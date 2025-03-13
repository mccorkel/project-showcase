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
  SelectField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@aws-amplify/ui-react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CohortStatisticsProps {
  cohortId?: string;
}

interface CohortStats {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalStudents: number;
  activeStudents: number;
  completionRate: number;
  averageGrade: string;
  submissionStats: {
    total: number;
    graded: number;
    pending: number;
    needsRevision: number;
  };
  weeklyProgress: {
    week: number;
    submissionRate: number;
    averageScore: number;
  }[];
  gradeDistribution: {
    grade: string;
    count: number;
  }[];
  topPerformers: {
    studentId: string;
    studentName: string;
    averageGrade: string;
    submissionRate: number;
  }[];
}

// Mock function to fetch cohort statistics
const fetchCohortStatistics = async (cohortId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock data
  const mockCohortStats: CohortStats = {
    id: cohortId,
    name: `Web Development - ${cohortId === 'cohort-1' ? 'Fall 2023' : 'Spring 2023'}`,
    startDate: '2023-09-01',
    endDate: '2023-12-15',
    totalStudents: 25,
    activeStudents: 22,
    completionRate: 0.88,
    averageGrade: 'B+',
    submissionStats: {
      total: 275,
      graded: 230,
      pending: 25,
      needsRevision: 20
    },
    weeklyProgress: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      submissionRate: Math.min(0.95, 0.7 + (i * 0.02)),
      averageScore: Math.min(92, 75 + (i * 1.5))
    })),
    gradeDistribution: [
      { grade: 'A', count: 8 },
      { grade: 'B', count: 10 },
      { grade: 'C', count: 4 },
      { grade: 'D', count: 2 },
      { grade: 'F', count: 1 }
    ],
    topPerformers: Array.from({ length: 5 }, (_, i) => ({
      studentId: `student-${i + 1}`,
      studentName: `Student ${i + 1}`,
      averageGrade: ['A', 'A-', 'B+', 'A', 'A-'][i],
      submissionRate: [1.0, 0.98, 0.95, 0.93, 0.91][i]
    }))
  };
  
  return mockCohortStats;
};

// Mock function to fetch available cohorts
const fetchCohorts = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    { id: 'cohort-1', name: 'Web Development - Fall 2023' },
    { id: 'cohort-2', name: 'Data Science - Spring 2023' },
    { id: 'cohort-3', name: 'UX Design - Summer 2023' }
  ];
};

// Add a custom implementation for the missing ProgressBar component
const ProgressBar = ({ value, max, label, ...props }: any) => {
  const percentage = (value / max) * 100;
  return (
    <div className="progress-container" {...props}>
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="progress-value">{percentage.toFixed(0)}%</div>
    </div>
  );
};

export default function CohortStatistics({ cohortId: initialCohortId }: CohortStatisticsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cohorts, setCohorts] = useState<{ id: string; name: string }[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState(initialCohortId || '');
  const [cohortStats, setCohortStats] = useState<CohortStats | null>(null);
  
  // Fetch available cohorts
  useEffect(() => {
    const loadCohorts = async () => {
      try {
        const data = await fetchCohorts();
        setCohorts(data);
        
        // If no cohort is selected and we have cohorts, select the first one
        if (!selectedCohortId && data.length > 0) {
          setSelectedCohortId(data[0].id);
        }
      } catch (err) {
        console.error('Error loading cohorts:', err);
        setError('Failed to load cohorts. Please try again.');
      }
    };
    
    loadCohorts();
  }, []);
  
  // Fetch cohort statistics when a cohort is selected
  useEffect(() => {
    const loadCohortStats = async () => {
      if (!selectedCohortId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCohortStatistics(selectedCohortId);
        setCohortStats(data);
      } catch (err) {
        console.error('Error loading cohort statistics:', err);
        setError('Failed to load cohort statistics. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCohortStats();
  }, [selectedCohortId]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Prepare chart data for weekly progress
  const weeklyProgressChartData = {
    labels: cohortStats?.weeklyProgress.map(w => `Week ${w.week}`) || [],
    datasets: [
      {
        label: 'Submission Rate (%)',
        data: cohortStats?.weeklyProgress.map(w => w.submissionRate * 100) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Average Score',
        data: cohortStats?.weeklyProgress.map(w => w.averageScore) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Prepare chart data for grade distribution
  const gradeDistributionChartData = {
    labels: cohortStats?.gradeDistribution.map(g => g.grade) || [],
    datasets: [
      {
        label: 'Students',
        data: cohortStats?.gradeDistribution.map(g => g.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  if (isLoading && !cohortStats) {
    return (
      <Card variation="elevated">
        <Flex justifyContent="center" padding="2rem">
          <Loader size="large" />
        </Flex>
      </Card>
    );
  }
  
  if (error && !cohortStats) {
    return (
      <Card variation="elevated">
        <Alert variation="error">{error}</Alert>
      </Card>
    );
  }
  
  return (
    <Card variation="elevated">
      <Flex direction="column" gap="1.5rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={3}>Cohort Statistics Dashboard</Heading>
          
          <SelectField
            label="Select Cohort"
            labelHidden
            name="cohortSelect"
            value={selectedCohortId}
            onChange={(e) => setSelectedCohortId(e.target.value)}
            width="250px"
          >
            <option value="">Select a Cohort</option>
            {cohorts.map(cohort => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))}
          </SelectField>
        </Flex>
        
        {isLoading && (
          <Flex justifyContent="center" padding="2rem">
            <Loader size="large" />
          </Flex>
        )}
        
        {error && <Alert variation="error">{error}</Alert>}
        
        {!isLoading && cohortStats && (
          <>
            <Card>
              <Heading level={4}>{cohortStats.name}</Heading>
              <Text>
                {formatDate(cohortStats.startDate)} - {formatDate(cohortStats.endDate)}
              </Text>
              
              <Grid
                templateColumns={{ base: '1fr', medium: '1fr 1fr', large: '1fr 1fr 1fr 1fr' }}
                gap="1rem"
                marginTop="1rem"
              >
                <Card backgroundColor="rgba(54, 162, 235, 0.1)" padding="1rem">
                  <Heading level={6}>Total Students</Heading>
                  <Text fontSize="1.5rem" fontWeight="bold">{cohortStats.totalStudents}</Text>
                  <Text fontSize="0.875rem">
                    {cohortStats.activeStudents} active ({Math.round(cohortStats.activeStudents / cohortStats.totalStudents * 100)}%)
                  </Text>
                </Card>
                
                <Card backgroundColor="rgba(255, 99, 132, 0.1)" padding="1rem">
                  <Heading level={6}>Completion Rate</Heading>
                  <Text fontSize="1.5rem" fontWeight="bold">{Math.round(cohortStats.completionRate * 100)}%</Text>
                  <ProgressBar
                    value={cohortStats.completionRate * 100}
                    max={100}
                    label="Completion"
                    labelHidden
                  />
                </Card>
                
                <Card backgroundColor="rgba(255, 206, 86, 0.1)" padding="1rem">
                  <Heading level={6}>Average Grade</Heading>
                  <Text fontSize="1.5rem" fontWeight="bold">{cohortStats.averageGrade}</Text>
                  <Text fontSize="0.875rem">Across all submissions</Text>
                </Card>
                
                <Card backgroundColor="rgba(75, 192, 192, 0.1)" padding="1rem">
                  <Heading level={6}>Submissions</Heading>
                  <Text fontSize="1.5rem" fontWeight="bold">{cohortStats.submissionStats.total}</Text>
                  <Text fontSize="0.875rem">
                    {cohortStats.submissionStats.graded} graded ({Math.round(cohortStats.submissionStats.graded / cohortStats.submissionStats.total * 100)}%)
                  </Text>
                </Card>
              </Grid>
            </Card>
            
            <Grid
              templateColumns={{ base: '1fr', large: '1fr 1fr' }}
              gap="1.5rem"
            >
              <Card>
                <Heading level={4}>Weekly Progress</Heading>
                <View height="300px">
                  <Bar 
                    data={weeklyProgressChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </View>
              </Card>
              
              <Card>
                <Heading level={4}>Grade Distribution</Heading>
                <View height="300px">
                  <Pie 
                    data={gradeDistributionChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </View>
              </Card>
            </Grid>
            
            <Card>
              <Heading level={4}>Top Performers</Heading>
              <Table highlightOnHover={true}>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">Student</TableCell>
                    <TableCell as="th">Average Grade</TableCell>
                    <TableCell as="th">Submission Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cohortStats.topPerformers.map(student => (
                    <TableRow key={student.studentId}>
                      <TableCell>{student.studentName}</TableCell>
                      <TableCell>{student.averageGrade}</TableCell>
                      <TableCell>{Math.round(student.submissionRate * 100)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            
            <Card>
              <Heading level={4}>Submission Status</Heading>
              <Grid
                templateColumns={{ base: '1fr', medium: '1fr 1fr', large: '1fr 1fr 1fr' }}
                gap="1rem"
                marginTop="1rem"
              >
                <Card backgroundColor="rgba(54, 162, 235, 0.1)" padding="1rem">
                  <Heading level={6}>Graded</Heading>
                  <Text fontSize="1.5rem" fontWeight="bold">{cohortStats.submissionStats.graded}</Text>
                  <ProgressBar
                    value={cohortStats.submissionStats.graded}
                    max={cohortStats.submissionStats.total}
                    label="Graded"
                    labelHidden
                  />
                </Card>
                
                <Card backgroundColor="rgba(255, 206, 86, 0.1)" padding="1rem">
                  <Heading level={6}>Pending</Heading>
                  <Text fontSize="1.5rem" fontWeight="bold">{cohortStats.submissionStats.pending}</Text>
                  <ProgressBar
                    value={cohortStats.submissionStats.pending}
                    max={cohortStats.submissionStats.total}
                    label="Pending"
                    labelHidden
                  />
                </Card>
                
                <Card backgroundColor="rgba(255, 99, 132, 0.1)" padding="1rem">
                  <Heading level={6}>Needs Revision</Heading>
                  <Text fontSize="1.5rem" fontWeight="bold">{cohortStats.submissionStats.needsRevision}</Text>
                  <ProgressBar
                    value={cohortStats.submissionStats.needsRevision}
                    max={cohortStats.submissionStats.total}
                    label="Needs Revision"
                    labelHidden
                  />
                </Card>
              </Grid>
            </Card>
            
            <Flex justifyContent="flex-end">
              <Button
                variation="primary"
                onClick={() => {
                  // In a real app, this would download a detailed report
                  alert('Downloading detailed cohort report...');
                }}
              >
                Download Detailed Report
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Card>
  );
} 