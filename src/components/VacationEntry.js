import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { dateFormatter } from 'utils';
import { LABELS } from 'utils/constants';
import { getWorkingDaysBetweenDates } from 'utils/api';

const VacationEntry = ({
  startDate,
  endDate,
  name,
  displayTime,
  type,
  isRemovable = false,
}) => {
  const [vacationDays, setVacationDays] = useState(0);

  const baseClasses = classNames(
    {
      'bg-violet-500': type === 'legal',
      'bg-violet-400': type === 'personal',
    },
    'flex flex-col my-1 p-2 m-2 rounded-xl text-white'
  );

  useEffect(() => {
    if (endDate) {
      getWorkingDaysBetweenDates(startDate, endDate).then(setVacationDays);
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
          {name || `Vacation (${vacationDays}) days`}
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
          onClick={() => alert('anularea')}
        >
          {LABELS.remove}
        </button>
      )}
    </div>
  );
};

export default VacationEntry;
