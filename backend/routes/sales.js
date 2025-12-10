// routes/sales.js
const express = require("express");
const router = express.Router();
const db = require("../koneksi");

// GET Total Sales
router.get("/total", (req, res) => {
    const sql = `
        SELECT SUM(TotalDue) AS total_sales
        FROM fak_sales
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data[0]);
    });
});

// GET Sales per bulan
router.get("/pertahun", (req, res) => {
    const sql = `
        SELECT w.Year, SUM(s.TotalDue) AS total
        FROM fak_sales s
        JOIN dim_waktu w ON s.DateKey = w.DateKey
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
        SELECT 
            w.Month AS month,
            SUM(s.TotalDue) AS total
        FROM fak_sales s
        JOIN dim_waktu w ON s.DateKey = w.DateKey
        WHERE w.Year = ?
        GROUP BY w.Month
        ORDER BY w.Month ASC
    `;

    db.query(sql, [year], (err, data) => {
        if (err) return res.status(500).json(err);

        // Convert month number → month name
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



// GET top customer
router.get("/top-customer", (req, res) => {
    const sql = `
        SELECT 
    c.CustomerID AS customer_id,
    c.NamaLengkap AS customer,
    SUM(f.TotalDue) AS total
    FROM fak_sales f
    JOIN dim_customer c ON f.CustomerID = c.CustomerID
    GROUP BY c.CustomerID, c.NamaLengkap
    ORDER BY total DESC
        LIMIT 5
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});


// DRILLDOWN: Produk yang dibeli oleh salah satu dari TOP 5 customer
router.get("/customer/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
      SELECT 
          p.ProductName AS product,
          SUM(s.OrderQty) AS qty,
          SUM(s.LineTotal) AS total
      FROM fak_sales s
      JOIN dim_produk p ON s.ProductID = p.ProductID
      WHERE s.CustomerID = ?
        AND s.CustomerID IN (
            SELECT CustomerID 
            FROM (
                SELECT CustomerID
                FROM fak_sales
                GROUP BY CustomerID
                ORDER BY SUM(LineTotal) DESC
                LIMIT 5
            ) AS top5
        )
      GROUP BY p.ProductID, p.ProductName
      ORDER BY total DESC;
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// GET sales berdasarkan territory
router.get("/territory", (req, res) => {
    const sql = `
        SELECT t.Name AS territory, SUM(s.LineTotal) AS total
        FROM fak_sales s
        JOIN dim_salesteritori t ON s.TerritoryID = t.TerritoryID
        GROUP BY t.Name
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// GET Top 5 Product
router.get("/top-product", (req, res) => {
    const sql = `
        SELECT p.ProductName, SUM(s.LineTotal) AS total
        FROM fak_sales s
        JOIN dim_produk p ON s.ProductID = p.ProductID
        GROUP BY p.ProductName
        ORDER BY total DESC
        LIMIT 5
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// GET Total Produk dari Master (dim_produk)
router.get("/total-product", (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total_product
        FROM dim_produk
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data[0]);
    });
});

// DRILLDOWN: Jumlah produk yang terbeli per bulan
router.get("/product/:productName/monthly", (req, res) => {
    const productName = req.params.productName;

    const sql = `
        SELECT 
            w.Year,
            w.Month AS month,
            SUM(s.OrderQty) AS total_qty
        FROM fak_sales s
        JOIN dim_waktu w ON s.DateKey = w.DateKey
        JOIN dim_produk p ON s.ProductID = p.ProductID
        WHERE p.ProductName = ?
        GROUP BY w.Year, w.Month
        ORDER BY w.Year, w.Month ASC
    `;

    db.query(sql, [productName], (err, data) => {
        if (err) return res.status(500).json({ error: err });

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const formatted = data.map(row => ({
            monthYear: `${monthNames[row.month - 1]} ${row.Year}`,
            total: row.total_qty
    }));


        res.json(formatted);
    });
});

module.exports = router;
