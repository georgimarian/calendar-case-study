import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import isBetween from 'dayjs/plugin/isBetween';

import {
  isHoliday,
  isWeekend,
  isVacationDay,
  buildMonthMatrix,
  getUserVacationDaysInMonth,
  getStartOfMonth,
  getEndOfMonth,
  getDaysInMonth,
} from 'utils';
import { MOCK_HOLIDAYS } from 'mock-data/testing-data/holidays';
import { USERS } from 'mock-data/testing-data/users';

dayjs.extend(objectSupport);
dayjs.extend(isBetween);

test('buildMonthMatrix', () => {
  const currentDate = dayjs();
  const CURRENT_MONTH_STRING =
    '[["","",1,2,3,4,5],[6,7,8,9,10,11,12],[13,14,15,16,17,18,19],[20,21,22,23,24,25,26],[27,28,29,30,"","",""]]';

  expect(JSON.stringify(buildMonthMatrix(currentDate.month()))).toEqual(
    CURRENT_MONTH_STRING
  );
});

test('getStartOfMonth', () => {
  // Start of DEC 2021 (month 11) is on Wednesday (day 3)
  const startOfDecember = getStartOfMonth(11);
  expect(startOfDecember).toBe(3);
});

test('getEndOfMonth', () => {
  // End of DEC 2021 (month 11) is on Friday (day 5)
  const startOfDecember = getEndOfMonth(11);
  expect(startOfDecember).toBe(5);
});

test('getDaysInMonth', () => {
  expect(getDaysInMonth(11)).toBe(31);
  expect(getDaysInMonth(10)).toBe(30);
  expect(getDaysInMonth(1)).toBe(28);
});

test('isWeekend', () => {
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

test('isHoliday', () => {
  // January 1 should be a holiday
  const MONTH = 0;
  const DATE = 1;
  const holidaysInMonth = (month) =>
    MOCK_HOLIDAYS.filter((holiday) => dayjs(holiday.date).month() === month);
  expect(isHoliday(DATE, holidaysInMonth(MONTH))).toBe(true);
});

test('isVacationDay', () => {
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

test('getUserVacationDaysInMonth', () => {
  // User Georgi has 2 vacations in June
  const MONTH = 5;
  const searchUser = (searchedUser) =>
    USERS.filter((user) => user.name === searchedUser);
  const [searchedUser] = searchUser('Georgi');
  expect(getUserVacationDaysInMonth(searchedUser, MONTH)).toHaveLength(2);
});
