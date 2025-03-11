"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Mock data for cohorts
const mockCohorts = [
  {
    id: "cohort-1",
    name: "Web Development Bootcamp - Spring 2023",
    startDate: "2023-01-15",
    endDate: "2023-06-30",
    studentCount: 24,
    activeStudents: 22,
    submissionRate: 92,
    averageGrade: 87,
    status: "active",
    weeks: 24,
    currentWeek: 18
  },
  {
    id: "cohort-2",
    name: "Data Science Fundamentals - Fall 2022",
    startDate: "2022-09-01",
    endDate: "2023-02-28",
    studentCount: 18,
    activeStudents: 16,
    submissionRate: 88,
    averageGrade: 84,
    status: "active",
    weeks: 26,
    currentWeek: 24
  },
  {
    id: "cohort-3",
    name: "UX/UI Design - Winter 2023",
    startDate: "2023-01-10",
    endDate: "2023-04-15",
    studentCount: 20,
    activeStudents: 19,
    submissionRate: 95,
    averageGrade: 91,
    status: "active",
    weeks: 14,
    currentWeek: 10
  },
  {
    id: "cohort-4",
    name: "Mobile App Development - Summer 2022",
    startDate: "2022-06-15",
    endDate: "2022-12-15",
    studentCount: 22,
    activeStudents: 20,
    submissionRate: 90,
    averageGrade: 85,
    status: "completed",
    weeks: 26,
    currentWeek: 26
  },
  {
    id: "cohort-5",
    name: "Cybersecurity Essentials - Spring 2023",
    startDate: "2023-03-01",
    endDate: "2023-08-30",
    studentCount: 16,
    activeStudents: 16,
    submissionRate: 94,
    averageGrade: 88,
    status: "active",
    weeks: 26,
    currentWeek: 8
  }
];

export default function CohortManagementPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate progress percentage
  const calculateProgress = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  // Filter and sort cohorts
  const filteredCohorts = mockCohorts
    .filter(cohort => {
      if (filterStatus !== 'all' && cohort.status !== filterStatus) return false;
      if (searchTerm && !cohort.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'startDate':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'endDate':
          comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
        case 'studentCount':
          comparison = a.studentCount - b.studentCount;
          break;
        case 'submissionRate':
          comparison = a.submissionRate - b.submissionRate;
          break;
        case 'averageGrade':
          comparison = a.averageGrade - b.averageGrade;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Handle sort change
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <ProtectedRoute requiredRoles={['instructor', 'admin']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cohort Management</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Request New Cohort
          </button>
        </div>

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="status-filter"
                  className="border border-gray-300 rounded px-3 py-2 w-full md:w-auto"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
              <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  id="sort-by"
                  className="border border-gray-300 rounded px-3 py-2 w-full md:w-auto"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Cohort Name</option>
                  <option value="startDate">Start Date</option>
                  <option value="endDate">End Date</option>
                  <option value="studentCount">Student Count</option>
                  <option value="submissionRate">Submission Rate</option>
                  <option value="averageGrade">Average Grade</option>
                </select>
              </div>
              <div>
                <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <select
                  id="sort-order"
                  className="border border-gray-300 rounded px-3 py-2 w-full md:w-auto"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <div className="w-full md:w-64">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                id="search"
                placeholder="Search cohorts..."
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Cohorts list */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Cohort Name
                    {sortBy === 'name' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('startDate')}
                  >
                    Duration
                    {sortBy === 'startDate' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('studentCount')}
                  >
                    Students
                    {sortBy === 'studentCount' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('submissionRate')}
                  >
                    Submission Rate
                    {sortBy === 'submissionRate' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('averageGrade')}
                  >
                    Avg. Grade
                    {sortBy === 'averageGrade' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCohorts.map((cohort) => (
                  <tr key={cohort.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/secure/instructor/cohorts/${cohort.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        {cohort.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}</div>
                      <div className="text-sm text-gray-500">Week {cohort.currentWeek} of {cohort.weeks}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{cohort.activeStudents}/{cohort.studentCount} active</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{cohort.submissionRate}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${cohort.submissionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${
                        cohort.averageGrade >= 90 ? 'text-green-600' : 
                        cohort.averageGrade >= 80 ? 'text-blue-600' : 
                        cohort.averageGrade >= 70 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {cohort.averageGrade}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{calculateProgress(cohort.currentWeek, cohort.weeks)}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${calculateProgress(cohort.currentWeek, cohort.weeks)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cohort.status === 'active' ? 'bg-green-100 text-green-800' : 
                        cohort.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/secure/instructor/cohorts/${cohort.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                        <Link href={`/secure/instructor/cohorts/${cohort.id}/students`} className="text-green-600 hover:text-green-900">
                          Students
                        </Link>
                        <Link href={`/secure/instructor/cohorts/${cohort.id}/submissions`} className="text-purple-600 hover:text-purple-900">
                          Submissions
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCohorts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No cohorts found matching your filters.
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 