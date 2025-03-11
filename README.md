## AWS Amplify Next.js (App Router) Starter Template

This repository provides a starter template for creating applications using Next.js (App Router) and AWS Amplify, emphasizing easy setup for authentication, API, and database capabilities.

## Overview

This template equips you with a foundational Next.js application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

# Project Showcase - Security Enhancements

This repository contains the security enhancements for the Project Showcase application. These enhancements are part of the final phase of development, focusing on securing the application before deployment.

## Security Features Implemented

### 1. Field-Level Access Control

The field-level access control system provides granular permissions for accessing and modifying specific fields in resources based on user roles and resource states.

- **Location**: `src/utils/security/fieldAccessControl.ts`
- **Features**:
  - Role-based access control for fields
  - Conditional access based on resource state
  - Filtering accessible fields for UI rendering
  - Validation of update operations

### 2. Audit Logging

The audit logging system records significant actions performed by users for security and compliance purposes.

- **Location**: `src/utils/security/auditLogger.ts`
- **Features**:
  - Comprehensive logging of user actions
  - Structured log entries with metadata
  - Support for various action and resource types
  - Designed for future API integration

### 3. Session Management

The session management system handles user sessions, including timeouts and account lockouts.

- **Location**: `src/utils/security/sessionManager.ts`
- **Features**:
  - Configurable session timeouts
  - Account lockout after failed login attempts
  - Activity-based session extension
  - Secure session storage

### 4. React Integration

The security features are integrated with React through custom hooks and components.

- **Locations**:
  - `src/hooks/useSession.tsx`: React hook for session management
  - `src/components/SessionTimeoutDialog.tsx`: Dialog for session timeout warnings
  - `src/components/ProtectedRoute.tsx`: HOC for protecting routes
  - `src/components/LoginPage.tsx`: Example login page implementation

## Getting Started

1. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```

2. Start the development server:
   ```
   npm start
   ```

## Usage Examples

### Protecting Routes

```jsx
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './utils/security/fieldAccessControl';

// Protect a route for authenticated users
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Protect a route for specific roles
<ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.INSTRUCTOR]}>
  <AdminDashboard />
</ProtectedRoute>
```

### Using Session Management

```jsx
import useSession from './hooks/useSession';

function MyComponent() {
  const { isAuthenticated, session, login, logout } = useSession();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {session?.userEmail}</p>
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
}
```

### Field Access Control

```jsx
import { hasFieldAccess, filterAccessibleFields, UserRole } from './utils/security/fieldAccessControl';

// Check if user can access a field
const canEditTitle = hasFieldAccess(
  'submission',
  'title',
  'write',
  submission,
  { role: UserRole.INSTRUCTOR }
);

// Filter fields for UI rendering
const accessibleFields = filterAccessibleFields(
  'submission',
  submission,
  'read',
  { role: UserRole.STUDENT }
);
```

### Audit Logging

```jsx
import { logUpdate, AuditResourceType } from './utils/security/auditLogger';

// Log an update action
await logUpdate(
  userId,
  userEmail,
  AuditResourceType.SUBMISSION,
  submissionId,
  ipAddress,
  userAgent,
  changes,
  'Updated submission title and description'
);
```

## Next Steps

- Implement CSRF protection
- Add rate limiting for API endpoints
- Implement content security policy
- Set up security headers
- Configure HTTPS