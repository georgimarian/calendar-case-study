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
}) => {
  const [vacationDays, setVacationDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const removeVacation = async () => {
    setIsRemoving(true);
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
    setIsRemoving(false);
  };

  const baseClasses = classNames(
    {
      'bg-violet-500': type === 'personal',
      'bg-violet-400': type === 'legal',
    },
    'flex flex-col my-1 p-2 m-2 rounded-xl text-white'
  );

  useEffect(() => {
    if (type === 'personal') {
      setLoading(true);
      getWorkingDaysBetweenDates(startDate, endDate).then((data) => {
        setVacationDays(data);
        setLoading(false);
      });
    }
  }, [startDate, endDate, type, setVacationDays]);

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
          {dateFormatter(startDate, 'de-DE', { day: 'numeric' })}
        </p>
      </div>
      <div className={classNames(baseClasses, 'flex-1 items-start')}>
        {loading ? (
          `${LABELS.loading}`
        ) : (
          <>
            <p className='font-bold text-xl'>
              {name || `Vacation (${vacationDays}) days`}
            </p>
            <p className='font-thin'>
              {vacationDays <= 1
                ? dateFormatter(startDate, 'default')
                : `${dateFormatter(startDate, 'default')} -
                    ${dateFormatter(endDate, 'default')}`}
            </p>
          </>
        )}
      </div>
      {type === 'personal' && (
        <button
          className={classNames(
            baseClasses,
            'items-center disabled:bg-slate-200'
          )}
          onClick={removeVacation}
          disabled={isRemoving}
        >
          {LABELS.remove}
        </button>
      )}
    </div>
  );
};

export default VacationEntry;
