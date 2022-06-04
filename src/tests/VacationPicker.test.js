import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { users, currentUser } from 'mock-data/testing-data/users';
import { checkAvailableColleagues } from 'components/VacationPicker';

dayjs.extend(isBetween);

const colleaguesOfSameDiscipline = users.filter(
  (user) =>
    user.discipline === currentUser.discipline && user.name !== currentUser.name
);

test('Should not be able to schedule', () => {
  const startDate = '2021-06-14';
  const endDate = '2021-06-30';
  const periodAvailable = checkAvailableColleagues(
    startDate,
    endDate,
    colleaguesOfSameDiscipline
  );
  expect(periodAvailable).toEqual(false);
});

test('Should be able to schedule', () => {
  const startDate = '2021-06-28';
  const endDate = '2021-06-30';
  const periodAvailable = checkAvailableColleagues(
    startDate,
    endDate,
    colleaguesOfSameDiscipline
  );
  expect(periodAvailable).toEqual(true);
});
