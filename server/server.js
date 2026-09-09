const express = require('express');
const path = require('path');
const { poolPromise } = require('./db');

const statusesRoutes = require('./routes/statuses');
const jobTypesRoutes = require('./routes/jobTypes');
const applicationsRoutes = require('./routes/applications');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use('/api/statuses', statusesRoutes);
app.use('/api/jobtypes', jobTypesRoutes);
app.use('/api/applications', applicationsRoutes);
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Job Application Tracker API is working!'
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});