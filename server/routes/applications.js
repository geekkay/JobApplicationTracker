const express = require('express');
const { sql, poolPromise } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                a.ApplicationID,
                a.CompanyName,
                a.JobTitle,
                a.DateApplied,
                a.StatusID,
                s.StatusName,
                j.JobType
            FROM Applications a
            INNER JOIN Statuses s
                ON a.StatusID = s.StatusID
            INNER JOIN JobTypes j
                ON a.JobTypeID = j.JobTypeID
            ORDER BY a.DateApplied DESC
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error retrieving applications:', error);

        res.status(500).json({
            error: 'Failed to retrieve applications'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('ApplicationID', sql.Int, req.params.id)
            .query(`
                SELECT
                    a.ApplicationID,
                    a.CompanyName,
                    a.JobTitle,
                    a.Location,
                    a.DateApplied,
                    a.StatusID,
                    s.StatusName,
                    a.JobTypeID,
                    j.JobType,
                    a.Notes,
                    a.CreatedAt,
                    a.UpdatedAt
                FROM Applications a
                INNER JOIN Statuses s
                    ON a.StatusID = s.StatusID
                INNER JOIN JobTypes j
                    ON a.JobTypeID = j.JobTypeID
                WHERE a.ApplicationID = @ApplicationID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                error: 'Application not found'
            });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error retrieving application:', error);

        res.status(500).json({
            error: 'Failed to retrieve application'
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const {
            CompanyName,
            JobTitle,
            Location,
            DateApplied,
            StatusID,
            JobTypeID,
            Notes
        } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('CompanyName', sql.VarChar, CompanyName)
            .input('JobTitle', sql.VarChar, JobTitle)
            .input('Location', sql.VarChar, Location)
            .input('DateApplied', sql.Date, DateApplied)
            .input('StatusID', sql.Int, StatusID)
            .input('JobTypeID', sql.Int, JobTypeID)
            .input('Notes', sql.VarChar, Notes)
            .query(`
                INSERT INTO Applications
                (
                    CompanyName,
                    JobTitle,
                    Location,
                    DateApplied,
                    StatusID,
                    JobTypeID,
                    Notes
                )
                OUTPUT INSERTED.*
                VALUES
                (
                    @CompanyName,
                    @JobTitle,
                    @Location,
                    @DateApplied,
                    @StatusID,
                    @JobTypeID,
                    @Notes
                )
            `);

        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Error creating application:', error);

        res.status(500).json({
            error: 'Failed to create application'
        });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { StatusID } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input('ApplicationID', sql.Int, req.params.id)
            .input('StatusID', sql.Int, StatusID)
            .query(`
                UPDATE Applications
                SET
                    StatusID = @StatusID,
                    UpdatedAt = GETDATE()
                OUTPUT INSERTED.*
                WHERE ApplicationID = @ApplicationID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                error: 'Application not found'
            });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error updating application status:', error);

        res.status(500).json({
            error: 'Failed to update application status'
        });
    }
});

module.exports = router;