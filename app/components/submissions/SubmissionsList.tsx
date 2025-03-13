import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../../contexts/AuthContext';
import { getSubmissions } from '../../graphql/operations/submissions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const client = generateClient();

interface SubmissionsListProps {
  onSelect?: (id: string) => void;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({ onSelect }) => {
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
    console.log('Fetching submissions with studentProfile:', studentProfile);
    
    if (!studentProfile?.id) {
      console.log('No studentProfile.id available, skipping fetch');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Making GraphQL query with studentProfileId:', studentProfile.id);
      
      const result = await client.graphql({
        query: getSubmissions,
        variables: {
          studentProfileId: studentProfile.id,
          limit: 100
        }
      });
      
      console.log('GraphQL result:', result);
      
      if ('data' in result && result.data.listSubmissions) {
        console.log('Setting submissions:', result.data.listSubmissions.items);
        setSubmissions(result.data.listSubmissions.items);
      } else {
        console.log('No submissions found in result');
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

  // Get status badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'graded':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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

  // Handle viewing submission details
  const handleViewDetails = (id: string) => {
    router.push(`/secure/submissions/${id}/details`);
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
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">My Submissions</h3>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          onClick={handleCreateNew}
        >
          Create New Submission
        </button>
      </div>
      
      {/* Show message if no student profile */}
      {!studentProfile?.id ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Student Profile Not Found</p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to complete your student profile before you can create submissions.
          </p>
          <Link href="/secure/profile">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
              Complete Your Profile
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>
            
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Week</label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={weekFilter}
                onChange={(e) => setWeekFilter(e.target.value)}
              >
                <option value="all">All Weeks</option>
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>Week {i + 1}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, description, or technology"
              />
            </div>
            
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDirection(direction);
                }}
              >
                <option value="updatedAt-desc">Newest First</option>
                <option value="updatedAt-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="week-asc">Week (Ascending)</option>
                <option value="week-desc">Week (Descending)</option>
                <option value="status-asc">Status (A-Z)</option>
                <option value="status-desc">Status (Z-A)</option>
              </select>
            </div>
          </div>
          
          {/* Submissions List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No submissions found</p>
              {submissions.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't created any submissions yet.</p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters to see more results.</p>
              )}
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                onClick={handleCreateNew}
              >
                Create Your First Submission
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSubmissions.map((submission) => (
                <div key={submission.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-0">{submission.title}</h4>
                      <div className="flex items-center">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(submission.status)}`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {submission.description || "No description provided."}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {submission.technologies?.map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium rounded">
                          {tech}
                        </span>
                      ))}
                      {(!submission.technologies || submission.technologies.length === 0) && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">No technologies specified</span>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                        Last updated: {formatDate(submission.updatedAt)}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded transition-colors"
                          onClick={() => handleViewDetails(submission.id)}
                        >
                          View Details
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm font-medium rounded transition-colors"
                          onClick={() => handleEdit(submission.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubmissionsList; 