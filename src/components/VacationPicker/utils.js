import dayjs from 'dayjs';

const computeVacationCount = (startDate, endDate, vacationsOfColleagues) => {
  const frequencyOfVacationsPerDay = {};

  vacationsOfColleagues.forEach((vacation) => {
    const start = dayjs(startDate).isAfter(vacation.startDate)
      ? startDate
      : vacation.startDate;
    const end = dayjs(endDate).isAfter(vacation.endDate)
      ? vacation.endDate
      : endDate;

    for (let i = dayjs(start); i <= dayjs(end); i = i.add(1, 'days')) {
      frequencyOfVacationsPerDay[i] = frequencyOfVacationsPerDay[i]
        ? frequencyOfVacationsPerDay[i] + 1
        : 1;
    }
  });

  return Object.values(frequencyOfVacationsPerDay);
};

const checkConflict = (startDate, endDate, colleaguesOfSameDiscipline) => {
  /*
              [   ]      -> st end
            [   ]
                 [  ]
               []
          [           ]         
  */
  const vacationsOfColleagues = colleaguesOfSameDiscipline
    .map((colleague) =>
      (colleague.vacations || []).filter(
        (vacation) =>
          dayjs(vacation.startDate).isBetween(startDate, endDate, null, '[]') ||
          dayjs(vacation.endDate).isBetween(startDate, endDate, null, '[]') ||
          dayjs(startDate).isBetween(
            vacation.startDate,
            vacation.endDate,
            null,
            '[]'
          ) ||
          dayjs(endDate).isBetween(
            vacation.startDate,
            vacation.endDate,
            null,
            '[]'
          )
      )
    )
    .flat();
  // [[{}], [{}], [{}]] --> [{}, {}, {}]
  const vacationsCountPerDayArray = computeVacationCount(
    startDate,
    endDate,
    vacationsOfColleagues
  );

  return !vacationsCountPerDayArray.includes(colleaguesOfSameDiscipline.length);
};

/**
 * For demo purposes, uses the same conflict checking function as when checking colleagues' vacations
 * However, a separate logic should be kept
 */
const checkPersonalVacations = (startDate, endDate, currentUser) =>
  checkConflict(startDate, endDate, [currentUser]);

export { checkConflict, checkPersonalVacations };
