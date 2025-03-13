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

def get_cognito_users(cognito_client, user_pool_id):
    """Get all users from the Cognito user pool."""
    users = []
    pagination_token = None
    
    while True:
        if pagination_token:
            response = cognito_client.list_users(
                UserPoolId=user_pool_id,
                PaginationToken=pagination_token
            )
        else:
            response = cognito_client.list_users(
                UserPoolId=user_pool_id
            )
        
        users.extend(response['Users'])
        
        # Check if there are more users to fetch
        pagination_token = response.get('PaginationToken')
        if not pagination_token:
            break
        
        # Add a small delay to avoid throttling
        time.sleep(0.1)
    
    return users

def create_user_in_database(api_endpoint, api_key, user):
    """Create a user entity in the database using GraphQL."""
    # Extract user attributes
    email = None
    for attr in user['Attributes']:
        if attr['Name'] == 'email':
            email = attr['Value']
            break
    
    if not email:
        print(f"Skipping user {user['Username']} - no email found")
        return None
    
    # Prepare the GraphQL mutation
    mutation = """
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            id
            cognitoId
            email
        }
    }
    """
    
    # Prepare the variables for the mutation
    variables = {
        "input": {
            "cognitoId": user['Username'],
            "email": email,
            "roles": ["student"],
            "status": "active"
        }
    }
    
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
            print(f"Error creating user {email}: {result['errors']}")
            return None
        else:
            print(f"Created user in database: {email}")
            return result['data']['createUser']
    else:
        print(f"Error creating user {email}: {response.status_code} - {response.text}")
        return None

def main():
    # Load Amplify outputs
    amplify_outputs = load_amplify_outputs()
    user_pool_id = amplify_outputs['auth']['user_pool_id']
    region = amplify_outputs['auth']['aws_region']
    
    # Get GraphQL API endpoint and API key from the 'data' section
    api_endpoint = amplify_outputs['data']['url']
    api_key = amplify_outputs['data']['api_key']
    
    # Initialize Cognito client
    cognito_client = boto3.client('cognito-idp', region_name=region)
    
    # Get all users from Cognito
    print("Fetching users from Cognito...")
    cognito_users = get_cognito_users(cognito_client, user_pool_id)
    print(f"Found {len(cognito_users)} users in Cognito")
    
    # Create users in the database
    print("Creating users in the database...")
    created_users = []
    skipped_users = []
    
    for user in cognito_users:
        # Check if user already exists in database (in a real implementation)
        # For now, we'll just create all users
        
        result = create_user_in_database(api_endpoint, api_key, user)
        if result:
            created_users.append(result)
        else:
            skipped_users.append(user['Username'])
        
        # Add a small delay to avoid throttling
        time.sleep(0.2)
    
    # Print summary
    print("\nSync completed!")
    print(f"Total Cognito users: {len(cognito_users)}")
    print(f"Users created in database: {len(created_users)}")
    print(f"Users skipped: {len(skipped_users)}")
    
    # Save results to a file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    results_file_path = os.path.join(script_dir, 'sync_results.json')
    with open(results_file_path, 'w') as f:
        json.dump({
            'created_users': created_users,
            'skipped_users': skipped_users
        }, f, indent=2)
    
    print(f"Results saved to {results_file_path}")

if __name__ == '__main__':
    main() 