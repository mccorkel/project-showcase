import { uploadData, getUrl, remove } from 'aws-amplify/storage';

/**
 * Upload a file to S3
 * @param file The file to upload
 * @param path The path to store the file at
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Generate a unique filename
    const extension = file.name.split('.').pop();
    const timestamp = Date.now();
    const filename = `${path}/${timestamp}.${extension}`;

    // Upload the file
    const result = await uploadData({
      key: filename,
      data: file,
      options: {
        contentType: file.type,
        accessLevel: 'protected'
      }
    }).result;

    // Get the URL of the uploaded file
    const urlResult = await getUrl({
      key: filename,
      options: {
        accessLevel: 'protected',
        validateObjectExistence: true
      }
    });

    return urlResult.url.toString();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete a file from S3
 * @param url The URL of the file to delete
 */
export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Extract the key from the URL
    const key = url.split('/').slice(3).join('/');
    
    // Delete the file
    await remove({
      key,
      options: {
        accessLevel: 'protected'
      }
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Upload a profile image
 * @param file The image file to upload
 * @param userId The ID of the user
 * @returns The URL of the uploaded image
 */
export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  return uploadFile(file, `profiles/${userId}`);
};

/**
 * Upload a project image
 * @param file The image file to upload
 * @param submissionId The ID of the submission
 * @returns The URL of the uploaded image
 */
export const uploadProjectImage = async (file: File, submissionId: string): Promise<string> => {
  return uploadFile(file, `submissions/${submissionId}`);
}; 