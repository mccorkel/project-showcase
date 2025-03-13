import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

/**
 * Define your data models
 * @see https://docs.amplify.aws/nextjs/build-a-backend/data/set-up-data/
 */
const schema = a.schema({
  // User model for storing user information and roles
  User: a.model({
    cognitoId: a.string().required(),
    email: a.string().required(),
    username: a.string(),
    roles: a.string().array(),
    status: a.string(),
    lastLogin: a.datetime(),
    settings: a.json(),
    // Enhanced fields
    linkedProfiles: a.json().array(), // Array of linked profile IDs and types
    permissions: a.json(), // Custom permissions and delegations
    security: a.json() // Security-related information (MFA, login attempts, etc.)
  })
  .authorization(allow => [
    allow.owner(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ])
  .secondaryIndexes(index => [
    index('cognitoId'),
    index('email')
  ]),

  // Session model for tracking user sessions
  Session: a.model({
    sessionId: a.string().required(),
    cognitoUserId: a.string().required(),
    createdAt: a.datetime().required(),
    expiresAt: a.datetime().required(),
    lastActivity: a.datetime(),
    ipAddress: a.string(),
    userAgent: a.string(),
    deviceInfo: a.json(),
    isActive: a.boolean().required(),
    originalRequestUrl: a.string()
  })
  .authorization(allow => [
    allow.owner(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ])
  .secondaryIndexes(index => [
    index('cognitoUserId')
  ]),

  // Delegation model for temporary permission delegation
  Delegation: a.model({
    delegatorId: a.string().required(),
    delegateeId: a.string().required(),
    permissions: a.string().array().required(),
    resourceType: a.string(),
    resourceIds: a.string().array(),
    reason: a.string(),
    createdAt: a.datetime().required(),
    expiresAt: a.datetime().required(),
    revokedAt: a.datetime(),
    revokedBy: a.string()
  })
  .authorization(allow => [
    allow.owner(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ])
  .secondaryIndexes(index => [
    index('delegatorId'),
    index('delegateeId')
  ]),

  // Audit log model for tracking significant actions
  AuditLog: a.model({
    cognitoUserId: a.string().required(),
    actionType: a.string().required(),
    resourceType: a.string().required(),
    resourceId: a.string(),
    timestamp: a.datetime().required(),
    ipAddress: a.string(),
    userAgent: a.string(),
    details: a.json()
  })
  .authorization(allow => [
    allow.authenticated(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ])
  .secondaryIndexes(index => [
    index('cognitoUserId'),
    index('actionType'),
    index('resourceType'),
    index('timestamp')
  ]),

  // Student profile information
  StudentProfile: a.model({
    userId: a.string().required(),
    firstName: a.string().required(),
    lastName: a.string().required(),
    title: a.string(),
    bio: a.string(),
    profileImageUrl: a.string(),
    location: a.string(),
    education: a.json().array(),
    experienceYears: a.integer(),
    socialLinks: a.json(),
    contactEmail: a.string(),
    skills: a.json().array(),
    // Enhanced fields
    contactInfo: a.json(), // Additional contact information
    preferences: a.json(), // Student preferences (job seeking, etc.)
    cohortId: a.string(), // Link to cohort
    isStaff: a.boolean(),
    orgName: a.string()
  })
  .authorization(allow => [
    allow.owner(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ])
  .secondaryIndexes(index => [
    index('userId'),
    index('cohortId')
  ]),

  // Instructor profile information
  InstructorProfile: a.model({
    userId: a.string().required(),
    firstName: a.string().required(),
    lastName: a.string().required(),
    title: a.string(),
    bio: a.string(),
    profileImageUrl: a.string(),
    assignedCohorts: a.string().array(),
    // Enhanced fields
    specialties: a.string().array(),
    contactInfo: a.json() // Contact information including office hours
  })
  .authorization(allow => [
    allow.owner(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ])
  .secondaryIndexes(index => [
    index('userId')
  ]),

  // Cohort model for organizing students
  Cohort: a.model({
    name: a.string().required(),
    startDate: a.datetime().required(),
    endDate: a.datetime(),
    program: a.string(),
    description: a.string(),
    instructors: a.string().array(),
    status: a.string().required(),
    createdAt: a.datetime().required(),
    updatedAt: a.datetime().required()
  })
  .authorization(allow => [
    allow.authenticated(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ])
  .secondaryIndexes(index => [
    index('status')
  ]),

  // Student project submission
  Submission: a.model({
    studentProfileId: a.string().required(),
    week: a.integer(),
    demoLink: a.string(),
    repoLink: a.string(),
    brainliftLink: a.string(),
    socialPost: a.string(),
    passing: a.boolean(),
    deployedUrl: a.string(),
    grade: a.string(),
    notes: a.string(),
    report: a.string(),
    gradedAt: a.datetime(),
    cohortId: a.string(),
    gradedBy: a.string(),
    status: a.string(),
    // Enhanced fields
    title: a.string(),
    description: a.string(),
    technologies: a.string().array(),
    featuredImageUrl: a.string(),
    additionalLinks: a.json().array(),
    showcaseIncluded: a.boolean(),
    showcasePriority: a.integer(),
    submittedAt: a.datetime(),
    lastStudentEdit: a.datetime(),
    editHistory: a.json().array()
  })
  .authorization(allow => [
    allow.owner(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ])
  .secondaryIndexes(index => [
    index('studentProfileId'),
    index('cohortId'),
    index('status')
  ]),

  // Showcase template
  Template: a.model({
    name: a.string().required(),
    description: a.string(),
    thumbnailUrl: a.string(),
    isActive: a.boolean(),
    defaultTheme: a.string(),
    features: a.string().array(),
    templateFiles: a.json(),
    customizationOptions: a.json()
  })
  .authorization(allow => [
    allow.authenticated(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ]),

  // Student showcase
  Showcase: a.model({
    studentProfileId: a.string().required(),
    cognitoUserId: a.string(),
    username: a.string(),
    templateId: a.string(),
    profile: a.json(),
    projects: a.json().array(),
    experience: a.json().array(),
    career: a.json(),
    blogs: a.json().array(),
    customization: a.json(),
    visibility: a.json(),
    analytics: a.json(),
    publication: a.json(),
    meta: a.json(),
    previewData: a.json()
  })
  .authorization(allow => [
    allow.owner(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ])
  .secondaryIndexes(index => [
    index('studentProfileId'),
    index('username'),
    index('templateId')
  ]),

  // Analytics for showcases
  Analytics: a.model({
    showcaseId: a.string().required(),
    date: a.date(),
    views: a.json(),
    projectViews: a.json().array(),
    referrers: a.json().array(),
    locations: a.json().array(),
    devices: a.json().array()
  })
  .authorization(allow => [
    allow.owner(),
    allow.publicApiKey().to(['read', 'create', 'update', 'delete'])
  ])
  .secondaryIndexes(index => [
    index('showcaseId'),
    index('date')
  ])
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // Add API key for public access to certain models
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>; 