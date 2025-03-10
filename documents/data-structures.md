# Student Project Showcase - Data Structures

## Student Profile JSON Structure

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
  "cohort_id": "Number"              // Identifier for the student's cohort
}
```

### Example Student Profiles

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
  "cohort_id": 0
}
```

```json
{
  "id": "5846946b-8fab-485e-825d-283158592cdb",
  "first_name": "Tuomas",
  "last_name": "Laitila",
  "email": "tuomas.laitila@gauntletai.com",
  "is_staff": false,
  "created_at": "2025-01-10T19:49:26.552428+00:00",
  "updated_at": "2025-01-10T19:49:26.552428+00:00",
  "user_roles": "student",
  "org_name": "\"\"",
  "cohort_id": 0
}
```

## Student Submissions JSON Structure

The application also uses student submission data extracted from the LMS to populate project information. Below is the structure of the student submissions JSON:

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
  "cohort_id": "Number|null"         // Identifier for the student's cohort
}
```

### Example Student Submissions

```json
{
  "id": 848,
  "auth_id": "768d2c98-0fa4-4402-b6b3-cf349de319a5",
  "week": 3,
  "demo_link": "https://x.com/AmeliaDahn/status/1884085166328668258",
  "repo_link": "https://github.com/AmeliaTDahn/StudySync",
  "brainlift_link": "https://workflowy.com/#/282ca3034e7e",
  "social_post": "https://x.com/AmeliaDahn/status/1884085166328668258",
  "passing": null,
  "created_at": "2025-01-28T03:46:45.453457+00:00",
  "updated_at": "2025-01-28T03:46:45.453457+00:00",
  "deployed_url": "https://study-sync-1-AmeliaDahn.replit.app",
  "grade": "\"\"",
  "notes": "Sorry for being late. Deployment and databases are hard lol. I deleted my database last night like a true developer!",
  "report": "\"\"",
  "graded_at": null,
  "cohort_id": null
}
```

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
  "report": "\"\"",
  "graded_at": null,
  "cohort_id": null
}
```

## Data Relationships

The key relationship between these data structures is:
- Student Profile `id` corresponds to Student Submission `auth_id`
- A single student can have multiple submissions (one-to-many relationship)
- Each submission represents a different project or assignment

## Student Showcase Template Data Structure

Based on the sample showcase page, we can define a comprehensive data structure that combines student profile information, submissions, and additional customizable content. This structure will be used to generate personalized showcase pages:

```json
{
  "profile": {
    "id": "UUID",                      // Student ID from LMS
    "first_name": "String",            // First name
    "last_name": "String",             // Last name
    "email": "String",                 // Email address
    "cohort": "String",                // Cohort/class information
    "title": "String",                 // Professional title (e.g., "AI-First Full-Stack Software Engineer")
    "education": [                     // Education history
      {
        "institution": "String",       // Institution name
        "degree": "String",            // Degree earned
        "field": "String",             // Field of study
        "logo_url": "String",          // Institution logo URL
        "graduation_date": "String"    // Graduation date
      }
    ],
    "experience_years": "Number",      // Years of experience
    "profile_image": "String",         // URL to profile image
    "bio": "String",                   // About me/bio text
    "location": "String",              // Current location
    "social_links": {                  // Social media links
      "github": "String",
      "linkedin": "String",
      "twitter": "String",
      "portfolio": "String",
      "other": [
        {
          "platform": "String",
          "url": "String",
          "icon": "String"             // Font Awesome icon class
        }
      ]
    },
    "resume_url": "String",            // URL to downloadable resume
    "contact_email": "String"          // Contact email (may differ from login email)
  },
  "projects": [                        // Array of projects (from submissions and manually added)
    {
      "id": "String",                  // Project ID
      "submission_id": "Number",       // Related submission ID (if applicable)
      "title": "String",               // Project title
      "icon": "String",                // Font Awesome icon class
      "summary": "String",             // Project summary/description
      "duration": "String",            // Project duration (e.g., "5-Day Build")
      "platform": "String",            // Platform (e.g., "Web", "iOS", "Android")
      "github_url": "String",          // GitHub repository URL
      "deployed_url": "String",        // Deployed application URL
      "is_pinned": "Boolean",          // Whether project is pinned/featured
      "technologies": [                // Array of technologies used
        {
          "name": "String",            // Technology name
          "category": "String"         // Optional category for grouping
        }
      ],
      "media": {                       // Project media
        "videos": [                    // Video links
          {
            "url": "String",           // Video URL
            "thumbnail": "String",     // Thumbnail URL
            "title": "String"          // Video title
          }
        ],
        "images": [                    // Image links
          {
            "url": "String",           // Image URL
            "caption": "String"        // Image caption
          }
        ]
      },
      "notes": "String"                // Additional notes
    }
  ],
  "skills": [                          // Skills categorized by type
    {
      "category": "String",            // Skill category
      "skills": ["String"]             // Array of skills in this category
    }
  ],
  "experience": [                      // Work experience
    {
      "company": "String",             // Company name
      "logo_url": "String",            // Company logo URL
      "position": "String",            // Position/title
      "start_date": "String",          // Start date
      "end_date": "String",            // End date (or "Present")
      "description": "String",         // Job description
      "technologies": ["String"]       // Technologies used
    }
  ],
  "career": {                          // Career preferences
    "looking_for": ["String"],         // What they're looking for in next role
    "preferred_locations": ["String"], // Preferred work locations
    "work_type": ["String"],           // Work types (remote, hybrid, on-site)
    "interests": ["String"]            // Areas of interest
  },
  "blogs": [                           // Blog posts or articles
    {
      "title": "String",               // Blog title
      "url": "String",                 // Blog URL
      "published_date": "String",      // Publication date
      "platform": "String"             // Publishing platform
    }
  ],
  "customization": {                   // UI customization options
    "theme_color": "String",           // Primary theme color
    "accent_color": "String",          // Accent color
    "font_preference": "String",       // Font preference
    "layout_preference": "String"      // Layout preference
  },
  "visibility": {                      // Visibility and privacy settings
    "is_public": "Boolean",            // Whether the showcase is publicly accessible (default: false)
    "last_published": "ISO8601 DateTime", // When the showcase was last published
    "searchable": "Boolean",           // Whether the showcase should appear in search results (default: false)
    "show_email": "Boolean",           // Whether to display email publicly (default: false)
    "show_contact_form": "Boolean",    // Whether to show a contact form (default: true)
    "project_visibility": [            // Per-project visibility settings
      {
        "project_id": "String",        // Project ID
        "is_public": "Boolean"         // Whether this specific project is public
      }
    ]
  },
  "analytics": {                       // Analytics data (visible only to the student)
    "view_count": "Number",            // Number of showcase views
    "last_viewed": "ISO8601 DateTime", // When the showcase was last viewed
    "popular_projects": ["String"],    // IDs of most viewed projects
    "referrers": [                     // Where visitors came from
      {
        "source": "String",            // Referrer source
        "count": "Number"              // Number of visits from this source
      }
    ]
  },
  "meta": {                            // Metadata about the showcase
    "created_at": "ISO8601 DateTime",  // When the showcase was created
    "updated_at": "ISO8601 DateTime",  // When the showcase was last updated
    "version": "String",               // Template version
    "status": "String"                 // Status (draft, published, archived)
  }
}
```

This comprehensive data structure allows for:
1. Automatic population of core information from LMS data
2. Integration of project submissions as portfolio items
3. Additional customization by students to personalize their showcase
4. Flexible templating to support different layouts and designs
5. Privacy controls allowing students to opt-in to making their showcase public

## Privacy and Visibility Controls

The showcase system implements a privacy-first approach:

- **Default Privacy**: All student showcases are private by default
- **Opt-In Publishing**: Students must explicitly choose to make their showcase public
- **Granular Controls**: Students can control visibility of individual projects
- **Contact Privacy**: Options to hide email and use contact forms instead
- **Search Indexing**: Control whether the showcase appears in search engines
- **Analytics Visibility**: Students can see who viewed their showcase without exposing this data publicly

## Student Showcase Data Model

Based on the student profile and submission data, we will create an extended data model for the showcase that includes:

### Core Profile Information
- Student ID (from LMS)
- First Name
- Last Name
- Email Address
- Cohort Information

### Extended Showcase Information
- Profile Picture
- Bio/About Me
- Skills/Technologies
- Social Media Links
  - LinkedIn
  - GitHub
  - Portfolio Website
  - Other platforms
- Contact Information (optional)

### Project Information (from Submissions)
- Project Title (derived from repository or manually added)
- Project Description
- Technologies Used
- Project Demo (from demo_link)
- GitHub Repository (from repo_link)
- Planning Documentation (from brainlift_link)
- Social Media Mentions (from social_post)
- Live Demo (from deployed_url)
- Project Week/Timeline
- Student Notes (from notes field)

### Academic Information
- Course/Program Name
- Graduation/Completion Date
- Achievements/Certifications
- Notable Assignments

This document will be updated as we refine the data model and integrate additional information from student submissions. 