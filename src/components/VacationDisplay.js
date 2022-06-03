import { useEffect, useState } from 'react';

import { dateFormatter, getUserVacationDaysInMonth } from 'utils';
import VacationEntry from './VacationEntry';

const VacationDisplay = ({
  legalPublicHolidays,
  currentUser,
  setCurrentUser,
  month,
}) => {
  const [currentVacationDays, setCurrentVacationDays] = useState([]);

  useEffect(() => {
    setCurrentVacationDays(getUserVacationDaysInMonth(currentUser, month));
  }, [currentUser, month, setCurrentVacationDays]);

  return (
    <div className='py-4'>
      {legalPublicHolidays.map((holiday) => (
        <VacationEntry
          startDate={holiday.date}
          key={holiday.name}
          name={holiday.name}
          displayTime={dateFormatter(holiday.date, 'default')}
          type='legal'
        />
      ))}
      {currentVacationDays?.map((holiday) => (
        <VacationEntry
          key={`${dateFormatter(holiday.startDate, 'default')} -
        ${dateFormatter(holiday.endDate, 'default')}`}
          startDate={holiday.startDate}
          endDate={holiday.endDate}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          type='personal'
          isRemovable
        />
      ))}
    </div>
  );
};

export default VacationDisplay;
