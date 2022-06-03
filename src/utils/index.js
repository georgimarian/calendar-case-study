const dateFormatter = (date, country, options = {}) =>
  new Intl.DateTimeFormat(country, options).format(new Date(date));

const getStartOfMonth = (month) => new Date(2022, month, 1).getDay();
const getEndOfMonth = (month) =>
  new Date(new Date(2022, month + 1, 1).getTime() - 1).getDay();

const getDaysInMonth = (month) => new Date(2022, month + 1, 0).getDate();

const getNumberOfWeeks = (month) => {
  const startDate = getStartOfMonth(month);
  const endDate = getEndOfMonth(month);
  const daysInMonth = getDaysInMonth(month);

  return (daysInMonth - (6 - startDate + 1) - (endDate + 1)) / 7 + 2;
};

const buildMonthMatrix = (month) => {
  const startDate = getStartOfMonth(month);
  const endDate = getEndOfMonth(month);
  const weeksInMonth = getNumberOfWeeks(month);

  let monthRows = new Array(weeksInMonth).fill('');
  monthRows = monthRows.map((row) => new Array(7).fill(''));

  let acc = 1;
  for (let i = startDate; i <= 6; i++) {
    monthRows[0][i] = acc++;
  }
  for (let i = 1; i < weeksInMonth - 1; i++) {
    for (let j = 0; j <= 6; j++) {
      monthRows[i][j] = acc++;
    }
  }
  for (let i = 0; i <= endDate; i++) {
    monthRows[weeksInMonth - 1][i] = acc++;
  }

  return monthRows;
};

export { dateFormatter, buildMonthMatrix };
