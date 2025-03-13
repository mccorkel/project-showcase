import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Loader, 
  Tabs,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  View,
  SearchField,
  SelectField,
  Grid,
  TextField
} from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock data for demonstration purposes
const generateMockCohortData = (cohortId: string) => {
  // Basic cohort info
  const cohortInfo = {
    id: cohortId,
    name: 'Web Development - Spring 2025',
    startDate: '2025-01-15',
    endDate: '2025-06-15',
    studentCount: 24,
    status: 'active',
    description: 'Full-stack web development cohort focusing on React, Node.js, and AWS.',
    currentModule: 'Advanced React Patterns',
    instructors: [
      { id: 'instructor-1', name: 'Dr. Jane Smith', email: 'jane.smith@example.com' },
      { id: 'instructor-2', name: 'Prof. Michael Johnson', email: 'michael.johnson@example.com' }
    ],
    schedule: 'Monday to Friday, 9:00 AM - 5:00 PM',
    location: 'Online / Remote',
    completionRate: 85,
    averageGrade: 87,
    submissionRate: 92
  };
  
  // Students in the cohort
  const students = Array.from({ length: 24 }, (_, i) => ({
    id: `student-${i + 1}`,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@example.com`,
    progress: Math.floor(Math.random() * 100),
    submissionRate: Math.floor(Math.random() * 30) + 70,
    averageGrade: Math.floor(Math.random() * 30) + 70,
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    status: Math.random() > 0.1 ? 'active' : 'inactive'
  }));
  
  // Modules in the cohort
  const modules = [
    { 
      id: 'module-1', 
      name: 'HTML & CSS Fundamentals', 
      startDate: '2025-01-15', 
      endDate: '2025-01-31',
      status: 'completed',
      averageGrade: 88
    },
    { 
      id: 'module-2', 
      name: 'JavaScript Basics', 
      startDate: '2025-02-01', 
      endDate: '2025-02-28',
      status: 'completed',
      averageGrade: 85
    },
    { 
      id: 'module-3', 
      name: 'React Fundamentals', 
      startDate: '2025-03-01', 
      endDate: '2025-03-31',
      status: 'completed',
      averageGrade: 82
    },
    { 
      id: 'module-4', 
      name: 'Advanced React Patterns', 
      startDate: '2025-04-01', 
      endDate: '2025-04-30',
      status: 'in-progress',
      averageGrade: 79
    },
    { 
      id: 'module-5', 
      name: 'Backend Development with Node.js', 
      startDate: '2025-05-01', 
      endDate: '2025-05-31',
      status: 'upcoming',
      averageGrade: null
    },
    { 
      id: 'module-6', 
      name: 'AWS Cloud Services', 
      startDate: '2025-06-01', 
      endDate: '2025-06-15',
      status: 'upcoming',
      averageGrade: null
    }
  ];
  
  // Recent submissions
  const recentSubmissions = Array.from({ length: 10 }, (_, i) => ({
    id: `submission-${i + 1}`,
    studentId: `student-${Math.floor(Math.random() * 24) + 1}`,
    studentName: `Student ${Math.floor(Math.random() * 24) + 1}`,
    moduleId: `module-${Math.floor(Math.random() * 4) + 1}`,
    moduleName: modules[Math.floor(Math.random() * 4)].name,
    submittedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    grade: Math.random() > 0.2 ? Math.floor(Math.random() * 30) + 70 : null,
    status: Math.random() > 0.2 ? 'graded' : 'pending'
  }));
  
  return {
    cohortInfo,
    students,
    modules,
    recentSubmissions
  };
};

interface CohortDetailProps {
  cohortId: string;
}

const CohortDetail: React.FC<CohortDetailProps> = ({ cohortId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cohortData, setCohortData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchCohortData = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, we would fetch data from an API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockData = generateMockCohortData(cohortId);
        setCohortData(mockData);
        setFilteredStudents(mockData.students);
      } catch (error) {
        console.error('Error fetching cohort data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCohortData();
  }, [cohortId]);
  
  useEffect(() => {
    if (!cohortData) return;
    
    // Apply filters to students
    let filtered = cohortData.students;
    
    // Apply search filter
    if (studentSearchQuery) {
      const query = studentSearchQuery.toLowerCase();
      filtered = filtered.filter((student: any) => 
        student.name.toLowerCase().includes(query) || 
        student.email.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (studentStatusFilter !== 'all') {
      filtered = filtered.filter((student: any) => student.status === studentStatusFilter);
    }
    
    setFilteredStudents(filtered);
  }, [studentSearchQuery, studentStatusFilter, cohortData]);
  
  const handleStudentSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentSearchQuery(e.target.value);
  };
  
  const handleStudentStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStudentStatusFilter(e.target.value);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variation="success">Active</Badge>;
      case 'inactive':
        return <Badge variation="error">Inactive</Badge>;
      case 'completed':
        return <Badge variation="info">Completed</Badge>;
      case 'in-progress':
        return <Badge variation="success">In Progress</Badge>;
      case 'upcoming':
        return <Badge variation="warning">Upcoming</Badge>;
      case 'graded':
        return <Badge variation="success">Graded</Badge>;
      case 'pending':
        return <Badge variation="warning">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Flex justifyContent="center" padding="2rem">
        <Loader size="large" />
      </Flex>
    );
  }
  
  if (!cohortData) {
    return (
      <Card>
        <Heading level={3}>Cohort Not Found</Heading>
        <Text>The requested cohort could not be found or you don't have permission to view it.</Text>
        <Button onClick={() => router.push('/secure/instructor/cohorts')} marginTop="1rem">
          Back to Cohorts
        </Button>
      </Card>
    );
  }
  
  const { cohortInfo, students, modules, recentSubmissions } = cohortData;
  
  return (
    <Card>
      <Flex direction="column" gap="1.5rem">
        {/* Cohort Header */}
        <Flex justifyContent="space-between" alignItems="flex-start">
          <div>
            <Heading level={3}>{cohortInfo.name}</Heading>
            <Text>{cohortInfo.description}</Text>
            <Flex gap="0.5rem" marginTop="0.5rem">
              {getStatusBadge(cohortInfo.status)}
              <Text fontSize="0.875rem">
                {formatDate(cohortInfo.startDate)} - {formatDate(cohortInfo.endDate)}
              </Text>
            </Flex>
          </div>
          <Flex gap="0.5rem">
            <Button onClick={() => router.push('/secure/instructor/cohorts')}>
              Back to Cohorts
            </Button>
            <Button variation="primary">
              Edit Cohort
            </Button>
          </Flex>
        </Flex>
        
        {/* Cohort Summary Cards */}
        <Flex wrap="wrap" gap="1rem">
          <Card variation="outlined" padding="1rem" width="180px">
            <Text fontSize="0.875rem" color="gray">Students</Text>
            <Heading level={5}>{cohortInfo.studentCount}</Heading>
          </Card>
          <Card variation="outlined" padding="1rem" width="180px">
            <Text fontSize="0.875rem" color="gray">Completion Rate</Text>
            <Heading level={5}>{cohortInfo.completionRate}%</Heading>
          </Card>
          <Card variation="outlined" padding="1rem" width="180px">
            <Text fontSize="0.875rem" color="gray">Average Grade</Text>
            <Heading level={5}>{cohortInfo.averageGrade}%</Heading>
          </Card>
          <Card variation="outlined" padding="1rem" width="180px">
            <Text fontSize="0.875rem" color="gray">Submission Rate</Text>
            <Heading level={5}>{cohortInfo.submissionRate}%</Heading>
          </Card>
          <Card variation="outlined" padding="1rem" width="180px">
            <Text fontSize="0.875rem" color="gray">Current Module</Text>
            <Heading level={5}>{cohortInfo.currentModule}</Heading>
          </Card>
        </Flex>
        
        {/* Tabs for different sections */}
        <Tabs
          spacing="equal"
          defaultValue="overview"
        >
          <Tabs.Item title="Overview" value="overview">
            <Flex direction="column" gap="1.5rem" marginTop="1rem">
              {/* Cohort Details */}
              <Card>
                <Heading level={4}>Cohort Details</Heading>
                <Divider marginTop="0.5rem" marginBottom="1rem" />
                <Flex direction="column" gap="0.5rem">
                  <Flex>
                    <Text fontWeight="bold" width="150px">Schedule:</Text>
                    <Text>{cohortInfo.schedule}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" width="150px">Location:</Text>
                    <Text>{cohortInfo.location}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" width="150px">Instructors:</Text>
                    <Flex direction="column">
                      {cohortInfo.instructors.map((instructor: any) => (
                        <Text key={instructor.id}>{instructor.name} ({instructor.email})</Text>
                      ))}
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
              
              {/* Module Progress */}
              <Card>
                <Heading level={4}>Module Progress</Heading>
                <Divider marginTop="0.5rem" marginBottom="1rem" />
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell as="th">Module</TableCell>
                      <TableCell as="th">Date Range</TableCell>
                      <TableCell as="th">Status</TableCell>
                      <TableCell as="th">Average Grade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell>{module.name}</TableCell>
                        <TableCell>{formatDate(module.startDate)} - {formatDate(module.endDate)}</TableCell>
                        <TableCell>{getStatusBadge(module.status)}</TableCell>
                        <TableCell>{module.averageGrade ? `${module.averageGrade}%` : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              
              {/* Recent Submissions */}
              <Card>
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading level={4}>Recent Submissions</Heading>
                  <Link href={`/secure/instructor/submissions?cohortId=${cohortId}`} legacyBehavior>
                    <Button size="small">View All Submissions</Button>
                  </Link>
                </Flex>
                <Divider marginTop="0.5rem" marginBottom="1rem" />
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell as="th">Student</TableCell>
                      <TableCell as="th">Module</TableCell>
                      <TableCell as="th">Submitted</TableCell>
                      <TableCell as="th">Status</TableCell>
                      <TableCell as="th">Grade</TableCell>
                      <TableCell as="th">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.studentName}</TableCell>
                        <TableCell>{submission.moduleName}</TableCell>
                        <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>{submission.grade ? `${submission.grade}%` : 'Not graded'}</TableCell>
                        <TableCell>
                          <Link href={`/secure/instructor/submissions/${submission.id}/grade`} legacyBehavior>
                            <Button size="small">
                              {submission.status === 'pending' ? 'Grade' : 'View'}
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Flex>
          </Tabs.Item>
          
          <Tabs.Item title="Students" value="students">
            <Flex direction="column" gap="1.5rem" marginTop="1rem">
              {/* Student Search and Filter */}
              <Card>
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading level={4}>Students</Heading>
                  <Link href={`/secure/instructor/cohorts/${cohortId}/add-students`} legacyBehavior>
                    <Button variation="primary" size="small">Add Students</Button>
                  </Link>
                </Flex>
                <Divider marginTop="0.5rem" marginBottom="1rem" />
                <Flex gap="1rem" marginBottom="1rem">
                  <TextField
                    placeholder="Search students..."
                    value={studentSearchQuery}
                    onChange={handleStudentSearchChange}
                    label="Search"
                    labelHidden
                  />
                  <SelectField
                    placeholder="Filter by status"
                    value={studentStatusFilter}
                    onChange={handleStudentStatusFilterChange}
                    label="Status"
                    labelHidden
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="at-risk">At Risk</option>
                    <option value="inactive">Inactive</option>
                  </SelectField>
                </Flex>
                
                {/* Students Table */}
                <Table highlightOnHover={true}>
                  <TableHead>
                    <TableRow>
                      <TableCell as="th">Name</TableCell>
                      <TableCell as="th">Email</TableCell>
                      <TableCell as="th">Progress</TableCell>
                      <TableCell as="th">Submission Rate</TableCell>
                      <TableCell as="th">Avg. Grade</TableCell>
                      <TableCell as="th">Last Active</TableCell>
                      <TableCell as="th">Status</TableCell>
                      <TableCell as="th">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Flex direction="column" gap="0.25rem">
                            <Text fontSize="0.875rem">{student.progress}%</Text>
                            <ProgressBar
                              value={student.progress}
                              max={100}
                              label={`${student.progress}%`}
                            />
                          </Flex>
                        </TableCell>
                        <TableCell>{student.submissionRate}%</TableCell>
                        <TableCell>{student.averageGrade}%</TableCell>
                        <TableCell>{formatDate(student.lastActive)}</TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell>
                          <Link href={`/secure/instructor/students/${student.id}`} legacyBehavior>
                            <Button size="small">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Flex>
          </Tabs.Item>
          
          <Tabs.Item title="Modules" value="modules">
            <Flex direction="column" gap="1.5rem" marginTop="1rem">
              {/* Modules List */}
              <Card>
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading level={4}>Course Modules</Heading>
                  <Link href={`/secure/instructor/cohorts/${cohortId}/modules/new`} legacyBehavior>
                    <Button variation="primary" size="small">Add Module</Button>
                  </Link>
                </Flex>
                <Divider marginTop="0.5rem" marginBottom="1rem" />
                
                {/* Modules Table */}
                <Table highlightOnHover={true}>
                  <TableHead>
                    <TableRow>
                      <TableCell as="th">Module</TableCell>
                      <TableCell as="th">Start Date</TableCell>
                      <TableCell as="th">End Date</TableCell>
                      <TableCell as="th">Submissions</TableCell>
                      <TableCell as="th">Avg. Grade</TableCell>
                      <TableCell as="th">Status</TableCell>
                      <TableCell as="th">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cohortData?.modules.map((module: any) => (
                      <TableRow key={module.id}>
                        <TableCell>{module.name}</TableCell>
                        <TableCell>{formatDate(module.startDate)}</TableCell>
                        <TableCell>{formatDate(module.endDate)}</TableCell>
                        <TableCell>{module.submissionCount} / {module.totalStudents}</TableCell>
                        <TableCell>{module.averageGrade}%</TableCell>
                        <TableCell>{getStatusBadge(module.status)}</TableCell>
                        <TableCell>
                          <Link href={`/secure/instructor/modules/${module.id}`} legacyBehavior>
                            <Button size="small">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Flex>
          </Tabs.Item>
        </Tabs>
      </Flex>
    </Card>
  );
};

// Add custom TabItem and ProgressBar components
const TabItem: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => {
  return (
    <div className="tab-item">
      <h3>{title}</h3>
      <div className="tab-content">{children}</div>
    </div>
  );
};

const ProgressBar: React.FC<{value: number; max?: number; label?: string}> = ({ 
  value, 
  max = 100, 
  label 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="progress-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="progress-value">{percentage.toFixed(0)}%</div>
    </div>
  );
};

export default CohortDetail; 