import json
import boto3
import random
import string
import time
import os
from botocore.exceptions import ClientError

def load_amplify_outputs():
    """Load the Amplify outputs from the JSON file."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    amplify_outputs_path = os.path.join(project_root, 'amplify_outputs.json')
    
    with open(amplify_outputs_path, 'r') as f:
        return json.load(f)

def generate_temporary_password():
    """Generate a secure temporary password that meets Cognito requirements."""
    # Ensure we have at least one of each required character type
    password = [
        random.choice(string.ascii_uppercase),  # uppercase
        random.choice(string.ascii_lowercase),  # lowercase
        random.choice(string.digits),           # number
        random.choice('!@#$%^&*()_+-=[]{}|;:,.<>?')  # special character
    ]
    
    # Add additional random characters to reach desired length (12 characters)
    chars = string.ascii_letters + string.digits + '!@#$%^&*()_+-=[]{}|;:,.<>?'
    password.extend(random.choice(chars) for _ in range(8))
    
    # Shuffle the password
    random.shuffle(password)
    
    return ''.join(password)

def create_cognito_user(cognito_client, user_pool_id, student):
    """Create a basic user in Cognito user pool with just email."""
    email = student['email']
    
    try:
        # Generate a temporary password
        temp_password = generate_temporary_password()
        
        # Create the user in Cognito with minimal attributes
        response = cognito_client.admin_create_user(
            UserPoolId=user_pool_id,
            Username=email,
            TemporaryPassword=temp_password,
            MessageAction='SUPPRESS',  # Don't send an email invitation
            UserAttributes=[
                {'Name': 'email', 'Value': email},
                {'Name': 'email_verified', 'Value': 'true'}
            ]
        )
        
        print(f"Created user: {email}")
        
        # Return the temporary password
        return temp_password
        
    except ClientError as e:
        print(f"Error creating user {email}: {e}")
        return None

def main():
    # Load Amplify outputs
    amplify_outputs = load_amplify_outputs()
    user_pool_id = amplify_outputs['auth']['user_pool_id']
    region = amplify_outputs['auth']['aws_region']
    
    # Initialize Cognito client
    cognito_client = boto3.client('cognito-idp', region_name=region)
    
    # Load students from JSON file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    students_file_path = os.path.join(script_dir, 'students.json')
    
    with open(students_file_path, 'r') as f:
        students = json.load(f)
    
    # Filter students to only include those with "student" role and email ending with "@gauntletai.com"
    filtered_students = [
        student for student in students 
        if student.get('user_roles') == 'student' and student.get('email', '').endswith('@gauntletai.com')
    ]
    
    print(f"Found {len(students)} total students")
    print(f"Filtered to {len(filtered_students)} students with 'student' role and @gauntletai.com email")
    
    # Store user credentials for reference
    user_credentials = []
    
    # Process each filtered student
    for student in filtered_students:
        temp_password = create_cognito_user(cognito_client, user_pool_id, student)
        if temp_password:
            user_credentials.append({
                'email': student['email'],
                'temporary_password': temp_password
            })
        
        # Add a small delay between API calls to avoid throttling
        time.sleep(0.2)
    
    # Save credentials to a file
    credentials_file_path = os.path.join(script_dir, 'user_credentials.json')
    with open(credentials_file_path, 'w') as f:
        json.dump(user_credentials, f, indent=2)
    
    print(f"Finished processing {len(filtered_students)} filtered students. Credentials saved to {credentials_file_path}")

if __name__ == '__main__':
    main() 