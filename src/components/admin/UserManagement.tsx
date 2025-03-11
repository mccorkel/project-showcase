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
  Modal,
  Tabs
} from '@aws-amplify/ui-react';
import { FiEdit2, FiTrash2, FiUserPlus, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';

// Mock data generator for users
const generateMockUsers = () => {
  const roles = ['admin', 'instructor', 'student'];
  const statuses = ['active', 'inactive', 'pending'];
  
  const users = [];
  
  for (let i = 1; i <= 20; i++) {
    const roleIndex = Math.floor(Math.random() * 3);
    // Admins are rare, make them less common
    const userRoles = roleIndex === 0 ? ['admin', 'instructor'] : [roles[roleIndex]];
    
    users.push({
      id: `user-${i}`,
      cognito_user_id: `us-east-1:${Math.random().toString(36).substring(2, 15)}`,
      email: `user${i}@example.com`,
      username: `user${i}`,
      first_name: `First${i}`,
      last_name: `Last${i}`,
      roles: userRoles,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
      last_login: Math.random() > 0.2 
        ? new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString()
        : null,
      linked_profiles: userRoles.includes('student') 
        ? [{ profile_type: 'student', profile_id: `profile-${i}` }] 
        : userRoles.includes('instructor')
          ? [{ profile_type: 'instructor', profile_id: `instructor-${i}` }]
          : []
    });
  }
  
  return users;
};

interface UserManagementProps {
  // In a real implementation, we might pass in props like onUserSelect
}

const UserManagement: React.FC<UserManagementProps> = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Form state for creating/editing users
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    roles: [] as string[],
    status: 'pending'
  });
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Apply filters when users, searchTerm, roleFilter, or statusFilter changes
  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, roleFilter, statusFilter]);
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const mockUsers = generateMockUsers();
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
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
    
    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => 
        user.roles.includes(roleFilter)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        user.status === statusFilter
      );
    }
    
    setFilteredUsers(filtered);
  };
  
  const handleCreateUser = () => {
    setCurrentUser(null);
    setFormData({
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      roles: [],
      status: 'pending'
    });
    setIsEditing(false);
    setShowModal(true);
    setActiveTab(0);
  };
  
  const handleEditUser = (user: any) => {
    setCurrentUser(user);
    setFormData({
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      roles: [...user.roles],
      status: user.status
    });
    setIsEditing(true);
    setShowModal(true);
    setActiveTab(0);
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        // Remove user from state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        
        // Show success message (in a real app, you might use a toast notification)
        alert('User deleted successfully');
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      }
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };
  
  const handleSaveUser = async () => {
    try {
      // Validate form data
      if (!formData.email || !formData.username || !formData.first_name || !formData.last_name) {
        setError('Please fill in all required fields.');
        return;
      }
      
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (isEditing && currentUser) {
        // Update existing user
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === currentUser.id 
              ? { 
                  ...user, 
                  email: formData.email,
                  username: formData.username,
                  first_name: formData.first_name,
                  last_name: formData.last_name,
                  roles: formData.roles,
                  status: formData.status
                } 
              : user
          )
        );
        
        // Show success message (in a real app, you might use a toast notification)
        alert('User updated successfully');
      } else {
        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          cognito_user_id: `us-east-1:${Math.random().toString(36).substring(2, 15)}`,
          email: formData.email,
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          roles: formData.roles,
          status: formData.status,
          created_at: new Date().toISOString(),
          last_login: null,
          linked_profiles: []
        };
        
        setUsers(prevUsers => [...prevUsers, newUser]);
        
        // Show success message (in a real app, you might use a toast notification)
        alert('User created successfully');
      }
      
      // Close modal
      handleCloseModal();
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user. Please try again.');
    }
  };
  
  const handleRoleToggle = (role: string) => {
    setFormData(prevData => {
      const roles = [...prevData.roles];
      
      if (roles.includes(role)) {
        // Remove role
        return {
          ...prevData,
          roles: roles.filter(r => r !== role)
        };
      } else {
        // Add role
        return {
          ...prevData,
          roles: [...roles, role]
        };
      }
    });
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
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
      case 'inactive':
        return <Badge variation="warning">Inactive</Badge>;
      case 'pending':
        return <Badge variation="info">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getRoleBadges = (roles: string[]) => {
    return roles.map(role => {
      switch (role) {
        case 'admin':
          return <Badge key={role} variation="error" marginRight="0.5rem">Admin</Badge>;
        case 'instructor':
          return <Badge key={role} variation="info" marginRight="0.5rem">Instructor</Badge>;
        case 'student':
          return <Badge key={role} variation="success" marginRight="0.5rem">Student</Badge>;
        default:
          return <Badge key={role} marginRight="0.5rem">{role}</Badge>;
      }
    });
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
          <Heading level={3}>User Management</Heading>
          
          <Button
            variation="primary"
            onClick={handleCreateUser}
            gap="0.5rem"
          >
            <FiUserPlus />
            Create User
          </Button>
        </Flex>
        
        {error && <Alert variation="error">{error}</Alert>}
        
        <Card>
          <Flex 
            direction={{ base: 'column', medium: 'row' }} 
            gap="1rem" 
            justifyContent="space-between"
            alignItems={{ base: 'stretch', medium: 'flex-end' }}
          >
            <TextField
              label="Search Users"
              placeholder="Search by name, email, or username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<FiSearch />}
              flex="1"
            />
            
            <Flex gap="1rem" flex="1">
              <SelectField
                label="Filter by Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                flex="1"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
              </SelectField>
              
              <SelectField
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                flex="1"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </SelectField>
            </Flex>
            
            <Button
              variation="link"
              onClick={fetchUsers}
              gap="0.5rem"
            >
              <FiRefreshCw />
              Refresh
            </Button>
          </Flex>
        </Card>
        
        <Table highlightOnHover={true}>
          <TableHead>
            <TableRow>
              <TableCell as="th">Name</TableCell>
              <TableCell as="th">Email</TableCell>
              <TableCell as="th">Username</TableCell>
              <TableCell as="th">Roles</TableCell>
              <TableCell as="th">Status</TableCell>
              <TableCell as="th">Created</TableCell>
              <TableCell as="th">Last Login</TableCell>
              <TableCell as="th">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Text textAlign="center">No users found matching the current filters.</Text>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{getRoleBadges(user.roles)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>{formatDate(user.last_login)}</TableCell>
                  <TableCell>
                    <Flex gap="0.5rem">
                      <Button
                        size="small"
                        variation="link"
                        onClick={() => handleEditUser(user)}
                      >
                        <FiEdit2 />
                      </Button>
                      <Button
                        size="small"
                        variation="link"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FiTrash2 />
                      </Button>
                    </Flex>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          size="large"
          heading={isEditing ? 'Edit User' : 'Create User'}
        >
          <Tabs
            currentIndex={activeTab}
            onChange={(index) => setActiveTab(index)}
            justifyContent="flex-start"
          >
            <Tabs.Item title="User Information">
              <Flex direction="column" gap="1rem" padding="1rem">
                <Grid
                  templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
                  gap="1rem"
                >
                  <TextField
                    label="Email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  
                  <TextField
                    label="Username"
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                  />
                  
                  <TextField
                    label="First Name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    required
                  />
                  
                  <TextField
                    label="Last Name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    required
                  />
                  
                  <SelectField
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </SelectField>
                </Grid>
                
                <Divider />
                
                <Heading level={5}>User Roles</Heading>
                <Text>Assign one or more roles to this user:</Text>
                
                <Flex direction="column" gap="0.5rem">
                  <SwitchField
                    label="Administrator"
                    labelPosition="end"
                    isChecked={formData.roles.includes('admin')}
                    onChange={() => handleRoleToggle('admin')}
                  />
                  
                  <SwitchField
                    label="Instructor"
                    labelPosition="end"
                    isChecked={formData.roles.includes('instructor')}
                    onChange={() => handleRoleToggle('instructor')}
                  />
                  
                  <SwitchField
                    label="Student"
                    labelPosition="end"
                    isChecked={formData.roles.includes('student')}
                    onChange={() => handleRoleToggle('student')}
                  />
                </Flex>
                
                {formData.roles.length === 0 && (
                  <Alert variation="warning">
                    Please assign at least one role to this user.
                  </Alert>
                )}
              </Flex>
            </Tabs.Item>
            
            {isEditing && (
              <Tabs.Item title="Linked Profiles">
                <Flex direction="column" gap="1rem" padding="1rem">
                  {currentUser?.linked_profiles?.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell as="th">Profile Type</TableCell>
                          <TableCell as="th">Profile ID</TableCell>
                          <TableCell as="th">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentUser.linked_profiles.map((profile: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{profile.profile_type}</TableCell>
                            <TableCell>{profile.profile_id}</TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                variation="link"
                                onClick={() => {
                                  // In a real implementation, this would navigate to the profile
                                  alert(`Navigate to ${profile.profile_type} profile: ${profile.profile_id}`);
                                }}
                              >
                                View Profile
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Text>No profiles linked to this user.</Text>
                  )}
                  
                  <Button
                    variation="primary"
                    onClick={() => {
                      // In a real implementation, this would open a dialog to link a profile
                      alert('Link profile functionality would be implemented here');
                    }}
                  >
                    Link Profile
                  </Button>
                </Flex>
              </Tabs.Item>
            )}
            
            {isEditing && (
              <Tabs.Item title="Activity Log">
                <Flex direction="column" gap="1rem" padding="1rem">
                  <Text>User activity log would be displayed here.</Text>
                  <Text>Created: {formatDate(currentUser?.created_at)}</Text>
                  <Text>Last Login: {formatDate(currentUser?.last_login)}</Text>
                </Flex>
              </Tabs.Item>
            )}
          </Tabs>
          
          <Flex justifyContent="flex-end" gap="1rem" padding="1rem">
            <Button
              variation="link"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            
            <Button
              variation="primary"
              onClick={handleSaveUser}
              isDisabled={formData.roles.length === 0}
            >
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </Flex>
        </Modal>
      </Flex>
    </Card>
  );
};

export default UserManagement; 