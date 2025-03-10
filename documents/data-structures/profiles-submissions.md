# Student Profiles and Submissions Data Structures

## Student Profile Structure

The application uses student profile data extracted from the Learning Management System (LMS). Below is the structure of the student profile JSON:

```json
{
  "id": "UUID",                      // Unique identifier for the student
  "first_name": "String",            // Student's first name
  "last_name": "String",             // Student's last name
  "email": "String",                 // Student's email address (used for authentication)
  "is_staff": "Boolean",             // Flag indicating if the user is staff
  "created_at": "ISO8601 DateTime",  // Timestamp when the profile was created
  "updated_at": "ISO8601 DateTime",  // Timestamp when the profile was last updated
  "user_roles": "String",            // User role(s) in the system
  "org_name": "String",              // Organization name (if applicable)
  "cohort_id": "Number",             // Identifier for the student's cohort
  "cognito_user_id": "String",       // ID of the linked Cognito user (if authenticated)
  "profile_image_url": "String",     // URL to student's profile image
  "bio": "String",                   // Student's biography/about me
  "contact_info": {                  // Additional contact information
    "phone": "String",               // Phone number
    "address": "String",             // Physical address
    "city": "String",                // City
    "state": "String",               // State/province
    "zip": "String",                 // Postal/zip code
    "country": "String"              // Country
  },
  "social_links": {                  // Social media profiles
    "linkedin": "String",            // LinkedIn profile URL
    "github": "String",              // GitHub profile URL
    "twitter": "String",             // Twitter/X profile URL
    "portfolio": "String",           // Personal portfolio URL
    "other": [                       // Other social links
      {
        "platform": "String",        // Platform name
        "url": "String"              // Profile URL
      }
    ]
  },
  "education": [                     // Educational background
    {
      "institution": "String",       // Institution name
      "degree": "String",            // Degree earned
      "field": "String",             // Field of study
      "start_date": "String",        // Start date
      "end_date": "String",          // End date (or "Present")
      "description": "String"        // Additional details
    }
  ],
  "skills": [                        // Technical skills
    {
      "category": "String",          // Skill category
      "skills": ["String"]           // List of skills in this category
    }
  ],
  "preferences": {                   // Student preferences
    "job_seeking_status": "String",  // Whether actively seeking employment
    "preferred_roles": ["String"],   // Preferred job roles
    "preferred_locations": ["String"], // Preferred work locations
    "remote_preference": "String"    // Remote work preference
  }
}
```

### Example Student Profile

```json
{
  "id": "f59bb9e0-c485-42f8-8e11-bc16cba2b477",
  "first_name": "Thomas",
  "last_name": "Tarpey",
  "email": "tom.tarpey@bloomtech.com",
  "is_staff": false,
  "created_at": "2025-01-10T18:23:46.536842+00:00",
  "updated_at": "2025-01-10T18:23:46.536842+00:00",
  "user_roles": "student",
  "org_name": "\"\"",
  "cohort_id": 0,
  "cognito_user_id": "us-east-1:a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "profile_image_url": "https://example.com/images/profiles/thomas-tarpey.jpg",
  "bio": "Full-stack developer with a passion for creating intuitive user experiences.",
  "contact_info": {
    "phone": "+1-555-123-4567",
    "address": "",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105",
    "country": "USA"
  },
  "social_links": {
    "linkedin": "https://linkedin.com/in/thomastarpey",
    "github": "https://github.com/thomastarpey",
    "twitter": "https://twitter.com/thomastarpey",
    "portfolio": "https://thomastarpey.dev",
    "other": []
  },
  "education": [
    {
      "institution": "BloomTech",
      "degree": "Certificate",
      "field": "Full-Stack Web Development",
      "start_date": "2024-09",
      "end_date": "2025-03",
      "description": "Intensive program covering modern web development technologies."
    }
  ],
  "skills": [
    {
      "category": "Frontend",
      "skills": ["React", "JavaScript", "HTML", "CSS", "Tailwind"]
    },
    {
      "category": "Backend",
      "skills": ["Node.js", "Express", "Python", "Django"]
    },
    {
      "category": "Database",
      "skills": ["MongoDB", "PostgreSQL", "DynamoDB"]
    }
  ],
  "preferences": {
    "job_seeking_status": "active",
    "preferred_roles": ["Frontend Developer", "Full-Stack Developer"],
    "preferred_locations": ["San Francisco", "Remote"],
    "remote_preference": "hybrid"
  }
}
```

## Instructor Profile Structure

The application also maintains profiles for instructors who manage student submissions and provide feedback.

```json
{
  "id": "UUID",                      // Unique identifier for the instructor
  "first_name": "String",            // Instructor's first name
  "last_name": "String",             // Instructor's last name
  "email": "String",                 // Instructor's email address
  "created_at": "ISO8601 DateTime",  // Timestamp when the profile was created
  "updated_at": "ISO8601 DateTime",  // Timestamp when the profile was last updated
  "assigned_cohorts": ["Number"],    // Array of cohort IDs the instructor is assigned to
  "cognito_user_id": "String",       // ID of the linked Cognito user
  "profile_image_url": "String",     // URL to instructor's profile image
  "bio": "String",                   // Instructor's biography
  "specialties": ["String"],         // Areas of expertise
  "contact_info": {                  // Contact information
    "phone": "String",               // Phone number
    "office_hours": "String"         // Office hours information
  }
}
```

## Student Submissions Structure

The application uses student submission data extracted from the LMS to populate project information. Below is the structure of the student submissions JSON:

```json
{
  "id": "Number",                    // Unique identifier for the submission
  "auth_id": "UUID",                 // Foreign key linking to student profile id
  "week": "Number",                  // Week number of the submission
  "demo_link": "String",             // Link to project demo
  "repo_link": "String",             // Link to GitHub repository
  "brainlift_link": "String",        // Link to project planning document
  "social_post": "String",           // Link to social media post about the project
  "passing": "Boolean|null",         // Whether the submission passed requirements
  "created_at": "ISO8601 DateTime",  // Timestamp when the submission was created
  "updated_at": "ISO8601 DateTime",  // Timestamp when the submission was last updated
  "deployed_url": "String",          // URL to the deployed project
  "grade": "String",                 // Grade assigned to the submission
  "notes": "String",                 // Student notes about the submission
  "report": "String",                // Instructor report/feedback
  "graded_at": "ISO8601 DateTime|null", // Timestamp when the submission was graded
  "cohort_id": "Number|null",        // Identifier for the student's cohort
  "graded_by": "UUID|null",          // ID of the instructor who graded the submission
  "status": "String",                // Submission status (draft, submitted, graded, archived)
  "submitted_at": "ISO8601 DateTime|null", // When the submission was officially submitted
  "last_student_edit": "ISO8601 DateTime|null", // Last time the student edited the submission
  "title": "String",                 // Project title (for showcase display)
  "description": "String",           // Extended project description
  "technologies": ["String"],        // Technologies used in the project
  "featured_image_url": "String",    // URL to featured project image
  "additional_links": [              // Additional project-related links
    {
      "title": "String",             // Link title
      "url": "String",               // URL
      "type": "String"               // Link type (documentation, video, etc.)
    }
  ],
  "showcase_included": "Boolean",    // Whether to include in student showcase
  "showcase_priority": "Number",     // Display priority in showcase (lower = higher priority)
  "edit_history": [                  // History of edits to the submission
    {
      "edited_at": "ISO8601 DateTime", // When the edit was made
      "edited_by": "String",         // Cognito User ID of who made the edit
      "fields_changed": ["String"],  // Array of fields that were changed
      "reason": "String"             // Reason for the edit (if provided)
    }
  ]
}
```

### Submission Status Lifecycle

The submission goes through several stages that align with the navigation structure and affect what fields can be edited and by whom:

1. **Draft**: Initial state when a student creates a submission but hasn't officially submitted it
   - Route: `/secure/submissions/new` or `/secure/submissions/:id` (for existing drafts)
   - Student can edit all fields
   - Submission is not visible to instructors for grading
   - Actions available:
     - Save as draft (updates the submission but keeps status as "draft")
     - Submit for grading (changes status to "submitted")
     - Delete draft (removes the submission entirely)

2. **Submitted**: Student has officially submitted their work
   - Route: `/secure/submissions/:id`
   - Student can edit only certain fields (demo_link, repo_link, deployed_url, notes)
   - Instructor can view and begin grading process
   - Actions available for students:
     - Update allowed fields
     - View submission status
   - Actions available for instructors:
     - Review submission
     - Provide feedback
     - Assign grade
     - Mark as passing/failing
     - Complete grading (changes status to "graded")

3. **Graded**: Instructor has reviewed and graded the submission
   - Route: `/secure/submissions/:id`
   - Student can only update non-academic fields (demo_link, repo_link, deployed_url, notes)
   - Grade and instructor feedback are locked for student editing
   - Instructor can still update all fields
   - Actions available for students:
     - View grade and feedback
     - Update allowed fields
     - Include in showcase (toggle `showcase_included`)
   - Actions available for instructors:
     - Update grade or feedback
     - Change passing status

4. **Archived**: Submission is locked for historical purposes
   - Route: `/secure/submissions/:id`
   - Read-only for students
   - Administrators can still make changes if necessary
   - Actions available:
     - View submission details (all users)
     - Restore from archive (administrators only)

### Field-Level Access Control

Access to submission fields varies by user role and submission status:

| Field | Administrator | Instructor | Student (Draft) | Student (Submitted) | Student (Graded) |
|-------|---------------|------------|----------------|---------------------|------------------|
| id | Read-only | Read-only | Read-only | Read-only | Read-only |
| auth_id | Read-only | Read-only | Read-only | Read-only | Read-only |
| week | Read/Write | Read/Write | Read/Write | Read-only | Read-only |
| demo_link | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| repo_link | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| brainlift_link | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| social_post | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| passing | Read/Write | Read/Write | Read-only | Read-only | Read-only |
| created_at | Read-only | Read-only | Read-only | Read-only | Read-only |
| updated_at | Read-only | Read-only | Read-only | Read-only | Read-only |
| deployed_url | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| grade | Read/Write | Read/Write | Read-only | Read-only | Read-only |
| notes | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| report | Read/Write | Read/Write | Read-only | Read-only | Read-only |
| graded_at | Read-only | Read-only | Read-only | Read-only | Read-only |
| cohort_id | Read/Write | Read-only | Read-only | Read-only | Read-only |
| graded_by | Read-only | Read-only | Read-only | Read-only | Read-only |
| status | Read/Write | Read/Write | Read/Write* | Read-only | Read-only |
| submitted_at | Read-only | Read-only | Read-only | Read-only | Read-only |
| last_student_edit | Read-only | Read-only | Read-only | Read-only | Read-only |
| title | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| description | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| technologies | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| featured_image_url | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| additional_links | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| showcase_included | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| showcase_priority | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write |
| edit_history | Read-only | Read-only | No access | No access | No access |

\* Students can only change status from "draft" to "submitted", not to other states.

## Submission Management Routes

The application provides several routes for managing submissions, each with specific functionality:

1. **Submissions List** (`/secure/submissions`)
   - Displays a list of all submissions for the authenticated student
   - Features:
     - Filter by status (draft, submitted, graded)
     - Sort by date, week, grade, etc.
     - Quick actions (view, edit, delete)
   - Data displayed:
     - Submission title
     - Week number
     - Status
     - Grade (if graded)
     - Created/submitted date
     - Passing status

2. **Create Submission** (`/secure/submissions/new`)
   - Form for creating a new submission
   - Fields available:
     - Week number
     - Title
     - Description
     - Demo link
     - Repository link
     - Deployed URL
     - BrainLift link
     - Social post link
     - Technologies used
     - Featured image
     - Additional links
     - Notes
   - Actions:
     - Save as draft
     - Submit for grading

3. **View/Edit Submission** (`/secure/submissions/:id`)
   - Detailed view of a specific submission
   - Editable fields based on submission status and user role
   - Features:
     - Form for editing allowed fields
     - Display of instructor feedback and grade
     - Submission history
     - Toggle for showcase inclusion
   - Actions:
     - Update submission
     - Submit for grading (if draft)
     - Delete (if draft)

4. **Admin Submissions List** (`/secure/admin/submissions`)
   - Available only to administrators and instructors
   - Displays submissions from all students
   - Features:
     - Filter by student, cohort, status, etc.
     - Bulk actions (grade, archive)
     - Export functionality

### Example Student Submission

```json
{
  "id": 887,
  "auth_id": "bff00795-b0cf-483a-8f62-35a736d6b3fc",
  "week": 3,
  "demo_link": "https://drive.google.com/file/d/1MayFpNcrRTqBRNJE9sR_hNzdqgPap13O/view?usp=sharing",
  "repo_link": "https://github.com/ayushshah21/Supa-auth",
  "brainlift_link": "https://workflowy.com/s/ticketai/AbtAqXwY1MMG0T64",
  "social_post": "https://x.com/ayushshah211/status/1885428107357937902",
  "passing": true,
  "created_at": "2025-01-31T20:41:26.026639+00:00",
  "updated_at": "2025-01-31T20:41:26.026639+00:00",
  "deployed_url": "https://ticket-ai-chi.vercel.app/",
  "grade": "B",
  "notes": "If you want to login as an admin to see full functionality I created a test user for this. Email: pulsefeed23@gmail.com, password: 123456",
  "report": "Great work on implementing authentication. The UI is clean and intuitive. Consider adding more error handling for edge cases.",
  "graded_at": "2025-02-01T14:30:22.123456+00:00",
  "cohort_id": null,
  "graded_by": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "graded",
  "submitted_at": "2025-01-31T20:41:26.026639+00:00",
  "last_student_edit": "2025-01-31T20:41:26.026639+00:00",
  "title": "TicketAI - Support Ticket Management System",
  "description": "A comprehensive support ticket management system with AI-powered ticket categorization and routing. The system includes user authentication, ticket creation, status tracking, and admin dashboard for managing support agents.",
  "technologies": ["Next.js", "Supabase", "Tailwind CSS", "OpenAI API", "TypeScript"],
  "featured_image_url": "https://example.com/images/projects/ticketai-dashboard.png",
  "additional_links": [
    {
      "title": "System Architecture Diagram",
      "url": "https://example.com/diagrams/ticketai-architecture.pdf",
      "type": "documentation"
    },
    {
      "title": "User Flow Demo",
      "url": "https://www.youtube.com/watch?v=example",
      "type": "video"
    }
  ],
  "showcase_included": true,
  "showcase_priority": 1,
  "edit_history": [
    {
      "edited_at": "2025-01-31T20:41:26.026639+00:00",
      "edited_by": "us-east-1:b2c3d4e5-f6g7-8901-bcde-fg2345678901",
      "fields_changed": ["demo_link", "repo_link", "notes", "deployed_url"],
      "reason": "Initial submission"
    },
    {
      "edited_at": "2025-02-01T14:30:22.123456+00:00",
      "edited_by": "us-east-1:c3d4e5f6-g7h8-9012-ijkl-mn3456789012",
      "fields_changed": ["grade", "report", "passing", "status"],
      "reason": "Grading submission"
    }
  ]
}
```

## Profile Management Routes

The application provides routes for managing student profiles:

1. **Profile Management** (`/secure/profile`)
   - Form for editing student profile information
   - Fields available:
     - Personal information (name, bio, etc.)
     - Contact information
     - Social media links
     - Education history
     - Skills
     - Preferences
   - Actions:
     - Update profile
     - Upload profile image

## Cohort Structure

The application organizes students into cohorts for administrative purposes.

```json
{
  "id": "Number",                    // Unique identifier for the cohort
  "name": "String",                  // Cohort name
  "start_date": "ISO8601 DateTime",  // When the cohort started
  "end_date": "ISO8601 DateTime",    // When the cohort ends
  "program": "String",               // Program name
  "description": "String",           // Cohort description
  "instructors": ["UUID"],           // Array of instructor IDs assigned to this cohort
  "status": "String",                // Cohort status (active, completed, upcoming)
  "created_at": "ISO8601 DateTime",  // When the cohort was created
  "updated_at": "ISO8601 DateTime"   // When the cohort was last updated
}
```

## Data Relationships

- Student Profile `id` corresponds to Student Submission `auth_id`
- A single student can have multiple submissions (one-to-many relationship)
- Each submission represents a different project or assignment
- Students are organized into cohorts
- Instructors are assigned to cohorts, and can manage submissions for students in those cohorts
- Student profiles and instructor profiles are linked to User Authentication records via `cognito_user_id` 