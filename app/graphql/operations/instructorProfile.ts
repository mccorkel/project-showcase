import { generateClient } from 'aws-amplify/api';

// Get instructor profile by user ID
export const getInstructorProfile = /* GraphQL */ `
  query GetInstructorProfile($userId: ID!) {
    getInstructorProfile(userId: $userId) {
      id
      userId
      firstName
      lastName
      title
      bio
      profileImageUrl
      assignedCohorts
      specialties
      contactInfo
    }
  }
`;

// Get all instructor profiles
export const getAllInstructorProfiles = /* GraphQL */ `
  query GetAllInstructorProfiles($limit: Int, $nextToken: String) {
    listInstructorProfiles(
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        firstName
        lastName
        title
        bio
        profileImageUrl
        assignedCohorts
        specialties
      }
      nextToken
    }
  }
`;

// Update instructor profile
export const updateInstructorProfile = /* GraphQL */ `
  mutation UpdateInstructorProfile(
    $id: ID!
    $firstName: String
    $lastName: String
    $title: String
    $bio: String
    $profileImageUrl: String
    $assignedCohorts: [String]
    $specialties: [String]
    $contactInfo: AWSJSON
  ) {
    updateInstructorProfile(
      input: {
        id: $id
        firstName: $firstName
        lastName: $lastName
        title: $title
        bio: $bio
        profileImageUrl: $profileImageUrl
        assignedCohorts: $assignedCohorts
        specialties: $specialties
        contactInfo: $contactInfo
      }
    ) {
      id
      firstName
      lastName
      title
      assignedCohorts
    }
  }
`; 