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

### Additional libraries

- For date manipulation, I used [dayjs](https://day.js.org/).
- For CSS class concatenation, I used [classnames](https://github.com/JedWatson/classnames#readme).
- for Proxy server (see below), I used express (additionally cors and dotenv)

### Holiday API Issues

- HolidayAPI yields a CORS error when called from the browser.
- HolidayAPI provides a node.js way of doing things (installing it as a npm package), which is incompatible with react/front-end use
- I created a node.js express server (found [here](https://github.com/georgimarian/calendar-proxy) in file `index.js`) to proxy the requests to the HolidayAPI
- even so, I can't access 2022 data since it's a paid feature of HolidayAPI. I get `Error: Free accounts are limited to last year's historical data only. Upgrade to premium for access to all holiday data. For more information, please visit https://holidayapi.com/docs`, so I made the decision to work with dates in 2021.
  - the date inputs are restricted to picking dates between Jan 1 and Dec 31 of 2021.
  - the calendar months of 2021 are displayed

### Starting the application

The following commands need to be run in the project root:

```
npm install
npm start
```

The following commands need to be run in the project root of the proxy:

```
npm install
npm start
```

### Deployment

The application is deployed via heroku at https://calendar-case-study.herokuapp.com/
