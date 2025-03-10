import { defineStorage } from '@aws-amplify/backend';

/**
 * Define and configure your storage resources
 * @see https://docs.amplify.aws/nextjs/build-a-backend/storage/set-up-storage/
 */
export const storage = defineStorage({
  name: 'media-bucket',
  access: (allow) => ({
    // User-specific media files
    'media/user/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
      allow.guest.to(['read'])
    ],
    // Public media files
    'media/public/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
  })
});

// Showcase bucket for published showcase files (HTML, CSS, JS)
export const showcaseBucket = defineStorage({
  name: 'showcase-bucket',
  access: (allow) => ({
    // Public access to all published showcases
    'public/{username}/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read'])
    ],
    // User-specific access for publishing
    'users/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
      allow.authenticated.to(['read'])
    ],
  })
});

// Template bucket for showcase template files
export const templateBucket = defineStorage({
  name: 'template-bucket',
  access: (allow) => ({
    // Templates are readable by all authenticated users
    'templates/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
  })
});

// Preview bucket for temporary preview files
export const previewBucket = defineStorage({
  name: 'preview-bucket',
  isDefault: true, // Mark as default bucket
  access: (allow) => ({
    // Preview files are only accessible to the owner
    'previews/user/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    // Temporary preview files with time-limited access - restructured to have entity_id as last part before wildcard
    'previews/shared/timestamp/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      // All authenticated users can read shared previews
      allow.authenticated.to(['read'])
    ],
  })
}); 