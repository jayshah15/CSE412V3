const express = require('express')
const port = 5000

const app = express();

const db = require('./db');

app.use(express.json());

const locations = require('./routes/locations')
const vaccination_by_age_groups = require('./routes/vaccination_by_age_group')
const vaccinations_by_manufacturer = require('./routes/vaccinations_by_manufacturer')
const covid_hospitalization = require('./routes/covid_hospitalization')

app.use('/locations', locations)
app.use('/agegroup', vaccination_by_age_groups)
app.use('/manufacturer', vaccinations_by_manufacturer)
app.use('/hospitalization', covid_hospitalization)


app.listen(port,() => 
console.log(`Server running at http://localhost: ${port}`)
);


