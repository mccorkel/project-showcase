#!/usr/bin/env python3
import json
import boto3
import time
import os
import requests
from botocore.exceptions import ClientError

def load_amplify_outputs():
    """Load the Amplify outputs from the JSON file."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    amplify_outputs_path = os.path.join(project_root, 'amplify_outputs.json')
    
    with open(amplify_outputs_path, 'r') as f:
        return json.load(f)

def load_students_data():
    """Load the students data from the JSON file."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    students_file_path = os.path.join(script_dir, 'students.json')
    
    with open(students_file_path, 'r') as f:
        return json.load(f)

def get_users_with_student_role(api_endpoint, api_key):
    """Get all users with the STUDENT role from the database."""
    all_users = []
    next_token = None
    
    # Loop to handle pagination
    while True:
        # GraphQL query to get users with pagination
        query = """
        query ListUsers($limit: Int, $nextToken: String) {
            listUsers(limit: $limit, nextToken: $nextToken) {
                items {
                    id
                    cognitoId
                    email
                    roles
                    linkedProfiles
                }
                nextToken
            }
        }
        """
        
        # Prepare variables for the query
        variables = {
            "limit": 100  # Maximum number of items to return per page
        }
        
        # Add nextToken if we have one
        if next_token:
            variables["nextToken"] = next_token
        
        # Make the GraphQL request
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': api_key
        }
        
        response = requests.post(
            api_endpoint,
            headers=headers,
            json={
                'query': query,
                'variables': variables
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            if 'errors' in result:
                print(f"Error fetching users: {result['errors']}")
                return []
            
            # Get the users from this page
            users_page = result['data']['listUsers']['items']
            all_users.extend(users_page)
            
            # Get the next token for pagination
            next_token = result['data']['listUsers'].get('nextToken')
            
            print(f"Fetched {len(users_page)} users (total so far: {len(all_users)})")
            
            # If there's no next token, we've reached the end
            if not next_token:
                break
            
            # Add a small delay to avoid throttling
            time.sleep(0.2)
        else:
            print(f"Error fetching users: {response.status_code} - {response.text}")
            return []
    
    # Filter users with STUDENT role
    student_users = []
    
    for user in all_users:
        roles = user.get('roles', [])
        
        # Handle different formats of roles
        if roles is None:
            roles = []
        elif isinstance(roles, str):
            try:
                roles = json.loads(roles)
            except json.JSONDecodeError:
                # If it's a single role as a string
                roles = [roles]
        
        # Check if 'student' is in roles (case-insensitive)
        if any(role.upper() == 'STUDENT' for role in roles):
            student_users.append(user)
    
    return student_users

def find_student_data(email, students_data):
    """Find student data in students.json by email."""
    for student in students_data:
        if student.get('email') == email:
            return student
    return None

def create_student_profile(api_endpoint, api_key, user, student_data):
    """Create a StudentProfile entity for a user."""
    # GraphQL mutation to create a StudentProfile
    mutation = """
    mutation CreateStudentProfile($input: CreateStudentProfileInput!) {
        createStudentProfile(input: $input) {
            id
            userId
            firstName
            lastName
        }
    }
    """
    
    # Prepare the variables for the mutation
    variables = {
        "input": {
            "userId": user['cognitoId'],
            "firstName": student_data.get('first_name', ''),
            "lastName": student_data.get('last_name', '')
        }
    }
    
    # Add optional fields only if they have values
    if student_data.get('title'):
        variables["input"]["title"] = student_data.get('title')
    
    if student_data.get('bio'):
        variables["input"]["bio"] = student_data.get('bio')
    
    if student_data.get('location'):
        variables["input"]["location"] = student_data.get('location')
    
    # Only add experienceYears if it's a valid integer
    try:
        exp_years = int(student_data.get('experience_years', 0))
        variables["input"]["experienceYears"] = exp_years
    except (ValueError, TypeError):
        variables["input"]["experienceYears"] = 0
    
    # Add contact email
    variables["input"]["contactEmail"] = user['email']
    
    # Add isStaff if it's a boolean
    is_staff = student_data.get('is_staff')
    if isinstance(is_staff, bool):
        variables["input"]["isStaff"] = is_staff
    
    # Add orgName if it's a string
    org_name = student_data.get('org_name')
    if isinstance(org_name, str) and org_name and org_name != '""':
        variables["input"]["orgName"] = org_name
    
    # Print the mutation and variables for debugging
    print(f"Creating student profile with variables: {json.dumps(variables)}")
    
    # Make the GraphQL request
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key
    }
    
    response = requests.post(
        api_endpoint,
        headers=headers,
        json={
            'query': mutation,
            'variables': variables
        }
    )
    
    if response.status_code == 200:
        result = response.json()
        if 'errors' in result:
            print(f"Error creating student profile for {user['email']}: {result['errors']}")
            # Print more details for debugging
            print(f"Response: {json.dumps(result)}")
            return None
        else:
            print(f"Created student profile for {user['email']}")
            return result['data']['createStudentProfile']
    else:
        print(f"Error creating student profile for {user['email']}: {response.status_code} - {response.text}")
        return None

def update_user_linked_profiles(api_endpoint, api_key, user, student_profile_id):
    """Update the User entity to include the StudentProfile in linkedProfiles."""
    # First, get the current user to see if they have existing linkedProfiles
    query = """
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            linkedProfiles
        }
    }
    """
    
    variables = {
        "id": user['id']
    }
    
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key
    }
    
    response = requests.post(
        api_endpoint,
        headers=headers,
        json={
            'query': query,
            'variables': variables
        }
    )
    
    existing_profiles = []
    if response.status_code == 200:
        result = response.json()
        if 'errors' not in result and 'data' in result and result['data']['getUser']:
            existing_linked_profiles = result['data']['getUser'].get('linkedProfiles', [])
            
            # Handle different formats of linkedProfiles
            if existing_linked_profiles:
                if isinstance(existing_linked_profiles, str):
                    try:
                        existing_profiles = json.loads(existing_linked_profiles)
                    except json.JSONDecodeError:
                        existing_profiles = []
                else:
                    existing_profiles = existing_linked_profiles
    
    # Create a new profile reference - simplified to just type and ID
    new_profile = {
        "type": "StudentProfile",
        "id": student_profile_id
    }
    
    # Check if this profile is already linked
    profile_already_linked = False
    for profile in existing_profiles:
        if isinstance(profile, dict) and profile.get('id') == student_profile_id:
            profile_already_linked = True
            break
    
    # Only add if not already linked
    if not profile_already_linked:
        existing_profiles.append(new_profile)
    
    # GraphQL mutation to update the User
    mutation = """
    mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
            id
            cognitoId
            email
            linkedProfiles
        }
    }
    """
    
    # Convert the profiles array to a JSON string
    linked_profiles_json = json.dumps(existing_profiles)
    
    # Prepare the variables for the mutation
    variables = {
        "input": {
            "id": user['id'],
            "linkedProfiles": linked_profiles_json
        }
    }
    
    # Print the mutation and variables for debugging
    print(f"Updating user with variables: {json.dumps(variables)}")
    
    # Make the GraphQL request
    response = requests.post(
        api_endpoint,
        headers=headers,
        json={
            'query': mutation,
            'variables': variables
        }
    )
    
    if response.status_code == 200:
        result = response.json()
        if 'errors' in result:
            print(f"Error updating user {user['email']}: {result['errors']}")
            # Print more details for debugging
            print(f"Response: {json.dumps(result)}")
            return False
        else:
            print(f"Updated user {user['email']} with linked profile")
            return True
    else:
        print(f"Error updating user {user['email']}: {response.status_code} - {response.text}")
        return False

def check_existing_student_profile(api_endpoint, api_key, user_id):
    """Check if a StudentProfile already exists for the given user ID."""
    query = """
    query GetStudentProfileByUserId($userId: String!, $limit: Int, $nextToken: String) {
        listStudentProfiles(filter: {userId: {eq: $userId}}, limit: $limit, nextToken: $nextToken) {
            items {
                id
                userId
                firstName
                lastName
            }
            nextToken
        }
    }
    """
    
    all_profiles = []
    next_token = None
    
    while True:
        variables = {
            "userId": user_id,
            "limit": 100
        }
        
        if next_token:
            variables["nextToken"] = next_token
        
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': api_key
        }
        
        response = requests.post(
            api_endpoint,
            headers=headers,
            json={
                'query': query,
                'variables': variables
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            if 'errors' in result:
                print(f"Error checking existing profile for user {user_id}: {result['errors']}")
                return None
            
            items = result.get('data', {}).get('listStudentProfiles', {}).get('items', [])
            all_profiles.extend(items)
            
            next_token = result.get('data', {}).get('listStudentProfiles', {}).get('nextToken')
            
            if not next_token:
                break
                
            time.sleep(0.2)  # Small delay to avoid throttling
        else:
            print(f"Error checking existing profile: {response.status_code} - {response.text}")
            return None
    
    if all_profiles:
        return all_profiles[0]
    
    return None

def main():
    # Load Amplify outputs
    amplify_outputs = load_amplify_outputs()
    
    # Get GraphQL API endpoint and API key
    api_endpoint = amplify_outputs['data']['url']
    api_key = amplify_outputs['data']['api_key']
    
    # Load students data
    students_data = load_students_data()
    print(f"Loaded {len(students_data)} students from students.json")
    
    # Get users with STUDENT role
    student_users = get_users_with_student_role(api_endpoint, api_key)
    print(f"Found {len(student_users)} users with STUDENT role")
    
    # Create StudentProfile for each user and update User entity
    created_profiles = []
    linked_existing_profiles = []
    skipped_users = []
    
    for user in student_users:
        # Check if a StudentProfile already exists for this user
        existing_profile = check_existing_student_profile(api_endpoint, api_key, user['cognitoId'])
        
        if existing_profile:
            print(f"User {user['email']} already has a StudentProfile (ID: {existing_profile['id']})")
            
            # Link the existing profile to the user
            success = update_user_linked_profiles(api_endpoint, api_key, user, existing_profile['id'])
            
            if success:
                linked_existing_profiles.append({
                    "email": user['email'],
                    "studentProfileId": existing_profile['id']
                })
                print(f"Linked existing profile for {user['email']}")
            else:
                skipped_users.append(user['email'])
                print(f"Failed to link existing profile for {user['email']}")
            
            continue
        
        # Find student data in students.json
        student_data = find_student_data(user['email'], students_data)
        
        if not student_data:
            print(f"Skipping user {user['email']} - no matching data in students.json")
            skipped_users.append(user['email'])
            continue
        
        # Create StudentProfile
        student_profile = create_student_profile(api_endpoint, api_key, user, student_data)
        
        if student_profile:
            # Update User with linkedProfiles
            success = update_user_linked_profiles(api_endpoint, api_key, user, student_profile['id'])
            
            if success:
                created_profiles.append({
                    "email": user['email'],
                    "studentProfileId": student_profile['id']
                })
        else:
            skipped_users.append(user['email'])
        
        # Add a small delay to avoid throttling
        time.sleep(0.2)
    
    # Print summary
    print("\nProcess completed!")
    print(f"Total users with STUDENT role: {len(student_users)}")
    print(f"StudentProfiles created and linked: {len(created_profiles)}")
    print(f"Existing profiles linked: {len(linked_existing_profiles)}")
    print(f"Users skipped: {len(skipped_users)}")
    
    # Save results to a file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    results_file_path = os.path.join(script_dir, 'student_profiles_results.json')
    with open(results_file_path, 'w') as f:
        json.dump({
            'created_profiles': created_profiles,
            'linked_existing_profiles': linked_existing_profiles,
            'skipped_users': skipped_users
        }, f, indent=2)
    
    print(f"Results saved to {results_file_path}")

if __name__ == '__main__':
    main() 