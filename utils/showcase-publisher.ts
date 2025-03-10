import { uploadData, getUrl, remove } from 'aws-amplify/storage';

/**
 * Publishes a showcase to the S3 bucket
 * @param username The username for the public URL
 * @param files Object containing HTML, CSS, JS content
 * @param assets Array of asset files (images, etc.)
 * @returns Object with URLs to the published files
 */
export async function publishShowcase(
  username: string,
  files: {
    html: string;
    css: string;
    js: string;
  },
  assets: Array<{
    file: File;
    path: string;
  }> = []
) {
  try {
    // Upload the main files
    const htmlUpload = await uploadData({
      path: `${username}/index.html`,
      data: files.html,
      options: {
        contentType: 'text/html',
      },
    }).result;

    const cssUpload = await uploadData({
      path: `${username}/style.css`,
      data: files.css,
      options: {
        contentType: 'text/css',
      },
    }).result;

    const jsUpload = await uploadData({
      path: `${username}/script.js`,
      data: files.js,
      options: {
        contentType: 'application/javascript',
      },
    }).result;

    // Upload asset files
    const assetUploads = await Promise.all(
      assets.map(async (asset) => {
        const upload = await uploadData({
          path: `${username}/assets/${asset.path}`,
          data: asset.file,
        }).result;
        return {
          path: asset.path,
          key: upload.path,
        };
      })
    );

    // Get the URLs for the files
    const htmlUrl = await getUrl({ 
      path: htmlUpload.path,
      options: {
        validateObjectExistence: true,
      },
    });

    return {
      htmlUrl: htmlUrl.url.toString(),
      username,
      files: {
        html: htmlUpload.path,
        css: cssUpload.path,
        js: jsUpload.path,
      },
      assets: assetUploads,
    };
  } catch (error) {
    console.error('Error publishing showcase:', error);
    throw error;
  }
}

/**
 * Creates a preview of a showcase
 * @param userId The user's ID
 * @param files Object containing HTML, CSS, JS content
 * @param assets Array of asset files (images, etc.)
 * @returns Object with URLs to the preview files
 */
export async function createShowcasePreview(
  userId: string,
  files: {
    html: string;
    css: string;
    js: string;
  },
  assets: Array<{
    file: File;
    path: string;
  }> = []
) {
  try {
    const timestamp = Date.now().toString();
    const previewPath = `previews/${userId}/${timestamp}`;

    // Upload the main files
    const htmlUpload = await uploadData({
      path: `${previewPath}/index.html`,
      data: files.html,
      options: {
        contentType: 'text/html',
      },
    }).result;

    const cssUpload = await uploadData({
      path: `${previewPath}/style.css`,
      data: files.css,
      options: {
        contentType: 'text/css',
      },
    }).result;

    const jsUpload = await uploadData({
      path: `${previewPath}/script.js`,
      data: files.js,
      options: {
        contentType: 'application/javascript',
      },
    }).result;

    // Upload asset files
    const assetUploads = await Promise.all(
      assets.map(async (asset) => {
        const upload = await uploadData({
          path: `${previewPath}/assets/${asset.path}`,
          data: asset.file,
        }).result;
        return {
          path: asset.path,
          key: upload.path,
        };
      })
    );

    // Get the URL for the preview
    const htmlUrl = await getUrl({
      path: htmlUpload.path,
      options: {
        validateObjectExistence: true,
        expiresIn: 86400, // 24 hours
      },
    });

    return {
      previewUrl: htmlUrl.url.toString(),
      timestamp,
      files: {
        html: htmlUpload.path,
        css: cssUpload.path,
        js: jsUpload.path,
      },
      assets: assetUploads,
      expiry: new Date(Date.now() + 86400 * 1000).toISOString(), // 24 hours from now
    };
  } catch (error) {
    console.error('Error creating showcase preview:', error);
    throw error;
  }
}

/**
 * Deletes expired preview files
 * @param userId The user's ID
 * @param timestamp The timestamp of the preview to delete
 */
export async function deleteExpiredPreview(userId: string, timestamp: string) {
  try {
    const previewPath = `previews/${userId}/${timestamp}`;
    
    // Delete the main files
    await remove({
      path: `${previewPath}/index.html`,
    });
    
    await remove({
      path: `${previewPath}/style.css`,
    });
    
    await remove({
      path: `${previewPath}/script.js`,
    });
    
    // Note: In a production environment, you would also delete all asset files
    // This would require listing the directory contents first
    
    console.log(`Deleted expired preview: ${previewPath}`);
  } catch (error) {
    console.error('Error deleting expired preview:', error);
  }
} 