// 🔑 CORE — single source of truth
export const formatDate = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ✅ today
export const getToday = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

// ➕ add days to string date
export const addDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

// ➖ subtract days
export const subDays = (dateStr: string, days: number) => {
  return addDays(dateStr, -days);
};

// 🔄 next day
export const getNextDay = (dateStr: string) => {
  return addDays(dateStr, 1);
};

// 🔄 previous day
export const getPrevDay = (dateStr: string) => {
  return addDays(dateStr, -1);
};

// 📊 difference in days
export const diffDays = (a: string, b: string) => {
  const d1 = new Date(a);
  const d2 = new Date(b);

  const diff = d2.getTime() - d1.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// 🔍 comparisons (string-safe)
export const getIsFuture = (dateStr: string) => {
  return dateStr > getToday();
};

export const getIsPast = (dateStr: string) => {
  return dateStr < getToday();
};

export const getIsSameOrBefore = (a: string, b: string) => {
  return a <= b;
};