const express = require("express");
const router = express.Router();
const db = require("../koneksi");

// GET total vendor
router.get("/total", (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total_vendor
        FROM dim_vendor
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data[0]);
    });
});

module.exports = router;
