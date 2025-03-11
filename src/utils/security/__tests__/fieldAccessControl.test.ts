import {
  UserRole,
  ResourceType,
  AccessType,
  SubmissionStatus,
  ShowcaseStatus,
  hasFieldAccess,
  filterAccessibleFields,
  validateUpdate
} from '../fieldAccessControl';

describe('Field Access Control', () => {
  // Test data
  const adminUser = { id: 'admin-1', role: UserRole.ADMIN };
  const instructorUser = { id: 'instructor-1', role: UserRole.INSTRUCTOR };
  const studentUser = { id: 'student-1', role: UserRole.STUDENT };
  const guestUser = { id: 'guest-1', role: UserRole.GUEST };
  
  const submission = {
    id: 'submission-1',
    userId: 'student-1',
    title: 'Test Submission',
    description: 'This is a test submission',
    status: SubmissionStatus.SUBMITTED,
    grade: 'A',
    feedback: 'Great work!',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z'
  };
  
  const showcase = {
    id: 'showcase-1',
    userId: 'student-1',
    title: 'Test Showcase',
    description: 'This is a test showcase',
    status: ShowcaseStatus.PUBLISHED,
    isPublic: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z'
  };
  
  describe('hasFieldAccess', () => {
    it('should grant admin access to all fields', () => {
      // Admin should have read access to all submission fields
      expect(hasFieldAccess(
        adminUser,
        ResourceType.SUBMISSION,
        submission,
        'title',
        AccessType.READ
      )).toBe(true);
      
      expect(hasFieldAccess(
        adminUser,
        ResourceType.SUBMISSION,
        submission,
        'grade',
        AccessType.READ
      )).toBe(true);
      
      // Admin should have write access to all submission fields
      expect(hasFieldAccess(
        adminUser,
        ResourceType.SUBMISSION,
        submission,
        'title',
        AccessType.WRITE
      )).toBe(true);
      
      expect(hasFieldAccess(
        adminUser,
        ResourceType.SUBMISSION,
        submission,
        'grade',
        AccessType.WRITE
      )).toBe(true);
    });
    
    it('should restrict student access based on field and resource state', () => {
      // Student should have read access to their own submission title
      expect(hasFieldAccess(
        studentUser,
        ResourceType.SUBMISSION,
        submission,
        'title',
        AccessType.READ
      )).toBe(true);
      
      // Student should have read access to their own grade
      expect(hasFieldAccess(
        studentUser,
        ResourceType.SUBMISSION,
        submission,
        'grade',
        AccessType.READ
      )).toBe(true);
      
      // Student should not have write access to grade
      expect(hasFieldAccess(
        studentUser,
        ResourceType.SUBMISSION,
        submission,
        'grade',
        AccessType.WRITE
      )).toBe(false);
      
      // Student should not have write access to title after submission
      expect(hasFieldAccess(
        studentUser,
        ResourceType.SUBMISSION,
        submission,
        'title',
        AccessType.WRITE
      )).toBe(false);
      
      // Student should have write access to title in draft state
      const draftSubmission = { ...submission, status: SubmissionStatus.DRAFT };
      expect(hasFieldAccess(
        studentUser,
        ResourceType.SUBMISSION,
        draftSubmission,
        'title',
        AccessType.WRITE
      )).toBe(true);
    });
    
    it('should restrict instructor access based on resource ownership', () => {
      // Instructor should have read access to any submission
      expect(hasFieldAccess(
        instructorUser,
        ResourceType.SUBMISSION,
        submission,
        'title',
        AccessType.READ
      )).toBe(true);
      
      // Instructor should have write access to grade
      expect(hasFieldAccess(
        instructorUser,
        ResourceType.SUBMISSION,
        submission,
        'grade',
        AccessType.WRITE
      )).toBe(true);
      
      // Instructor should not have write access to title
      expect(hasFieldAccess(
        instructorUser,
        ResourceType.SUBMISSION,
        submission,
        'title',
        AccessType.WRITE
      )).toBe(false);
    });
    
    it('should restrict guest access appropriately', () => {
      // Guest should not have access to submissions
      expect(hasFieldAccess(
        guestUser,
        ResourceType.SUBMISSION,
        submission,
        'title',
        AccessType.READ
      )).toBe(false);
      
      // Guest should have read access to public showcase
      expect(hasFieldAccess(
        guestUser,
        ResourceType.SHOWCASE,
        showcase,
        'title',
        AccessType.READ
      )).toBe(true);
      
      // Guest should not have write access to public showcase
      expect(hasFieldAccess(
        guestUser,
        ResourceType.SHOWCASE,
        showcase,
        'title',
        AccessType.WRITE
      )).toBe(false);
      
      // Guest should not have read access to private showcase
      const privateShowcase = { ...showcase, isPublic: false };
      expect(hasFieldAccess(
        guestUser,
        ResourceType.SHOWCASE,
        privateShowcase,
        'title',
        AccessType.READ
      )).toBe(false);
    });
  });
  
  describe('filterAccessibleFields', () => {
    it('should return all fields for admin', () => {
      const filteredSubmission = filterAccessibleFields(
        adminUser,
        ResourceType.SUBMISSION,
        submission,
        AccessType.READ
      );
      
      // Admin should have access to all fields
      expect(Object.keys(filteredSubmission).length).toBe(Object.keys(submission).length);
      expect(filteredSubmission).toEqual(submission);
    });
    
    it('should filter fields for student based on access rules', () => {
      const filteredSubmission = filterAccessibleFields(
        studentUser,
        ResourceType.SUBMISSION,
        submission,
        AccessType.WRITE
      );
      
      // Student should not have write access to grade or feedback
      expect(filteredSubmission).not.toHaveProperty('grade');
      expect(filteredSubmission).not.toHaveProperty('feedback');
      
      // Student should not have write access to title after submission
      expect(filteredSubmission).not.toHaveProperty('title');
      
      // Student should have write access to title in draft state
      const draftSubmission = { ...submission, status: SubmissionStatus.DRAFT };
      const filteredDraftSubmission = filterAccessibleFields(
        studentUser,
        ResourceType.SUBMISSION,
        draftSubmission,
        AccessType.WRITE
      );
      
      expect(filteredDraftSubmission).toHaveProperty('title');
    });
  });
  
  describe('validateUpdate', () => {
    it('should allow valid updates for admin', () => {
      const changes = {
        title: 'Updated Title',
        grade: 'B',
        feedback: 'Needs improvement'
      };
      
      const result = validateUpdate(
        adminUser,
        ResourceType.SUBMISSION,
        submission,
        changes
      );
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
    
    it('should reject invalid updates for student', () => {
      const changes = {
        title: 'Updated Title',
        grade: 'B' // Student should not be able to update grade
      };
      
      const result = validateUpdate(
        studentUser,
        ResourceType.SUBMISSION,
        submission,
        changes
      );
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(2); // Both title and grade should be rejected
      
      // Check specific error messages
      expect(result.errors.some(error => error.field === 'title')).toBe(true);
      expect(result.errors.some(error => error.field === 'grade')).toBe(true);
    });
    
    it('should allow valid updates for student in draft state', () => {
      const draftSubmission = { ...submission, status: SubmissionStatus.DRAFT };
      const changes = {
        title: 'Updated Title',
        description: 'Updated Description'
      };
      
      const result = validateUpdate(
        studentUser,
        ResourceType.SUBMISSION,
        draftSubmission,
        changes
      );
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });
}); 