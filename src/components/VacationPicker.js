import { useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

import { LABELS } from 'utils/constants';
import { ReactComponent as Arrow } from 'assets/arrow.svg';
import { getWorkingDaysBetweenDates } from 'utils/api';

import isBetween from 'dayjs/plugin/isBetween';

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

    const isFree = (colleague) => {
      const vacations = (colleague.vacations || []).filter((vacation) => {
        dayjs.extend(isBetween);

        return (
          dayjs(vacation.startDate).isBetween(
            dayjs(startDate),
            dayjs(endDate)
          ) ||
          dayjs(vacation.endDate).isBetween(dayjs(startDate), dayjs(endDate)) ||
          dayjs(startDate).isBetween(
            dayjs(vacation.startDate),
            dayjs(vacation.endDate)
          ) ||
          dayjs(endDate).isBetween(
            dayjs(vacation.startDate),
            dayjs(vacation.endDate)
          )
        );
      });

      return vacations.length === 0;
    };

    const freeColleagues = colleaguesOfSameDiscipline.some((colleague) =>
      isFree(colleague)
    );

    if (freeColleagues && removedDays <= currentUser.vacationBudget) {
      setCurrentUser((prevUser) => ({
        ...prevUser,
        vacationBudget: prevUser.vacationBudget - removedDays,
        vacations: prevUser.vacations
          ? [...prevUser.vacations, { startDate, endDate }]
          : [{ startDate, endDate }],
      }));

      setStartDate('');
      setEndDate('');
    } else if (!freeColleagues) {
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
