import { URL } from './constants';
import { dateFormatter } from 'utils';

const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const getNationalHolidays = (currentDate) =>
  fetch(`${URL}/holidays`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      country: 'DE',
      year: '2021',
      month: currentDate.getMonth() + 1,
    }),
  }).then((response) => response.json());

const getWorkingDaysBetweenDates = (startDate, endDate) =>
  fetch(`${URL}/workdays`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      country: 'DE',
      start: dateFormatter(startDate, 'fr-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      end: dateFormatter(endDate, 'fr-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    }),
  }).then((response) => response.json());

export { getNationalHolidays, getWorkingDaysBetweenDates };
