# Student Project Showcase - User Roles and Permissions

## Overview

The Student Project Showcase application implements a role-based access control (RBAC) system to manage permissions for different types of users. This document outlines the various user roles, their permissions, and how they interact with the system.

## User Roles

### Administrator

Administrators have full access to the system and can manage all aspects of the application.

**Permissions:**
- Create, read, update, and delete any student profile
- Create, read, update, and delete any student submission
- Create, read, update, and delete any student showcase
- Import data from external Learning Management Systems
- Manage user accounts and role assignments
- Access analytics and reporting across all showcases
- Configure system-wide settings

### Instructor

Instructors have elevated access to manage students within their assigned cohorts.

**Permissions:**
- Read any student profile
- Create, read, update, and delete student submissions for students in their cohorts
- Grade student submissions and provide feedback
- Read any student showcase
- Provide feedback on student submissions
- View analytics for students in their cohorts

### Student

Students have access to manage their own profiles, submissions, and showcases.

**Permissions:**
- Read and update their own student profile
- Create new submissions
- Read their own submissions
- Update certain fields of their own submissions (excluding grades and instructor feedback)
- Read and update their own student showcase
- Control visibility settings for their showcase
- View analytics for their own showcase

### Guest

Guests are unauthenticated users who can view public showcases.

**Permissions:**
- View public student showcases
- Cannot access any administrative functions
- Cannot view private showcases or submissions

## Permission Matrix

| Action | Administrator | Instructor | Student | Guest |
|--------|---------------|------------|---------|-------|
| **Student Profiles** |
| Create | ✅ | ❌ | ❌ | ❌ |
| Read (Any) | ✅ | ✅ | ❌ | ❌ |
| Read (Own) | ✅ | ✅ | ✅ | ❌ |
| Update (Any) | ✅ | ❌ | ❌ | ❌ |
| Update (Own) | ✅ | ✅ | ✅ | ❌ |
| Delete (Any) | ✅ | ❌ | ❌ | ❌ |
| **Student Submissions** |
| Create (Any) | ✅ | ✅* | ❌ | ❌ |
| Create (Own) | ✅ | ✅ | ✅ | ❌ |
| Read (Any) | ✅ | ✅ | ❌ | ❌ |
| Read (Own) | ✅ | ✅ | ✅ | ❌ |
| Update (Any) | ✅ | ✅* | ❌ | ❌ |
| Update (Own) | ✅ | ✅ | ⚠️** | ❌ |
| Delete (Any) | ✅ | ✅* | ❌ | ❌ |
| Delete (Own) | ✅ | ✅ | ❌ | ❌ |
| Grade | ✅ | ✅* | ❌ | ❌ |
| Provide Feedback | ✅ | ✅* | ❌ | ❌ |
| **Student Showcases** |
| Create (Any) | ✅ | ❌ | ❌ | ❌ |
| Create (Own) | ✅ | ✅ | ✅ | ❌ |
| Read (Any Public) | ✅ | ✅ | ✅ | ✅ |
| Read (Any Private) | ✅ | ✅ | ❌ | ❌ |
| Read (Own) | ✅ | ✅ | ✅ | ❌ |
| Update (Any) | ✅ | ❌ | ❌ | ❌ |
| Update (Own) | ✅ | ✅ | ✅ | ❌ |
| Delete (Any) | ✅ | ❌ | ❌ | ❌ |
| Delete (Own) | ✅ | ✅ | ✅ | ❌ |
| Publish/Unpublish (Any) | ✅ | ❌ | ❌ | ❌ |
| Publish/Unpublish (Own) | ✅ | ✅ | ✅ | ❌ |
| **System Administration** |
| User Management | ✅ | ❌ | ❌ | ❌ |
| LMS Integration | ✅ | ❌ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ | ❌ |
| Analytics (All) | ✅ | ❌ | ❌ | ❌ |
| Analytics (Cohort) | ✅ | ✅ | ❌ | ❌ |
| Analytics (Own) | ✅ | ✅ | ✅ | ❌ |

\* Instructors can only perform these actions for students in their assigned cohorts.

\** Students can update only certain fields of their own submissions (e.g., demo_link, repo_link, deployed_url, notes) but cannot modify grades, instructor feedback, or submission status after a certain point.

## Submission Field Access Control

To maintain data integrity while allowing students appropriate control over their submissions, field-level permissions are implemented:

| Submission Field | Administrator | Instructor | Student |
|------------------|---------------|------------|---------|
| id | Read-only | Read-only | Read-only |
| auth_id | Read-only | Read-only | Read-only |
| week | Read/Write | Read/Write | Read-only |
| demo_link | Read/Write | Read/Write | Read/Write |
| repo_link | Read/Write | Read/Write | Read/Write |
| brainlift_link | Read/Write | Read/Write | Read/Write |
| social_post | Read/Write | Read/Write | Read/Write |
| passing | Read/Write | Read/Write | Read-only |
| created_at | Read-only | Read-only | Read-only |
| updated_at | Read-only | Read-only | Read-only |
| deployed_url | Read/Write | Read/Write | Read/Write |
| grade | Read/Write | Read/Write | Read-only |
| notes | Read/Write | Read/Write | Read/Write |
| report | Read/Write | Read/Write | Read-only |
| graded_at | Read-only | Read-only | Read-only |
| cohort_id | Read/Write | Read-only | Read-only |
| graded_by | Read-only | Read-only | Read-only |

## Authentication and Identity

The application uses Amazon Cognito for authentication and identity management, with role information stored in our application database. Each user is assigned a unique Cognito User ID that is used to link their account to their profile in the system.

### Authentication Flow

1. Users sign up or are pre-registered in the Cognito User Pool
2. Upon first login, the application creates a User Authentication record in the database
3. Role assignments are stored directly in the User Authentication record
4. The application checks the User Authentication record for role information when authorizing actions

### User-Profile Linking

- Students are linked to their LMS profile via email address matching
- If a student's email in the LMS matches their Cognito login email, they are automatically granted access to that profile
- Administrators can manually link or unlink user accounts to profiles if needed

## Implementation Details

### Role Assignment

- Roles are assigned to users through the User Authentication data structure
- Each user can have multiple roles (e.g., a user could be both an instructor and a student)
- Roles are stored as an array in the User Authentication record:
  ```json
  {
    "cognito_user_id": "us-east-1:a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "roles": ["admin", "instructor"],
    ...
  }
  ```
- The application checks this roles array to determine permissions

### Permission Enforcement

Permissions are enforced at multiple levels:

1. **UI Level**: Interface elements are conditionally rendered based on user role
2. **API Level**: GraphQL resolvers check permissions before executing operations
3. **Database Level**: Access patterns are designed to enforce ownership and role-based access
4. **Field Level**: Specific fields within resources have their own access control rules
5. **Infrastructure Level**: AWS IAM policies provide an additional layer of security

### Role Hierarchy

The role hierarchy is as follows (from highest to lowest permissions):
1. Administrator
2. Instructor
3. Student
4. Guest (unauthenticated)

When a user has multiple roles, the highest role in the hierarchy takes precedence.

## Special Considerations

### Multiple Roles

Some users may have multiple roles in the system. For example:
- An instructor might also be a student in a different program
- An administrator might also be an instructor

In these cases, the user will have the combined permissions of all their roles, with the most permissive role taking precedence for any given action.

### Submission Lifecycle

The submission lifecycle affects what actions students can perform:

1. **Draft Stage**: Students can create and fully edit their submissions
2. **Submitted Stage**: Students can update certain fields (links, notes) but not submission status
3. **Graded Stage**: Students can only update non-academic fields (links, notes) but not grades or feedback
4. **Archived Stage**: Submissions become read-only for students

### Delegation

- Administrators can temporarily delegate certain permissions to instructors for specific tasks
- This delegation is implemented through a separate delegation record in the database:
  ```json
  {
    "id": "UUID",
    "delegator_id": "String",         // Cognito User ID of the delegator
    "delegatee_id": "String",         // Cognito User ID of the delegatee
    "permissions": ["String"],        // Array of delegated permissions
    "resource_ids": ["String"],       // Array of resource IDs the delegation applies to
    "expires_at": "ISO8601 DateTime", // When the delegation expires
    "created_at": "ISO8601 DateTime"  // When the delegation was created
  }
  ```
- The application checks for active delegations when authorizing actions

### Audit Trail

All significant actions in the system are logged with:
- User ID of the person performing the action
- Timestamp
- Action type
- Affected resources
- IP address

This audit trail is available to administrators for security and compliance purposes.

This document will be updated as the role and permission system evolves. 