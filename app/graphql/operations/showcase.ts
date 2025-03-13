import { generateClient } from 'aws-amplify/api';

// Get the current user's showcase
export const getShowcase = /* GraphQL */ `
  query GetShowcase($studentProfileId: ID!) {
    getShowcaseByStudentProfileId(studentProfileId: $studentProfileId) {
      id
      studentProfileId
      templateId
      projects {
        id
        title
        description
        technologies
        featuredImageUrl
        repoLink
        demoLink
        deployedUrl
        isIncluded
        displayOrder
      }
      customization {
        themeColor
        accentColor
        fontPreference
        layoutPreference
        sectionsOrder
        sectionsVisibility {
          about
          projects
          skills
          experience
          education
          blogs
          contact
        }
      }
      visibility {
        isPublic
        accessType
        password
        scheduledDate
        customDomain
      }
      publishedUrl
      lastPublished
      lastUpdated
      createdAt
      updatedAt
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
  mutation CreateShowcase($input: CreateShowcaseInput!) {
    createShowcase(input: $input) {
      id
      studentProfileId
      templateId
      lastUpdated
      createdAt
      updatedAt
    }
  }
`;

// Update an existing showcase
export const updateShowcase = /* GraphQL */ `
  mutation UpdateShowcase($input: UpdateShowcaseInput!) {
    updateShowcase(input: $input) {
      id
      studentProfileId
      templateId
      lastUpdated
      updatedAt
    }
  }
`;

// Update showcase visibility
export const updateShowcaseVisibility = /* GraphQL */ `
  mutation UpdateShowcaseVisibility($id: ID!, $visibility: ShowcaseVisibilityInput!) {
    updateShowcaseVisibility(id: $id, visibility: $visibility) {
      id
      visibility {
        isPublic
        accessType
        password
        scheduledDate
        customDomain
      }
      updatedAt
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

// Get publication history query
export const getPublicationHistory = /* GraphQL */ `
  query GetPublicationHistory($showcaseId: ID!) {
    getPublicationHistory(showcaseId: $showcaseId) {
      items {
        version
        publishedAt
        publishedBy
        status
        notes
        url
      }
      nextToken
    }
  }
`;

// Update publishShowcase mutation to include additional parameters
export const publishShowcase = /* GraphQL */ `
  mutation PublishShowcase($id: ID!, $isPublic: Boolean, $customDomain: String, $notes: String) {
    publishShowcase(id: $id, isPublic: $isPublic, customDomain: $customDomain, notes: $notes) {
      id
      studentProfileId
      publishedUrl
      lastPublished
      updatedAt
      publication {
        status
        version
        publishedFiles {
          htmlPath
          cssPath
          jsPath
          assetsPath
        }
      }
    }
  }
`;

// Get templates query
export const getTemplates = /* GraphQL */ `
  query GetTemplates($limit: Int, $nextToken: String) {
    listTemplates(limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        thumbnailUrl
        previewUrl
        category
        tags
        features
        createdAt
        updatedAt
      }
      nextToken
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

// Get template by ID query
export const getTemplateById = /* GraphQL */ `
  query GetTemplateById($id: ID!) {
    getTemplate(id: $id) {
      id
      name
      description
      thumbnailUrl
      previewUrl
      category
      tags
      features
      templateData
      createdAt
      updatedAt
    }
  }
`;

// Get published showcase by URL query
export const getPublishedShowcase = /* GraphQL */ `
  query GetPublishedShowcase($url: String!) {
    getPublishedShowcaseByUrl(url: $url) {
      id
      studentProfileId
      templateId
      projects {
        id
        title
        description
        technologies
        featuredImageUrl
        repoLink
        demoLink
        deployedUrl
        isIncluded
        displayOrder
      }
      customization {
        themeColor
        accentColor
        fontPreference
        layoutPreference
        sectionsOrder
        sectionsVisibility {
          about
          projects
          skills
          experience
          education
          blogs
          contact
        }
      }
      publishedUrl
      lastPublished
      studentProfile {
        id
        firstName
        lastName
        email
        bio
        avatarUrl
        socialLinks {
          platform
          url
        }
        skills
        education {
          institution
          degree
          fieldOfStudy
          startDate
          endDate
          description
        }
        experience {
          company
          position
          startDate
          endDate
          description
        }
      }
    }
  }
`;

// Create template mutation
export const createTemplate = /* GraphQL */ `
  mutation CreateTemplate($input: CreateTemplateInput!) {
    createTemplate(input: $input) {
      id
      name
      description
      thumbnailUrl
      category
      tags
      features
      isPublic
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Update template mutation
export const updateTemplate = /* GraphQL */ `
  mutation UpdateTemplate($input: UpdateTemplateInput!) {
    updateTemplate(input: $input) {
      id
      name
      description
      thumbnailUrl
      category
      tags
      features
      isPublic
      updatedAt
    }
  }
`;

// Generate template preview mutation
export const generateTemplatePreview = /* GraphQL */ `
  mutation GenerateTemplatePreview($templateId: ID!, $showcaseData: AWSJSON!) {
    generateTemplatePreview(templateId: $templateId, showcaseData: $showcaseData) {
      previewUrl
      expiresAt
    }
  }
`;

// Rollback to a previous version of a published showcase
export const rollbackToVersion = /* GraphQL */ `
  mutation RollbackToVersion($showcaseId: ID!, $version: Int!) {
    rollbackToVersion(showcaseId: $showcaseId, version: $version) {
      id
      publishedUrl
      lastPublished
      publication {
        status
        version
      }
    }
  }
`; 