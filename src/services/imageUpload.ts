/**
 * ImgBB Image Upload Service
 * API Endpoint: https://api.imgbb.com/1/upload
 * Key: Configurable via backend proxy or client fallback
 */

export const IMGBB_API_KEY = 'bfbd887ebc86001dfbbd00f361b65421';
export const IMGBB_UPLOAD_ENDPOINT = 'https://api.imgbb.com/1/upload';

export interface ImageUploadResult {
  success: boolean;
  url: string;
  displayUrl?: string;
  thumbUrl?: string;
  deleteUrl?: string;
  error?: string;
}

export interface UploadProgressCallback {
  (percentage: number): void;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
];

const MAX_FILE_SIZE_BYTES = 16 * 1024 * 1024; // 16 MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const mime = file.type.toLowerCase();
  const isExtensionValid = /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.name);

  if (!ALLOWED_MIME_TYPES.includes(mime) && !isExtensionValid) {
    return {
      valid: false,
      error: `Invalid image type (${file.type || 'unknown'}). Supported formats: JPG, PNG, WEBP, GIF, AVIF.`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum allowed size is 16 MB.`
    };
  }

  return { valid: true };
}

/**
 * Upload an image file to ImgBB
 * Tries server-side proxy first (for security & avoiding client blocks),
 * falls back to direct browser upload for static hosting.
 */
export async function uploadImageToImgBB(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<ImageUploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, url: '', error: validation.error };
  }

  // 1. Try server-side proxy endpoints first (prevents exposing key & avoids Cloudflare blocks)
  try {
    const serverResult = await uploadViaServerProxy(file, onProgress);
    if (serverResult.success) {
      return serverResult;
    }
  } catch (proxyErr) {
    console.warn('Server proxy upload not available, attempting direct ImgBB upload...', proxyErr);
  }

  // 2. Direct browser upload to ImgBB
  return uploadDirectToImgBB(file, onProgress);
}

/**
 * Attempt upload via Node/Express proxy or Hostinger PHP endpoint
 */
async function uploadViaServerProxy(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<ImageUploadResult> {
  const formData = new FormData();
  formData.append('image', file);

  // Try /api/upload/imgbb (Express backend) or /api/upload.php (Hostinger Apache/Nginx PHP)
  const endpoint = '/api/upload/imgbb';

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.url) {
            resolve({
              success: true,
              url: res.url,
              displayUrl: res.displayUrl || res.url,
              thumbUrl: res.thumbUrl,
              deleteUrl: res.deleteUrl
            });
            return;
          }
        } catch {
          // not JSON, fallback
        }
      }
      reject(new Error(`Server proxy returned ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error('Network error calling server proxy'));
    xhr.send(formData);
  });
}

/**
 * Direct browser upload to ImgBB API
 */
export async function uploadDirectToImgBB(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<ImageUploadResult> {
  const formData = new FormData();
  formData.append('image', file);

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    // Pass API key via query parameter as per ImgBB official API docs
    xhr.open('POST', `${IMGBB_UPLOAD_ENDPOINT}?key=${IMGBB_API_KEY}`);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.success && response.data) {
          const directUrl = response.data.url || response.data.display_url;
          resolve({
            success: true,
            url: directUrl,
            displayUrl: response.data.display_url,
            thumbUrl: response.data.thumb?.url,
            deleteUrl: response.data.delete_url
          });
        } else {
          const errorMsg =
            response.error?.message ||
            response.status_txt ||
            'ImgBB upload failed with an unknown error.';
          resolve({
            success: false,
            url: '',
            error: `ImgBB Error: ${errorMsg}`
          });
        }
      } catch (err) {
        resolve({
          success: false,
          url: '',
          error: `Failed to parse ImgBB response (${xhr.status} ${xhr.statusText})`
        });
      }
    };

    xhr.onerror = () => {
      resolve({
        success: false,
        url: '',
        error: 'Network connection failed while uploading image to ImgBB.'
      });
    };

    xhr.send(formData);
  });
}
