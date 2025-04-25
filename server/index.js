// server/index.js
const express = require("express");
const session = require("express-session");
const { google } = require("googleapis");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
require("./passport"); // <-- Konfigurasi passport-nya nanti kita buat

const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running.");
});

// Autentikasi ke Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: "sampelproduct-fef4a9b76d28.json", // Ganti sesuai nama file credentials kamu
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets", // Scope resmi & valid
  ],
});

// ID dari Google Spreadsheet kamu
const spreadsheetId = "1nK-lxuJuHwgrld1Tv-azpVD71JrhJONqup2z4xWyR2o"; // Ganti dengan ID spreadsheet kamu

// Endpoint API untuk menambahkan data
app.post("/add", async (req, res) => {
    const { name, email } = req.body;
  
    if (!name || !email) {
      return res.status(400).json({ error: "Name dan email harus diisi!" });
    }
  
    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });
  
      const id = Date.now(); // atau bisa diganti dengan UUID
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A:C",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[id, name, email]],
        },
      });
      
  
      res.status(200).json({ message: "✅ Data berhasil disimpan ke Google Spreadsheet!" });
    } catch (error) {
      console.error("❌ Error saat menyimpan ke Google Sheets:", error.message);
      res.status(500).json({ error: "Gagal menyimpan data ke Google Spreadsheet." });
    }
  });

  app.get("/data", async (req, res) => {
    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });
  
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A:C",
      });
  
      const rows = response.data.values;
      if (!rows || rows.length <= 1) {
        return res.status(404).json({ message: "No data found" });
      }
  
      // Skip header dan filter baris yang datanya lengkap
      const formatted = rows
        .slice(1)
        .filter((row) => row[0] && row[1] && row[2]) // pastikan id, name, email ada
        .map(([id, name, email]) => ({
          id,
          name,
          email,
        }));
  
      res.json(formatted);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });
  

  // Endpoint DELETE
  app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });
  
      // Ambil data dulu
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A:C",
      });
  
      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "Tidak ada data ditemukan" });
      }
  
      // Cari baris yang cocok dengan ID
      const rowIndex = rows.findIndex((row) => row[0] === id);
      if (rowIndex === -1) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
  
      // Hapus baris berdasarkan index (ditambah 1 karena Google Sheets mulai dari baris 1)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0, // Asumsikan sheet pertama, ganti jika perlu
                  dimension: "ROWS",
                  startIndex: rowIndex,
                  endIndex: rowIndex + 1,
                },
              },
            },
          ],
        },
      });
  
      res.status(200).json({ message: "✅ Data berhasil dihapus" });
    } catch (error) {
      console.error("❌ Gagal menghapus:", error);
      res.status(500).json({ error: "Gagal menghapus data" });
    }
  });
  
  // Endpoint DELETE
  app.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
  
    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });
  
      const getRows = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A:C", // Mulai dari baris 1 agar ID ditemukan
      });
  
      const rows = getRows.data.values;
      const rowIndex = rows.findIndex((row) => String(row[0]).trim() === String(id).trim());
  
      if (rowIndex === -1) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
  
      const rangeToUpdate = `Sheet1!A${rowIndex + 1}:C${rowIndex + 1}`; // +1 karena Google Sheets index 1-based
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: rangeToUpdate,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[id, name, email]],
        },
      });
  
      res.json({ message: "✅ Data berhasil diperbarui" });
    } catch (err) {
      console.error("❌ Gagal update data:", err);
      res.status(500).json({ error: "Gagal update data" });
    }
  });

//get product
app.get("/data2", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet2!A:E",
    });

    const rows = response.data.values;
    console.log("Rows fetched:", rows);

    if (!rows || rows.length <= 1) {
      return res.status(404).json({ message: "No data found" });
    }

    const formatted = rows
      .slice(1)
      .filter((row) => row[0] && row[1] && row[2] && row[3])
      .map(([id, nameproduct, deskripsi, harga, image]) => ({
        id,
        nameproduct,
        deskripsi,
        harga,
        image: image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

