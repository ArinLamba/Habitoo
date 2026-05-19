// // hooks/use-month-days.ts

// export const useMonthDays = (currentDate: Date) => {
//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();

//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   return Array.from(
//     { length: daysInMonth },
//     (_, i) => new Date(year, month, i + 1)
//   );
// };