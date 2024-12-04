const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Function to handle query errors
const queryDb = async (query, params) => {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (err) {
    console.error(err);
    throw new Error('Database query failed');
  }
};

// Register a new student
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const students = await queryDb(
      'INSERT INTO students (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    res.json(students[0]);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));