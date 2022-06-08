import { useMemo } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

import {
  dateFormatter,
  buildMonthMatrix,
  isHoliday,
  isWeekend,
  isVacationDay,
} from 'utils';

import { ReactComponent as ArrowLeft } from 'assets/left.svg';
import { ReactComponent as ArrowRight } from 'assets/right.svg';
import { LABELS, WEEK_DAYS } from 'utils/constants';

const CalendarHeader = ({ currentStartOfMonth, setCurrentStartOfMonth }) => {
  const currentMonthAsString = dateFormatter(currentStartOfMonth, 'de-DE', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className='flex justify-between'>
      <p className='font-bold text-xl'>{currentMonthAsString}</p>
      <div>
        <button
          className='p-1'
          disabled={dayjs(currentStartOfMonth).month() === 0}
          onClick={() =>
            setCurrentStartOfMonth((prevMonth) =>
              dayjs(prevMonth).subtract(1, 'month')
            )
          }
        >
          <ArrowLeft />
        </button>
        <button
          className='p-1'
          disabled={dayjs(currentStartOfMonth).month() === 11}
          onClick={() =>
            setCurrentStartOfMonth((prevMonth) =>
              dayjs(prevMonth).add(1, 'month')
            )
          }
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

const Calendar = ({
  currentStartOfMonth,
  setCurrentStartOfMonth,
  currentHolidays,
  currentVacationDays,
  loading,
}) => {
  const monthMatrix = useMemo(
    () => buildMonthMatrix(currentStartOfMonth.month()),
    []
  );

  return (
    <div className='relative w-full rounded-xl bg-slate-100 p-2'>
      {loading && (
        <div className='absolute w-full h-full bg-slate-100 opacity-40	font-bold flex flex-col justify-center items-center'>
          {LABELS.loading}
        </div>
      )}
      <CalendarHeader
        currentStartOfMonth={currentStartOfMonth}
        setCurrentStartOfMonth={setCurrentStartOfMonth}
      />
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
                  'bg-violet-500':
                    day !== '' &&
                    !isWeekend(day, currentStartOfMonth) &&
                    isVacationDay(
                      day,
                      currentStartOfMonth,
                      currentVacationDays
                    ),
                  'bg-violet-300': isHoliday(day, currentHolidays),
                  'rounded-full text-white font-bold':
                    isHoliday(day, currentHolidays) ||
                    (!isWeekend(day, currentStartOfMonth) &&
                      isVacationDay(
                        day,
                        currentStartOfMonth,
                        currentVacationDays
                      )),
                },
                'p-2  w-8 h-8 flex items-center justify-center'
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
