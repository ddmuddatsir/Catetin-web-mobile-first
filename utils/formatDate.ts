export const formatDate = (date: string | number | Date) => {
  if (!date) return "Invalid Date";

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(parsedDate.getTime())) return "Invalid Date";

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    weekday: "long",
  };

  return new Intl.DateTimeFormat("id-ID", options).format(parsedDate);
};

export const formatTime = (date: string | number | Date) => {
  if (!date) return "Invalid Time";

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(parsedDate.getTime())) return "Invalid Time";

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Gunakan format 24 jam
  }).format(parsedDate);
};
