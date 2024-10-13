const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.')));

let db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Updated schema
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    is_admin INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    datetime TEXT,
    max_students INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    class_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(class_id) REFERENCES classes(id)
  )`);
});

// User registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (row) {
      res.json({ success: true, userId: row.id, isAdmin: row.is_admin === 1 });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Create a new class (admin only)
app.post('/class', (req, res) => {
  const { name, datetime, maxStudents } = req.body;
  db.run(`INSERT INTO classes (name, datetime, max_students) VALUES (?, ?, ?)`, 
    [name, datetime, maxStudents], 
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Get all classes
app.get('/classes', (req, res) => {
  db.all(`SELECT * FROM classes`, (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Enroll in a class
app.post('/enroll', (req, res) => {
  const { userId, classId } = req.body;
  
  // Check if the class is full
  db.get(`SELECT count(*) as count, max_students FROM enrollments 
          JOIN classes ON enrollments.class_id = classes.id 
          WHERE class_id = ?`, [classId], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (row.count >= row.max_students) {
      return res.status(400).json({ error: 'Class is full' });
    }
    
    // If not full, add the enrollment
    db.run(`INSERT INTO enrollments (user_id, class_id) VALUES (?, ?)`, 
      [userId, classId], 
      function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
      }
    );
  });
});

// Get user enrollments
app.get('/enrollments/:userId', (req, res) => {
  const userId = req.params.userId;
  db.all(`SELECT classes.* FROM enrollments 
          JOIN classes ON enrollments.class_id = classes.id 
          WHERE enrollments.user_id = ?`, [userId], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});