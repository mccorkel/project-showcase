/**
 * Audit Logging Utility
 * 
 * This utility provides functions to log significant actions performed by users
 * for security and compliance purposes.
 */

// Define action types for audit logging
export enum AuditActionType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  PUBLISH = 'publish',
  GRADE = 'grade',
  DELEGATE = 'delegate',
  REVOKE = 'revoke',
  IMPORT = 'import',
  EXPORT = 'export',
  SYSTEM_CHANGE = 'system_change'
}

// Define resource types for audit logging
export enum AuditResourceType {
  USER = 'user',
  STUDENT_PROFILE = 'student_profile',
  INSTRUCTOR_PROFILE = 'instructor_profile',
  SUBMISSION = 'submission',
  SHOWCASE = 'showcase',
  TEMPLATE = 'template',
  COHORT = 'cohort',
  SYSTEM_SETTINGS = 'system_settings',
  SESSION = 'session',
  DELEGATION = 'delegation',
  LMS_INTEGRATION = 'lms_integration'
}

// Interface for audit log entry
export interface AuditLogEntry {
  id?: string;
  userId: string;
  userEmail: string;
  actionType: AuditActionType;
  resourceType: AuditResourceType;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  metadata?: Record<string, any>;
}

/**
 * Create an audit log entry
 * 
 * @param entry The audit log entry to create
 * @returns Promise that resolves when the entry is created
 */
export async function createAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    
    // In a real implementation, this would be an API call to store the audit log
    // For example:
    // await API.graphql(graphqlOperation(createAuditLogEntry, {
    //   input: {
    //     ...entry,
    //     timestamp
    //   }
    // }));
    
    // For now, we'll just log to console
    console.log('AUDIT LOG:', {
      ...entry,
      timestamp
    });
    
    // In a production environment, we might also want to:
    // 1. Queue logs for batch processing
    // 2. Ensure logs are stored even if the API call fails
    // 3. Implement retry logic for failed log submissions
  } catch (error) {
    console.error('Error creating audit log:', error);
    // In production, we would want to handle this error more gracefully
    // Perhaps by queuing the log for retry or alerting administrators
  }
}

/**
 * Log a user login action
 * 
 * @param userId The ID of the user who logged in
 * @param userEmail The email of the user who logged in
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param success Whether the login was successful
 * @param details Additional details about the login
 */
export async function logLogin(
  userId: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string,
  success: boolean,
  details?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.LOGIN,
    resourceType: AuditResourceType.SESSION,
    resourceId: 'session-' + new Date().getTime(),
    ipAddress,
    userAgent,
    details: details || (success ? 'Successful login' : 'Failed login attempt'),
    metadata: { success }
  });
}

/**
 * Log a user logout action
 * 
 * @param userId The ID of the user who logged out
 * @param userEmail The email of the user who logged out
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param sessionId The ID of the session that was ended
 */
export async function logLogout(
  userId: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string,
  sessionId: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.LOGOUT,
    resourceType: AuditResourceType.SESSION,
    resourceId: sessionId,
    ipAddress,
    userAgent,
    details: 'User logged out'
  });
}

/**
 * Log a resource creation action
 * 
 * @param userId The ID of the user who created the resource
 * @param userEmail The email of the user who created the resource
 * @param resourceType The type of resource that was created
 * @param resourceId The ID of the resource that was created
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param details Additional details about the creation
 */
export async function logCreate(
  userId: string,
  userEmail: string,
  resourceType: AuditResourceType,
  resourceId: string,
  ipAddress: string,
  userAgent: string,
  details?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.CREATE,
    resourceType,
    resourceId,
    ipAddress,
    userAgent,
    details: details || `Created ${resourceType} with ID ${resourceId}`
  });
}

/**
 * Log a resource update action
 * 
 * @param userId The ID of the user who updated the resource
 * @param userEmail The email of the user who updated the resource
 * @param resourceType The type of resource that was updated
 * @param resourceId The ID of the resource that was updated
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param changes The changes that were made to the resource
 * @param details Additional details about the update
 */
export async function logUpdate(
  userId: string,
  userEmail: string,
  resourceType: AuditResourceType,
  resourceId: string,
  ipAddress: string,
  userAgent: string,
  changes?: Record<string, any>,
  details?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.UPDATE,
    resourceType,
    resourceId,
    ipAddress,
    userAgent,
    details: details || `Updated ${resourceType} with ID ${resourceId}`,
    metadata: { changes }
  });
}

/**
 * Log a resource deletion action
 * 
 * @param userId The ID of the user who deleted the resource
 * @param userEmail The email of the user who deleted the resource
 * @param resourceType The type of resource that was deleted
 * @param resourceId The ID of the resource that was deleted
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param details Additional details about the deletion
 */
export async function logDelete(
  userId: string,
  userEmail: string,
  resourceType: AuditResourceType,
  resourceId: string,
  ipAddress: string,
  userAgent: string,
  details?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.DELETE,
    resourceType,
    resourceId,
    ipAddress,
    userAgent,
    details: details || `Deleted ${resourceType} with ID ${resourceId}`
  });
}

/**
 * Log a showcase publication action
 * 
 * @param userId The ID of the user who published the showcase
 * @param userEmail The email of the user who published the showcase
 * @param showcaseId The ID of the showcase that was published
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param version The version of the showcase that was published
 * @param details Additional details about the publication
 */
export async function logPublish(
  userId: string,
  userEmail: string,
  showcaseId: string,
  ipAddress: string,
  userAgent: string,
  version: number,
  details?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.PUBLISH,
    resourceType: AuditResourceType.SHOWCASE,
    resourceId: showcaseId,
    ipAddress,
    userAgent,
    details: details || `Published showcase with ID ${showcaseId} (version ${version})`,
    metadata: { version }
  });
}

/**
 * Log a submission grading action
 * 
 * @param userId The ID of the user who graded the submission
 * @param userEmail The email of the user who graded the submission
 * @param submissionId The ID of the submission that was graded
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param grade The grade that was assigned
 * @param passing Whether the submission was marked as passing
 * @param details Additional details about the grading
 */
export async function logGrade(
  userId: string,
  userEmail: string,
  submissionId: string,
  ipAddress: string,
  userAgent: string,
  grade: string | number,
  passing: boolean,
  details?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.GRADE,
    resourceType: AuditResourceType.SUBMISSION,
    resourceId: submissionId,
    ipAddress,
    userAgent,
    details: details || `Graded submission with ID ${submissionId}`,
    metadata: { grade, passing }
  });
}

/**
 * Log a permission delegation action
 * 
 * @param userId The ID of the user who delegated permissions
 * @param userEmail The email of the user who delegated permissions
 * @param delegationId The ID of the delegation that was created
 * @param delegateeId The ID of the user who received the delegation
 * @param delegateeEmail The email of the user who received the delegation
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param permissions The permissions that were delegated
 * @param expiresAt When the delegation expires
 * @param details Additional details about the delegation
 */
export async function logDelegate(
  userId: string,
  userEmail: string,
  delegationId: string,
  delegateeId: string,
  delegateeEmail: string,
  ipAddress: string,
  userAgent: string,
  permissions: string[],
  expiresAt: string,
  details?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.DELEGATE,
    resourceType: AuditResourceType.DELEGATION,
    resourceId: delegationId,
    ipAddress,
    userAgent,
    details: details || `Delegated permissions to ${delegateeEmail}`,
    metadata: { delegateeId, delegateeEmail, permissions, expiresAt }
  });
}

/**
 * Log a permission revocation action
 * 
 * @param userId The ID of the user who revoked permissions
 * @param userEmail The email of the user who revoked permissions
 * @param delegationId The ID of the delegation that was revoked
 * @param delegateeId The ID of the user whose delegation was revoked
 * @param delegateeEmail The email of the user whose delegation was revoked
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param details Additional details about the revocation
 */
export async function logRevoke(
  userId: string,
  userEmail: string,
  delegationId: string,
  delegateeId: string,
  delegateeEmail: string,
  ipAddress: string,
  userAgent: string,
  details?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.REVOKE,
    resourceType: AuditResourceType.DELEGATION,
    resourceId: delegationId,
    ipAddress,
    userAgent,
    details: details || `Revoked delegation from ${delegateeEmail}`,
    metadata: { delegateeId, delegateeEmail }
  });
}

/**
 * Log a system settings change
 * 
 * @param userId The ID of the user who changed system settings
 * @param userEmail The email of the user who changed system settings
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param changes The changes that were made to the system settings
 * @param details Additional details about the changes
 */
export async function logSystemChange(
  userId: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string,
  changes: Record<string, any>,
  details?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.SYSTEM_CHANGE,
    resourceType: AuditResourceType.SYSTEM_SETTINGS,
    resourceId: 'system-settings',
    ipAddress,
    userAgent,
    details: details || 'Updated system settings',
    metadata: { changes }
  });
}

/**
 * Log an LMS data import action
 * 
 * @param userId The ID of the user who imported data
 * @param userEmail The email of the user who imported data
 * @param ipAddress The IP address of the user
 * @param userAgent The user agent of the user's browser
 * @param lmsProvider The LMS provider that data was imported from
 * @param dataTypes The types of data that were imported
 * @param recordCounts The number of records imported by type
 * @param details Additional details about the import
 */
export async function logImport(
  userId: string,
  userEmail: string,
  ipAddress: string,
  userAgent: string,
  lmsProvider: string,
  dataTypes: string[],
  recordCounts: Record<string, number>,
  details?: string
): Promise<void> {
  await createAuditLog({
    userId,
    userEmail,
    actionType: AuditActionType.IMPORT,
    resourceType: AuditResourceType.LMS_INTEGRATION,
    resourceId: `import-${new Date().getTime()}`,
    ipAddress,
    userAgent,
    details: details || `Imported data from ${lmsProvider}`,
    metadata: { lmsProvider, dataTypes, recordCounts }
  });
} 