const { HolidayAPI } = require('holidayapi');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

const app = express();
app.use(cors());

// const bodyParser = require('body-parser');
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const holidayApi = new HolidayAPI({ key: process.env.REACT_APP_API_KEY });

app.post('/holidays', async (req, res) => {
  const holidays = await holidayApi.holidays(req.body).then((response) => {
    return response.holidays;
  });
  res.json(holidays);
});

app.post('/workdays', async (req, res) => {
  const workdays = await holidayApi.workdays(req.body).then((response) => {
    return response.workdays;
  });
  res.json(workdays);
});

app.listen(port, host, () => console.log(`listening on ${host}:${port}`));
