import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage, showcaseBucket, templateBucket, previewBucket } from './storage/resource';

/**
 * Define and configure your backend
 * @see https://docs.amplify.aws/gen2/build-a-backend/
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
  showcaseBucket,
  templateBucket,
  previewBucket
});

// Disable self-signup by setting allowAdminCreateUserOnly to true
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true,
};
