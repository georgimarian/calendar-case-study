import { useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { LABELS } from 'utils/constants';
import { ReactComponent as Arrow } from 'assets/arrow.svg';
import { getWorkingDaysBetweenDates } from 'utils/api';

dayjs.extend(isBetween);

const computeVacationFrequencyArray = (
  startDate,
  endDate,
  vacationsOfColleagues
) => {
  const vacationsPerDayArray = new Array(dayjs(endDate).date()).fill(0);

  vacationsOfColleagues.forEach((vacation) => {
    const start = dayjs(startDate).isAfter(vacation.startDate)
      ? dayjs(startDate).date()
      : dayjs(vacation.startDate).date();
    const end = dayjs(endDate).isAfter(vacation.endDate)
      ? dayjs(vacation.endDate).date()
      : dayjs(endDate).date();

    for (let i = start; i < end; i++) {
      vacationsPerDayArray[i] = vacationsPerDayArray[i] + 1;
    }
  });

  console.log(vacationsPerDayArray);

  return vacationsPerDayArray.slice(dayjs(startDate).date());
};

export const checkAvailableColleagues = (
  startDate,
  endDate,
  colleaguesOfSameDiscipline
) => {
  const vacationsOfColleagues = colleaguesOfSameDiscipline
    .map((colleague) =>
      (colleague.vacations || []).filter(
        (vacation) =>
          dayjs(vacation.startDate).isBetween(startDate, endDate, null, '[]') ||
          dayjs(vacation.endDate).isBetween(startDate, endDate, null, '[]') ||
          dayjs(startDate).isBetween(
            vacation.startDate,
            vacation.endDate,
            null,
            '[]'
          ) ||
          dayjs(endDate).isBetween(
            vacation.startDate,
            vacation.endDate,
            null,
            '[]'
          )
      )
    )
    .flat();

  const vacationsPerDayArray = computeVacationFrequencyArray(
    startDate,
    endDate,
    vacationsOfColleagues
  );

  return !vacationsPerDayArray.some(
    (element) => element + 1 === colleaguesOfSameDiscipline.length
  );
};

const VacationPicker = ({ users, currentUser, setCurrentUser }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const buttonBaseClass = classNames({
    'bg-slate-200': !startDate || !endDate,
  });

  const addVacation = async () => {
    const removedDays = await getWorkingDaysBetweenDates(startDate, endDate);
    const colleaguesOfSameDiscipline = users.filter(
      (user) =>
        user.discipline === currentUser.discipline &&
        user.name !== currentUser.name
    );

    const periodAvailable = checkAvailableColleagues(
      startDate,
      endDate,
      colleaguesOfSameDiscipline
    );

    if (periodAvailable && removedDays <= currentUser.vacationBudget) {
      setCurrentUser((prevUser) => ({
        ...prevUser,
        vacationBudget: prevUser.vacationBudget - removedDays,
        vacations: prevUser.vacations
          ? [...prevUser.vacations, { startDate, endDate }]
          : [{ startDate, endDate }],
      }));

      setStartDate('');
      setEndDate('');
    } else if (!periodAvailable) {
      alert('No free Colleagues');
    } else {
      alert("You don't have enough days");
    }
  };

  return (
    <>
      <h3 className='font-bold text-2xl py-3'>{LABELS.bookVacation}</h3>
      <div className='flex justify-between items-center py-4'>
        <div className='flex-1'>
          <label className='font-bold text-xl'>{LABELS.startDate}</label>
          <input
            className='rounded-xl w-full h-11 p-2 bg-slate-100'
            type='date'
            disabled={!currentUser}
            min='2021-01-01'
            max='2021-12-31'
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
            min='2021-01-01'
            max='2021-12-31'
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
    </>
  );
};

export default VacationPicker;
