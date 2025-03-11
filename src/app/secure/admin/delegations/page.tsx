import React, { useState, useEffect } from 'react';
import { Card, Heading, Text, Flex, Divider, Button, SelectField, TextField, Table, TableCell, TableBody, TableHead, TableRow, Badge, Pagination, SwitchField, Alert } from '@aws-amplify/ui-react';

// Define the delegation interface
interface Delegation {
  id: string;
  delegatorId: string;
  delegatorEmail: string;
  delegateeId: string;
  delegateeEmail: string;
  permissions: string[];
  resourceType: string;
  resourceIds: string[];
  reason: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
  revokedBy: string | null;
}

// Define the user interface for user selection
interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

const PermissionDelegationsPage = () => {
  // State for new delegation form
  const [newDelegation, setNewDelegation] = useState({
    delegatorId: '',
    delegateeId: '',
    permissions: [] as string[],
    resourceType: '',
    resourceIds: [] as string[],
    reason: '',
    expiresAt: '',
  });

  // State for delegations
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [activeDelegations, setActiveDelegations] = useState<Delegation[]>([]);
  const [expiredDelegations, setExpiredDelegations] = useState<Delegation[]>([]);
  const [revokedDelegations, setRevokedDelegations] = useState<Delegation[]>([]);
  
  // State for users (for selection)
  const [users, setUsers] = useState<User[]>([]);
  
  // State for UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState({
    viewSubmissions: false,
    gradeSubmissions: false,
    manageStudents: false,
    manageInstructors: false,
    manageCohorts: false,
    viewAnalytics: false,
    manageTemplates: false,
  });

  // Mock data for users
  const mockUsers: User[] = [
    {
      id: 'user-1',
      email: 'admin@example.com',
      name: 'Admin User',
      roles: ['admin'],
    },
    {
      id: 'user-2',
      email: 'instructor@example.com',
      name: 'Instructor User',
      roles: ['instructor'],
    },
    {
      id: 'user-3',
      email: 'student@example.com',
      name: 'Student User',
      roles: ['student'],
    },
    {
      id: 'user-4',
      email: 'another-instructor@example.com',
      name: 'Another Instructor',
      roles: ['instructor'],
    },
    {
      id: 'user-5',
      email: 'another-student@example.com',
      name: 'Another Student',
      roles: ['student'],
    },
  ];

  // Mock data for delegations
  const mockDelegations: Delegation[] = [
    {
      id: 'delegation-1',
      delegatorId: 'user-1',
      delegatorEmail: 'admin@example.com',
      delegateeId: 'user-2',
      delegateeEmail: 'instructor@example.com',
      permissions: ['viewSubmissions', 'gradeSubmissions'],
      resourceType: 'submission',
      resourceIds: ['submission-1', 'submission-2'],
      reason: 'Temporary grading assistance',
      createdAt: '2025-01-10T10:00:00Z',
      expiresAt: '2025-02-10T10:00:00Z',
      revokedAt: null,
      revokedBy: null,
    },
    {
      id: 'delegation-2',
      delegatorId: 'user-1',
      delegatorEmail: 'admin@example.com',
      delegateeId: 'user-4',
      delegateeEmail: 'another-instructor@example.com',
      permissions: ['manageStudents', 'manageCohorts'],
      resourceType: 'cohort',
      resourceIds: ['cohort-1'],
      reason: 'Cohort management assistance',
      createdAt: '2025-01-05T14:30:00Z',
      expiresAt: '2025-01-20T14:30:00Z',
      revokedAt: null,
      revokedBy: null,
    },
    {
      id: 'delegation-3',
      delegatorId: 'user-1',
      delegatorEmail: 'admin@example.com',
      delegateeId: 'user-2',
      delegateeEmail: 'instructor@example.com',
      permissions: ['viewAnalytics'],
      resourceType: 'analytics',
      resourceIds: ['analytics-global'],
      reason: 'Analytics review',
      createdAt: '2024-12-15T09:45:00Z',
      expiresAt: '2025-01-15T09:45:00Z',
      revokedAt: '2025-01-10T16:20:00Z',
      revokedBy: 'user-1',
    },
  ];

  // Fetch delegations and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, these would be API calls
        // const delegationsResponse = await API.graphql(graphqlOperation(listDelegations));
        // const usersResponse = await API.graphql(graphqlOperation(listUsers));
        // setDelegations(delegationsResponse.data.listDelegations.items);
        // setUsers(usersResponse.data.listUsers.items);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, we'll use mock data
        setDelegations(mockDelegations);
        setUsers(mockUsers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Categorize delegations when they change
  useEffect(() => {
    const now = new Date();
    
    const active = delegations.filter(d => 
      d.revokedAt === null && new Date(d.expiresAt) > now
    );
    
    const expired = delegations.filter(d => 
      d.revokedAt === null && new Date(d.expiresAt) <= now
    );
    
    const revoked = delegations.filter(d => 
      d.revokedAt !== null
    );
    
    setActiveDelegations(active);
    setExpiredDelegations(expired);
    setRevokedDelegations(revoked);
  }, [delegations]);

  // Handle form input changes
  const handleInputChange = (name: string, value: string) => {
    setNewDelegation({
      ...newDelegation,
      [name]: value,
    });
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (name: string, checked: boolean) => {
    setSelectedPermissions({
      ...selectedPermissions,
      [name]: checked,
    });
  };

  // Create new delegation
  const handleCreateDelegation = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Convert selected permissions to array
    const permissionsArray = Object.entries(selectedPermissions)
      .filter(([_, isSelected]) => isSelected)
      .map(([permission]) => permission);

    if (permissionsArray.length === 0) {
      setError('Please select at least one permission to delegate.');
      setIsLoading(false);
      return;
    }

    if (!newDelegation.delegatorId) {
      setError('Please select a delegator.');
      setIsLoading(false);
      return;
    }

    if (!newDelegation.delegateeId) {
      setError('Please select a delegatee.');
      setIsLoading(false);
      return;
    }

    if (!newDelegation.resourceType) {
      setError('Please select a resource type.');
      setIsLoading(false);
      return;
    }

    if (!newDelegation.expiresAt) {
      setError('Please set an expiration date.');
      setIsLoading(false);
      return;
    }

    try {
      // In a real implementation, this would be an API call
      // const input = {
      //   ...newDelegation,
      //   permissions: permissionsArray,
      // };
      // await API.graphql(graphqlOperation(createDelegation, { input }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll just add to the local state
      const newId = `delegation-${delegations.length + 1}`;
      const delegator = users.find(u => u.id === newDelegation.delegatorId);
      const delegatee = users.find(u => u.id === newDelegation.delegateeId);
      
      const newDelegationItem: Delegation = {
        id: newId,
        delegatorId: newDelegation.delegatorId,
        delegatorEmail: delegator?.email || '',
        delegateeId: newDelegation.delegateeId,
        delegateeEmail: delegatee?.email || '',
        permissions: permissionsArray,
        resourceType: newDelegation.resourceType,
        resourceIds: newDelegation.resourceIds.length > 0 ? newDelegation.resourceIds : ['all'],
        reason: newDelegation.reason,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(newDelegation.expiresAt).toISOString(),
        revokedAt: null,
        revokedBy: null,
      };
      
      setDelegations([...delegations, newDelegationItem]);
      
      // Reset form
      setNewDelegation({
        delegatorId: '',
        delegateeId: '',
        permissions: [],
        resourceType: '',
        resourceIds: [],
        reason: '',
        expiresAt: '',
      });
      
      setSelectedPermissions({
        viewSubmissions: false,
        gradeSubmissions: false,
        manageStudents: false,
        manageInstructors: false,
        manageCohorts: false,
        viewAnalytics: false,
        manageTemplates: false,
      });
      
      setSuccess('Delegation created successfully.');
      setIsLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error creating delegation:', error);
      setError('Failed to create delegation. Please try again.');
      setIsLoading(false);
    }
  };

  // Revoke delegation
  const handleRevokeDelegation = async (delegationId: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real implementation, this would be an API call
      // await API.graphql(graphqlOperation(revokeDelegation, { id: delegationId }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, we'll just update the local state
      const updatedDelegations = delegations.map(d => {
        if (d.id === delegationId) {
          return {
            ...d,
            revokedAt: new Date().toISOString(),
            revokedBy: 'user-1', // Current user ID would be used in a real implementation
          };
        }
        return d;
      });
      
      setDelegations(updatedDelegations);
      setSuccess('Delegation revoked successfully.');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error revoking delegation:', error);
      setError('Failed to revoke delegation. Please try again.');
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Check if a delegation is expired
  const isDelegationExpired = (expiresAt: string) => {
    return new Date(expiresAt) <= new Date();
  };

  return (
    <Flex direction="column" gap="1rem">
      <Heading level={2}>Permission Delegations</Heading>
      <Text>Manage temporary permission delegations between users in the system.</Text>
      
      {error && (
        <Alert variation="error" heading="Error">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variation="success" heading="Success">
          {success}
        </Alert>
      )}
      
      <Card>
        <Heading level={3}>Create New Delegation</Heading>
        <Divider />
        <Flex direction="column" gap="1rem" padding="1rem">
          <Flex direction={{ base: 'column', large: 'row' }} gap="1rem">
            <SelectField
              label="Delegator (From)"
              placeholder="Select user who is delegating permissions"
              width={{ base: '100%', large: '50%' }}
              descriptiveText="User who is delegating permissions"
              value={newDelegation.delegatorId}
              onChange={(e) => handleInputChange('delegatorId', e.target.value)}
              isDisabled={isLoading}
            >
              <option value="">Select delegator...</option>
              {users
                .filter(user => user.roles.includes('admin') || user.roles.includes('instructor'))
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))
              }
            </SelectField>
            <SelectField
              label="Delegatee (To)"
              placeholder="Select user who will receive permissions"
              width={{ base: '100%', large: '50%' }}
              descriptiveText="User who will receive delegated permissions"
              value={newDelegation.delegateeId}
              onChange={(e) => handleInputChange('delegateeId', e.target.value)}
              isDisabled={isLoading}
            >
              <option value="">Select delegatee...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </SelectField>
          </Flex>
          
          <Heading level={5}>Permissions to Delegate</Heading>
          <Flex direction="column" gap="0.5rem">
            <SwitchField
              label="View Submissions"
              labelPosition="end"
              checked={selectedPermissions.viewSubmissions}
              onChange={(e) => handlePermissionChange('viewSubmissions', e.target.checked)}
              isDisabled={isLoading}
            />
            <SwitchField
              label="Grade Submissions"
              labelPosition="end"
              checked={selectedPermissions.gradeSubmissions}
              onChange={(e) => handlePermissionChange('gradeSubmissions', e.target.checked)}
              isDisabled={isLoading}
            />
            <SwitchField
              label="Manage Students"
              labelPosition="end"
              checked={selectedPermissions.manageStudents}
              onChange={(e) => handlePermissionChange('manageStudents', e.target.checked)}
              isDisabled={isLoading}
            />
            <SwitchField
              label="Manage Instructors"
              labelPosition="end"
              checked={selectedPermissions.manageInstructors}
              onChange={(e) => handlePermissionChange('manageInstructors', e.target.checked)}
              isDisabled={isLoading}
            />
            <SwitchField
              label="Manage Cohorts"
              labelPosition="end"
              checked={selectedPermissions.manageCohorts}
              onChange={(e) => handlePermissionChange('manageCohorts', e.target.checked)}
              isDisabled={isLoading}
            />
            <SwitchField
              label="View Analytics"
              labelPosition="end"
              checked={selectedPermissions.viewAnalytics}
              onChange={(e) => handlePermissionChange('viewAnalytics', e.target.checked)}
              isDisabled={isLoading}
            />
            <SwitchField
              label="Manage Templates"
              labelPosition="end"
              checked={selectedPermissions.manageTemplates}
              onChange={(e) => handlePermissionChange('manageTemplates', e.target.checked)}
              isDisabled={isLoading}
            />
          </Flex>
          
          <SelectField
            label="Resource Type"
            descriptiveText="Type of resource the delegation applies to"
            value={newDelegation.resourceType}
            onChange={(e) => handleInputChange('resourceType', e.target.value)}
            isDisabled={isLoading}
          >
            <option value="">Select resource type...</option>
            <option value="submission">Submissions</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="cohort">Cohorts</option>
            <option value="template">Templates</option>
            <option value="analytics">Analytics</option>
            <option value="all">All Resources</option>
          </SelectField>
          
          <TextField
            label="Reason"
            placeholder="Enter reason for delegation"
            descriptiveText="Why this delegation is being created"
            value={newDelegation.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            isDisabled={isLoading}
          />
          
          <TextField
            label="Expiration Date"
            type="datetime-local"
            descriptiveText="When the delegation will expire"
            value={newDelegation.expiresAt}
            onChange={(e) => handleInputChange('expiresAt', e.target.value)}
            isDisabled={isLoading}
          />
          
          <Flex justifyContent="flex-end" gap="1rem">
            <Button 
              variation="primary" 
              onClick={handleCreateDelegation}
              isLoading={isLoading}
              loadingText="Creating..."
            >
              Create Delegation
            </Button>
          </Flex>
        </Flex>
      </Card>
      
      <Card>
        <Heading level={3}>Active Delegations</Heading>
        <Divider />
        {isLoading ? (
          <Flex justifyContent="center" padding="2rem">
            <Text>Loading...</Text>
          </Flex>
        ) : activeDelegations.length === 0 ? (
          <Flex justifyContent="center" padding="2rem">
            <Text>No active delegations found.</Text>
          </Flex>
        ) : (
          <Table highlightOnHover={true}>
            <TableHead>
              <TableRow>
                <TableCell as="th">Delegator</TableCell>
                <TableCell as="th">Delegatee</TableCell>
                <TableCell as="th">Permissions</TableCell>
                <TableCell as="th">Resource Type</TableCell>
                <TableCell as="th">Expires</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeDelegations.map((delegation) => (
                <TableRow key={delegation.id}>
                  <TableCell>{delegation.delegatorEmail}</TableCell>
                  <TableCell>{delegation.delegateeEmail}</TableCell>
                  <TableCell>
                    <Flex direction="column" gap="0.25rem">
                      {delegation.permissions.map((permission, index) => (
                        <Badge key={index} variation="info">
                          {permission}
                        </Badge>
                      ))}
                    </Flex>
                  </TableCell>
                  <TableCell>{delegation.resourceType}</TableCell>
                  <TableCell>{formatDate(delegation.expiresAt)}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variation="warning"
                      onClick={() => handleRevokeDelegation(delegation.id)}
                      isDisabled={isLoading}
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      
      <Card>
        <Heading level={3}>Expired Delegations</Heading>
        <Divider />
        {isLoading ? (
          <Flex justifyContent="center" padding="2rem">
            <Text>Loading...</Text>
          </Flex>
        ) : expiredDelegations.length === 0 ? (
          <Flex justifyContent="center" padding="2rem">
            <Text>No expired delegations found.</Text>
          </Flex>
        ) : (
          <Table highlightOnHover={true}>
            <TableHead>
              <TableRow>
                <TableCell as="th">Delegator</TableCell>
                <TableCell as="th">Delegatee</TableCell>
                <TableCell as="th">Permissions</TableCell>
                <TableCell as="th">Resource Type</TableCell>
                <TableCell as="th">Expired</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expiredDelegations.map((delegation) => (
                <TableRow key={delegation.id}>
                  <TableCell>{delegation.delegatorEmail}</TableCell>
                  <TableCell>{delegation.delegateeEmail}</TableCell>
                  <TableCell>
                    <Flex direction="column" gap="0.25rem">
                      {delegation.permissions.map((permission, index) => (
                        <Badge key={index} variation="info">
                          {permission}
                        </Badge>
                      ))}
                    </Flex>
                  </TableCell>
                  <TableCell>{delegation.resourceType}</TableCell>
                  <TableCell>{formatDate(delegation.expiresAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      
      <Card>
        <Heading level={3}>Revoked Delegations</Heading>
        <Divider />
        {isLoading ? (
          <Flex justifyContent="center" padding="2rem">
            <Text>Loading...</Text>
          </Flex>
        ) : revokedDelegations.length === 0 ? (
          <Flex justifyContent="center" padding="2rem">
            <Text>No revoked delegations found.</Text>
          </Flex>
        ) : (
          <Table highlightOnHover={true}>
            <TableHead>
              <TableRow>
                <TableCell as="th">Delegator</TableCell>
                <TableCell as="th">Delegatee</TableCell>
                <TableCell as="th">Permissions</TableCell>
                <TableCell as="th">Resource Type</TableCell>
                <TableCell as="th">Revoked</TableCell>
                <TableCell as="th">Revoked By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revokedDelegations.map((delegation) => (
                <TableRow key={delegation.id}>
                  <TableCell>{delegation.delegatorEmail}</TableCell>
                  <TableCell>{delegation.delegateeEmail}</TableCell>
                  <TableCell>
                    <Flex direction="column" gap="0.25rem">
                      {delegation.permissions.map((permission, index) => (
                        <Badge key={index} variation="info">
                          {permission}
                        </Badge>
                      ))}
                    </Flex>
                  </TableCell>
                  <TableCell>{delegation.resourceType}</TableCell>
                  <TableCell>{delegation.revokedAt ? formatDate(delegation.revokedAt) : 'N/A'}</TableCell>
                  <TableCell>{delegation.revokedBy ? users.find(u => u.id === delegation.revokedBy)?.email || delegation.revokedBy : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </Flex>
  );
};

export default PermissionDelegationsPage; 