/**
 * Image Optimization Utility
 * 
 * This utility provides functions to help with optimizing images
 * to improve performance in the application.
 */

/**
 * Image dimensions
 */
interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Image format options
 */
export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  WEBP = 'webp',
  AVIF = 'avif'
}

/**
 * Image optimization options
 */
export interface ImageOptimizationOptions {
  /**
   * Maximum width of the image
   */
  maxWidth?: number;
  
  /**
   * Maximum height of the image
   */
  maxHeight?: number;
  
  /**
   * Quality of the image (0-100)
   */
  quality?: number;
  
  /**
   * Format of the image
   */
  format?: ImageFormat;
  
  /**
   * Whether to preserve the aspect ratio
   */
  preserveAspectRatio?: boolean;
}

/**
 * Default image optimization options
 */
const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 80,
  format: ImageFormat.WEBP,
  preserveAspectRatio: true
};

/**
 * Get the dimensions of an image
 * 
 * @param file Image file
 * @returns Promise that resolves with the image dimensions
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate the dimensions of an image after resizing
 * 
 * @param originalWidth Original width of the image
 * @param originalHeight Original height of the image
 * @param maxWidth Maximum width of the image
 * @param maxHeight Maximum height of the image
 * @param preserveAspectRatio Whether to preserve the aspect ratio
 * @returns New dimensions of the image
 */
export function calculateResizedDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number = DEFAULT_OPTIONS.maxWidth!,
  maxHeight: number = DEFAULT_OPTIONS.maxHeight!,
  preserveAspectRatio: boolean = DEFAULT_OPTIONS.preserveAspectRatio!
): ImageDimensions {
  if (!preserveAspectRatio) {
    return {
      width: Math.min(originalWidth, maxWidth),
      height: Math.min(originalHeight, maxHeight)
    };
  }
  
  const aspectRatio = originalWidth / originalHeight;
  
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    // No resizing needed
    return {
      width: originalWidth,
      height: originalHeight
    };
  }
  
  if (originalWidth / maxWidth > originalHeight / maxHeight) {
    // Width is the limiting factor
    return {
      width: maxWidth,
      height: Math.round(maxWidth / aspectRatio)
    };
  } else {
    // Height is the limiting factor
    return {
      width: Math.round(maxHeight * aspectRatio),
      height: maxHeight
    };
  }
}

/**
 * Optimize an image
 * 
 * @param file Image file
 * @param options Optimization options
 * @returns Promise that resolves with the optimized image as a Blob
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<Blob> {
  // Merge options with defaults
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Get image dimensions
  const dimensions = await getImageDimensions(file);
  
  // Calculate new dimensions
  const newDimensions = calculateResizedDimensions(
    dimensions.width,
    dimensions.height,
    opts.maxWidth,
    opts.maxHeight,
    opts.preserveAspectRatio
  );
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = newDimensions.width;
  canvas.height = newDimensions.height;
  
  // Draw image on canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // Create image element
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
  
  // Draw image on canvas
  ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);
  
  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      `image/${opts.format}`,
      opts.quality ? opts.quality / 100 : undefined
    );
  });
}

/**
 * Create an object URL for an optimized image
 * 
 * @param file Image file
 * @param options Optimization options
 * @returns Promise that resolves with the object URL
 */
export async function createOptimizedImageUrl(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const blob = await optimizeImage(file, options);
  return URL.createObjectURL(blob);
}

/**
 * Create a data URL for an optimized image
 * 
 * @param file Image file
 * @param options Optimization options
 * @returns Promise that resolves with the data URL
 */
export async function createOptimizedImageDataUrl(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const blob = await optimizeImage(file, options);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate a thumbnail for an image
 * 
 * @param file Image file
 * @param maxSize Maximum size of the thumbnail (width and height)
 * @param quality Quality of the thumbnail (0-100)
 * @returns Promise that resolves with the thumbnail as a Blob
 */
export async function generateThumbnail(
  file: File,
  maxSize: number = 200,
  quality: number = 70
): Promise<Blob> {
  return optimizeImage(file, {
    maxWidth: maxSize,
    maxHeight: maxSize,
    quality,
    format: ImageFormat.WEBP,
    preserveAspectRatio: true
  });
}

/**
 * Check if the browser supports a specific image format
 * 
 * @param format Image format to check
 * @returns Whether the browser supports the format
 */
export function supportsImageFormat(format: ImageFormat): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    const dataUrl = canvas.toDataURL(`image/${format}`);
    return dataUrl.indexOf(`image/${format}`) === 5;
  } catch (e) {
    return false;
  }
}

/**
 * Get the best supported image format for the current browser
 * 
 * @returns The best supported image format
 */
export function getBestSupportedImageFormat(): ImageFormat {
  if (supportsImageFormat(ImageFormat.AVIF)) {
    return ImageFormat.AVIF;
  }
  
  if (supportsImageFormat(ImageFormat.WEBP)) {
    return ImageFormat.WEBP;
  }
  
  return ImageFormat.JPEG;
}

/**
 * Example usage:
 * 
 * // Optimize an image
 * const fileInput = document.querySelector('input[type="file"]');
 * fileInput.addEventListener('change', async (event) => {
 *   const file = event.target.files[0];
 *   
 *   if (file) {
 *     try {
 *       // Generate a thumbnail
 *       const thumbnail = await generateThumbnail(file);
 *       const thumbnailUrl = URL.createObjectURL(thumbnail);
 *       
 *       // Display the thumbnail
 *       const img = document.createElement('img');
 *       img.src = thumbnailUrl;
 *       document.body.appendChild(img);
 *       
 *       // Optimize the full image
 *       const optimizedImage = await optimizeImage(file, {
 *         maxWidth: 800,
 *         quality: 85,
 *         format: getBestSupportedImageFormat()
 *       });
 *       
 *       // Use the optimized image
 *       const optimizedUrl = URL.createObjectURL(optimizedImage);
 *       console.log('Optimized image URL:', optimizedUrl);
 *     } catch (error) {
 *       console.error('Error optimizing image:', error);
 *     }
 *   }
 * });
 */ 