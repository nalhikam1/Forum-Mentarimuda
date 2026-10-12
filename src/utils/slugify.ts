export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 30) return 'Baru saja';
    if (seconds < 60) return `${seconds} detik lalu`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} hari lalu`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} bulan lalu`;
    
    return `${Math.floor(days / 365)} tahun lalu`;
  } catch {
    return 'Beberapa saat lalu';
  }
}
