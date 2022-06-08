import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';

dayjs.extend(objectSupport);

const YEAR = 2021;
const DAYS_IN_WEEK = 7;

const dateFormatter = (date, country, options = {}) =>
  new Intl.DateTimeFormat(country, options).format(new Date(date));

const getStartOfMonth = (month) =>
  dayjs({ year: YEAR, month: month }).startOf('month').day();
const getEndOfMonth = (month) =>
  dayjs({ year: YEAR, month: month }).endOf('month').day();

const getDaysInMonth = (month) =>
  dayjs({ year: YEAR, month: month }).daysInMonth();

const getNumberOfWeeks = (month) => {
  const startDate = getStartOfMonth(month);
  const endDate = getEndOfMonth(month);
  const daysInMonth = getDaysInMonth(month);

  /**
   * [ '' '' ''  1  2  3  4] --> removed and + 1 at the end
   * [  ....... ]            --> remaining days / days in week
   * [ 26 27 28 29 30 '' ''] --> removed and + 1 at the end
   */
  return (daysInMonth - (6 - startDate + 1) - (endDate + 1)) / DAYS_IN_WEEK + 2;
};

const buildMonthMatrix = (month) => {
  const startDate = getStartOfMonth(month);
  const endDate = getEndOfMonth(month);
  const weeksInMonth = getNumberOfWeeks(month);

  let monthRows = new Array(weeksInMonth)
    .fill('')
    .map((row) => new Array(DAYS_IN_WEEK).fill(''));

  let acc = 1;
  for (let i = startDate; i < DAYS_IN_WEEK; i++) {
    monthRows[0][i] = acc++;
  }
  for (let i = 1; i < weeksInMonth - 1; i++) {
    for (let j = 0; j < DAYS_IN_WEEK; j++) {
      monthRows[i][j] = acc++;
    }
  }
  for (let i = 0; i <= endDate; i++) {
    monthRows[weeksInMonth - 1][i] = acc++;
  }

  return monthRows;
};

const getUserVacationDaysInMonth = (user, month) =>
  (user?.vacations || []).filter(
    (vacation) =>
      dayjs(vacation.startDate).month() === month ||
      dayjs(vacation.endDate).month() === month
  );

const isVacationDay = (day, month, vacationDays) =>
  (vacationDays || []).find(
    (vacation) =>
      day !== 0 &&
      dayjs({ year: YEAR, month: month.month(), day: day }).isBetween(
        vacation.startDate,
        vacation.endDate,
        null,
        '[]'
      )
  ) !== undefined;

const isWeekend = (day, month) => {
  const date = dayjs({ year: YEAR, month: month.month(), day: day }).day();
  return date === 0 || date === 6;
};

const isHoliday = (day, holidays) =>
  holidays.find((holiday) => dayjs(holiday.date).date() === day) !== undefined;

export {
  isHoliday,
  isWeekend,
  isVacationDay,
  dateFormatter,
  buildMonthMatrix,
  getUserVacationDaysInMonth,
  getStartOfMonth,
  getEndOfMonth,
  getDaysInMonth,
};
