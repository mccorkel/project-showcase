# Authentication Data Structures

## User Authentication Structure

The application uses Amazon Cognito for user authentication and stores role information in our application database. This User Authentication structure is the primary mechanism for role-based access control. Below is the structure of the user authentication data:

```json
{
  "cognito_user_id": "String",         // Unique identifier from Cognito
  "email": "String",                   // User's email address (used for authentication)
  "username": "String",                // Username for public profile URL (derived from email or name)
  "roles": ["String"],                 // Array of roles assigned to the user (admin, instructor, student)
  "created_at": "ISO8601 DateTime",    // Timestamp when the user account was created
  "last_login": "ISO8601 DateTime",    // Timestamp of the user's last login
  "status": "String",                  // Account status (active, inactive, pending)
  "linked_profiles": [                 // Profiles linked to this user account
    {
      "profile_type": "String",        // Type of profile (student, instructor)
      "profile_id": "UUID"             // ID of the linked profile
    }
  ],
  "permissions": {                     // Custom permissions (for delegation)
    "delegated": [                     // Permissions delegated to this user
      {
        "permission": "String",        // The delegated permission
        "resource_type": "String",     // Type of resource the permission applies to
        "resource_id": "String",       // ID of the resource the permission applies to
        "delegated_by": "String",      // Cognito User ID of the delegator
        "expires_at": "ISO8601 DateTime" // When the delegation expires
      }
    ],
    "restrictions": [                  // Restrictions on standard role permissions
      {
        "permission": "String",        // The restricted permission
        "resource_type": "String",     // Type of resource the restriction applies to
        "resource_id": "String",       // ID of the resource the restriction applies to
        "reason": "String",            // Reason for the restriction
        "applied_by": "String",        // Cognito User ID of who applied the restriction
        "applied_at": "ISO8601 DateTime" // When the restriction was applied
      }
    ]
  },
  "settings": {                        // User preferences and settings
    "theme": "String",                 // UI theme preference (light, dark, system)
    "email_notifications": "Boolean",  // Whether to receive email notifications
    "last_viewed_page": "String"       // Last page viewed (for returning users)
  },
  "security": {                        // Security-related information
    "mfa_enabled": "Boolean",          // Whether multi-factor authentication is enabled
    "last_password_change": "ISO8601 DateTime", // When password was last changed
    "login_attempts": "Number",        // Number of failed login attempts
    "locked_until": "ISO8601 DateTime" // Account lockout expiration (if applicable)
  }
}
```

### Example User Authentication Records

```json
{
  "cognito_user_id": "us-east-1:a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "tom.tarpey@bloomtech.com",
  "username": "tom.tarpey",
  "roles": ["student"],
  "created_at": "2025-01-10T18:23:46.536842+00:00",
  "last_login": "2025-01-15T09:12:33.123456+00:00",
  "status": "active",
  "linked_profiles": [
    {
      "profile_type": "student",
      "profile_id": "f59bb9e0-c485-42f8-8e11-bc16cba2b477"
    }
  ],
  "permissions": {
    "delegated": [],
    "restrictions": []
  },
  "settings": {
    "theme": "system",
    "email_notifications": true,
    "last_viewed_page": "/secure/dashboard"
  },
  "security": {
    "mfa_enabled": false,
    "last_password_change": "2025-01-10T18:23:46.536842+00:00",
    "login_attempts": 0,
    "locked_until": null
  }
}
```

```json
{
  "cognito_user_id": "us-east-1:b2c3d4e5-f6g7-8901-bcde-fg2345678901",
  "email": "admin@example.com",
  "username": "admin",
  "roles": ["admin", "instructor"],
  "created_at": "2025-01-05T10:15:20.123456+00:00",
  "last_login": "2025-01-16T14:30:45.654321+00:00",
  "status": "active",
  "linked_profiles": [
    {
      "profile_type": "instructor",
      "profile_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    }
  ],
  "permissions": {
    "delegated": [],
    "restrictions": []
  },
  "settings": {
    "theme": "dark",
    "email_notifications": true,
    "last_viewed_page": "/secure/admin/dashboard"
  },
  "security": {
    "mfa_enabled": true,
    "last_password_change": "2025-01-15T10:15:20.123456+00:00",
    "login_attempts": 0,
    "locked_until": null
  }
}
```

## Session Structure

The application maintains session information for authenticated users.

```json
{
  "session_id": "UUID",               // Unique identifier for the session
  "cognito_user_id": "String",        // ID of the authenticated user
  "created_at": "ISO8601 DateTime",   // When the session was created
  "expires_at": "ISO8601 DateTime",   // When the session expires
  "last_activity": "ISO8601 DateTime", // Last user activity timestamp
  "ip_address": "String",             // IP address of the user
  "user_agent": "String",             // User agent string
  "device_info": {                    // Information about the user's device
    "type": "String",                 // Device type (desktop, mobile, tablet)
    "os": "String",                   // Operating system
    "browser": "String"               // Browser name and version
  },
  "is_active": "Boolean",             // Whether the session is currently active
  "original_request_url": "String",   // URL the user was trying to access before authentication
  "jwt_token": "String"               // JWT token for this session (encrypted)
}
```

## Delegation Structure

The application supports temporary delegation of permissions from one user to another.

```json
{
  "id": "UUID",                      // Unique identifier for the delegation
  "delegator_id": "String",          // Cognito User ID of the delegator
  "delegatee_id": "String",          // Cognito User ID of the delegatee
  "permissions": ["String"],         // Array of delegated permissions
  "resource_type": "String",         // Type of resource the delegation applies to
  "resource_ids": ["String"],        // Array of resource IDs the delegation applies to
  "reason": "String",                // Reason for the delegation
  "created_at": "ISO8601 DateTime",  // When the delegation was created
  "expires_at": "ISO8601 DateTime",  // When the delegation expires
  "revoked_at": "ISO8601 DateTime",  // When the delegation was revoked (if applicable)
  "revoked_by": "String"             // Who revoked the delegation (if applicable)
}
```

## Audit Log Structure

The application maintains an audit log of all significant actions performed by users.

```json
{
  "id": "UUID",                      // Unique identifier for the audit log entry
  "cognito_user_id": "String",       // ID of the user who performed the action
  "action_type": "String",           // Type of action performed
  "resource_type": "String",         // Type of resource affected
  "resource_id": "String",           // ID of the resource affected
  "timestamp": "ISO8601 DateTime",   // When the action was performed
  "ip_address": "String",            // IP address of the user
  "user_agent": "String",            // User agent of the client
  "details": "JSON"                  // Additional details about the action
}
```

## Authentication Flow

The authentication flow aligns with the navigation structure and follows these steps:

1. **Initial Access**
   - User navigates to the application landing page (`/`)
   - User clicks "Login" button
   - System redirects to login page (`/login`)

2. **Login Process**
   - User enters credentials (email and password) on the login page
   - System sends authentication request to Cognito
   - Cognito validates credentials

3. **Authentication Success**
   - Cognito returns JWT token
   - System creates or updates User Authentication record
   - System creates a new Session record
   - System stores JWT token in browser (localStorage or secure cookie)
   - System updates `last_login` timestamp
   - System checks for original request URL:
     - If present, redirects to that URL
     - If not present, redirects to dashboard (`/secure/dashboard`)
   - User's `settings.last_viewed_page` is updated

4. **Authentication Failure**
   - System displays error message on login page
   - System increments `security.login_attempts`
   - If `login_attempts` exceeds threshold, account is temporarily locked
   - User remains on login page (`/login`)

5. **Session Management**
   - For each request to a secure route:
     - System validates JWT token
     - System checks if session is active and not expired
     - System updates `last_activity` timestamp
   - Sessions expire after a period of inactivity
   - User can manually log out, which invalidates the session

6. **Logout Process**
   - User clicks "Logout" in navigation
   - System invalidates the session (sets `is_active` to false)
   - System removes JWT token from browser
   - System redirects to landing page (`/`)

## Route Authorization

The application implements route-based authorization to control access to different parts of the application:

1. **Public Routes**
   - Routes: `/`, `/login`, `/profile/:username`
   - Access: Available to all users, no authentication required
   - Behavior: If user is already authenticated, `/login` redirects to dashboard

2. **Secure Routes**
   - Routes: All routes under `/secure/*`
   - Access: Requires valid authentication
   - Behavior: 
     - If user is not authenticated, redirects to `/login`
     - After successful login, redirects back to the originally requested URL
     - JWT token is validated for each request

3. **Role-Based Routes**
   - Student Routes:
     - Routes: `/secure/dashboard`, `/secure/profile`, `/secure/submissions/*`, `/secure/showcase/*`
     - Access: Requires `student` role
     - Behavior: If user doesn't have `student` role, shows 403 Forbidden page

   - Admin Routes:
     - Routes: `/secure/admin/*`
     - Access: Requires `admin` role
     - Behavior: If user doesn't have `admin` role, shows 403 Forbidden page

   - Instructor Routes:
     - Routes: Various instructor-specific functionality
     - Access: Requires `instructor` role
     - Behavior: If user doesn't have `instructor` role, shows 403 Forbidden page

4. **Resource-Based Authorization**
   - In addition to route-based authorization, the application implements resource-based authorization
   - Example: A student can only view and edit their own submissions
   - Implementation: For each resource access, the system checks:
     - User's roles
     - User's permissions (including delegated permissions)
     - Resource ownership
     - Any restrictions that may apply

## Error Pages

The application provides specific error pages for authentication and authorization issues:

1. **403 Forbidden Page**
   - Displayed when a user attempts to access a route they don't have permission for
   - Includes a link back to the dashboard

2. **404 Not Found Page**
   - Displayed when a route doesn't exist
   - Includes a link back to the dashboard

3. **500 Server Error Page**
   - Displayed when an unexpected error occurs during authentication
   - Includes a link to contact support

## Data Relationships

- Cognito User ID is the primary key linking authentication data to user profiles
- Each User Authentication record can be linked to multiple profiles (student, instructor)
- Sessions are linked to User Authentication records via Cognito User ID
- Audit logs track actions performed by authenticated users 