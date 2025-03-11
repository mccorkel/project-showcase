/**
 * Field-level access control utility
 * 
 * This utility provides functions to determine if a user has access to specific fields
 * based on their role and the resource state.
 */

// Define user roles
export enum UserRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  GUEST = 'guest'
}

// Define resource types
export enum ResourceType {
  STUDENT_PROFILE = 'studentProfile',
  INSTRUCTOR_PROFILE = 'instructorProfile',
  SUBMISSION = 'submission',
  SHOWCASE = 'showcase',
  TEMPLATE = 'template',
  COHORT = 'cohort',
  SYSTEM_SETTINGS = 'systemSettings'
}

// Define access types
export enum AccessType {
  READ = 'read',
  WRITE = 'write'
}

// Define submission status types
export enum SubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  ARCHIVED = 'archived'
}

// Define showcase status types
export enum ShowcaseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// Interface for field access rules
interface FieldAccessRule {
  roles: UserRole[];
  conditions?: (resource: any, user?: any, newValue?: any) => boolean;
}

// Interface for field access configuration
interface FieldAccessConfig {
  [field: string]: {
    read?: FieldAccessRule;
    write?: FieldAccessRule;
  };
}

// Access configurations for different resource types
const accessConfigurations: Record<ResourceType, FieldAccessConfig> = {
  [ResourceType.SUBMISSION]: {
    id: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      // ID is read-only
    },
    auth_id: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR] },
      // auth_id is read-only
    },
    week: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR],
        // Students can only edit week in draft status
        conditions: (submission) => submission.status === SubmissionStatus.DRAFT
      }
    },
    demo_link: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT],
        // Students can edit links in any status
        conditions: (submission) => true
      }
    },
    repo_link: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT],
        // Students can edit links in any status
        conditions: (submission) => true
      }
    },
    deployed_url: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT],
        // Students can edit links in any status
        conditions: (submission) => true
      }
    },
    passing: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR],
        // Only admins and instructors can mark as passing
      }
    },
    grade: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR],
        // Only admins and instructors can grade
      }
    },
    notes: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT],
        // Students can edit notes in any status
        conditions: (submission) => true
      }
    },
    report: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR],
        // Only admins and instructors can write reports
      }
    },
    status: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR],
        // Students can only change status from draft to submitted
        conditions: (submission, user, newValue) => 
          user.role === UserRole.STUDENT 
            ? (submission.status === SubmissionStatus.DRAFT && newValue === SubmissionStatus.SUBMITTED)
            : true
      }
    },
    created_at: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      // created_at is read-only
    },
    updated_at: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      // updated_at is read-only
    },
    graded_at: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      // graded_at is read-only
    },
    graded_by: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      // graded_by is read-only
    },
    cohort_id: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN],
        // Only admins can change cohort_id
      }
    }
  },
  [ResourceType.SHOWCASE]: {
    id: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      // ID is read-only
    },
    student_id: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      // student_id is read-only
    },
    template_id: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.STUDENT],
        // Students can change their template
        conditions: (showcase, user) => 
          user.role === UserRole.STUDENT 
            ? showcase.student_id === user.id
            : true
      }
    },
    profile: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.STUDENT],
        // Students can edit their own profile
        conditions: (showcase, user) => 
          user.role === UserRole.STUDENT 
            ? showcase.student_id === user.id
            : true
      }
    },
    projects: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.STUDENT],
        // Students can edit their own projects
        conditions: (showcase, user) => 
          user.role === UserRole.STUDENT 
            ? showcase.student_id === user.id
            : true
      }
    },
    customization: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.STUDENT],
        // Students can edit their own customization
        conditions: (showcase, user) => 
          user.role === UserRole.STUDENT 
            ? showcase.student_id === user.id
            : true
      }
    },
    visibility: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.STUDENT],
        // Students can edit their own visibility settings
        conditions: (showcase, user) => 
          user.role === UserRole.STUDENT 
            ? showcase.student_id === user.id
            : true
      }
    },
    analytics: {
      read: { 
        roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT],
        // Students can only see their own analytics
        conditions: (showcase, user) => 
          user.role === UserRole.STUDENT 
            ? showcase.student_id === user.id
            : true
      },
      // analytics is read-only
    },
    publication: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      write: { 
        roles: [UserRole.ADMIN, UserRole.STUDENT],
        // Students can publish their own showcase
        conditions: (showcase, user) => 
          user.role === UserRole.STUDENT 
            ? showcase.student_id === user.id
            : true
      }
    }
  },
  [ResourceType.STUDENT_PROFILE]: {
    // Add student profile field access rules
    id: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      // ID is read-only
    },
    // Add more fields as needed
  },
  [ResourceType.INSTRUCTOR_PROFILE]: {
    // Add instructor profile field access rules
    id: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR] },
      // ID is read-only
    },
    // Add more fields as needed
  },
  [ResourceType.TEMPLATE]: {
    // Add template field access rules
    id: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT] },
      // ID is read-only
    },
    // Add more fields as needed
  },
  [ResourceType.COHORT]: {
    // Add cohort field access rules
    id: {
      read: { roles: [UserRole.ADMIN, UserRole.INSTRUCTOR] },
      // ID is read-only
    },
    // Add more fields as needed
  },
  [ResourceType.SYSTEM_SETTINGS]: {
    // Add system settings field access rules
    id: {
      read: { roles: [UserRole.ADMIN] },
      // ID is read-only
    },
    // Add more fields as needed
  }
};

/**
 * Check if a user has access to a specific field
 * 
 * @param user The user object with role information
 * @param resourceType The type of resource being accessed
 * @param resource The resource object
 * @param field The field being accessed
 * @param accessType The type of access (read or write)
 * @param newValue Optional new value for write operations
 * @returns Boolean indicating if access is allowed
 */
export function hasFieldAccess(
  user: { id: string; role: UserRole },
  resourceType: ResourceType,
  resource: any,
  field: string,
  accessType: AccessType,
  newValue?: any
): boolean {
  // Admin role has access to everything
  if (user.role === UserRole.ADMIN) {
    return true;
  }

  const resourceConfig = accessConfigurations[resourceType];
  if (!resourceConfig) {
    return false;
  }

  const fieldConfig = resourceConfig[field];
  if (!fieldConfig) {
    return false;
  }

  const accessRule = fieldConfig[accessType];
  if (!accessRule) {
    return false;
  }

  // Check if user's role is allowed
  if (!accessRule.roles.includes(user.role)) {
    return false;
  }

  // Check additional conditions if they exist
  if (accessRule.conditions) {
    return accessRule.conditions(resource, user, newValue);
  }

  return true;
}

/**
 * Filter an object to only include fields the user has access to
 * 
 * @param user The user object with role information
 * @param resourceType The type of resource being accessed
 * @param resource The resource object
 * @param accessType The type of access (read or write)
 * @returns A new object with only the fields the user has access to
 */
export function filterAccessibleFields(
  user: { id: string; role: UserRole },
  resourceType: ResourceType,
  resource: any,
  accessType: AccessType
): any {
  // Admin role has access to everything
  if (user.role === UserRole.ADMIN) {
    return { ...resource };
  }

  const result: any = {};
  
  for (const field in resource) {
    if (hasFieldAccess(user, resourceType, resource, field, accessType)) {
      result[field] = resource[field];
    }
  }

  return result;
}

/**
 * Check if a user can update a resource with the given changes
 * 
 * @param user The user object with role information
 * @param resourceType The type of resource being accessed
 * @param resource The current resource object
 * @param changes The changes to be applied
 * @returns An object with a boolean indicating if the update is allowed and any validation errors
 */
export function validateUpdate(
  user: { id: string; role: UserRole },
  resourceType: ResourceType,
  resource: any,
  changes: any
): { isValid: boolean; errors: { field: string; message: string }[] } {
  // Admin role can update anything
  if (user.role === UserRole.ADMIN) {
    return { isValid: true, errors: [] };
  }

  const errors: { field: string; message: string }[] = [];

  for (const field in changes) {
    if (!hasFieldAccess(user, resourceType, resource, field, AccessType.WRITE, changes[field])) {
      errors.push({
        field,
        message: `You don't have permission to update the ${field} field.`
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
} 