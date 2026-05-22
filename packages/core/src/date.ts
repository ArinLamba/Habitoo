export const formatDate = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const indianFormat = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
};

export const normalize = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const getToday = () => formatDate(new Date());

export const addDays = (dateStr: string, days: number) => {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

export const subDays = (dateStr: string, days: number) => {
  return addDays(dateStr, -days);
};

export const getNextDay = (dateStr: string) => {
  return addDays(dateStr, 1);
};

export const getPrevDay = (dateStr: string) => {
  return addDays(dateStr, -1);
};

export const diffDays = (a: string, b: string) => {
  const d1 = parseLocalDate(a);
  const d2 = parseLocalDate(b);

  const diff = d2.getTime() - d1.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const getIsFuture = (dateStr: string) => {
  return dateStr > getToday();
};

export const getIsPast = (dateStr: string) => {
  return dateStr < getToday();
};

export const getIsSameOrBefore = (a: string, b: string) => {
  return a <= b;
};

export const formatDisplayDate = (dateStr: string) => {
  const d = new Date(`${dateStr}T00:00:00`);

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formattedToday = formatDate(today);
  const formattedYesterday = formatDate(yesterday);

  if (dateStr === formattedToday) {
    return "Today";
  }

  if (dateStr === formattedYesterday) {
    return "Yesterday";
  }

  return d.toLocaleDateString("default", {
    day: "numeric",
    month: "short",
  });
};
