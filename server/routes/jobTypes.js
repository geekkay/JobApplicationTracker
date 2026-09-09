const express = require('express');
const { poolPromise } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT JobTypeID, JobType
            FROM JobTypes
            ORDER BY JobTypeID
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error retrieving job types:', error);

        res.status(500).json({
            error: 'Failed to retrieve job types'
        });
    }
});

module.exports = router;