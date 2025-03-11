import React, { useState, useEffect } from 'react';
import { Card, Heading, Text, Flex, Divider, Button, SelectField, TextField, Table, TableCell, TableBody, TableHead, TableRow, Badge, Pagination, Alert } from '@aws-amplify/ui-react';

// Define the audit log interface
interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  actionType: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: string;
}

const AuditLogsPage = () => {
  // State for filters
  const [filters, setFilters] = useState({
    user: '',
    actionType: '',
    resourceType: '',
    startDate: '',
    endDate: '',
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  
  // State for logs
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  
  // State for UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock data for audit logs
  const mockLogs: AuditLog[] = [
    {
      id: '1',
      userId: 'user-1',
      userEmail: 'admin@example.com',
      actionType: 'login',
      resourceType: 'session',
      resourceId: 'session-1',
      timestamp: '2025-01-15T09:30:00Z',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      details: 'Successful login',
    },
    {
      id: '2',
      userId: 'user-2',
      userEmail: 'instructor@example.com',
      actionType: 'update',
      resourceType: 'submission',
      resourceId: 'submission-1',
      timestamp: '2025-01-15T10:15:00Z',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: 'Updated submission grade',
    },
    {
      id: '3',
      userId: 'user-3',
      userEmail: 'student@example.com',
      actionType: 'create',
      resourceType: 'submission',
      resourceId: 'submission-2',
      timestamp: '2025-01-15T11:00:00Z',
      ipAddress: '192.168.1.3',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      details: 'Created new submission',
    },
    {
      id: '4',
      userId: 'user-1',
      userEmail: 'admin@example.com',
      actionType: 'delete',
      resourceType: 'user',
      resourceId: 'user-4',
      timestamp: '2025-01-15T12:30:00Z',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      details: 'Deleted user account',
    },
    {
      id: '5',
      userId: 'user-2',
      userEmail: 'instructor@example.com',
      actionType: 'grade',
      resourceType: 'submission',
      resourceId: 'submission-3',
      timestamp: '2025-01-15T13:45:00Z',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: 'Graded submission',
    },
    {
      id: '6',
      userId: 'user-3',
      userEmail: 'student@example.com',
      actionType: 'publish',
      resourceType: 'showcase',
      resourceId: 'showcase-1',
      timestamp: '2025-01-15T14:20:00Z',
      ipAddress: '192.168.1.3',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      details: 'Published showcase',
    },
    {
      id: '7',
      userId: 'user-1',
      userEmail: 'admin@example.com',
      actionType: 'update',
      resourceType: 'system',
      resourceId: 'settings',
      timestamp: '2025-01-15T15:10:00Z',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      details: 'Updated system settings',
    },
    {
      id: '8',
      userId: 'user-5',
      userEmail: 'another-student@example.com',
      actionType: 'login',
      resourceType: 'session',
      resourceId: 'session-2',
      timestamp: '2025-01-15T16:05:00Z',
      ipAddress: '192.168.1.4',
      userAgent: 'Mozilla/5.0 (Linux; Android 10)',
      details: 'Failed login attempt',
    },
    {
      id: '9',
      userId: 'user-2',
      userEmail: 'instructor@example.com',
      actionType: 'create',
      resourceType: 'cohort',
      resourceId: 'cohort-1',
      timestamp: '2025-01-15T17:30:00Z',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: 'Created new cohort',
    },
    {
      id: '10',
      userId: 'user-1',
      userEmail: 'admin@example.com',
      actionType: 'logout',
      resourceType: 'session',
      resourceId: 'session-1',
      timestamp: '2025-01-15T18:00:00Z',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      details: 'User logged out',
    },
  ];

  // Fetch logs on component mount
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // const response = await API.graphql(graphqlOperation(listAuditLogs));
        // setLogs(response.data.listAuditLogs.items);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, we'll use mock data
        setLogs(mockLogs);
        setFilteredLogs(mockLogs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        setError('Failed to load audit logs. Please try again.');
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...logs];
      
      // Filter by user
      if (filters.user) {
        filtered = filtered.filter(log => 
          log.userEmail.toLowerCase().includes(filters.user.toLowerCase()) ||
          log.userId.toLowerCase().includes(filters.user.toLowerCase())
        );
      }
      
      // Filter by action type
      if (filters.actionType) {
        filtered = filtered.filter(log => log.actionType === filters.actionType);
      }
      
      // Filter by resource type
      if (filters.resourceType) {
        filtered = filtered.filter(log => log.resourceType === filters.resourceType);
      }
      
      // Filter by date range
      if (filters.startDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
      }
      
      if (filters.endDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
      }
      
      setFilteredLogs(filtered);
      setTotalPages(Math.ceil(filtered.length / 10));
      setCurrentPage(1); // Reset to first page when filters change
    };
    
    applyFilters();
  }, [filters, logs]);

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Handle page change
  const handlePageChange = (newPageIndex?: number, prevPageIndex?: number) => {
    if (newPageIndex !== undefined) {
      setCurrentPage(newPageIndex);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      user: '',
      actionType: '',
      resourceType: '',
      startDate: '',
      endDate: '',
    });
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get badge variation based on action type
  const getActionBadgeVariation = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return 'success';
      case 'update':
        return 'info';
      case 'delete':
        return 'error';
      case 'login':
        return 'success';
      case 'logout':
        return 'warning';
      case 'publish':
        return 'success';
      case 'grade':
        return 'info';
      default:
        return 'warning';
    }
  };

  // Get current page of logs
  const getCurrentPageLogs = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredLogs.slice(startIndex, endIndex);
  };

  return (
    <Flex direction="column" gap="1rem">
      <Heading level={2}>Audit Logs</Heading>
      <Text>View system audit logs for all actions performed by users.</Text>
      
      {error && (
        <Alert variation="error" heading="Error">
          {error}
        </Alert>
      )}
      
      <Card>
        <Heading level={3}>Filters</Heading>
        <Divider />
        <Flex direction={{ base: 'column', large: 'row' }} gap="1rem" padding="1rem" wrap="wrap">
          <TextField
            label="User"
            placeholder="Search by user email or ID"
            width={{ base: '100%', large: '25%' }}
            value={filters.user}
            onChange={(e) => handleFilterChange('user', e.target.value)}
            isDisabled={isLoading}
          />
          <SelectField
            label="Action Type"
            placeholder="All Actions"
            width={{ base: '100%', large: '25%' }}
            value={filters.actionType}
            onChange={(e) => handleFilterChange('actionType', e.target.value)}
            isDisabled={isLoading}
          >
            <option value="">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="publish">Publish</option>
            <option value="grade">Grade</option>
          </SelectField>
          <SelectField
            label="Resource Type"
            placeholder="All Resources"
            width={{ base: '100%', large: '25%' }}
            value={filters.resourceType}
            onChange={(e) => handleFilterChange('resourceType', e.target.value)}
            isDisabled={isLoading}
          >
            <option value="">All Resources</option>
            <option value="user">User</option>
            <option value="submission">Submission</option>
            <option value="showcase">Showcase</option>
            <option value="session">Session</option>
            <option value="cohort">Cohort</option>
            <option value="system">System</option>
          </SelectField>
        </Flex>
        <Flex direction={{ base: 'column', large: 'row' }} gap="1rem" padding="0 1rem 1rem 1rem" wrap="wrap">
          <TextField
            label="Start Date"
            type="date"
            width={{ base: '100%', large: '25%' }}
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            isDisabled={isLoading}
          />
          <TextField
            label="End Date"
            type="date"
            width={{ base: '100%', large: '25%' }}
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            isDisabled={isLoading}
          />
          <Flex alignItems="flex-end" width={{ base: '100%', large: '50%' }} justifyContent="flex-end">
            <Button 
              onClick={handleResetFilters}
              isDisabled={isLoading}
            >
              Reset Filters
            </Button>
          </Flex>
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Logs</Heading>
        <Divider />
        <Table highlightOnHover={true}>
          <TableHead>
            <TableRow>
              <TableCell as="th">Timestamp</TableCell>
              <TableCell as="th">User</TableCell>
              <TableCell as="th">Action</TableCell>
              <TableCell as="th">Resource</TableCell>
              <TableCell as="th">IP Address</TableCell>
              <TableCell as="th">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Flex justifyContent="center" padding="2rem">
                    <Text>Loading...</Text>
                  </Flex>
                </TableCell>
              </TableRow>
            ) : getCurrentPageLogs().length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Flex justifyContent="center" padding="2rem">
                    <Text>No audit logs found matching the current filters.</Text>
                  </Flex>
                </TableCell>
              </TableRow>
            ) : (
              getCurrentPageLogs().map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                  <TableCell>{log.userEmail}</TableCell>
                  <TableCell>
                    <Badge variation={getActionBadgeVariation(log.actionType)}>
                      {log.actionType.charAt(0).toUpperCase() + log.actionType.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.resourceType}</TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Flex justifyContent="center" padding="1rem">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            siblingCount={1} 
            onChange={handlePageChange}
          />
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Export Options</Heading>
        <Divider />
        <Flex gap="1rem" padding="1rem">
          <Button variation="primary" isDisabled={isLoading || filteredLogs.length === 0}>
            Export to CSV
          </Button>
          <Button variation="primary" isDisabled={isLoading || filteredLogs.length === 0}>
            Export to JSON
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export default AuditLogsPage; 