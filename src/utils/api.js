import { URL } from './constants';
import { dateFormatter } from 'utils';

const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const getNationalHolidays = (currentDate) =>
  fetch(
    `${URL}/holidays?${new URLSearchParams({
      country: 'DE',
      year: '2021',
      month: currentDate.month() + 1,
    })}`,
    {
      method: 'GET',
      headers: HEADERS,
    }
  ).then((response) => response.json());

const getWorkingDaysBetweenDates = (startDate, endDate) =>
  fetch(
    `${URL}/workdays?${new URLSearchParams({
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
    })}`,
    {
      method: 'GET',
      headers: HEADERS,
    }
  ).then((response) => response.json());

export { getNationalHolidays, getWorkingDaysBetweenDates };
