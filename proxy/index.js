const { HolidayAPI } = require('holidayapi');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3001;
const host = process.env.HOST || '127.0.0.1';

const app = express();
app.use(cors());
app.use(express.json());

const holidayApi = new HolidayAPI({ key: process.env.API_KEY });

app.get('/holidays', async (req, res) => {
  res.json(
    await holidayApi.holidays(req.query).then((response) => response.holidays)
  );
});

app.get('/workdays', async (req, res) => {
  res.json(
    await holidayApi.workdays(req.query).then((response) => response.workdays)
  );
});

app.listen(port, host, () => console.log(`listening on ${host}:${port}`));
