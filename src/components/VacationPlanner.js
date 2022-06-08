import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { MOCK_USERS } from 'mock-data/users';
import { LABELS } from 'utils/constants';
import { getUserVacationDaysInMonth } from 'utils';
import { getNationalHolidays } from 'utils/api';

import Calendar from './Calendar';
import VacationDisplay from './VacationDisplay';
import VacationPicker from './VacationPicker';

const VacationPlanner = () => {
  const [users, setUsers] = useState(
    localStorage.getItem('users')
      ? JSON.parse(localStorage.getItem('users'))
      : MOCK_USERS
  );
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser'))
      : null
  );
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [currentStartOfMonth, setCurrentStartOfMonth] = useState(
    dayjs().subtract(1, 'year').startOf('month')
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      setUsers((previousUsers) => {
        const users = [...previousUsers];
        const changedUserIndex = users.findIndex(
          (user) => user.name === currentUser.name
        );
        users.splice(changedUserIndex, 1, currentUser);
        return users;
      });
    }
  }, [currentUser, setUsers]);

  useEffect(() => {
    setLoading(true);
    getNationalHolidays(currentStartOfMonth).then((data) => {
      setPublicHolidays(data);
      setLoading(false);
    });
  }, [currentStartOfMonth, setPublicHolidays, setLoading]);

  const handleUserChange = (event) =>
    setCurrentUser(JSON.parse(event.target.value));

  const legalPublicHolidays = publicHolidays.filter(
    (holiday) => holiday.public
  );

  return (
    <div className='w-full	p-4 rounded-xl flex flex-col justify-center bg-white'>
      <select
        className='w-full h-11 bg-slate-100 rounded-xl p-px my-1'
        value={currentUser ? JSON.stringify(currentUser) : 'initial'}
        onChange={handleUserChange}
      >
        <option disabled hidden value='initial'>
          {LABELS.defaultSelect}
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
      <VacationPicker
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      <h3 className='font-bold text-2xl'>{LABELS.calendar}</h3>
      <div className='py-4'>
        <Calendar
          currentStartOfMonth={currentStartOfMonth}
          setCurrentStartOfMonth={setCurrentStartOfMonth}
          currentHolidays={legalPublicHolidays}
          currentVacationDays={getUserVacationDaysInMonth(
            currentUser,
            currentStartOfMonth.month()
          )}
          loading={loading}
        />
      </div>
      <h3 className='font-bold text-2xl'>{LABELS.vacationsAndHolidays}</h3>
      {loading ? (
        <p>{LABELS.loading}</p>
      ) : (
        <VacationDisplay
          legalPublicHolidays={legalPublicHolidays}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          month={currentStartOfMonth.month()}
        />
      )}
    </div>
  );
};

export default VacationPlanner;
