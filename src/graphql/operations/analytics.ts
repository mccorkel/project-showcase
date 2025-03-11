import { generateClient } from 'aws-amplify/api';

// Track a showcase view
export const trackShowcaseView = /* GraphQL */ `
  mutation TrackShowcaseView($input: TrackShowcaseViewInput!) {
    trackShowcaseView(input: $input) {
      id
      showcaseId
      date
      views {
        total
        unique
      }
    }
  }
`;

// Track a project view
export const trackProjectView = /* GraphQL */ `
  mutation TrackProjectView($input: TrackProjectViewInput!) {
    trackProjectView(input: $input) {
      id
      showcaseId
      projectId
      date
      views
    }
  }
`;

// Get showcase analytics
export const getShowcaseAnalytics = /* GraphQL */ `
  query GetShowcaseAnalytics($showcaseId: ID!, $startDate: String, $endDate: String) {
    getShowcaseAnalytics(showcaseId: $showcaseId, startDate: $startDate, endDate: $endDate) {
      showcaseId
      studentId
      period {
        startDate
        endDate
      }
      summary {
        totalViews
        uniqueVisitors
        averageTimeOnPage
        bounceRate
      }
      viewsByDay {
        date
        count
      }
      projectViews {
        projectId
        projectTitle
        views
        percentage
      }
      referrers {
        source
        count
        percentage
      }
      locations {
        country
        region
        city
        count
        percentage
      }
      devices {
        type
        count
        percentage
      }
    }
  }
`;

// Get cohort analytics (for instructors)
export const getCohortAnalytics = /* GraphQL */ `
  query GetCohortAnalytics($cohortId: ID!, $startDate: String, $endDate: String) {
    getCohortAnalytics(cohortId: $cohortId, startDate: $startDate, endDate: $endDate) {
      cohortId
      period {
        startDate
        endDate
      }
      summary {
        totalStudents
        studentsWithPublishedShowcases
        totalShowcaseViews
        averageViewsPerShowcase
      }
      topShowcases {
        studentId
        studentName
        showcaseId
        views
        ranking
      }
      viewsTrend {
        date
        count
      }
      referrers {
        source
        count
        percentage
      }
      locations {
        country
        count
        percentage
      }
      devices {
        type
        count
        percentage
      }
    }
  }
`;

// Get system-wide analytics (for admins)
export const getSystemAnalytics = /* GraphQL */ `
  query GetSystemAnalytics($startDate: String, $endDate: String) {
    getSystemAnalytics(startDate: $startDate, endDate: $endDate) {
      period {
        startDate
        endDate
      }
      summary {
        totalStudents
        totalShowcases
        publishedShowcases
        totalViews
        averageViewsPerShowcase
      }
      viewsTrend {
        date
        count
      }
      cohortPerformance {
        cohortId
        cohortName
        studentCount
        publishedShowcases
        totalViews
        averageViewsPerShowcase
      }
      topShowcases {
        studentId
        studentName
        cohortId
        cohortName
        showcaseId
        views
      }
      referrers {
        source
        count
        percentage
      }
      locations {
        country
        count
        percentage
      }
      devices {
        type
        count
        percentage
      }
    }
  }
`;

const client = generateClient(); 