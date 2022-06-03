import { useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

import { ReactComponent as Arrow } from 'assets/arrow.svg';
import { MOCK_USERS as users } from 'mock-data/users';

import Calendar from './Calendar';
import VacationDisplay from './VacationDisplay';

import { LABELS } from 'utils/constants';
import { getNationalHolidays, getWorkingDaysBetweenDates } from 'utils/api';

const VacationPlanner = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs().subtract(1, 'year'));
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getNationalHolidays(currentDate).then((data) => {
      setPublicHolidays(data);
      setIsLoading(false);
    });
  }, [currentDate]);

  const handleUserChange = (event) =>
    setCurrentUser(JSON.parse(event.target.value));

  const filterPublicHolidays = (holidays) =>
    holidays.filter((holiday) => holiday.public);

  const getUserVacationDaysInMonth = () =>
    currentUser?.vacations?.filter(
      (vacation) =>
        dayjs(vacation.startDate).month() === currentDate.month() ||
        dayjs(vacation.endDate).month() === currentDate.month()
    );
  const legalPublicHolidays = filterPublicHolidays(publicHolidays);

  const buttonBaseClass = classNames({
    'bg-slate-200': !startDate || !endDate,
  });

  const addVacation = async () => {
    currentUser.vacations.push({ startDate, endDate });
    const removedDays = await getWorkingDaysBetweenDates(startDate, endDate);
    currentUser.vacationBudget = currentUser.vacationBudget - removedDays;
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className='w-4/5 p-4 rounded-xl flex flex-col justify-center bg-white'>
      <select
        className='w-full h-11 bg-slate-100 rounded-xl p-px my-1'
        defaultValue={'initial'}
        onChange={handleUserChange}
      >
        <option disabled hidden value='initial'>
          -- select an option --
        </option>

        {users.map((user) => (
          <option className='p-px' key={user.name} value={JSON.stringify(user)}>
            {user.name}
          </option>
        ))}
      </select>
      {currentUser && (
        <div>
          <span className='font-bold text-2xl text-violet-500'>
            {currentUser.vacationBudget}
          </span>
          <span className='text-slate-400'>{LABELS.totalVacationBudget}</span>
        </div>
      )}
      <h3 className='font-bold text-2xl py-3'>{LABELS.bookVacation}</h3>
      <div className='flex justify-between items-center py-4'>
        <div className='flex-1'>
          <label className='font-bold text-xl'>{LABELS.startDate}</label>
          <input
            className='rounded-xl w-full h-11 p-2 bg-slate-100'
            type='date'
            disabled={!currentUser}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <Arrow className='m-4 self-end' />
        <div className='flex-1'>
          <label className='font-bold text-xl'>{LABELS.endDate}</label>
          <input
            className='rounded-xl w-full h-11 p-2 bg-slate-100'
            type='date'
            disabled={!currentUser}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <button
        className={classNames(
          buttonBaseClass,
          'self-end bg-violet-300 rounded-xl p-4 self-end'
        )}
        disabled={!startDate || !endDate}
        onClick={addVacation}
      >
        Add
      </button>

      <h3 className='font-bold text-2xl'>{LABELS.calendar}</h3>
      <div className='py-4'>
        <Calendar
          month={currentDate}
          setMonth={setCurrentDate}
          currentHolidays={legalPublicHolidays}
          currentVacationDays={getUserVacationDaysInMonth()}
        />
      </div>
      <h3 className='font-bold text-2xl'>{LABELS.vacationsAndHolidays}</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <VacationDisplay
          legalPublicHolidays={legalPublicHolidays}
          currentVacationDays={getUserVacationDaysInMonth()}
        />
      )}
    </div>
  );
};

export default VacationPlanner;
