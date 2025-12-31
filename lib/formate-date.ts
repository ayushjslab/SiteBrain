
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  return d.toLocaleString(undefined, options || defaultOptions);
}
