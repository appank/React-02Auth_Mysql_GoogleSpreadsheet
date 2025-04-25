const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "02auth",
});

db.query("SELECT 1")
  .then(() => console.log("✅ Connected to MySQL"))
  .catch((err) => console.error("❌ MySQL connection error:", err));

module.exports = db;