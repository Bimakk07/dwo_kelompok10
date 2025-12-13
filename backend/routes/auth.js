const express = require("express");
const router = express.Router();
const db = require("../koneksi");

/**
 * REGISTER
 */
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  const sql = `
    INSERT INTO users (username, password)
    VALUES (?, ?)
  `;

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Username sudah digunakan" });
      }
      return res.status(500).json(err);
    }

    res.json({
      message: "Registrasi berhasil",
      user_id: result.insertId
    });
  });
});

/**
 * LOGIN
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  const sql = `
    SELECT id, username, created_at
    FROM users
    WHERE username = ? AND password = ?
  `;

  db.query(sql, [username, password], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    res.json({
      message: "Login berhasil",
      user: data[0]
    });
  });
});

module.exports = router;
