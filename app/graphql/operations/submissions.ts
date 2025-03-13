import { generateClient } from 'aws-amplify/api';

// Get a list of submissions for the current user
export const getSubmissions = /* GraphQL */ `
  query GetSubmissions($studentProfileId: ID!, $limit: Int, $nextToken: String) {
    listSubmissions(
      filter: { studentProfileId: { eq: $studentProfileId } }
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        studentProfileId
        week
        demoLink
        repoLink
        brainliftLink
        socialPost
        passing
        deployedUrl
        grade
        notes
        report
        gradedAt
        cohortId
        gradedBy
        status
        title
        description
        technologies
        featuredImageUrl
        submittedAt
        lastStudentEdit
        showcaseIncluded
        showcasePriority
      }
      nextToken
    }
  }
`;

// Get a single submission by ID
export const getSubmission = /* GraphQL */ `
  query GetSubmission($id: ID!) {
    getSubmission(id: $id) {
      id
      studentProfileId
      week
      demoLink
      repoLink
      brainliftLink
      socialPost
      passing
      deployedUrl
      grade
      notes
      report
      gradedAt
      cohortId
      gradedBy
      status
      title
      description
      technologies
      featuredImageUrl
      additionalLinks
      submittedAt
      lastStudentEdit
      showcaseIncluded
      showcasePriority
      editHistory
    }
  }
`;

// Create a new submission
export const createSubmission = /* GraphQL */ `
  mutation CreateSubmission(
    $studentProfileId: ID!
    $week: Int
    $title: String!
    $description: String
    $demoLink: String
    $repoLink: String
    $brainliftLink: String
    $socialPost: String
    $deployedUrl: String
    $notes: String
    $technologies: [String]
    $status: String!
  ) {
    createSubmission(
      input: {
        studentProfileId: $studentProfileId
        week: $week
        title: $title
        description: $description
        demoLink: $demoLink
        repoLink: $repoLink
        brainliftLink: $brainliftLink
        socialPost: $socialPost
        deployedUrl: $deployedUrl
        notes: $notes
        technologies: $technologies
        status: $status
        lastStudentEdit: "${new Date().toISOString()}"
      }
    ) {
      id
      title
      status
    }
  }
`;

// Update an existing submission
export const updateSubmission = /* GraphQL */ `
  mutation UpdateSubmission(
    $id: ID!
    $week: Int
    $title: String
    $description: String
    $demoLink: String
    $repoLink: String
    $brainliftLink: String
    $socialPost: String
    $deployedUrl: String
    $notes: String
    $technologies: [String]
    $status: String
    $featuredImageUrl: String
    $showcaseIncluded: Boolean
    $showcasePriority: Int
  ) {
    updateSubmission(
      input: {
        id: $id
        week: $week
        title: $title
        description: $description
        demoLink: $demoLink
        repoLink: $repoLink
        brainliftLink: $brainliftLink
        socialPost: $socialPost
        deployedUrl: $deployedUrl
        notes: $notes
        technologies: $technologies
        status: $status
        featuredImageUrl: $featuredImageUrl
        showcaseIncluded: $showcaseIncluded
        showcasePriority: $showcasePriority
        lastStudentEdit: "${new Date().toISOString()}"
      }
    ) {
      id
      title
      status
    }
  }
`;

// Submit a draft submission for grading
export const submitForGrading = /* GraphQL */ `
  mutation SubmitForGrading($id: ID!) {
    updateSubmission(
      input: {
        id: $id
        status: "submitted"
        submittedAt: "${new Date().toISOString()}"
      }
    ) {
      id
      status
      submittedAt
    }
  }
`;

// Delete a submission
export const deleteSubmission = /* GraphQL */ `
  mutation DeleteSubmission($id: ID!) {
    deleteSubmission(input: { id: $id }) {
      id
    }
  }
`;

// Get submissions by cohort ID (for instructors)
export const getSubmissionsByCohort = /* GraphQL */ `
  query GetSubmissionsByCohort($cohortId: String!, $status: String, $limit: Int, $nextToken: String) {
    listSubmissions(
      filter: { 
        cohortId: { eq: $cohortId },
        status: { eq: $status }
      }
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        studentProfileId
        week
        title
        description
        status
        submittedAt
        gradedAt
        grade
        passing
        technologies
        cohortId
      }
      nextToken
    }
  }
`;

// Get all submissions (for instructors/admins)
export const getAllSubmissions = /* GraphQL */ `
  query GetAllSubmissions($limit: Int, $nextToken: String) {
    listSubmissions(
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        studentProfileId
        week
        title
        description
        status
        submittedAt
        gradedAt
        grade
        passing
        technologies
        cohortId
      }
      nextToken
    }
  }
`; 