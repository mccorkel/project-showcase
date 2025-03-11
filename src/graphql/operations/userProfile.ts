import { generateClient } from 'aws-amplify/api';

// Get the current user's profile
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($userId: ID!) {
    getUser(id: $userId) {
      id
      cognitoId
      email
      username
      roles
      status
      lastLogin
      settings
      linkedProfiles
      permissions
      security
    }
  }
`;

// Get the student profile for the current user
export const getStudentProfile = /* GraphQL */ `
  query GetStudentProfile($userId: ID!) {
    getStudentProfile(userId: $userId) {
      id
      userId
      firstName
      lastName
      title
      bio
      profileImageUrl
      location
      education
      experienceYears
      socialLinks
      contactEmail
      skills
      contactInfo
      preferences
      cohortId
      isStaff
      orgName
    }
  }
`;

// Update the user profile
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile(
    $id: ID!
    $username: String
    $settings: AWSJSON
  ) {
    updateUser(
      input: {
        id: $id
        username: $username
        settings: $settings
      }
    ) {
      id
      cognitoId
      email
      username
      settings
    }
  }
`;

// Update the student profile
export const updateStudentProfile = /* GraphQL */ `
  mutation UpdateStudentProfile(
    $id: ID!
    $firstName: String
    $lastName: String
    $title: String
    $bio: String
    $profileImageUrl: String
    $location: String
    $education: [AWSJSON]
    $experienceYears: Int
    $socialLinks: AWSJSON
    $contactEmail: String
    $skills: [AWSJSON]
    $contactInfo: AWSJSON
    $preferences: AWSJSON
  ) {
    updateStudentProfile(
      input: {
        id: $id
        firstName: $firstName
        lastName: $lastName
        title: $title
        bio: $bio
        profileImageUrl: $profileImageUrl
        location: $location
        education: $education
        experienceYears: $experienceYears
        socialLinks: $socialLinks
        contactEmail: $contactEmail
        skills: $skills
        contactInfo: $contactInfo
        preferences: $preferences
      }
    ) {
      id
      userId
      firstName
      lastName
      title
      bio
      profileImageUrl
      location
      education
      experienceYears
      socialLinks
      contactEmail
      skills
      contactInfo
      preferences
    }
  }
`;

// Create a new education entry
export const addEducation = /* GraphQL */ `
  mutation AddEducation(
    $id: ID!
    $education: [AWSJSON]!
  ) {
    updateStudentProfile(
      input: {
        id: $id
        education: $education
      }
    ) {
      id
      education
    }
  }
`;

// Create a new skill category
export const addSkillCategory = /* GraphQL */ `
  mutation AddSkillCategory(
    $id: ID!
    $skills: [AWSJSON]!
  ) {
    updateStudentProfile(
      input: {
        id: $id
        skills: $skills
      }
    ) {
      id
      skills
    }
  }
`;

// Update social links
export const updateSocialLinks = /* GraphQL */ `
  mutation UpdateSocialLinks(
    $id: ID!
    $socialLinks: AWSJSON!
  ) {
    updateStudentProfile(
      input: {
        id: $id
        socialLinks: $socialLinks
      }
    ) {
      id
      socialLinks
    }
  }
`;

// Upload profile image (this will be used with Storage API)
export const updateProfileImage = /* GraphQL */ `
  mutation UpdateProfileImage(
    $id: ID!
    $profileImageUrl: String!
  ) {
    updateStudentProfile(
      input: {
        id: $id
        profileImageUrl: $profileImageUrl
      }
    ) {
      id
      profileImageUrl
    }
  }
`; 