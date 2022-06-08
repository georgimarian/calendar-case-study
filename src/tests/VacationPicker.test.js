import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { USERS, currentUser } from 'mock-data/testing-data/users';
import { checkConflict } from 'components/VacationPicker/utils';

dayjs.extend(isBetween);

const colleaguesOfSameDiscipline = USERS.filter(
  (user) =>
    user.discipline === currentUser.discipline && user.name !== currentUser.name
);

test('Should not be able to schedule', () => {
  const startDate = '2021-06-14';
  const endDate = '2021-06-16';
  const periodAvailable = checkConflict(
    startDate,
    endDate,
    colleaguesOfSameDiscipline
  );
  expect(periodAvailable).toEqual(true);
});

test('Should be able to schedule', () => {
  const startDate = '2021-06-21';
  const endDate = '2021-06-23';
  const periodAvailable = checkConflict(
    startDate,
    endDate,
    colleaguesOfSameDiscipline
  );
  expect(periodAvailable).toEqual(false);
});
