import { useEffect, useState } from 'react';
import classNames from 'classnames';

import { dateFormatter } from 'utils';
import { LABELS } from 'utils/constants';
import { getWorkingDaysBetweenDates } from 'utils/api';

const VacationEntry = ({
  startDate,
  endDate,
  name,
  type,
  currentUser,
  setCurrentUser,
  isRemovable = false,
}) => {
  const [vacationDays, setVacationDays] = useState(0);
  const [loading, setLoading] = useState(false);

  const removeVacation = async () => {
    const workingDays = await getWorkingDaysBetweenDates(startDate, endDate);
    const vacationIndex = currentUser.vacations.findIndex(
      (vacation) => vacation.startDate === startDate
    );
    setCurrentUser((prevUser) => {
      prevUser.vacations.splice(vacationIndex, 1);
      return {
        ...prevUser,
        vacationBudget: prevUser.vacationBudget + workingDays,
        vacations: prevUser.vacations,
      };
    });
  };

  const baseClasses = classNames(
    {
      'bg-violet-500': type === 'legal',
      'bg-violet-400': type === 'personal',
    },
    'flex flex-col my-1 p-2 m-2 rounded-xl text-white'
  );

  useEffect(() => {
    if (endDate) {
      setLoading(true);
      getWorkingDaysBetweenDates(startDate, endDate).then((data) => {
        setVacationDays(data);
        setLoading(false);
      });
    }
  }, [startDate, endDate, setVacationDays]);

  return (
    <div className='flex w-full' key={name}>
      <div className={classNames(baseClasses, 'items-center')}>
        <p className='font-thin	'>
          {dateFormatter(startDate, 'de-DE', {
            month: 'short',
            year: 'numeric',
          })}
        </p>
        <p className='font-bold text-xl'>
          {dateFormatter(startDate, 'de-DE', {
            day: 'numeric',
          })}
        </p>
      </div>
      <div className={classNames(baseClasses, 'flex-1 items-start')}>
        <p className='font-bold text-xl'>
          {loading
            ? `${LABELS.loading}`
            : name || `Vacation (${vacationDays}) days`}
        </p>
        <p className='font-thin	'>
          {!endDate
            ? dateFormatter(startDate, 'default')
            : `${dateFormatter(startDate, 'default')} -
            ${dateFormatter(endDate, 'default')}`}
        </p>
      </div>
      {isRemovable && (
        <button
          className={classNames(baseClasses, 'items-center')}
          onClick={removeVacation}
        >
          {LABELS.remove}
        </button>
      )}
    </div>
  );
};

export default VacationEntry;
