const express = require("express");
const router = express.Router();
const db = require("../koneksi");

// GET Total Purchase (LineTotal)
router.get("/total", (req, res) => {
    const sql = `SELECT SUM(LineTotal) AS total_purchase FROM fak_purchase`;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data[0]);
    });
});

// GET Purchase pertahun
router.get("/pertahun", (req, res) => {
    const sql = `
        SELECT w.Year, SUM(p.LineTotal) AS total
        FROM fak_purchase p
        JOIN dim_waktu w ON p.DateKey = w.DateKey
        GROUP BY w.Year
        ORDER BY w.Year ASC
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// GET Purchase per bulan berdasarkan tahun (DRILLDOWN)
router.get("/monthly/:year", (req, res) => {
    const year = req.params.year;

    const sql = `
        SELECT w.Month AS month, SUM(p.LineTotal) AS total
        FROM fak_purchase p
        JOIN dim_waktu w ON p.DateKey = w.DateKey
        WHERE w.Year = ?
        GROUP BY w.Month
        ORDER BY w.Month ASC
    `;

    db.query(sql, [year], (err, data) => {
        if (err) return res.status(500).json(err);

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const formatted = data.map(row => ({
            month: monthNames[row.month - 1],
            total: row.total
        }));

        res.json(formatted);
    });
});

// GET Top 5 vendor berdasarkan total purchase
router.get("/top-vendor", (req, res) => {
    const sql = `
        SELECT 
            v.VendorID AS id,
            v.VendorName AS name, 
            SUM(p.LineTotal) AS total
        FROM fak_purchase p
        JOIN dim_vendor v ON p.VendorID = v.VendorID
        GROUP BY v.VendorID, v.VendorName
        ORDER BY total DESC
        LIMIT 5
    `;

    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error Query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(data);
    });
});


// Drilldown: Produk  Vendor
router.get("/vendor/:vendorId/top-product", (req, res) => {
    const vendorId = req.params.vendorId;

    const sql = `
        SELECT 
         p.ProductName AS product,
         SUM(fp.OrderQty) AS qty
         FROM fak_purchase fp
        JOIN dim_produk p ON fp.ProductID = p.ProductID
        WHERE fp.VendorID = ?
        GROUP BY fp.ProductID
        ORDER BY qty DESC
        LIMIT 10
    `;

    db.query(sql, [vendorId], (err, data) => {
        if (err) return res.status(500).json({ error: err });
        res.json(data);
    });
});

module.exports = router;
