# Student Project Showcase - Data Structures

This directory contains documentation for the data structures used in the Student Project Showcase application. The data structures are organized into the following categories:

## Authentication and User Management

[Authentication Data Structures](./authentication.md)

- User Authentication Structure
- Session Structure
- Delegation Structure
- Audit Log Structure
- Authentication Flow
- Route Authorization
- Error Pages
- Data Relationships

## Student Profiles and Submissions

[Profiles and Submissions Data Structures](./profiles-submissions.md)

- Student Profile Structure
- Instructor Profile Structure
- Student Submissions Structure
- Submission Status Lifecycle
- Field-Level Access Control
- Submission Management Routes
- Profile Management Routes
- Cohort Structure
- Data Relationships

## Student Showcases

[Showcase Data Structures](./showcase.md)

- Showcase Template Structure
- Student Showcase Structure
- Showcase Analytics Structure
- Showcase Publication Process
- Preview Functionality
- S3 Storage Structure
- Public URL Structure
- Data Relationships

## Data Flow Overview

The application follows this general data flow, which aligns with the navigation structure:

1. **Authentication**: 
   - User navigates to the application landing page (`/`)
   - User clicks "Login" and is directed to `/login`
   - User authenticates via Cognito and is assigned roles
   - On successful authentication, user is redirected to `/secure/dashboard`

2. **Profile Management**: 
   - Student navigates to `/secure/profile`
   - Student views and updates their profile information
   - Profile changes are saved to the database

3. **Submissions**: 
   - Student navigates to `/secure/submissions/new`
   - Student creates and submits project work
   - Submissions are stored with status "draft" until officially submitted

4. **Grading**: 
   - Instructor accesses submissions via `/secure/admin/submissions`
   - Instructor reviews and grades submissions
   - Graded submissions have status updated to "graded"

5. **Showcase Creation**: 
   - Student navigates to `/secure/showcase`
   - Student selects a template and customizes their showcase
   - Student previews the showcase via `/secure/showcase/preview`

6. **Publication**: 
   - Student toggles "Make Profile Public" to true
   - Student publishes their showcase
   - Published showcase is accessible at `/profile/{username}`

7. **Analytics**: 
   - System tracks engagement with published showcases
   - Analytics data is displayed to students on their dashboard

## Navigation Structure

The application's navigation structure is organized into the following sections:

### Public Routes

- **`/`** - Landing Page
  - Main entry point for the application
  - No authentication required

- **`/login`** - Authentication Page
  - Login page for students and administrators
  - No authentication required

- **`/profile/:username`** - Public Profile View
  - Public-facing view of a student's showcase
  - No authentication required

### Secure Routes

- **`/secure/dashboard`** - Student Dashboard
  - Main dashboard for authenticated students
  - Authentication required

- **`/secure/profile`** - Profile Management
  - Page for students to edit their profile information
  - Authentication required

- **`/secure/submissions`** - Submissions Management
  - List of all student submissions
  - Authentication required

- **`/secure/submissions/new`** - Create Submission
  - Create a new submission draft
  - Authentication required

- **`/secure/submissions/:id`** - View/Edit Submission
  - View or edit a specific submission
  - Authentication required

- **`/secure/showcase`** - Showcase Management
  - Manage the student's public showcase
  - Authentication required

- **`/secure/showcase/preview`** - Showcase Preview
  - Preview the showcase before publishing
  - Authentication required

### Admin Routes

- **`/secure/admin/dashboard`** - Admin Dashboard
  - Dashboard for administrators
  - Admin authentication required

- **`/secure/admin/students`** - Student Management
  - Manage student accounts
  - Admin authentication required

- **`/secure/admin/submissions`** - All Submissions
  - View and manage all student submissions
  - Admin authentication required

## Database Schema

The application uses a combination of DynamoDB tables and S3 storage:

### DynamoDB Tables

- **Users**: Stores user authentication and role information
- **StudentProfiles**: Stores student profile information
- **InstructorProfiles**: Stores instructor profile information
- **Submissions**: Stores student project submissions
- **Showcases**: Stores student showcase configurations
- **Templates**: Stores showcase template definitions
- **Analytics**: Stores showcase analytics data
- **AuditLogs**: Stores system audit logs
- **Sessions**: Stores user session information

### S3 Buckets

- **media-bucket**: Stores uploaded media files (profile images, project screenshots, etc.)
- **showcase-bucket**: Stores published showcase files (HTML, CSS, JS)
- **template-bucket**: Stores showcase template files
- **preview-bucket**: Stores temporary preview files

## API Structure

The application exposes GraphQL APIs for interacting with these data structures:

- **Authentication API**: User authentication and session management
- **Profile API**: Student and instructor profile management
- **Submission API**: Student submission management and grading
- **Showcase API**: Showcase creation, customization, and publication
- **Analytics API**: Showcase analytics and reporting
- **Admin API**: Administrative functions and system management

## Data Security

- All data is encrypted at rest and in transit
- Access to data is controlled via role-based permissions
- Sensitive fields are protected from unauthorized access
- Audit logs track all data modifications
- JWT tokens are used for secure authentication
- Session management includes timeout and inactivity handling 