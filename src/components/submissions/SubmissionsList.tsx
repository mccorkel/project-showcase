import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Flex, 
  Divider, 
  Button, 
  SelectField,
  TextField,
  useTheme,
  Collection,
  Badge,
  Text,
  View,
  Image,
  Loader
} from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { getSubmissions } from '../../graphql/operations/submissions';
import { useRouter } from 'next/navigation';

const client = generateClient();

interface SubmissionsListProps {
  onSelect?: (id: string) => void;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({ onSelect }) => {
  const { tokens } = useTheme();
  const { studentProfile } = useAuth();
  const router = useRouter();
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [weekFilter, setWeekFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Fetch submissions when the component mounts
  useEffect(() => {
    fetchSubmissions();
  }, [studentProfile]);

  // Apply filters and sorting when submissions or filter values change
  useEffect(() => {
    applyFiltersAndSort();
  }, [submissions, statusFilter, weekFilter, searchTerm, sortBy, sortDirection]);

  // Fetch submissions from the API
  const fetchSubmissions = async () => {
    if (!studentProfile?.id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await client.graphql({
        query: getSubmissions,
        variables: {
          studentProfileId: studentProfile.id,
          limit: 100
        }
      });
      
      if ('data' in result && result.data.listSubmissions) {
        setSubmissions(result.data.listSubmissions.items);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and sorting to the submissions
  const applyFiltersAndSort = () => {
    let filtered = [...submissions];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }
    
    // Apply week filter
    if (weekFilter !== 'all') {
      filtered = filtered.filter(submission => submission.week === parseInt(weekFilter));
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(submission => 
        submission.title?.toLowerCase().includes(term) ||
        submission.description?.toLowerCase().includes(term) ||
        submission.technologies?.some((tech: string) => tech.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'title':
          valueA = a.title || '';
          valueB = b.title || '';
          return sortDirection === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        
        case 'week':
          valueA = a.week || 0;
          valueB = b.week || 0;
          return sortDirection === 'asc' 
            ? valueA - valueB
            : valueB - valueA;
        
        case 'status':
          valueA = a.status || '';
          valueB = b.status || '';
          return sortDirection === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        
        case 'updatedAt':
        default:
          valueA = new Date(a.lastStudentEdit || a.updatedAt || 0).getTime();
          valueB = new Date(b.lastStudentEdit || b.updatedAt || 0).getTime();
          return sortDirection === 'asc' 
            ? valueA - valueB
            : valueB - valueA;
      }
    });
    
    setFilteredSubmissions(filtered);
  };

  // Get status badge variation based on status
  const getStatusBadgeVariation = (status: string) => {
    switch (status) {
      case 'draft':
        return 'warning';
      case 'submitted':
        return 'info';
      case 'graded':
        return 'success';
      default:
        return 'info';
    }
  };

  // Handle creating a new submission
  const handleCreateNew = () => {
    router.push('/secure/submissions/new');
  };

  // Handle editing a submission
  const handleEdit = (id: string) => {
    if (onSelect) {
      onSelect(id);
    } else {
      router.push(`/secure/submissions/${id}`);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={3}>My Submissions</Heading>
        <Button
          variation="primary"
          onClick={handleCreateNew}
        >
          Create New Submission
        </Button>
      </Flex>
      <Divider marginBlock={tokens.space.medium} />
      
      {/* Filters */}
      <Flex direction={{ base: 'column', large: 'row' }} gap={tokens.space.medium} marginBottom={tokens.space.large}>
        <SelectField
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          width={{ base: '100%', large: '20%' }}
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="graded">Graded</option>
        </SelectField>
        
        <SelectField
          label="Week"
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value)}
          width={{ base: '100%', large: '20%' }}
        >
          <option value="all">All Weeks</option>
          {Array.from({ length: 20 }, (_, i) => (
            <option key={i + 1} value={(i + 1).toString()}>Week {i + 1}</option>
          ))}
        </SelectField>
        
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, description, or technology"
          width={{ base: '100%', large: '40%' }}
        />
        
        <SelectField
          label="Sort By"
          value={`${sortBy}-${sortDirection}`}
          onChange={(e) => {
            const [field, direction] = e.target.value.split('-');
            setSortBy(field);
            setSortDirection(direction);
          }}
          width={{ base: '100%', large: '20%' }}
        >
          <option value="updatedAt-desc">Newest First</option>
          <option value="updatedAt-asc">Oldest First</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="week-asc">Week (Ascending)</option>
          <option value="week-desc">Week (Descending)</option>
          <option value="status-asc">Status (A-Z)</option>
          <option value="status-desc">Status (Z-A)</option>
        </SelectField>
      </Flex>
      
      {/* Submissions List */}
      {isLoading ? (
        <Flex justifyContent="center" padding={tokens.space.xl}>
          <Loader size="large" />
        </Flex>
      ) : filteredSubmissions.length === 0 ? (
        <Flex direction="column" alignItems="center" padding={tokens.space.xl} gap={tokens.space.medium}>
          <Text fontSize={tokens.fontSizes.large}>No submissions found</Text>
          {submissions.length === 0 ? (
            <Text>You haven't created any submissions yet.</Text>
          ) : (
            <Text>Try adjusting your filters to see more results.</Text>
          )}
          <Button
            variation="primary"
            onClick={handleCreateNew}
          >
            Create Your First Submission
          </Button>
        </Flex>
      ) : (
        <Collection
          items={filteredSubmissions}
          type="list"
          gap={tokens.space.medium}
        >
          {(submission) => (
            <Card key={submission.id} variation="outlined">
              <Flex direction={{ base: 'column', large: 'row' }} gap={tokens.space.medium}>
                {/* Featured Image */}
                {submission.featuredImageUrl && (
                  <View
                    width={{ base: '100%', large: '200px' }}
                    height={{ base: '150px', large: '150px' }}
                    overflow="hidden"
                  >
                    <Image
                      src={submission.featuredImageUrl}
                      alt={submission.title}
                      objectFit="cover"
                      width="100%"
                      height="100%"
                    />
                  </View>
                )}
                
                {/* Content */}
                <Flex direction="column" gap={tokens.space.small} flex="1">
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Heading level={5}>{submission.title}</Heading>
                    <Badge variation={getStatusBadgeVariation(submission.status)}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </Badge>
                  </Flex>
                  
                  <Flex gap={tokens.space.xs}>
                    {submission.week && (
                      <Badge variation="info">Week {submission.week}</Badge>
                    )}
                    {submission.technologies && submission.technologies.map((tech: string, index: number) => (
                      <Badge key={index} variation="info">{tech}</Badge>
                    ))}
                  </Flex>
                  
                  <Text>{submission.description?.substring(0, 150)}...</Text>
                  
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize={tokens.fontSizes.small} color={tokens.colors.neutral[60]}>
                      Last updated: {formatDate(submission.lastStudentEdit || submission.updatedAt)}
                    </Text>
                    <Button
                      variation="primary"
                      onClick={() => handleEdit(submission.id)}
                    >
                      View Details
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          )}
        </Collection>
      )}
    </Card>
  );
};

export default SubmissionsList; 