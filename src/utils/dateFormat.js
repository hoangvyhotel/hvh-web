export function pad(num, size = 2) {
  return String(num).padStart(size, '0');
}

export function formatToMySQL(input) {
  if (!input) return '';
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';

  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());

  // Display hours:minutes first, then day-month-year as requested (HH:MM DD-MM-YYYY)
  return `${hh}:${mm} ${DD}-${MM}-${YYYY}`;
}

export default formatToMySQL;
