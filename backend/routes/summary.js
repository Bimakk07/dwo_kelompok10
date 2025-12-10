const express = require("express");
const router = express.Router();
const db = require("../koneksi");

// GET summary data
router.get("/", (req, res) => {
    const sql = `
        SELECT s.SalesOrderDetailID, c.namalengkap AS customer, p.ProductName, s.TotalDue
        FROM fak_sales s
        JOIN dim_customer c ON s.CustomerID = c.CustomerID
        JOIN dim_produk p ON s.ProductID = p.ProductID
        LIMIT 50
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

module.exports = router;
