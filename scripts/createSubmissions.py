#!/usr/bin/env python3
import json
import boto3
import time
import os
import requests
from botocore.exceptions import ClientError
from datetime import datetime

def load_amplify_outputs():
    """Load the Amplify outputs from the JSON file."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    amplify_outputs_path = os.path.join(project_root, 'amplify_outputs.json')
    
    with open(amplify_outputs_path, 'r') as f:
        return json.load(f)

def load_submissions_data():
    """Load the submissions data from the JSON file."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    submissions_file_path = os.path.join(script_dir, 'submissions.json')
    
    with open(submissions_file_path, 'r') as f:
        return json.load(f)

def load_students_data():
    """Load the students data from the JSON file."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    students_file_path = os.path.join(script_dir, 'students.json')
    
    with open(students_file_path, 'r') as f:
        return json.load(f)

def get_all_users(api_endpoint, api_key):
    """Get all users from the database with pagination."""
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
            time.sleep(0.5)
        else:
            print(f"Error fetching users: {response.status_code} - {response.text}")
            return []
    
    return all_users

def get_all_student_profiles(api_endpoint, api_key):
    """Get all student profiles from the database with pagination."""
    all_profiles = []
    next_token = None
    
    # Loop to handle pagination
    while True:
        # GraphQL query to get student profiles with pagination
        query = """
        query ListStudentProfiles($limit: Int, $nextToken: String) {
            listStudentProfiles(limit: $limit, nextToken: $nextToken) {
                items {
                    id
                    userId
                    firstName
                    lastName
                    contactEmail
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
                print(f"Error fetching student profiles: {result['errors']}")
                return []
            
            # Get the profiles from this page
            profiles_page = result['data']['listStudentProfiles']['items']
            all_profiles.extend(profiles_page)
            
            # Get the next token for pagination
            next_token = result['data']['listStudentProfiles'].get('nextToken')
            
            print(f"Fetched {len(profiles_page)} student profiles (total so far: {len(all_profiles)})")
            
            # If there's no next token, we've reached the end
            if not next_token:
                break
            
            # Add a small delay to avoid throttling
            time.sleep(0.5)
        else:
            print(f"Error fetching student profiles: {response.status_code} - {response.text}")
            return []
    
    return all_profiles

def find_student_by_auth_id(auth_id, students_data):
    """Find student data in students.json by auth_id.
    
    The auth_id in submissions.json corresponds to the id field in students.json.
    """
    for student in students_data:
        if student.get('id') == auth_id:  # Changed from auth_id to id
            return student
    return None

def create_submission(api_endpoint, api_key, submission_data, student_profile_id):
    """Create a Submission entity."""
    mutation = """
    mutation CreateSubmission($input: CreateSubmissionInput!) {
        createSubmission(input: $input) {
            id
            title
            description
            studentProfileId
            status
            week
        }
    }
    """
    
    # Map fields from submissions.json to the GraphQL schema fields
    # Prepare the variables for the mutation
    variables = {
        "input": {
            "studentProfileId": student_profile_id,
            "week": submission_data.get('week'),
            "status": submission_data.get('status', 'DRAFT'),
            "title": submission_data.get('title', f"Week {submission_data.get('week')} Submission"),
            "description": submission_data.get('description', ''),
            "demoLink": submission_data.get('demo_link'),
            "repoLink": submission_data.get('repo_link'),
            "brainliftLink": submission_data.get('brainlift_link'),
            "socialPost": submission_data.get('social_post'),
            "deployedUrl": submission_data.get('deployed_url'),
            "notes": submission_data.get('notes'),
            "passing": submission_data.get('passing')
        }
    }
    
    # Remove None values to avoid GraphQL errors
    variables["input"] = {k: v for k, v in variables["input"].items() if v is not None}
    
    # Handle technologies if present
    if 'technologies' in submission_data and submission_data['technologies']:
        variables["input"]["technologies"] = submission_data['technologies']
    
    # Print the mutation and variables for debugging
    print(f"Creating submission with variables: {json.dumps(variables)}")
    
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
            print(f"Error creating submission: {result['errors']}")
            # Print more details for debugging
            print(f"Response: {json.dumps(result)}")
            return None
        else:
            print(f"Created submission: {result['data']['createSubmission']['title']}")
            return result['data']['createSubmission']
    else:
        print(f"Error creating submission: {response.status_code} - {response.text}")
        return None

def main():
    # Load Amplify outputs
    amplify_outputs = load_amplify_outputs()
    
    # Get GraphQL API endpoint and API key
    api_endpoint = amplify_outputs['data']['url']
    api_key = amplify_outputs['data']['api_key']
    
    # Load submissions and students data
    submissions_data = load_submissions_data()
    students_data = load_students_data()
    
    print(f"Loaded {len(submissions_data)} submissions from submissions.json")
    print(f"Loaded {len(students_data)} students from students.json")
    
    # Fetch all users and student profiles at once
    print("Fetching all users from the database...")
    all_users = get_all_users(api_endpoint, api_key)
    
    # Create email to user lookup dictionary for faster access
    email_to_user = {user['email']: user for user in all_users if 'email' in user}
    print(f"Created lookup dictionary for {len(email_to_user)} users by email")
    
    print("Fetching all student profiles from the database...")
    all_profiles = get_all_student_profiles(api_endpoint, api_key)
    
    # Create userId to profile lookup dictionary for faster access
    userid_to_profile = {profile['userId']: profile for profile in all_profiles if 'userId' in profile}
    print(f"Created lookup dictionary for {len(userid_to_profile)} student profiles by userId")
    
    # Create submissions for each entry
    created_submissions = []
    skipped_submissions = []
    
    # Set a delay between submissions to avoid overloading the database
    submission_delay = 1.0  # seconds
    
    for submission_entry in submissions_data:
        auth_id = submission_entry.get('auth_id')
        if not auth_id:
            print(f"Skipping submission - no auth_id provided")
            skipped_submissions.append(submission_entry)
            continue
        
        # Find student data by auth_id
        student_data = find_student_by_auth_id(auth_id, students_data)
        if not student_data:
            print(f"Skipping submission - no matching student found for auth_id: {auth_id}")
            skipped_submissions.append(submission_entry)
            continue
        
        # Get user by email from our lookup dictionary
        email = student_data.get('email')
        if not email:
            print(f"Skipping submission - no email found for student with auth_id: {auth_id}")
            skipped_submissions.append(submission_entry)
            continue
        
        user = email_to_user.get(email)
        if not user:
            print(f"Skipping submission - no user found with email: {email}")
            skipped_submissions.append(submission_entry)
            continue
        
        # Get student profile by user ID from our lookup dictionary
        student_profile = userid_to_profile.get(user['cognitoId'])
        if not student_profile:
            print(f"Skipping submission - no student profile found for user: {email}")
            skipped_submissions.append(submission_entry)
            continue
        
        # Create submission
        submission = create_submission(api_endpoint, api_key, submission_entry, student_profile['id'])
        
        if submission:
            created_submissions.append({
                "title": submission['title'],
                "id": submission['id'],
                "studentEmail": email
            })
        else:
            skipped_submissions.append(submission_entry)
        
        # Add a delay between submissions to avoid overloading the database
        print(f"Waiting {submission_delay} seconds before processing next submission...")
        time.sleep(submission_delay)
    
    # Print summary
    print("\nProcess completed!")
    print(f"Total submissions in file: {len(submissions_data)}")
    print(f"Submissions created: {len(created_submissions)}")
    print(f"Submissions skipped: {len(skipped_submissions)}")
    
    # Save results to a file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    results_file_path = os.path.join(script_dir, 'submissions_results.json')
    with open(results_file_path, 'w') as f:
        json.dump({
            'created_submissions': created_submissions,
            'skipped_submissions': skipped_submissions
        }, f, indent=2)
    
    print(f"Results saved to {results_file_path}")

if __name__ == '__main__':
    main() 