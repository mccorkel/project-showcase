import { generateClient } from 'aws-amplify/api';

// Get all cohorts
export const getAllCohorts = /* GraphQL */ `
  query GetAllCohorts($limit: Int, $nextToken: String) {
    listCohorts(
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        startDate
        endDate
        program
        description
        instructors
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

// Get cohort by ID
export const getCohort = /* GraphQL */ `
  query GetCohort($id: ID!) {
    getCohort(id: $id) {
      id
      name
      startDate
      endDate
      program
      description
      instructors
      status
      createdAt
      updatedAt
    }
  }
`;

// Get cohorts by instructor ID
export const getCohortsByInstructor = /* GraphQL */ `
  query GetCohortsByInstructor($instructorId: String!, $limit: Int, $nextToken: String) {
    listCohorts(
      filter: { instructors: { contains: $instructorId } }
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        startDate
        endDate
        program
        description
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

// Get active cohorts
export const getActiveCohorts = /* GraphQL */ `
  query GetActiveCohorts($limit: Int, $nextToken: String) {
    listCohorts(
      filter: { status: { eq: "active" } }
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        startDate
        endDate
        program
        description
        instructors
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`; 