import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import isBetween from 'dayjs/plugin/isBetween';

import {
  isHoliday,
  isWeekend,
  isVacationDay,
  dateFormatter,
  buildMonthMatrix,
  getUserVacationDaysInMonth,
  getStartOfMonth,
  getEndOfMonth,
  getDaysInMonth,
} from 'utils';
import { MOCK_HOLIDAYS } from 'mock-data/holidays';
import { USERS } from 'mock-data/testing-data/users';

dayjs.extend(objectSupport);
dayjs.extend(isBetween);

test('Month tests', () => {
  const currentDate = dayjs();
  console.log(currentDate.month());

  console.log(buildMonthMatrix(currentDate.month()));

  const lastMonthDate = dayjs({
    year: currentDate.year(),
    month: currentDate.month() + 1,
  });
  console.log(lastMonthDate);

  console.log(buildMonthMatrix(lastMonthDate.month()));
});

test('Start of Month', () => {
  // Start of DEC 2021 (month 11) is on Wednesday (day 3)
  const startOfDecember = getStartOfMonth(11);
  expect(startOfDecember).toBe(3);
});

test('End of Month', () => {
  // End of DEC 2021 (month 11) is on Friday (day 5)
  const startOfDecember = getEndOfMonth(11);
  expect(startOfDecember).toBe(5);
});

test('Days Month', () => {
  expect(getDaysInMonth(11)).toBe(31);
  expect(getDaysInMonth(10)).toBe(30);
  expect(getDaysInMonth(1)).toBe(28);
});

test('Is weekend', () => {
  // Last day of october 2021 was on a Sunday
  const YEAR = 2021;
  const MONTH = 9;
  expect(
    isWeekend(
      dayjs({ year: YEAR, month: MONTH }).endOf('month').date(),
      dayjs({ year: YEAR, month: MONTH })
    )
  ).toBe(true);
});

test('Is Holiday', () => {
  // January 1 should be a holiday
  const MONTH = 0;
  const DATE = 1;
  const holidaysInMonth = (month) =>
    MOCK_HOLIDAYS.filter((holiday) => dayjs(holiday.date).month() === month);
  expect(isHoliday(DATE, holidaysInMonth(MONTH))).toBe(true);
});

test('Is Vacation Day', () => {
  // January 1 should be a holiday
  const MONTH = 0;
  const DATE = 1;
  const searchUser = (searchedUser) =>
    USERS.filter((user) => user.name === searchedUser);
  const [searchedUser] = searchUser('Georgi');
  const vacationsForUser = searchedUser.vacations;
  expect(
    isVacationDay(
      dayjs(vacationsForUser[0].startDate).date(),
      dayjs(vacationsForUser[0].startDate),
      vacationsForUser
    )
  ).toBe(true);
});

test("Get User's vacations in month", () => {
  // User Georgi has 2 vacations in June
  const MONTH = 5;
  const searchUser = (searchedUser) =>
    USERS.filter((user) => user.name === searchedUser);
  const [searchedUser] = searchUser('Georgi');
  expect(getUserVacationDaysInMonth(searchedUser, MONTH)).toHaveLength(2);
});
