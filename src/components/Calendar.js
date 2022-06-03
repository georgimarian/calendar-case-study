import { useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

import { dateFormatter, buildMonthMatrix } from 'utils';
import { ReactComponent as ArrowLeft } from 'assets/left.svg';
import { ReactComponent as ArrowRight } from 'assets/right.svg';
import { WEEK_DAYS } from 'utils/constants';

const CalendarHeader = ({ month, setMonth }) => {
  const currentMonthAsString = dateFormatter(month, 'de-DE', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className='flex justify-between'>
      <p className='font-bold text-xl'>{currentMonthAsString}</p>
      <div>
        <button
          className='p-1'
          onClick={() =>
            setMonth((prevMonth) => dayjs(prevMonth).subtract(1, 'month'))
          }
        >
          <ArrowLeft />
        </button>
        <button
          className='p-1'
          onClick={() =>
            setMonth((prevMonth) => dayjs(prevMonth).add(1, 'month'))
          }
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

const Calendar = ({
  month,
  setMonth,
  currentHolidays,
  currentVacationDays,
}) => {
  const [monthMatrix, setMonthMatrix] = useState([]);

  useEffect(() => {
    setMonthMatrix(buildMonthMatrix(month.month()));
  }, [month]);

  const isVacationDay = (day, vacationDays) =>
    vacationDays?.find(
      (vacation) =>
        day !== 0 &&
        day - new Date(vacation.startDate).getDate() >= 0 &&
        new Date(vacation.endDate).getDate() - day >= 0
    );

  const isWeekend = (day) => {
    const date = dayjs(new Date(2021, month.month(), day)).day();
    return date === 0 || date === 6;
  };

  const isHoliday = (day, holidays) =>
    holidays.find((holiday) => dayjs(holiday.date).date() === day);

  return (
    <div className='w-full rounded-xl bg-slate-100 p-2'>
      <CalendarHeader month={month} setMonth={setMonth} />
      <div className='py-4'>
        <div className='flex justify-between'>
          {WEEK_DAYS.map((weekDay) => (
            <div className='py-1 px-2 font-bold w-1/12'>{weekDay}</div>
          ))}
        </div>
        {monthMatrix.map((row) => (
          <div className='flex justify-between py-2'>
            {row.map((day) => {
              const dateClasses = classNames(
                {
                  'bg-violet-300':
                    !isWeekend(day) && isVacationDay(day, currentVacationDays),
                  'bg-violet-500': isHoliday(day, currentHolidays),
                  'rounded-3xl text-white font-bold':
                    isHoliday(day, currentHolidays) ||
                    (!isWeekend(day) &&
                      isVacationDay(day, currentVacationDays)),
                },
                'w-fit p-2'
              );
              return (
                <div className='py-1 w-1/12'>
                  <div className={dateClasses}>{day}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
