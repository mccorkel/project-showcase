# Student Project Showcase - Project Summary

## Overview
This application is designed to create an online showcase/resume platform for students. It leverages AWS Amplify Gen 2 with Next.js to provide a modern, responsive web experience where students can showcase their projects, skills, and achievements.

## Core Features
- **LMS Integration**: Extracts student information from an external Learning Management System to pre-populate showcase pages
- **Authentication**: Students can log in using their learning email addresses
- **Profile Management**: Students can edit their showcase pages and add additional information
- **Project Gallery**: Display of student projects with descriptions, images, and links
- **Responsive Design**: Mobile-friendly interface accessible on various devices
- **Customizable Templates**: Students can personalize their showcase with different themes and layouts
- **Dark/Light Mode**: Support for different color schemes to enhance readability
- **Privacy Controls**: Students opt-in to make their showcase public, with granular visibility settings

## Data Sources
- **Student Profiles**: Basic information imported from the LMS including name, email, and cohort details
- **Student Submissions**: Project work and assignments submitted through the LMS, including:
  - Project repositories
  - Demo videos/links
  - Deployed applications
  - Project planning documents
  - Social media posts
  - Student notes
- **User-Generated Content**: Additional information added by students after authentication
- **Media Assets**: Images, documents, and other files uploaded by students

## Data Relationships
- Student profiles are linked to their submissions via a unique identifier
- Each student can have multiple project submissions
- Projects are organized by week/module in the curriculum

## Privacy and Visibility
- **Default Private**: All student showcases are private by default
- **Opt-In Publishing**: Students must explicitly choose to make their showcase public
- **Granular Controls**: Students can control visibility of individual projects
- **Contact Privacy**: Options to hide email and use contact forms instead
- **Analytics**: Students can see who viewed their showcase without exposing this data publicly
- **Admin Access**: Instructors and administrators can view all showcases regardless of privacy settings

## Showcase Generation Process
1. **Initial Template Creation**: System generates a basic showcase template for each student
2. **Data Population**: Template is populated with student profile and submission data
3. **Student Customization**: Students can log in and customize their showcase:
   - Add/edit personal information and bio
   - Upload profile picture and media
   - Customize project displays and pin featured projects
   - Add additional projects not in the LMS
   - Select theme and layout preferences
   - Configure privacy and visibility settings
4. **Publishing**: Students can publish their showcase to make it publicly accessible
5. **Updates**: Showcase automatically updates when new submissions are added to the LMS

## Template Features
- **Professional Header**: Student name, title, and quick contact options
- **Intro Section**: Brief overview of the student's background and skills
- **Project Gallery**: Showcase of student projects with details and media
- **About Me**: Personalized biography and background information
- **Experience & Education**: Academic and professional history
- **Skills & Technologies**: Visual representation of technical skills
- **Career Interests**: Information about career goals and preferences
- **Contact Information**: Ways to connect with the student

## User Flows
1. **Initial Data Import**: Administrator imports student data from LMS
2. **Student Login**: Students authenticate using their learning email
3. **Profile Customization**: Students edit and enhance their pre-populated profiles
4. **Content Management**: Students add projects, skills, and other portfolio elements
5. **Privacy Configuration**: Students set visibility preferences for their showcase
6. **Publishing**: Students opt-in to make their showcase publicly accessible
7. **Public Viewing**: External visitors can browse published student showcases

## Business Goals
- Provide students with a professional online presence
- Showcase student achievements to potential employers
- Create a centralized platform for student work
- Streamline the process of creating professional portfolios
- Respect student privacy and data ownership

## Future Enhancements
- Integration with professional networks (LinkedIn, GitHub)
- Advanced analytics for profile views and engagement
- Employer portal for talent recruitment
- Mobile application version
- AI-powered content suggestions for student profiles
- Automated project thumbnail generation
- Enhanced privacy controls and data export options

This document will be updated as the project evolves. 