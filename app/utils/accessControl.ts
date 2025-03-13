/**
 * Utility functions for field-level access control
 */

/**
 * Determines if a field in a submission is editable based on the submission status and user role
 * @param fieldName The name of the field to check
 * @param submissionStatus The status of the submission (draft, submitted, graded)
 * @param userRole The role of the user (student, instructor, admin)
 * @returns Whether the field is editable
 */
export const isSubmissionFieldEditable = (
  fieldName: string,
  submissionStatus: string,
  userRole: string
): boolean => {
  // Admin can edit all fields regardless of status
  if (userRole === 'admin') {
    return true;
  }

  // Instructor can edit grading-related fields and provide feedback
  if (userRole === 'instructor') {
    const instructorEditableFields = [
      'grade',
      'passing',
      'report',
      'gradedBy',
      'gradedAt',
      'status'
    ];
    
    return instructorEditableFields.includes(fieldName);
  }

  // Student access depends on submission status
  if (userRole === 'student') {
    // Fields that students can always edit
    const alwaysEditableFields = [
      'demoLink',
      'repoLink',
      'deployedUrl',
      'notes',
      'socialPost'
    ];
    
    // Fields that students can only edit in draft status
    const draftOnlyFields = [
      'title',
      'description',
      'week',
      'brainliftLink',
      'technologies',
      'featuredImageUrl'
    ];
    
    // Fields that students can never edit
    const neverEditableFields = [
      'id',
      'studentProfileId',
      'grade',
      'passing',
      'report',
      'gradedBy',
      'gradedAt',
      'createdAt',
      'updatedAt',
      'cohortId'
    ];
    
    if (alwaysEditableFields.includes(fieldName)) {
      return true;
    }
    
    if (draftOnlyFields.includes(fieldName)) {
      return submissionStatus === 'draft';
    }
    
    if (neverEditableFields.includes(fieldName)) {
      return false;
    }
    
    // For any other fields not explicitly listed
    return submissionStatus === 'draft';
  }
  
  // Default to not editable for unknown roles
  return false;
};

/**
 * Determines if a submission can be submitted for grading
 * @param submissionStatus The status of the submission
 * @param userRole The role of the user
 * @returns Whether the submission can be submitted for grading
 */
export const canSubmitForGrading = (
  submissionStatus: string,
  userRole: string
): boolean => {
  // Only draft submissions can be submitted for grading
  if (submissionStatus !== 'draft') {
    return false;
  }
  
  // Only students and admins can submit for grading
  return userRole === 'student' || userRole === 'admin';
};

/**
 * Determines if a submission can be graded
 * @param submissionStatus The status of the submission
 * @param userRole The role of the user
 * @returns Whether the submission can be graded
 */
export const canGradeSubmission = (
  submissionStatus: string,
  userRole: string
): boolean => {
  // Only submitted submissions can be graded
  if (submissionStatus !== 'submitted') {
    return false;
  }
  
  // Only instructors and admins can grade submissions
  return userRole === 'instructor' || userRole === 'admin';
};

/**
 * Filters submission data based on user role and submission status
 * @param submission The submission data
 * @param userRole The role of the user
 * @returns Filtered submission data with only the fields the user can access
 */
export const filterSubmissionDataByRole = (
  submission: any,
  userRole: string
): any => {
  // Admin and instructor can see all fields
  if (userRole === 'admin' || userRole === 'instructor') {
    return submission;
  }
  
  // For students, filter out certain fields based on submission status
  if (userRole === 'student') {
    const filteredSubmission = { ...submission };
    
    // If the submission is not graded yet, hide grading information
    if (submission.status !== 'graded') {
      delete filteredSubmission.grade;
      delete filteredSubmission.passing;
      delete filteredSubmission.report;
      delete filteredSubmission.gradedBy;
      delete filteredSubmission.gradedAt;
    }
    
    return filteredSubmission;
  }
  
  // For other roles, return a minimal set of fields
  return {
    id: submission.id,
    title: submission.title,
    status: submission.status,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt
  };
}; 