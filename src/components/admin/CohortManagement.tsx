import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Card,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  View,
  Badge,
  Alert,
  Divider,
  Loader,
  TextField,
  SelectField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@aws-amplify/ui-react';

// Mock data generator for cohorts
const generateMockCohorts = () => {
  const cohorts = [];
  const programs = ['Web Development', 'Data Science', 'UX Design', 'Mobile Development'];
  const statuses = ['active', 'upcoming', 'completed'];
  
  for (let i = 1; i <= 15; i++) {
    const programIndex = Math.floor(Math.random() * programs.length);
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6));
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 3); // 3-month program
    
    cohorts.push({
      id: `cohort-${i}`,
      name: `${programs[programIndex]} - ${getTermName(startDate)}`,
      program: programs[programIndex],
      status: statuses[statusIndex],
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      instructor_id: `instructor-${Math.floor(Math.random() * 5) + 1}`,
      instructor_name: `Instructor ${Math.floor(Math.random() * 5) + 1}`,
      student_count: Math.floor(Math.random() * 25) + 5,
      description: `This cohort focuses on ${programs[programIndex]} fundamentals and advanced concepts.`
    });
  }
  
  return cohorts;
};

// Helper function to get term name based on date
const getTermName = (date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  
  if (month >= 0 && month <= 3) return `Spring ${year}`;
  if (month >= 4 && month <= 7) return `Summer ${year}`;
  return `Fall ${year}`;
};

// Mock data generator for instructors
const generateMockInstructors = () => {
  const instructors = [];
  
  for (let i = 1; i <= 5; i++) {
    instructors.push({
      id: `instructor-${i}`,
      name: `Instructor ${i}`,
      email: `instructor${i}@example.com`,
      specialization: i % 2 === 0 ? 'Frontend Development' : 'Backend Development',
      active: Math.random() > 0.2
    });
  }
  
  return instructors;
};

interface CohortManagementProps {
  // In a real implementation, we might pass in props like onCohortSelect
}

// Define interfaces for our data types
interface Instructor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  active: boolean;
}

interface Cohort {
  id: string;
  name: string;
  program: string;
  status: string;
  start_date: string;
  end_date: string;
  instructor_id: string;
  instructor_name: string;
  student_count: number;
  description: string;
}

interface FormData {
  name: string;
  program: string;
  status: string;
  start_date: string;
  end_date: string;
  instructor_id: string;
  description: string;
}

const CohortManagement: React.FC<CohortManagementProps> = () => {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [filteredCohorts, setFilteredCohorts] = useState<Cohort[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [currentCohort, setCurrentCohort] = useState<Cohort | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for creating/editing cohorts
  const [formData, setFormData] = useState<FormData>({
    name: '',
    program: '',
    status: 'upcoming',
    start_date: '',
    end_date: '',
    instructor_id: '',
    description: ''
  });
  
  // Fetch cohorts and instructors on component mount
  useEffect(() => {
    fetchCohorts();
  }, []);
  
  // Apply filters when cohorts, searchTerm, or statusFilter changes
  useEffect(() => {
    applyFilters();
  }, [cohorts, searchTerm, statusFilter]);
  
  const fetchCohorts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, these would be API calls
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const mockCohorts = generateMockCohorts();
      const mockInstructors = generateMockInstructors();
      
      setCohorts(mockCohorts);
      setFilteredCohorts(mockCohorts);
      setInstructors(mockInstructors);
    } catch (err) {
      console.error('Error fetching cohorts:', err);
      setError('Failed to load cohorts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...cohorts];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cohort => 
        cohort.name.toLowerCase().includes(term) ||
        cohort.program.toLowerCase().includes(term) ||
        cohort.instructor_name.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cohort => 
        cohort.status === statusFilter
      );
    }
    
    setFilteredCohorts(filtered);
  };
  
  const handleCreateCohort = () => {
    setCurrentCohort(null);
    const today = new Date().toISOString().split('T')[0];
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    
    setFormData({
      name: '',
      program: '',
      status: 'upcoming',
      start_date: today,
      end_date: threeMonthsLater.toISOString().split('T')[0],
      instructor_id: '',
      description: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };
  
  const handleEditCohort = (cohort: Cohort) => {
    setCurrentCohort(cohort);
    setFormData({
      name: cohort.name,
      program: cohort.program,
      status: cohort.status,
      start_date: cohort.start_date,
      end_date: cohort.end_date,
      instructor_id: cohort.instructor_id,
      description: cohort.description
    });
    setIsEditing(true);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCohort(null);
    setError(null);
    setSuccess(null);
  };
  
  const handleSaveCohort = async () => {
    try {
      // Validate form data
      if (!formData.name || !formData.program || !formData.start_date || !formData.end_date || !formData.instructor_id) {
        setError('Please fill in all required fields.');
        return;
      }
      
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const selectedInstructor = instructors.find(instructor => instructor.id === formData.instructor_id);
      
      if (isEditing && currentCohort) {
        // Update existing cohort
        setCohorts(prevCohorts => 
          prevCohorts.map(cohort => 
            cohort.id === currentCohort.id 
              ? { 
                  ...cohort, 
                  name: formData.name,
                  program: formData.program,
                  status: formData.status,
                  start_date: formData.start_date,
                  end_date: formData.end_date,
                  instructor_id: formData.instructor_id,
                  instructor_name: selectedInstructor?.name || 'Unknown Instructor',
                  description: formData.description
                } 
              : cohort
          )
        );
        
        setSuccess('Cohort updated successfully');
      } else {
        // Create new cohort
        const newCohort: Cohort = {
          id: `cohort-${Date.now()}`,
          name: formData.name,
          program: formData.program,
          status: formData.status,
          start_date: formData.start_date,
          end_date: formData.end_date,
          instructor_id: formData.instructor_id,
          instructor_name: selectedInstructor?.name || 'Unknown Instructor',
          student_count: 0,
          description: formData.description
        };
        
        setCohorts(prevCohorts => [...prevCohorts, newCohort]);
        setSuccess('Cohort created successfully');
      }
      
      // Close modal after a delay to show success message
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err) {
      console.error('Error saving cohort:', err);
      setError('Failed to save cohort. Please try again.');
    }
  };
  
  const handleDeleteCohort = async (cohortId: string) => {
    if (window.confirm('Are you sure you want to delete this cohort? This action cannot be undone.')) {
      try {
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        // Remove cohort from state
        setCohorts(prevCohorts => prevCohorts.filter(cohort => cohort.id !== cohortId));
        
        // Show success message
        alert('Cohort deleted successfully');
      } catch (err) {
        console.error('Error deleting cohort:', err);
        setError('Failed to delete cohort. Please try again.');
      }
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variation="success">Active</Badge>;
      case 'upcoming':
        return <Badge variation="info">Upcoming</Badge>;
      case 'completed':
        return <Badge variation="warning">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card variation="elevated">
        <Flex justifyContent="center" padding="2rem">
          <Loader size="large" />
        </Flex>
      </Card>
    );
  }
  
  // Custom modal implementation since @aws-amplify/ui-react doesn't export Modal
  const renderModal = () => {
    if (!showModal) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <Card variation="elevated" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
          <Flex direction="column" gap="1rem">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading level={4}>{isEditing ? 'Edit Cohort' : 'Create Cohort'}</Heading>
              <Button variation="link" onClick={handleCloseModal}>×</Button>
            </Flex>
            
            <Divider />
            
            <Flex direction="column" gap="1rem" padding="1rem">
              <Grid
                templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
                gap="1rem"
              >
                <TextField
                  label="Cohort Name"
                  placeholder="e.g., Web Development - Fall 2023"
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                  required
                />
                
                <TextField
                  label="Program"
                  placeholder="e.g., Web Development"
                  value={formData.program}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('program', e.target.value)}
                  required
                />
                
                <TextField
                  label="Start Date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('start_date', e.target.value)}
                  required
                />
                
                <TextField
                  label="End Date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('end_date', e.target.value)}
                  required
                />
                
                <SelectField
                  label="Status"
                  value={formData.status}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('status', e.target.value)}
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </SelectField>
                
                <SelectField
                  label="Instructor"
                  value={formData.instructor_id}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('instructor_id', e.target.value)}
                  required
                >
                  <option value="">Select an Instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name} ({instructor.specialization})
                    </option>
                  ))}
                </SelectField>
              </Grid>
              
              <TextField
                label="Description"
                placeholder="Enter a description for this cohort"
                value={formData.description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value)}
              />
              
              {error && <Alert variation="error">{error}</Alert>}
              {success && <Alert variation="success">{success}</Alert>}
              
              <Flex justifyContent="flex-end" gap="1rem">
                <Button
                  variation="link"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                
                <Button
                  variation="primary"
                  onClick={handleSaveCohort}
                >
                  {isEditing ? 'Update Cohort' : 'Create Cohort'}
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </div>
    );
  };
  
  return (
    <Card variation="elevated">
      <Flex direction="column" gap="1.5rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={3}>Cohort Management</Heading>
          
          <Button
            variation="primary"
            onClick={handleCreateCohort}
          >
            Create Cohort
          </Button>
        </Flex>
        
        {error && <Alert variation="error">{error}</Alert>}
        {success && <Alert variation="success">{success}</Alert>}
        
        <Card>
          <Flex 
            direction={{ base: 'column', medium: 'row' }} 
            gap="1rem" 
            justifyContent="space-between"
            alignItems={{ base: 'stretch', medium: 'flex-end' }}
          >
            <TextField
              label="Search Cohorts"
              placeholder="Search by name, program, or instructor"
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              flex="1"
            />
            
            <SelectField
              label="Filter by Status"
              value={statusFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              width="200px"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </SelectField>
            
            <Button
              variation="link"
              onClick={fetchCohorts}
            >
              Refresh
            </Button>
          </Flex>
        </Card>
        
        <Table highlightOnHover={true}>
          <TableHead>
            <TableRow>
              <TableCell as="th">Cohort Name</TableCell>
              <TableCell as="th">Program</TableCell>
              <TableCell as="th">Status</TableCell>
              <TableCell as="th">Start Date</TableCell>
              <TableCell as="th">End Date</TableCell>
              <TableCell as="th">Instructor</TableCell>
              <TableCell as="th">Students</TableCell>
              <TableCell as="th">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCohorts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Text textAlign="center">No cohorts found matching the current filters.</Text>
                </TableCell>
              </TableRow>
            ) : (
              filteredCohorts.map(cohort => (
                <TableRow key={cohort.id}>
                  <TableCell>{cohort.name}</TableCell>
                  <TableCell>{cohort.program}</TableCell>
                  <TableCell>{getStatusBadge(cohort.status)}</TableCell>
                  <TableCell>{formatDate(cohort.start_date)}</TableCell>
                  <TableCell>{formatDate(cohort.end_date)}</TableCell>
                  <TableCell>{cohort.instructor_name}</TableCell>
                  <TableCell>{cohort.student_count}</TableCell>
                  <TableCell>
                    <Flex gap="0.5rem">
                      <Button
                        size="small"
                        variation="link"
                        onClick={() => handleEditCohort(cohort)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variation="link"
                        onClick={() => handleDeleteCohort(cohort.id)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {renderModal()}
      </Flex>
    </Card>
  );
};

export default CohortManagement; 