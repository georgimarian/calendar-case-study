const USERS = [
  {
    name: 'Georgi',
    vacationBudget: 18,
    discipline: 'Frontend',
    vacations: [
      { startDate: '2021-04-04', endDate: '2021-04-05' },
      { startDate: '2021-06-01', endDate: '2021-06-03' },
      { startDate: '2021-06-15', endDate: '2021-06-23' },
    ],
  },
  {
    name: 'Angel',
    vacationBudget: 22,
    discipline: 'Frontend',
    vacations: [{ startDate: '2021-06-24', endDate: '2021-06-30' }],
  },
  { name: 'Murat', vacationBudget: 25, discipline: 'Frontend', vacations: [] },
  {
    name: 'Eduard',
    vacationBudget: 25,
    discipline: 'Frontend',
    vacations: [
      { startDate: '2021-06-26', endDate: '2021-06-26' },
      { startDate: '2021-06-21', endDate: '2021-06-23' },
    ],
  },
  { name: 'Dilshod', vacationBudget: 26, discipline: 'Backend' },
  { name: 'Andreas', vacationBudget: 30, discipline: 'Backend' },
];

const currentUser = {
  name: 'Murat',
  vacationBudget: 25,
  discipline: 'Frontend',
  vacations: [],
};

export { USERS, currentUser };
