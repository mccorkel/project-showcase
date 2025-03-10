# Student Project Showcase - Navigation Structure

## Overview

This document outlines the navigation structure of the Student Project Showcase application, including routes, authentication requirements, and page transitions.

## Route Structure

### Public Routes (Unauthenticated)

- **`/`** - Landing Page
  - Description: Main entry point for the application
  - Authentication: None required
  - Features:
    - Overview of the showcase platform
    - Featured student showcases
    - Login button
    - Information for prospective students

- **`/login`** - Authentication Page
  - Description: Login page for students and administrators
  - Authentication: None required
  - Features:
    - Login form (email/password)
    - Cognito authentication integration
    - Error handling for invalid credentials
    - Redirect to dashboard upon successful login
  - Notes: 
    - No account creation functionality (accounts are pre-created based on LMS data)
    - Redirects to `/secure/dashboard` after successful authentication

- **`/profile/:username`** - Public Profile View
  - Description: Public-facing view of a student's showcase
  - Authentication: None required
  - Features:
    - If profile is public: Displays the student's published showcase
    - If profile is private: Displays a "Profile is private" message
    - Loads static files (index.html, style.css, script.js) from S3 bucket for public profiles
  - URL Parameters:
    - `username`: The student's username (typically derived from email or name)

### Secure Routes (Authentication Required)

All routes under `/secure/*` require authentication. Attempting to access these routes without authentication will redirect to the `/login` page.

- **`/secure/dashboard`** - Student Dashboard
  - Description: Main dashboard for authenticated students
  - Authentication: Required
  - Features:
    - Overview of student's submissions and showcase status
    - Navigation to other secure areas
    - Quick actions (create submission, edit profile, etc.)
    - Notifications and alerts

- **`/secure/profile`** - Profile Management
  - Description: Page for students to edit their profile information
  - Authentication: Required
  - Features:
    - Edit personal information
    - Update contact details
    - Manage social media links
    - Upload profile picture

- **`/secure/submissions`** - Submissions Management
  - Description: List of all student submissions
  - Authentication: Required
  - Features:
    - View all submissions
    - Filter by status (draft, submitted, graded)
    - Sort by date, grade, etc.

- **`/secure/submissions/new`** - Create Submission
  - Description: Create a new submission draft
  - Authentication: Required
  - Features:
    - Submission form
    - Save as draft
    - Submit for grading

- **`/secure/submissions/:id`** - View/Edit Submission
  - Description: View or edit a specific submission
  - Authentication: Required
  - Features:
    - View submission details
    - Edit submission (if in draft status or editable fields)
    - View instructor feedback and grade (if graded)
  - URL Parameters:
    - `id`: The submission ID

- **`/secure/showcase`** - Showcase Management
  - Description: Manage the student's public showcase
  - Authentication: Required
  - Features:
    - Edit showcase content
    - Select template and customization options
    - Choose which projects to feature
    - Toggle visibility settings (public/private)
    - Publish showcase (generates static files and uploads to S3)

- **`/secure/showcase/preview`** - Showcase Preview
  - Description: Preview the showcase before publishing
  - Authentication: Required
  - Features:
    - Live preview of how the showcase will appear to visitors
    - Option to publish or continue editing

- **`/secure/analytics`** - Personal Analytics
  - Description: View analytics for the student's own showcase
  - Authentication: Required
  - Features:
    - View showcase engagement metrics
    - Track profile views
    - Monitor project popularity
    - Analyze traffic sources
    - View geographic distribution of visitors

### Instructor Routes (Instructor Authentication Required)

- **`/secure/instructor/dashboard`** - Instructor Dashboard
  - Description: Dashboard for instructors
  - Authentication: Required (Instructor role)
  - Features:
    - Overview of assigned cohorts
    - Submissions pending review
    - Recent student activity
    - Quick access to grading functions

- **`/secure/instructor/cohorts`** - Cohort Management
  - Description: Manage assigned cohorts
  - Authentication: Required (Instructor role)
  - Features:
    - View all assigned cohorts
    - Filter students by cohort
    - View cohort progress and statistics

- **`/secure/instructor/cohorts/:id`** - Cohort Detail
  - Description: View details for a specific cohort
  - Authentication: Required (Instructor role)
  - Features:
    - List of all students in the cohort
    - Submission statistics for the cohort
    - Bulk actions for cohort management
  - URL Parameters:
    - `id`: The cohort ID

- **`/secure/instructor/students`** - Student List
  - Description: View all students in assigned cohorts
  - Authentication: Required (Instructor role)
  - Features:
    - List of all students in assigned cohorts
    - Filter and search functionality
    - Quick access to student profiles and submissions

- **`/secure/instructor/students/:id`** - Student Detail
  - Description: View details for a specific student
  - Authentication: Required (Instructor role)
  - Features:
    - Student profile information
    - List of all submissions by the student
    - Showcase preview (if available)
  - URL Parameters:
    - `id`: The student profile ID

- **`/secure/instructor/submissions`** - Submission Management
  - Description: Manage submissions for students in assigned cohorts
  - Authentication: Required (Instructor role)
  - Features:
    - View all submissions from students in assigned cohorts
    - Filter by status, student, week, etc.
    - Bulk grading actions

- **`/secure/instructor/submissions/:id/grade`** - Grade Submission
  - Description: Grade a specific submission
  - Authentication: Required (Instructor role)
  - Features:
    - View submission details
    - Provide feedback
    - Assign grade
    - Mark as passing/failing
  - URL Parameters:
    - `id`: The submission ID

- **`/secure/instructor/analytics`** - Cohort Analytics
  - Description: View analytics for assigned cohorts
  - Authentication: Required (Instructor role)
  - Features:
    - Submission statistics by cohort
    - Grading progress
    - Student engagement metrics
    - Showcase publication statistics

### Admin Routes (Admin Authentication Required)

- **`/secure/admin/dashboard`** - Admin Dashboard
  - Description: Dashboard for administrators
  - Authentication: Required (Admin role)
  - Features:
    - Overview of system statistics
    - Access to admin functions
    - System health indicators
    - Recent activity across the platform

- **`/secure/admin/students`** - Student Management
  - Description: Manage student accounts
  - Authentication: Required (Admin role)
  - Features:
    - View all students
    - Edit student information
    - Link/unlink Cognito accounts
    - Create new student profiles
    - Bulk import students from CSV

- **`/secure/admin/students/:id`** - Student Detail Management
  - Description: Manage a specific student account
  - Authentication: Required (Admin role)
  - Features:
    - Edit all student profile fields
    - Manage role assignments
    - View activity history
    - Reset password
  - URL Parameters:
    - `id`: The student profile ID

- **`/secure/admin/instructors`** - Instructor Management
  - Description: Manage instructor accounts
  - Authentication: Required (Admin role)
  - Features:
    - View all instructors
    - Create new instructor accounts
    - Assign instructors to cohorts
    - Manage instructor permissions

- **`/secure/admin/instructors/:id`** - Instructor Detail Management
  - Description: Manage a specific instructor account
  - Authentication: Required (Admin role)
  - Features:
    - Edit instructor profile
    - Manage cohort assignments
    - View grading history
  - URL Parameters:
    - `id`: The instructor profile ID

- **`/secure/admin/cohorts`** - Cohort Management
  - Description: Manage all cohorts
  - Authentication: Required (Admin role)
  - Features:
    - View all cohorts
    - Create new cohorts
    - Assign instructors to cohorts
    - Manage cohort schedules

- **`/secure/admin/cohorts/:id`** - Cohort Detail Management
  - Description: Manage a specific cohort
  - Authentication: Required (Admin role)
  - Features:
    - Edit cohort details
    - Add/remove students
    - Assign/unassign instructors
    - View cohort statistics
  - URL Parameters:
    - `id`: The cohort ID

- **`/secure/admin/submissions`** - All Submissions
  - Description: View and manage all student submissions
  - Authentication: Required (Admin role)
  - Features:
    - View all submissions across all students
    - Filter and search functionality
    - Bulk actions
    - Override grades or feedback

- **`/secure/admin/templates`** - Showcase Template Management
  - Description: Manage showcase templates
  - Authentication: Required (Admin role)
  - Features:
    - View all templates
    - Create new templates
    - Edit existing templates
    - Set default template
    - Preview templates

- **`/secure/admin/templates/:id`** - Template Detail Management
  - Description: Manage a specific showcase template
  - Authentication: Required (Admin role)
  - Features:
    - Edit template files (HTML, CSS, JS)
    - Configure customization options
    - Preview template
    - Publish/unpublish template
  - URL Parameters:
    - `id`: The template ID

- **`/secure/admin/lms-integration`** - LMS Integration
  - Description: Manage integration with Learning Management Systems
  - Authentication: Required (Admin role)
  - Features:
    - Configure LMS connection settings
    - Import student data
    - Import submission data
    - View import history
    - Resolve import conflicts

- **`/secure/admin/system-settings`** - System Settings
  - Description: Configure system-wide settings
  - Authentication: Required (Admin role)
  - Features:
    - General settings
    - Email notification settings
    - Authentication settings
    - Storage configuration
    - Feature toggles

- **`/secure/admin/analytics`** - System Analytics
  - Description: View analytics for the entire system
  - Authentication: Required (Admin role)
  - Features:
    - User engagement metrics
    - Submission statistics
    - Showcase publication metrics
    - System performance metrics
    - Export reports

- **`/secure/admin/audit-logs`** - Audit Logs
  - Description: View system audit logs
  - Authentication: Required (Admin role)
  - Features:
    - View all system actions
    - Filter by user, action type, date, etc.
    - Export logs
    - Set up alerts for suspicious activity

- **`/secure/admin/delegations`** - Permission Delegations
  - Description: Manage temporary permission delegations
  - Authentication: Required (Admin role)
  - Features:
    - Create new delegations
    - View active delegations
    - Revoke delegations
    - Set delegation expiration

### Template Management (Authenticated Users)

- **`/secure/templates`** - Template Creation and Management
  - Description: Create and manage custom showcase templates
  - Authentication: Required
  - Features:
    - View instructions for creating templates
    - Create new templates using HTML and placeholders
    - Generate previews of templates with sample data
    - Save templates to an S3 bucket
    - Load available templates from the S3 bucket for use in showcases

## Authentication Flow

1. User navigates to the application (landing page)
2. User clicks "Login" and is directed to `/login`
3. User enters credentials
4. On successful authentication:
   - JWT token is stored in browser
   - User is redirected to `/secure/dashboard`
5. On failed authentication:
   - Error message is displayed
   - User remains on login page
6. For secure routes:
   - Application checks for valid JWT token
   - If token is invalid or missing, redirect to `/login`
   - After successful login, redirect back to the originally requested page

## Role-Based Redirection

After successful authentication, users are redirected based on their highest role:

1. Administrators: Redirected to `/secure/admin/dashboard`
2. Instructors: Redirected to `/secure/instructor/dashboard`
3. Students: Redirected to `/secure/dashboard`

Users with multiple roles can switch between different views using the navigation menu.

## Showcase Publication Flow

1. Student navigates to `/secure/showcase`
2. Student edits showcase content and settings
3. Student toggles "Make Profile Public" to true
4. Student clicks "Publish Showcase"
5. System:
   - Generates static HTML (index.html)
   - Generates CSS (style.css)
   - Generates JavaScript (script.js)
   - Uploads files to S3 bucket with path pattern: `{bucket-name}/{username}/`
   - Updates database to mark showcase as published
6. Student's showcase is now accessible at `/profile/{username}`

## URL Structure for Public Profiles

- Public Profile URL: `/profile/{username}`
- Corresponding S3 Path: `{bucket-name}/{username}/index.html`
- CSS File: `{bucket-name}/{username}/style.css`
- JavaScript File: `{bucket-name}/{username}/script.js`
- Additional Assets: `{bucket-name}/{username}/assets/*`

## Responsive Behavior

- All pages are responsive and adapt to different screen sizes
- Mobile navigation uses a hamburger menu for secure routes
- Dashboard layout adjusts for smaller screens

## Error Pages

- **`/404`** - Not Found
  - Displayed when a page doesn't exist
  
- **`/403`** - Forbidden
  - Displayed when a user attempts to access a page they don't have permission for
  
- **`/500`** - Server Error
  - Displayed when an unexpected error occurs

## Navigation Components

### Main Navigation (Student)

- Dashboard
- Profile
- Submissions
- Showcase
- Analytics
- Templates
- Logout

### Instructor Navigation

- Instructor Dashboard
- Cohorts
- Students
- Submissions
- Analytics
- Templates
- Return to Student View (if user has dual role)
- Logout

### Admin Navigation

- Admin Dashboard
- Students
- Instructors
- Cohorts
- Submissions
- Templates
- LMS Integration
- System Settings
- Analytics
- Audit Logs
- Delegations
- Return to Instructor View (if user has instructor role)
- Return to Student View (if user has student role)
- Logout

This document will be updated as the navigation structure evolves during development. 