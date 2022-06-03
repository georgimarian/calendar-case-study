import { LABELS } from 'utils/constants';
import { dateFormatter } from 'utils';
import VacationEntry from './VacationEntry';

const VacationDisplay = ({ legalPublicHolidays, currentVacationDays }) => {
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
          type='personal'
          isRemovable
        />
      ))}
    </div>
  );
};

export default VacationDisplay;
