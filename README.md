# Vacation Planner

This project provides an interface that allows a user to schedule a vacation for the entire team for a year.

## Functional Requirements

The system should allow the user to block vacation days for any user on any working day, as long as the following criteria are met:

- The selected user has unused days.
- At least one other employee of the same discipline is working on that day.
- Scheduled vacation days can be removed, restoring the employee's vacation budget.
- Public holidays should be accounted for and should not use up the vacation budget when vacations are scheduled over it.
  - The list of public holidays comes from [Holiday API](https://holidayapi.com/countries/de/2022).

## Non-functional requirements

- React
- Tailwind CSS
- Unit Testing

## Assumptions/Decisions

- HolidayAPI yields a CORS error when called via fetch.
- HolidayAPI provides a node.js way of doing things, which is incompatible with react/front-end use
- I created a node.js express server (in file `server.js`) to proxy the requests to the HolidayAPI
- even so, I can't access 2022 data since I get `Error: Free accounts are limited to last year's historical data only. Upgrade to premium for access to all holiday data. For more information, please visit https://holidayapi.com/docs`, so we will work with dates in 2021
