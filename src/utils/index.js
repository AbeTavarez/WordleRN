// Copies bi-directional arrays
export const copyBidirectionalArr = (arr) => [...arr.map((row) => [...row])];

// gets current number day of the year
export const getDayOfTheYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};

// get Current year
export const getCurrentYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  return year;
};

export const getDayKey = () =>
  `day-${getDayOfTheYear() + 3}-${getCurrentYear()}`;
