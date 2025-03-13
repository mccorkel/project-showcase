import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Loader, 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Badge,
  SearchField,
  Pagination,
  TextField,
  TextAreaField,
  SelectField,
  Divider
} from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Add custom Modal component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Mock data for demonstration purposes
const generateMockCohorts = () => {
  return [
    {
      id: 'cohort-1',
      name: 'Web Development - Spring 2025',
      startDate: '2025-01-15',
      endDate: '2025-06-15',
      studentCount: 24,
      status: 'active',
      description: 'Full-stack web development cohort focusing on React, Node.js, and AWS.',
      currentModule: 'Advanced React Patterns'
    },
    {
      id: 'cohort-2',
      name: 'Data Science - Fall 2024',
      startDate: '2024-09-01',
      endDate: '2025-02-01',
      studentCount: 18,
      status: 'active',
      description: 'Data science program covering Python, machine learning, and data visualization.',
      currentModule: 'Neural Networks'
    },
    {
      id: 'cohort-3',
      name: 'Mobile Development - Summer 2024',
      startDate: '2024-06-01',
      endDate: '2024-12-01',
      studentCount: 15,
      status: 'completed',
      description: 'Mobile app development with React Native and Flutter.',
      currentModule: 'Completed'
    },
    {
      id: 'cohort-4',
      name: 'DevOps Engineering - Winter 2024',
      startDate: '2024-01-10',
      endDate: '2024-07-10',
      studentCount: 20,
      status: 'completed',
      description: 'DevOps practices, CI/CD, containerization, and cloud infrastructure.',
      currentModule: 'Completed'
    },
    {
      id: 'cohort-5',
      name: 'Cybersecurity - Spring 2025',
      startDate: '2025-01-15',
      endDate: '2025-06-15',
      studentCount: 22,
      status: 'upcoming',
      description: 'Comprehensive cybersecurity program covering offensive and defensive security.',
      currentModule: 'Not started'
    }
  ];
};

interface CohortManagementProps {
  // In a real implementation, we might pass in props like onCohortSelect
}

const CohortManagement: React.FC<CohortManagementProps> = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [filteredCohorts, setFilteredCohorts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<any>(null);
  const [formMode, setFormMode] = useState<'view' | 'edit' | 'create'>('view');
  
  const itemsPerPage = 5;
  
  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, we would fetch data from an API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockCohorts = generateMockCohorts();
        setCohorts(mockCohorts);
        setFilteredCohorts(mockCohorts);
      } catch (error) {
        console.error('Error fetching cohorts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCohorts();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever search query or status filter changes
    let filtered = cohorts;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cohort => 
        cohort.name.toLowerCase().includes(query) || 
        cohort.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cohort => cohort.status === statusFilter);
    }
    
    setFilteredCohorts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, cohorts]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const handleViewCohort = (cohort: any) => {
    router.push(`/secure/instructor/cohorts/${cohort.id}`);
  };
  
  const handleEditCohort = (cohort: any) => {
    setSelectedCohort(cohort);
    setFormMode('edit');
    setIsModalOpen(true);
  };
  
  const handleCreateCohort = () => {
    setSelectedCohort({
      id: '',
      name: '',
      startDate: '',
      endDate: '',
      studentCount: 0,
      status: 'upcoming',
      description: '',
      currentModule: ''
    });
    setFormMode('create');
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCohort(null);
  };
  
  const handleSaveCohort = () => {
    // In a real implementation, we would save the cohort to the API
    if (formMode === 'create') {
      // Add new cohort to the list
      setCohorts([...cohorts, { ...selectedCohort, id: `cohort-${cohorts.length + 1}` }]);
    } else if (formMode === 'edit') {
      // Update existing cohort
      setCohorts(cohorts.map(c => c.id === selectedCohort.id ? selectedCohort : c));
    }
    
    handleCloseModal();
  };
  
  const handleInputChange = (field: string, value: string | number) => {
    setSelectedCohort({ ...selectedCohort, [field]: value });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variation="success">Active</Badge>;
      case 'completed':
        return <Badge variation="info">Completed</Badge>;
      case 'upcoming':
        return <Badge variation="warning">Upcoming</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCohorts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCohorts = filteredCohorts.slice(startIndex, startIndex + itemsPerPage);
  
  if (isLoading) {
    return (
      <Flex justifyContent="center" padding="2rem">
        <Loader size="large" />
      </Flex>
    );
  }
  
  return (
    <Card>
      <Flex direction="column" gap="1.5rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={3}>Cohort Management</Heading>
          <Button onClick={handleCreateCohort}>Create New Cohort</Button>
        </Flex>
        
        <Text>
          Manage your assigned cohorts, view student progress, and track cohort performance.
        </Text>
        
        <Flex direction={{ base: 'column', medium: 'row' }} gap="1rem" alignItems="flex-end">
          <SearchField
            label="Search Cohorts"
            placeholder="Search by name or description"
            value={searchQuery}
            onChange={handleSearchChange}
            flex="1"
          />
          
          <SelectField
            label="Status Filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            width={{ base: '100%', medium: '200px' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </SelectField>
        </Flex>
        
        {filteredCohorts.length === 0 ? (
          <Card variation="outlined" padding="1rem">
            <Text textAlign="center">No cohorts found matching your criteria.</Text>
          </Card>
        ) : (
          <>
            <Table highlightOnHover={true}>
              <TableHead>
                <TableRow>
                  <TableCell as="th">Cohort Name</TableCell>
                  <TableCell as="th">Date Range</TableCell>
                  <TableCell as="th">Students</TableCell>
                  <TableCell as="th">Status</TableCell>
                  <TableCell as="th">Current Module</TableCell>
                  <TableCell as="th">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCohorts.map((cohort) => (
                  <TableRow key={cohort.id}>
                    <TableCell>{cohort.name}</TableCell>
                    <TableCell>{cohort.startDate} to {cohort.endDate}</TableCell>
                    <TableCell>{cohort.studentCount}</TableCell>
                    <TableCell>{getStatusBadge(cohort.status)}</TableCell>
                    <TableCell>{cohort.currentModule}</TableCell>
                    <TableCell>
                      <Flex gap="0.5rem">
                        <Button size="small" onClick={() => handleViewCohort(cohort)}>View</Button>
                        <Button size="small" onClick={() => handleEditCohort(cohort)}>Edit</Button>
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {totalPages > 1 && (
              <Flex justifyContent="center" marginTop="1rem">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  siblingCount={1}
                  onChange={setCurrentPage}
                />
              </Flex>
            )}
          </>
        )}
      </Flex>
      
      {/* Cohort Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={formMode === 'create' ? 'Create New Cohort' : 'Edit Cohort'}
      >
        {selectedCohort && (
          <Flex direction="column" gap="1rem">
            <TextField
              label="Cohort Name"
              value={selectedCohort.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              isRequired
            />
            
            <Flex direction={{ base: 'column', medium: 'row' }} gap="1rem">
              <TextField
                label="Start Date"
                type="date"
                value={selectedCohort.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                isRequired
                flex="1"
              />
              
              <TextField
                label="End Date"
                type="date"
                value={selectedCohort.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                isRequired
                flex="1"
              />
            </Flex>
            
            <TextAreaField
              label="Description"
              value={selectedCohort.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
            
            <Flex direction={{ base: 'column', medium: 'row' }} gap="1rem">
              <SelectField
                label="Status"
                value={selectedCohort.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                flex="1"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </SelectField>
              
              <TextField
                label="Current Module"
                value={selectedCohort.currentModule}
                onChange={(e) => handleInputChange('currentModule', e.target.value)}
                flex="1"
              />
            </Flex>
            
            {formMode === 'edit' && (
              <TextField
                label="Student Count"
                type="number"
                value={selectedCohort.studentCount.toString()}
                onChange={(e) => handleInputChange('studentCount', parseInt(e.target.value, 10) || 0)}
                min="0"
              />
            )}
            
            <Divider marginTop="1rem" marginBottom="1rem" />
            
            <Flex justifyContent="flex-end" gap="1rem">
              <Button onClick={handleCloseModal} variation="link">Cancel</Button>
              <Button onClick={handleSaveCohort} variation="primary">
                {formMode === 'create' ? 'Create Cohort' : 'Save Changes'}
              </Button>
            </Flex>
          </Flex>
        )}
      </Modal>
    </Card>
  );
};

export default CohortManagement; 