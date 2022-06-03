import { render, screen } from '@testing-library/react';
import { buildMonthMatrix } from 'utils';

test('Month tests', () => {
  const currentDate = new Date();
  console.log(currentDate.getMonth());

  console.log(buildMonthMatrix(currentDate.getMonth()));

  const lastMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1
  );
  console.log(lastMonthDate.getMonth());

  console.log(buildMonthMatrix(lastMonthDate.getMonth()));
});
