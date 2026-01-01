
export const getCurrentISODate = () => new Date().toISOString();

export const formatDate = (iso: string | null) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};
