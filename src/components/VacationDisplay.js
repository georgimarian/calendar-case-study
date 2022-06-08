import { dateFormatter, getUserVacationDaysInMonth } from 'utils';
import VacationEntry from './VacationEntry';

const VacationDisplay = ({
  legalPublicHolidays,
  currentUser,
  setCurrentUser,
  month,
}) => {
  return (
    <div className='py-4'>
      {(legalPublicHolidays || []).map((holiday) => (
        <VacationEntry
          startDate={holiday.date}
          key={holiday.name}
          name={holiday.name}
          displayTime={dateFormatter(holiday.date, 'default')}
          type='legal'
        />
      ))}
      {getUserVacationDaysInMonth(currentUser, month).map((holiday) => (
        <VacationEntry
          key={`${dateFormatter(holiday.startDate, 'default')} -
        ${dateFormatter(holiday.endDate, 'default')}`}
          startDate={holiday.startDate}
          endDate={holiday.endDate}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          type='personal'
        />
      ))}
    </div>
  );
};

export default VacationDisplay;
