export default function getInitials(name: string) {
  if (!name) return '';

  // Pisahkan berdasarkan spasi
  const parts = name.trim().split(' ').filter(Boolean);

  // Ambil huruf pertama dari setiap bagian
  const initials = parts.map(part => part[0].toUpperCase());

  // Gabungkan
  return initials.join('');
}
