const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON payloads
const dbcon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "manya",
});
// Connect to the database
dbcon.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// POST endpoint to add a new entry
app.post("/addinfo", (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validate incoming data
  if (!name || !email || !phone || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  const sql =
    "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";
  const values = [name, email, phone, message];

  dbcon.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.status(201).json({
      success: true,
      message: "Data added successfully.",
      id: result.insertId,
    });
  });
});

// PUT endpoint to update an entry
app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, message } = req.body;

  // Validate incoming data
  if (!name || !email || !phone || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  const sql =
    "UPDATE contacts SET name = ?, email = ?, phone = ?, message = ? WHERE id = ?";
  const values = [name, email, phone, message, id];

  dbcon.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating data:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Entry not found." });
    }
    return res.json({ success: true, message: "Data updated successfully." });
  });
});

// DELETE endpoint to delete an entry
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM contacts WHERE id = ?";

  dbcon.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Entry not found." });
    }
    return res.json({ success: true, message: "Data deleted successfully." });
  });
});

// Fetching data from databse Table

app.get("/", (req, res) => {
  // return res.json({ success: "This is backend side" });
  const sql = "SELECT * FROM contacts";
  dbcon.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.json({ success: true, data });
  });
});

//console.log(data);
app.listen(8080, () => {
  console.log("Server is running on port 8080.....");
});
