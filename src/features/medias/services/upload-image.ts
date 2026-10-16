import { createSignature } from '@/features/medias/actions/create-signature';
import type {
  CloudinaryImage,
  CloudinaryUploadResponse,
} from '@/types/cloudinary';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'] as const;

function validateImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    throw new Error('Format gambar harus JPG, JPEG, atau PNG.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Ukuran gambar maksimal 5 MB.');
  }
}

export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal,
): Promise<CloudinaryImage> {
  validateImage(file);

  signal?.throwIfAborted();

  const res = await createSignature({
    folder: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER!,
    upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_UPLOAD_PRESET!,
  });

  if (!res.success) throw new Error(res.message);

  signal?.throwIfAborted();

  const formData = new FormData();

  formData.append('file', file);
  formData.append('api_key', res.data.apiKey);
  formData.append('timestamp', String(res.data.timestamp));
  formData.append('signature', res.data.signature);
  formData.append('upload_preset', res.data.upload_preset);
  formData.append('folder', res.data.folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const cleanup = () => {
      signal?.removeEventListener('abort', handleAbort);
      xhr.upload.onprogress = null;
      xhr.onerror = null;
      xhr.onabort = null;
      xhr.onload = null;
    };

    const handleAbort = () => {
      xhr.abort();
    };

    signal?.addEventListener('abort', handleAbort, { once: true });

    xhr.onload = () => {
      cleanup();

      let result: CloudinaryUploadResponse;

      try {
        result = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
      } catch {
        reject(new Error('Respons dari Cloudinary tidak valid.'));
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error('Gagal mengunggah gambar ke Cloudinary.'));
        return;
      }

      resolve({
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      });
    };

    xhr.onerror = () => {
      cleanup();
      reject(new Error('Koneksi gagal saat mengunggah gambar.'));
    };

    xhr.onabort = () => {
      cleanup();
      reject(
        signal?.reason ??
          new DOMException('Unggah gambar dibatalkan.', 'AbortError'),
      );
    };

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    };

    if (signal?.aborted) {
      handleAbort();
      return;
    }

    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${res.data.cloudName}/image/upload`,
    );

    xhr.send(formData);
  });
}
