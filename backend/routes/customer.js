const express = require("express");
const router = express.Router();
const db = require("../koneksi");

// GET total customer
router.get("/total", (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total_customer
        FROM dim_customer
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data[0]);
    });
});

module.exports = router;
