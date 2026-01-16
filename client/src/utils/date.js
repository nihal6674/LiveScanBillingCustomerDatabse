export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(-2);

  return `${mm}/${dd}/${yy}`;
};
