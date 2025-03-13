'use client';

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
  SwitchField
} from '@aws-amplify/ui-react';

// Mock data for roles
const generateMockRoles = () => {
  return [
    {
      id: 'role-1',
      name: 'Administrator',
      description: 'Full access to all system features',
      permissions: [
        'users:read', 'users:write', 'users:delete',
        'roles:read', 'roles:write', 'roles:delete',
        'settings:read', 'settings:write',
        'content:read', 'content:write', 'content:delete',
        'submissions:read', 'submissions:write', 'submissions:delete'
      ]
    },
    {
      id: 'role-2',
      name: 'Instructor',
      description: 'Access to manage courses, students, and submissions',
      permissions: [
        'users:read',
        'content:read', 'content:write',
        'submissions:read', 'submissions:write'
      ]
    },
    {
      id: 'role-3',
      name: 'Student',
      description: 'Access to view courses and submit assignments',
      permissions: [
        'content:read',
        'submissions:read', 'submissions:write'
      ]
    },
    {
      id: 'role-4',
      name: 'Guest',
      description: 'Limited access to public content only',
      permissions: [
        'content:read'
      ]
    }
  ];
};

// Mock data for permissions
const generateMockPermissions = () => {
  return [
    { id: 'users:read', name: 'View Users', category: 'User Management' },
    { id: 'users:write', name: 'Create/Edit Users', category: 'User Management' },
    { id: 'users:delete', name: 'Delete Users', category: 'User Management' },
    
    { id: 'roles:read', name: 'View Roles', category: 'Role Management' },
    { id: 'roles:write', name: 'Create/Edit Roles', category: 'Role Management' },
    { id: 'roles:delete', name: 'Delete Roles', category: 'Role Management' },
    
    { id: 'settings:read', name: 'View Settings', category: 'System Settings' },
    { id: 'settings:write', name: 'Modify Settings', category: 'System Settings' },
    
    { id: 'content:read', name: 'View Content', category: 'Content Management' },
    { id: 'content:write', name: 'Create/Edit Content', category: 'Content Management' },
    { id: 'content:delete', name: 'Delete Content', category: 'Content Management' },
    
    { id: 'submissions:read', name: 'View Submissions', category: 'Submission Management' },
    { id: 'submissions:write', name: 'Create/Grade Submissions', category: 'Submission Management' },
    { id: 'submissions:delete', name: 'Delete Submissions', category: 'Submission Management' }
  ];
};

// Mock function to fetch users with roles
const generateMockUsers = () => {
  return [
    { id: 'user-1', name: 'Admin User', email: 'admin@example.com', roles: ['role-1'] },
    { id: 'user-2', name: 'Instructor One', email: 'instructor1@example.com', roles: ['role-2'] },
    { id: 'user-3', name: 'Instructor Two', email: 'instructor2@example.com', roles: ['role-2'] },
    { id: 'user-4', name: 'Student One', email: 'student1@example.com', roles: ['role-3'] },
    { id: 'user-5', name: 'Student Two', email: 'student2@example.com', roles: ['role-3'] },
    { id: 'user-6', name: 'Guest User', email: 'guest@example.com', roles: ['role-4'] },
    { id: 'user-7', name: 'Multi-Role User', email: 'multi@example.com', roles: ['role-2', 'role-3'] }
  ];
};

interface RoleAssignmentProps {
  // In a real implementation, we might pass in props
}

const RoleAssignment: React.FC<RoleAssignmentProps> = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real implementation, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockRoles = generateMockRoles();
        const mockPermissions = generateMockPermissions();
        const mockUsers = generateMockUsers();
        
        setRoles(mockRoles);
        setPermissions(mockPermissions);
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        
        // Select the first role by default
        if (mockRoles.length > 0) {
          setSelectedRole(mockRoles[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);
  
  const handleRoleSelect = (role: any) => {
    setSelectedRole(role);
    setSelectedUser(null);
  };
  
  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(null);
  };
  
  const handleTogglePermission = (permissionId: string) => {
    if (!selectedRole) return;
    
    setRoles(prevRoles => 
      prevRoles.map(role => {
        if (role.id === selectedRole.id) {
          const updatedPermissions = role.permissions.includes(permissionId)
            ? role.permissions.filter((id: string) => id !== permissionId)
            : [...role.permissions, permissionId];
          
          const updatedRole = { ...role, permissions: updatedPermissions };
          setSelectedRole(updatedRole);
          return updatedRole;
        }
        return role;
      })
    );
  };
  
  const handleToggleUserRole = (roleId: string) => {
    if (!selectedUser) return;
    
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === selectedUser.id) {
          const updatedRoles = user.roles.includes(roleId)
            ? user.roles.filter((id: string) => id !== roleId)
            : [...user.roles, roleId];
          
          const updatedUser = { ...user, roles: updatedRoles };
          setSelectedUser(updatedUser);
          return updatedUser;
        }
        return user;
      })
    );
  };
  
  const handleSaveChanges = () => {
    // In a real implementation, this would save changes to the backend
    alert('Changes saved successfully!');
  };
  
  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };
  
  const getPermissionName = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };
  
  const getPermissionsByCategory = () => {
    const categories: Record<string, any[]> = {};
    
    permissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    
    return categories;
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
          <Heading level={3}>Role & Permission Management</Heading>
          
          <Flex gap="1rem">
            <Button
              variation={activeTab === 'roles' ? 'primary' : 'link'}
              onClick={() => setActiveTab('roles')}
            >
              Manage Roles
            </Button>
            <Button
              variation={activeTab === 'users' ? 'primary' : 'link'}
              onClick={() => setActiveTab('users')}
            >
              Assign User Roles
            </Button>
          </Flex>
        </Flex>
        
        {error && <Alert variation="error">{error}</Alert>}
        
        {activeTab === 'roles' ? (
          <Grid
            templateColumns={{ base: '1fr', large: '250px 1fr' }}
            gap="1.5rem"
          >
            {/* Role List */}
            <Card>
              <Heading level={5}>Roles</Heading>
              <Divider marginTop="0.5rem" marginBottom="1rem" />
              
              <Flex direction="column" gap="0.5rem">
                {roles.map(role => (
                  <Button
                    key={role.id}
                    variation={selectedRole?.id === role.id ? 'primary' : 'link'}
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role.name}
                  </Button>
                ))}
              </Flex>
              
              <Divider marginTop="1rem" marginBottom="1rem" />
              
              <Button
                onClick={() => {
                  // In a real implementation, this would open a dialog to create a new role
                  alert('Create new role functionality would be implemented here');
                }}
              >
                Create New Role
              </Button>
            </Card>
            
            {/* Role Details & Permissions */}
            <Card>
              {selectedRole ? (
                <Flex direction="column" gap="1rem">
                  <Heading level={4}>{selectedRole.name}</Heading>
                  <Text>{selectedRole.description}</Text>
                  
                  <Divider marginTop="0.5rem" marginBottom="1rem" />
                  
                  <Heading level={5}>Permissions</Heading>
                  <Text>Select the permissions for this role:</Text>
                  
                  {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
                    <View key={category}>
                      <Heading level={6} marginTop="1rem">{category}</Heading>
                      <Grid
                        templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
                        gap="0.5rem"
                        marginTop="0.5rem"
                      >
                        {categoryPermissions.map(permission => (
                          <SwitchField
                            key={permission.id}
                            label={permission.name}
                            labelPosition="end"
                            isChecked={selectedRole.permissions.includes(permission.id)}
                            onChange={() => handleTogglePermission(permission.id)}
                          />
                        ))}
                      </Grid>
                    </View>
                  ))}
                  
                  <Divider marginTop="1rem" marginBottom="1rem" />
                  
                  <Flex justifyContent="flex-end" gap="1rem">
                    <Button
                      onClick={() => {
                        // In a real implementation, this would delete the role
                        if (window.confirm(`Are you sure you want to delete the "${selectedRole.name}" role?`)) {
                          alert(`Role "${selectedRole.name}" would be deleted`);
                        }
                      }}
                      variation="destructive"
                    >
                      Delete Role
                    </Button>
                    <Button onClick={handleSaveChanges} variation="primary">
                      Save Changes
                    </Button>
                  </Flex>
                </Flex>
              ) : (
                <Flex justifyContent="center" alignItems="center" height="300px">
                  <Text>Select a role to view and edit its permissions</Text>
                </Flex>
              )}
            </Card>
          </Grid>
        ) : (
          <Flex direction="column" gap="1.5rem">
            {/* User Search */}
            <Card>
              <Flex 
                direction={{ base: 'column', medium: 'row' }} 
                gap="1rem" 
                justifyContent="space-between"
                alignItems={{ base: 'stretch', medium: 'flex-end' }}
              >
                <TextField
                  label="Search Users"
                  placeholder="Enter name or email"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  flex="1"
                />
                
                <Button
                  variation="link"
                  onClick={() => {
                    setUserSearchQuery('');
                    setFilteredUsers(users);
                  }}
                  gap="0.5rem"
                >
                  Reset
                </Button>
              </Flex>
            </Card>
            
            <Grid
              templateColumns={{ base: '1fr', large: '1fr 300px' }}
              gap="1.5rem"
            >
              {/* User List */}
              <Card>
                <Heading level={5}>Users</Heading>
                <Divider marginTop="0.5rem" marginBottom="1rem" />
                
                <Table highlightOnHover={true}>
                  <TableHead>
                    <TableRow>
                      <TableCell as="th">Name</TableCell>
                      <TableCell as="th">Email</TableCell>
                      <TableCell as="th">Roles</TableCell>
                      <TableCell as="th">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Text textAlign="center">No users found matching the search criteria.</Text>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Flex gap="0.25rem" wrap="wrap">
                              {user.roles.map((roleId: string) => (
                                <Badge key={roleId} variation="info" marginRight="0.25rem" marginBottom="0.25rem">
                                  {getRoleName(roleId)}
                                </Badge>
                              ))}
                            </Flex>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variation={selectedUser?.id === user.id ? 'primary' : 'link'}
                              onClick={() => handleUserSelect(user)}
                            >
                              Edit Roles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
              
              {/* User Role Assignment */}
              <Card>
                {selectedUser ? (
                  <Flex direction="column" gap="1rem">
                    <Heading level={5}>Assign Roles</Heading>
                    <Text>User: {selectedUser.name}</Text>
                    <Text>Email: {selectedUser.email}</Text>
                    
                    <Divider marginTop="0.5rem" marginBottom="1rem" />
                    
                    <Heading level={6}>Available Roles</Heading>
                    <Flex direction="column" gap="0.5rem">
                      {roles.map(role => (
                        <SwitchField
                          key={role.id}
                          label={role.name}
                          labelPosition="end"
                          isChecked={selectedUser.roles.includes(role.id)}
                          onChange={() => handleToggleUserRole(role.id)}
                        />
                      ))}
                    </Flex>
                    
                    <Divider marginTop="1rem" marginBottom="1rem" />
                    
                    <Button onClick={handleSaveChanges} variation="primary">
                      Save Changes
                    </Button>
                  </Flex>
                ) : (
                  <Flex justifyContent="center" alignItems="center" height="300px">
                    <Text>Select a user to assign roles</Text>
                  </Flex>
                )}
              </Card>
            </Grid>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};

export default RoleAssignment; 