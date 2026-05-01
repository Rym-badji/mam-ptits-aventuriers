export function getMediaUrl(path) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `https://mam-backend-oo2g.onrender.com${path}`;
}