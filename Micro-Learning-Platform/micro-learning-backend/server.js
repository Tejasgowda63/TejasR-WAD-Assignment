const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
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
  ssl: {
    rejectUnauthorized: false       
  }
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

// Login for a student which also generates a jsonwebtoken
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Fill the Missing fields' });

  try {
    const students = await queryDb('SELECT * FROM students WHERE email = $1', [email]);
    const student = students[0];

    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: student.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get list of available topics from database
app.get('/topics', async (req, res) => {
  try {
    const topics = await queryDb('SELECT * FROM topics', []);
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Fetch quiz questions for a specific topic from database
app.get('/quiz/:topicId', async (req, res) => {
  const { topicId } = req.params;
  try {
    const questions = await queryDb('SELECT * FROM questions WHERE topic_id = $1', [topicId]);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
  }
});

// Submit quiz answers and return score 
app.post('/submit-quiz', async (req, res) => {
  const { studentId, answers, topicId } = req.body;
  if (!studentId || !answers || !topicId) return res.status(400).json({ error: 'Missing fields' });

  try {
    let score = 0;
    for (const { questionId, selectedAnswer } of answers) {
      const questions = await queryDb('SELECT * FROM questions WHERE id = $1', [questionId]);
      if (questions[0].correct_answer === selectedAnswer) score++;
    }
    await queryDb('INSERT INTO quizsubmissions (student_id, topic_id, score) VALUES ($1, $2, $3)', [studentId, topicId, score]);
    res.json({ score });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
