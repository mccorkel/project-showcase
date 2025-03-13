# Project Showcase Scripts

This directory contains utility scripts for the Project Showcase application.

## Creating Cognito Users

The `createCognitoUsers.py` script creates basic users in your Cognito user pool based on the data in `students.json`. It only creates users with email addresses, without additional attributes like names or roles.

### Prerequisites

1. Python 3.6 or higher
2. AWS CLI installed and configured with appropriate credentials
3. Required Python packages:
   ```
   pip install boto3
   ```

### Usage

1. Make sure your AWS credentials are configured:
   ```
   aws configure
   ```

2. Run the script:
   ```
   python createCognitoUsers.py
   ```

3. The script will:
   - Read student data from `students.json`
   - Create basic users in your Cognito user pool with just email addresses
   - Generate temporary passwords for each user
   - Save the credentials to `user_credentials.json`

### Notes

- The script uses the Cognito user pool ID and region from `amplify_outputs.json`
- Only email addresses are stored in Cognito; all other user data will be handled in the database
- Temporary passwords are generated to meet Cognito's password requirements
- Email notifications are suppressed, so users won't receive invitation emails
- User credentials are saved to `user_credentials.json` for reference

## Sending Students to DynamoDB

The `sendStudentsToDynamo.py` script uploads complete student data to a DynamoDB table.

### Usage

1. Make sure your AWS credentials are configured
2. Run the script:
   ```
   python sendStudentsToDynamo.py
   ```

3. The script will read student data from `students.json` and insert it into the specified DynamoDB table, including all user details like names, roles, and other attributes. 