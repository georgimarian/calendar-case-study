import { useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { LABELS } from 'utils/constants';
import { ReactComponent as Arrow } from 'assets/arrow.svg';
import { getWorkingDaysBetweenDates } from 'utils/api';
import {
  checkConflict,
  checkPersonalVacations,
} from 'components/VacationPicker/utils';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const VacationPicker = ({ users, currentUser, setCurrentUser }) => {
  const TODAY = dayjs(new Date()).subtract(1, 'year').format('YYYY-MM-DD');

  const [startDate, setStartDate] = useState(TODAY);
  const [endDate, setEndDate] = useState(TODAY);
  const [loading, setLoading] = useState(false);

  const addVacation = async () => {
    setLoading(true);
    const removedDays = await getWorkingDaysBetweenDates(startDate, endDate);
    const colleaguesOfSameDiscipline = users.filter(
      (user) =>
        user.discipline === currentUser.discipline &&
        user.name !== currentUser.name
    );

    const periodAvailable = checkConflict(
      startDate,
      endDate,
      colleaguesOfSameDiscipline
    );

    const userHasSimultaneousVacations = checkPersonalVacations(
      startDate,
      endDate,
      currentUser
    );

    if (removedDays === 0) {
      alert(LABELS.chosenDaysAreHolidays);
    } else if (!userHasSimultaneousVacations) {
      alert(LABELS.youHaveExistingVacation);
    } else if (!periodAvailable) {
      alert(LABELS.noFreeColleagues);
    } else if (removedDays > currentUser.vacationBudget) {
      alert(LABELS.notEnoughDays);
    } else {
      setCurrentUser((prevUser) => ({
        ...prevUser,
        vacationBudget: prevUser.vacationBudget - removedDays,
        vacations: [...(prevUser.vacations || []), { startDate, endDate }],
      }));
    }
    setLoading(false);
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
            onChange={(event) => setStartDate(event.target.value)}
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
        className={
          'self-end bg-violet-300 disabled:bg-slate-200 rounded-xl p-4 self-end text-white font-bold'
        }
        disabled={
          loading || !currentUser || !dayjs(startDate).isSameOrBefore(endDate)
        }
        onClick={addVacation}
      >
        {LABELS.add}
      </button>
    </>
  );
};

export default VacationPicker;
