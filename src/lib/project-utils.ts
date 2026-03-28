import * as fs from 'node:fs';
import * as path from 'node:path';

export function slugifyProjectName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatProjectDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function normalizeVideoEntry(entry: unknown) {
  if (!Array.isArray(entry)) {
    return null;
  }

  const [src = '', description = '', link = ''] = entry;

  return {
    src: String(src ?? ''),
    description: String(description ?? ''),
    link: String(link ?? ''),
  };
}

export function getYouTubeEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    let videoId = '';

    if (host === 'youtu.be') {
      videoId = url.pathname.replace(/^\//, '');
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v') ?? '';
      } else if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/')[2] ?? '';
      } else if (url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.split('/')[2] ?? '';
      }
    }

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : '';
  } catch {
    return '';
  }
}

export function normalizeGifEntry(entry: unknown) {
  if (Array.isArray(entry)) {
    return String(entry[0] ?? '');
  }

  return String(entry ?? '');
}

export function getProjectGalleryImages(projectName: string) {
  const projectFolder = path.join(process.cwd(), 'public', 'images', 'projects', projectName.toLowerCase());

  if (!fs.existsSync(projectFolder)) {
    return [];
  }

  return fs
    .readdirSync(projectFolder)
    .filter((fileName) => {
      const lower = fileName.toLowerCase();
      return !lower.includes('_small') && !lower.endsWith('.gif') && !lower.endsWith('0.png') && !lower.endsWith('0.jpg') && !lower.endsWith('0.jpeg') && !lower.endsWith('0.webp');
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((fileName) => `/images/projects/${projectName.toLowerCase()}/${fileName}`);
}
