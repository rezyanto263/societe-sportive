const IMAGE_MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

export function getImageExtension(url: string) {
  return url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
}

export function getImageMimeType(url: string) {
  return IMAGE_MIME_BY_EXTENSION[getImageExtension(url)];
}
