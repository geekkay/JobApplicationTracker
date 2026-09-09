const express = require('express');
const { poolPromise } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT StatusID, StatusName
            FROM Statuses
            ORDER BY StatusID
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error retrieving statuses:', error);

        res.status(500).json({
            error: 'Failed to retrieve statuses'
        });
    }
});

module.exports = router;