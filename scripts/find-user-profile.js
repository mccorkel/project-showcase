// Script to find a user by Cognito ID and then find the associated student profile
const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');
const fs = require('fs');
const path = require('path');

// Read the Amplify configuration
const amplifyOutputs = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'amplify_outputs.json'), 'utf8')
);

// Configure Amplify
Amplify.configure(amplifyOutputs);

// Create a client for API calls with API key authorization
const client = generateClient({
  authMode: 'apiKey',
  apiKey: amplifyOutputs.data.api_key
});

console.log('Using API key for authorization');

// Query to find a user by Cognito ID
const listUserByCognitoId = /* GraphQL */ `
  query ListUserByCognitoId($cognitoId: String!) {
    listUserByCognitoId(cognitoId: $cognitoId) {
      items {
        id
        cognitoId
        email
        username
        roles
        status
        lastLogin
      }
    }
  }
`;

// Query to list all student profiles
const listStudentProfiles = /* GraphQL */ `
  query ListStudentProfiles {
    listStudentProfiles(limit: 100) {
      items {
        id
        userId
        firstName
        lastName
        title
        contactEmail
      }
    }
  }
`;

// Query to get a student profile by ID
const getStudentProfile = /* GraphQL */ `
  query GetStudentProfile($id: ID!) {
    getStudentProfile(id: $id) {
      id
      userId
      firstName
      lastName
      title
      bio
      profileImageUrl
      location
      education
      experienceYears
      socialLinks
      contactEmail
      skills
      contactInfo
      preferences
      cohortId
      isStaff
      orgName
    }
  }
`;

// Query to list all users
const listUsers = /* GraphQL */ `
  query ListUsers {
    listUsers(limit: 100) {
      items {
        id
        cognitoId
        email
        username
      }
    }
  }
`;

// Main function to find user and profile
async function findUserAndProfile(cognitoId) {
  try {
    console.log(`Looking for user with Cognito ID: ${cognitoId}`);
    
    // Find the user by Cognito ID
    const userResult = await client.graphql({
      query: listUserByCognitoId,
      variables: { cognitoId },
      authMode: 'apiKey'
    });
    
    if (!userResult.data?.listUserByCognitoId?.items?.length) {
      console.log('No user found with this Cognito ID');
      return;
    }
    
    const user = userResult.data.listUserByCognitoId.items[0];
    console.log('User found:', JSON.stringify(user, null, 2));
    
    // Get all student profiles
    console.log('Fetching all student profiles...');
    const profilesResult = await client.graphql({
      query: listStudentProfiles,
      authMode: 'apiKey'
    });
    
    if (!profilesResult.data?.listStudentProfiles?.items?.length) {
      console.log('No student profiles found');
      return;
    }
    
    const profiles = profilesResult.data.listStudentProfiles.items;
    console.log(`Found ${profiles.length} student profiles`);
    
    // Find the profile with matching userId
    const matchingProfile = profiles.find(
      profile => profile.userId === user.id
    );
    
    if (matchingProfile) {
      console.log('Found matching profile by userId:', JSON.stringify(matchingProfile, null, 2));
      
      // Get the full profile details
      const fullProfileResult = await client.graphql({
        query: getStudentProfile,
        variables: { id: matchingProfile.id },
        authMode: 'apiKey'
      });
      
      if (fullProfileResult.data?.getStudentProfile) {
        const fullProfile = fullProfileResult.data.getStudentProfile;
        console.log('Full student profile details:', JSON.stringify(fullProfile, null, 2));
      }
    } else {
      console.log('No student profile found with userId:', user.id);
      
      // Try to find a profile with matching email
      const emailMatchingProfile = profiles.find(
        profile => profile.contactEmail === user.email
      );
      
      if (emailMatchingProfile) {
        console.log('Found matching profile by email:', JSON.stringify(emailMatchingProfile, null, 2));
        
        // Get the full profile details
        const fullProfileResult = await client.graphql({
          query: getStudentProfile,
          variables: { id: emailMatchingProfile.id },
          authMode: 'apiKey'
        });
        
        if (fullProfileResult.data?.getStudentProfile) {
          const fullProfile = fullProfileResult.data.getStudentProfile;
          console.log('Full student profile details:', JSON.stringify(fullProfile, null, 2));
        }
      } else {
        console.log('No student profile found with email:', user.email);
        
        // List all profiles for inspection
        console.log('All student profiles:');
        profiles.forEach((profile, index) => {
          console.log(`Profile ${index + 1}:`, JSON.stringify(profile, null, 2));
        });
        
        // Get all users to see if there's any connection
        console.log('Fetching all users...');
        const usersResult = await client.graphql({
          query: listUsers,
          authMode: 'apiKey'
        });
        
        if (usersResult.data?.listUsers?.items?.length) {
          const users = usersResult.data.listUsers.items;
          console.log(`Found ${users.length} users`);
          
          // Find users with similar email
          const similarEmailUsers = users.filter(u => 
            u.email && user.email && u.email.toLowerCase().includes('mccorkel')
          );
          
          if (similarEmailUsers.length) {
            console.log('Users with similar email:', JSON.stringify(similarEmailUsers, null, 2));
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Error finding user and profile:', error);
  }
}

// Get the Cognito ID from command line arguments
const cognitoId = process.argv[2] || 'a4f8b428-f0b1-70ab-5e39-1e4fb343869e';

// Run the function
findUserAndProfile(cognitoId); 