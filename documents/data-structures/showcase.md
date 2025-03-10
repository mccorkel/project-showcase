# Student Showcase Data Structures

## Showcase Template Structure

The application provides templates for student showcases. Below is the structure of the showcase template data:

```json
{
  "id": "UUID",                      // Unique identifier for the template
  "name": "String",                  // Template name
  "description": "String",           // Template description
  "thumbnail_url": "String",         // URL to template thumbnail image
  "created_at": "ISO8601 DateTime",  // When the template was created
  "updated_at": "ISO8601 DateTime",  // When the template was last updated
  "is_active": "Boolean",            // Whether the template is available for use
  "default_theme": "String",         // Default theme (light, dark, auto)
  "features": ["String"],            // Features supported by this template
  "template_files": {                // Template file references
    "html": "String",                // Path to HTML template
    "css": "String",                 // Path to CSS template
    "js": "String"                   // Path to JavaScript template
  },
  "customization_options": {         // Available customization options
    "colors": [                      // Color schemes
      {
        "id": "String",              // Color scheme ID
        "name": "String",            // Color scheme name
        "primary": "String",         // Primary color (hex)
        "secondary": "String",       // Secondary color (hex)
        "accent": "String",          // Accent color (hex)
        "background": "String",      // Background color (hex)
        "text": "String"             // Text color (hex)
      }
    ],
    "fonts": [                       // Font options
      {
        "id": "String",              // Font ID
        "name": "String",            // Font name
        "heading": "String",         // Heading font family
        "body": "String"             // Body font family
      }
    ],
    "layouts": [                     // Layout options
      {
        "id": "String",              // Layout ID
        "name": "String",            // Layout name
        "description": "String"      // Layout description
      }
    ]
  }
}
```

## Student Showcase Structure

The student showcase combines student profile information, submissions, and customization preferences. Below is the structure of the student showcase data:

```json
{
  "id": "UUID",                        // Unique identifier for the showcase
  "student_id": "UUID",                // ID of the student profile
  "cognito_user_id": "String",         // ID of the Cognito user who owns this showcase
  "username": "String",                // Username for public URL (derived from email or name)
  "created_at": "ISO8601 DateTime",    // When the showcase was created
  "updated_at": "ISO8601 DateTime",    // When the showcase was last updated
  "template_id": "UUID",               // ID of the selected template
  "profile": {                         // Profile information
    "first_name": "String",            // First name
    "last_name": "String",             // Last name
    "title": "String",                 // Professional title
    "bio": "String",                   // About me/bio text
    "profile_image_url": "String",     // URL to profile image
    "location": "String",              // Current location
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
    "social_links": {                  // Social media links
      "github": "String",              // GitHub profile URL
      "linkedin": "String",            // LinkedIn profile URL
      "twitter": "String",             // Twitter profile URL
      "portfolio": "String",           // Personal portfolio URL
      "other": [                       // Other social links
        {
          "platform": "String",        // Platform name
          "url": "String",             // Profile URL
          "icon": "String"             // Font Awesome icon class
        }
      ]
    },
    "contact_email": "String",         // Public contact email (may differ from login email)
    "skills": [                        // Skills categorized by type
      {
        "category": "String",          // Skill category
        "skills": ["String"]           // Array of skills in this category
      }
    ]
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
      "notes": "String",               // Additional notes
      "display_order": "Number"        // Order to display in showcase (lower = higher priority)
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
    "layout_preference": "String",     // Layout preference
    "sections_order": ["String"],      // Order of sections to display
    "sections_visibility": {           // Visibility of individual sections
      "about": "Boolean",              // Show About Me section
      "projects": "Boolean",           // Show Projects section
      "skills": "Boolean",             // Show Skills section
      "experience": "Boolean",         // Show Experience section
      "education": "Boolean",          // Show Education section
      "blogs": "Boolean",              // Show Blogs section
      "contact": "Boolean"             // Show Contact section
    }
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
  "publication": {                     // Publication details
    "status": "String",                // Status (draft, published, archived)
    "version": "Number",               // Current version number
    "published_files": {               // Information about published files
      "html_path": "String",           // S3 path to published HTML file
      "css_path": "String",            // S3 path to published CSS file
      "js_path": "String",             // S3 path to published JavaScript file
      "assets_path": "String"          // S3 path to published assets directory
    },
    "publication_history": [           // History of publications
      {
        "version": "Number",           // Version number
        "published_at": "ISO8601 DateTime", // When this version was published
        "published_by": "String",      // Who published this version
        "files": {                     // Files for this version
          "html_path": "String",       // S3 path to HTML file
          "css_path": "String",        // S3 path to CSS file
          "js_path": "String",         // S3 path to JavaScript file
          "assets_path": "String"      // S3 path to assets directory
        }
      }
    ]
  },
  "meta": {                            // Metadata about the showcase
    "created_by": "String",            // Cognito User ID of the creator
    "last_updated_by": "String",       // Cognito User ID of the last person to update
    "edit_history": [                  // History of edits
      {
        "edited_at": "ISO8601 DateTime", // When the edit was made
        "edited_by": "String",         // Who made the edit
        "changes": ["String"]          // What was changed
      }
    ]
  },
  "preview_data": {                    // Data for preview functionality
    "last_preview_generated": "ISO8601 DateTime", // When the preview was last generated
    "preview_files": {                 // Information about preview files
      "html_path": "String",           // S3 path to preview HTML file
      "css_path": "String",            // S3 path to preview CSS file
      "js_path": "String",             // S3 path to preview JavaScript file
      "assets_path": "String"          // S3 path to preview assets directory
    },
    "preview_url": "String",           // Temporary URL for accessing the preview
    "preview_expiry": "ISO8601 DateTime" // When the preview URL expires
  }
}
```

## Showcase Analytics Structure

The application tracks analytics for student showcases to provide insights on engagement.

```json
{
  "id": "UUID",                      // Unique identifier for the analytics record
  "showcase_id": "UUID",             // ID of the showcase
  "student_id": "UUID",              // ID of the student
  "date": "ISO8601 Date",            // Date of the analytics data
  "views": {                         // View statistics
    "total": "Number",               // Total views for the day
    "unique": "Number",              // Unique visitors for the day
    "by_hour": [                     // Views broken down by hour
      {
        "hour": "Number",            // Hour of the day (0-23)
        "count": "Number"            // Number of views in this hour
      }
    ]
  },
  "project_views": [                 // Views for individual projects
    {
      "project_id": "String",        // Project ID
      "views": "Number"              // Number of views for this project
    }
  ],
  "referrers": [                     // Traffic sources
    {
      "source": "String",            // Referrer source
      "count": "Number"              // Number of visits from this source
    }
  ],
  "locations": [                     // Geographic locations of visitors
    {
      "country": "String",           // Country code
      "region": "String",            // Region/state
      "city": "String",              // City
      "count": "Number"              // Number of visits from this location
    }
  ],
  "devices": [                       // Device types used by visitors
    {
      "type": "String",              // Device type (desktop, mobile, tablet)
      "count": "Number"              // Number of visits from this device type
    }
  ]
}
```

## Showcase Publication Process

The showcase publication process involves several steps that align with the navigation structure:

1. **Template Selection**: Student selects a template for their showcase
   - Route: `/secure/showcase`
   - Action: Student selects from available templates
   - Data Updated: `template_id` in Showcase Structure

2. **Content Customization**: Student customizes their showcase content and appearance
   - Route: `/secure/showcase`
   - Actions:
     - Edit profile information
     - Select projects to include
     - Customize appearance (colors, fonts, layout)
     - Configure visibility settings
   - Data Updated: Multiple fields in Showcase Structure

3. **Preview**: Student previews how their showcase will appear to visitors
   - Route: `/secure/showcase/preview`
   - Actions:
     - System generates temporary preview files
     - Student reviews the preview
     - Student can return to editing or proceed to publication
   - Data Updated: `preview_data` in Showcase Structure

4. **Publication**: Student publishes their showcase
   - Route: `/secure/showcase`
   - Actions:
     - Student toggles `visibility.is_public` to true
     - Student clicks "Publish Showcase" button
     - System generates static files based on template and content
     - System uploads files to S3 bucket with path pattern: `{bucket-name}/{username}/`
     - System updates showcase record with publication details
   - Data Updated:
     - `visibility.is_public` set to true
     - `visibility.last_published` updated
     - `publication.status` set to "published"
     - `publication.version` incremented
     - `publication.published_files` updated with new paths
     - New entry added to `publication.publication_history`

5. **Updates**: Student can make changes and republish
   - Route: `/secure/showcase`
   - Actions:
     - Student makes changes to showcase content or settings
     - Student republishes, creating a new version
   - Data Updated:
     - Same as Publication step, with version number incremented

## Preview Functionality

The preview functionality allows students to see how their showcase will appear to visitors before publishing:

1. **Generate Preview**: System generates temporary preview files
   - Triggered when student navigates to `/secure/showcase/preview`
   - Creates temporary HTML, CSS, and JavaScript files
   - Stores files in S3 with path pattern: `{bucket-name}/previews/{username}/{timestamp}/`
   - Updates `preview_data` in Showcase Structure

2. **View Preview**: Student views the preview
   - Preview is displayed in the browser
   - Preview uses the actual template and student's content
   - Preview is visually identical to how the published showcase will appear

3. **Preview Expiry**: Preview files are temporary
   - Preview URLs expire after a set period (typically 24 hours)
   - Expired preview files are automatically deleted
   - New preview files are generated when student revisits the preview page

## S3 Storage Structure

Published showcase files are stored in S3 with the following structure:

```
{bucket-name}/
├── {username}/
│   ├── index.html           # Main HTML file
│   ├── style.css            # CSS styles
│   ├── script.js            # JavaScript functionality
│   ├── assets/              # Assets directory
│   │   ├── images/          # Image assets
│   │   │   ├── profile.jpg  # Profile image
│   │   │   └── projects/    # Project images
│   │   ├── fonts/           # Custom fonts
│   │   └── videos/          # Video thumbnails
│   └── versions/            # Previous versions
│       ├── v1/              # Version 1
│       │   ├── index.html
│       │   ├── style.css
│       │   └── script.js
│       └── v2/              # Version 2
│           ├── index.html
│           ├── style.css
│           └── script.js
├── previews/                # Preview files
│   └── {username}/          # Organized by username
│       └── {timestamp}/     # Organized by generation time
│           ├── index.html
│           ├── style.css
│           └── script.js
```

## Public URL Structure

Each published showcase is accessible via a public URL with the following pattern:

- Public Profile URL: `/profile/{username}`
- Corresponding S3 Path: `{bucket-name}/{username}/index.html`

## Data Relationships

- Each student can have one showcase
- Showcases are linked to student profiles via `student_id`
- Showcases can include multiple projects from student submissions
- Showcases are associated with a template that defines their appearance
- Analytics data is linked to showcases via `showcase_id` 