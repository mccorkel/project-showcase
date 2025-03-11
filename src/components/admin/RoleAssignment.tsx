import React, { useState, useEffect } from 'react';
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
  SwitchField,
  CheckboxField
} from '@aws-amplify/ui-react';
import { FiSearch, FiRefreshCw, FiSave, FiUserCheck } from 'react-icons/fi';

// Mock data generator for roles
const generateMockRoles = () => {
  return [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full access to all system features and settings.',
      permissions: [
        'user:create', 'user:read', 'user:update', 'user:delete',
        'profile:create', 'profile:read', 'profile:update', 'profile:delete',
        'submission:create', 'submission:read', 'submission:update', 'submission:delete',
        'showcase:create', 'showcase:read', 'showcase:update', 'showcase:delete',
        'system:settings', 'system:logs'
      ]
    },
    {
      id: 'instructor',
      name: 'Instructor',
      description: 'Access to manage students, submissions, and provide feedback.',
      permissions: [
        'profile:read',
        'submission:read', 'submission:update',
        'showcase:read',
        'cohort:read', 'cohort:update'
      ]
    },
    {
      id: 'student',
      name: 'Student',
      description: 'Access to manage own profile, submissions, and showcase.',
      permissions: [
        'profile:read:own', 'profile:update:own',
        'submission:create:own', 'submission:read:own', 'submission:update:own',
        'showcase:create:own', 'showcase:read:own', 'showcase:update:own', 'showcase:delete:own'
      ]
    },
    {
      id: 'guest',
      name: 'Guest',
      description: 'Limited access to view public showcases only.',
      permissions: [
        'showcase:read:public'
      ]
    }
  ];
};

// Mock data generator for users
const generateMockUsers = () => {
  const users = [];
  
  for (let i = 1; i <= 20; i++) {
    users.push({
      id: `user-${i}`,
      cognito_user_id: `us-east-1:${Math.random().toString(36).substring(2, 15)}`,
      email: `user${i}@example.com`,
      username: `user${i}`,
      first_name: `First${i}`,
      last_name: `Last${i}`,
      roles: i % 5 === 0 ? ['admin'] : i % 3 === 0 ? ['instructor'] : ['student'],
      status: i % 7 === 0 ? 'inactive' : 'active'
    });
  }
  
  return users;
};

interface RoleAssignmentProps {
  // In a real implementation, we might pass in props like onRoleAssigned
}

const RoleAssignment: React.FC<RoleAssignmentProps> = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch roles and users on component mount
  useEffect(() => {
    fetchRolesAndUsers();
  }, []);
  
  // Apply filters when users or searchTerm changes
  useEffect(() => {
    applyFilters();
  }, [users, searchTerm]);
  
  const fetchRolesAndUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, these would be API calls
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const mockRoles = generateMockRoles();
      const mockUsers = generateMockUsers();
      
      setRoles(mockRoles);
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load roles and users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.first_name.toLowerCase().includes(term) ||
        user.last_name.toLowerCase().includes(term)
      );
    }
    
    setFilteredUsers(filtered);
  };
  
  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setUserRoles([...user.roles]);
    setSuccess(null);
  };
  
  const handleRoleToggle = (roleId: string) => {
    setUserRoles(prevRoles => {
      if (prevRoles.includes(roleId)) {
        // Remove role
        return prevRoles.filter(r => r !== roleId);
      } else {
        // Add role
        return [...prevRoles, roleId];
      }
    });
  };
  
  const handleSaveRoles = async () => {
    if (!selectedUser) return;
    
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      // Update user in state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { ...user, roles: [...userRoles] } 
            : user
        )
      );
      
      // Update selected user
      setSelectedUser({ ...selectedUser, roles: [...userRoles] });
      
      // Show success message
      setSuccess('Roles updated successfully');
    } catch (err) {
      console.error('Error saving roles:', err);
      setError('Failed to save roles. Please try again.');
    }
  };
  
  const getRoleBadge = (roleId: string) => {
    switch (roleId) {
      case 'admin':
        return <Badge variation="error">Admin</Badge>;
      case 'instructor':
        return <Badge variation="info">Instructor</Badge>;
      case 'student':
        return <Badge variation="success">Student</Badge>;
      case 'guest':
        return <Badge variation="warning">Guest</Badge>;
      default:
        return <Badge>{roleId}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variation="success">Active</Badge>;
      case 'inactive':
        return <Badge variation="warning">Inactive</Badge>;
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
  
  return (
    <Card variation="elevated">
      <Flex direction="column" gap="1.5rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={3}>Role Assignment</Heading>
          
          <Button
            variation="link"
            onClick={fetchRolesAndUsers}
            gap="0.5rem"
          >
            <FiRefreshCw />
            Refresh
          </Button>
        </Flex>
        
        {error && <Alert variation="error">{error}</Alert>}
        {success && <Alert variation="success">{success}</Alert>}
        
        <Grid templateColumns={{ base: '1fr', large: '1fr 1fr' }} gap="1.5rem">
          <Card>
            <Heading level={4}>Users</Heading>
            <TextField
              label="Search Users"
              placeholder="Search by name, email, or username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              marginBottom="1rem"
            />
            
            <Table highlightOnHover={true}>
              <TableHead>
                <TableRow>
                  <TableCell as="th">Name</TableCell>
                  <TableCell as="th">Email</TableCell>
                  <TableCell as="th">Current Roles</TableCell>
                  <TableCell as="th">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Text textAlign="center">No users found matching the search term.</Text>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow 
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: selectedUser?.id === user.id ? 'var(--amplify-colors-background-secondary)' : undefined
                      }}
                    >
                      <TableCell>{user.first_name} {user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Flex gap="0.5rem">
                          {user.roles.map((role: string) => (
                            <View key={role}>{getRoleBadge(role)}</View>
                          ))}
                        </Flex>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
          
          <Card>
            <Heading level={4}>Assign Roles</Heading>
            
            {selectedUser ? (
              <Flex direction="column" gap="1rem">
                <Text>
                  Assigning roles for: <strong>{selectedUser.first_name} {selectedUser.last_name}</strong> ({selectedUser.email})
                </Text>
                
                <Divider />
                
                <Text fontWeight="bold">Available Roles:</Text>
                
                <Flex direction="column" gap="1rem">
                  {roles.map(role => (
                    <Card key={role.id} padding="1rem">
                      <Flex justifyContent="space-between" alignItems="flex-start">
                        <Flex direction="column" gap="0.5rem">
                          <Flex alignItems="center" gap="0.5rem">
                            {getRoleBadge(role.id)}
                            <Heading level={5} margin="0">{role.name}</Heading>
                          </Flex>
                          <Text fontSize="0.875rem">{role.description}</Text>
                        </Flex>
                        
                        <CheckboxField
                          name={`role-${role.id}`}
                          label="Assign"
                          labelHidden
                          checked={userRoles.includes(role.id)}
                          onChange={() => handleRoleToggle(role.id)}
                        />
                      </Flex>
                      
                      <Divider marginY="0.5rem" />
                      
                      <Text fontSize="0.75rem" fontWeight="bold">Permissions:</Text>
                      <Flex gap="0.5rem" flexWrap="wrap" marginTop="0.5rem">
                        {role.permissions.map(permission => (
                          <Badge key={permission} size="small" variation="info">
                            {permission}
                          </Badge>
                        ))}
                      </Flex>
                    </Card>
                  ))}
                </Flex>
                
                <Button
                  variation="primary"
                  onClick={handleSaveRoles}
                  gap="0.5rem"
                >
                  <FiSave />
                  Save Role Assignments
                </Button>
              </Flex>
            ) : (
              <Flex 
                direction="column" 
                alignItems="center" 
                justifyContent="center" 
                padding="2rem"
                gap="1rem"
              >
                <FiUserCheck size={48} color="var(--amplify-colors-neutral-60)" />
                <Text>Select a user from the list to assign roles</Text>
              </Flex>
            )}
          </Card>
        </Grid>
      </Flex>
    </Card>
  );
};

export default RoleAssignment; 