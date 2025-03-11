import { generateClient } from 'aws-amplify/api';

// Get the current user's showcase
export const getShowcase = /* GraphQL */ `
  query GetShowcase($studentProfileId: ID!) {
    getShowcase(studentProfileId: $studentProfileId) {
      id
      studentProfileId
      cognitoUserId
      username
      templateId
      profile
      projects
      experience
      career
      blogs
      customization
      visibility
      analytics
      publication
      meta
      previewData
    }
  }
`;

// Get a showcase by username (for public viewing)
export const getShowcaseByUsername = /* GraphQL */ `
  query GetShowcaseByUsername($username: String!) {
    listShowcases(filter: { username: { eq: $username } }) {
      items {
        id
        studentProfileId
        cognitoUserId
        username
        templateId
        profile
        projects
        experience
        career
        blogs
        customization
        visibility
        publication
      }
    }
  }
`;

// Create a new showcase
export const createShowcase = /* GraphQL */ `
  mutation CreateShowcase(
    $studentProfileId: ID!
    $cognitoUserId: String!
    $username: String!
    $templateId: String
    $profile: AWSJSON
    $projects: [AWSJSON]
    $customization: AWSJSON
    $visibility: AWSJSON
  ) {
    createShowcase(
      input: {
        studentProfileId: $studentProfileId
        cognitoUserId: $cognitoUserId
        username: $username
        templateId: $templateId
        profile: $profile
        projects: $projects
        customization: $customization
        visibility: $visibility
      }
    ) {
      id
      studentProfileId
      username
    }
  }
`;

// Update an existing showcase
export const updateShowcase = /* GraphQL */ `
  mutation UpdateShowcase(
    $id: ID!
    $templateId: String
    $profile: AWSJSON
    $projects: [AWSJSON]
    $experience: [AWSJSON]
    $career: AWSJSON
    $blogs: [AWSJSON]
    $customization: AWSJSON
    $visibility: AWSJSON
  ) {
    updateShowcase(
      input: {
        id: $id
        templateId: $templateId
        profile: $profile
        projects: $projects
        experience: $experience
        career: $career
        blogs: $blogs
        customization: $customization
        visibility: $visibility
      }
    ) {
      id
      studentProfileId
      username
    }
  }
`;

// Update showcase visibility
export const updateShowcaseVisibility = /* GraphQL */ `
  mutation UpdateShowcaseVisibility(
    $id: ID!
    $visibility: AWSJSON!
  ) {
    updateShowcase(
      input: {
        id: $id
        visibility: $visibility
      }
    ) {
      id
      visibility
    }
  }
`;

// Generate a preview of the showcase
export const generateShowcasePreview = /* GraphQL */ `
  mutation GenerateShowcasePreview(
    $id: ID!
  ) {
    generateShowcasePreview(
      id: $id
    ) {
      previewUrl
      expiresAt
    }
  }
`;

// Publish the showcase
export const publishShowcase = /* GraphQL */ `
  mutation PublishShowcase(
    $id: ID!
  ) {
    publishShowcase(
      id: $id
    ) {
      publicUrl
      publishedAt
    }
  }
`;

// Get all available templates
export const getTemplates = /* GraphQL */ `
  query GetTemplates {
    listTemplates(filter: { isActive: { eq: true } }) {
      items {
        id
        name
        description
        thumbnailUrl
        defaultTheme
        features
        customizationOptions
      }
    }
  }
`;

// Get a specific template
export const getTemplate = /* GraphQL */ `
  query GetTemplate($id: ID!) {
    getTemplate(id: $id) {
      id
      name
      description
      thumbnailUrl
      defaultTheme
      features
      templateFiles
      customizationOptions
    }
  }
`; 