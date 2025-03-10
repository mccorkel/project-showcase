import json
import boto3
from botocore.exceptions import ClientError

def upload_students_to_dynamodb(json_file_path, table_name, region_name='us-east-1'):
    """Read an array of student JSON objects and insert them into DynamoDB."""
    dynamodb = boto3.resource('dynamodb', region_name=region_name)
    table = dynamodb.Table(table_name)

    with open(json_file_path, 'r') as json_file:
        students = json.load(json_file)  # Assumes the file contains a JSON array

    for student in students:
        try:
            table.put_item(Item=student)
            print(f"Inserted student with ID: {student.get('id')}")
        except ClientError as e:
            print(f"Error inserting student {student.get('id')}: {e.response['Error']['Message']}")

def main():
    JSON_FILE_PATH = 'students.json'      # Path to the file containing your JSON array
    TABLE_NAME = 'GauntletStudents'       # Your DynamoDB table name
    AWS_REGION = 'us-east-1'             # AWS region

    upload_students_to_dynamodb(JSON_FILE_PATH, TABLE_NAME, AWS_REGION)

if __name__ == '__main__':
    main()