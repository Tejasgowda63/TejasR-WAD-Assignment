const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const WebSocket = require('ws');
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

const ADMIN_CREDENTIALS = {
  username: 'admin@gmail.com', 
  password: 'admin1234',
};
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/admin/add-topic', async (req, res) => {
  const { name } = req.body; 
  try {
    const newTopic = await queryDb(
      'INSERT INTO topics (name) VALUES ($1) RETURNING *',[name]);
    res.json(newTopic[0]);
  } catch (err) {
    console.error('Add Topic Error:', err); 
    res.status(500).json({ error: 'Failed to add topic' });
  }
});

app.post("/admin/add-question", async (req, res) => {
  try {
    const { topicId, questionText, option1, option2, option3, option4, correctAnswer } = req.body;
    const topic = await queryDb('SELECT * FROM topics WHERE id = $1', [topicId]);
    if (!topic || topic.length === 0) {
      return res.status(404).json({ message: "Topic not found" });
    }
    const result = await queryDb(
      `INSERT INTO questions (topic_id, question_text, option1, option2, option3, option4, correct_answer) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,[topicId, questionText, option1, option2, option3, option4, correctAnswer] );
    res.status(201).json({
      message: "Question added successfully",
      questionId: result[0].id,
    });
  } catch (err) {
    console.error('Error adding question:', err);
    res.status(500).json({ message: "Failed to add question" });
  }
});

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('A client connected to WebSocket');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
app.server = app.listen(process.env.PORT || 5001, () => {
  console.log(`Server running on port ${process.env.PORT || 5001}`);
});
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
const broadcastScoreUpdate = (studentId, totalScore) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ studentId, totalScore }));
    }
  });
};
//Submiting the quiz data to database
app.post('/submit-quiz', async (req, res) => {
  const { studentId, answers, topicId } = req.body;
  if (!studentId || !answers || !topicId) return res.status(400).json({ error: 'Missing fields' });

  try {
    let score = 0;
    for (const { questionId, selectedAnswer } of answers) {
      const questions = await queryDb('SELECT * FROM questions WHERE id = $1', [questionId]);
      if (questions.length > 0 && questions[0].correct_answer === selectedAnswer) {
        score++;
      }
    }
    const timestamp = new Date().toISOString();
    let totalScore = 0;

    const existingSubmission = await queryDb(
      'SELECT * FROM quiz_submissions WHERE student_id = $1 AND topic_id = $2',[studentId, topicId]);

    if (existingSubmission.length > 0) {
      totalScore = existingSubmission[0].score + score;
      await queryDb(
        'UPDATE quiz_submissions SET score = $1, "timestamp" = $2 WHERE student_id = $3 AND topic_id = $4',[totalScore, timestamp, studentId, topicId]);
    } else {
      await queryDb(
        'INSERT INTO quiz_submissions (student_id, topic_id, score, "timestamp") VALUES ($1, $2, $3, $4)',[studentId, topicId, score, timestamp]);
      totalScore = score;
    }
    // Update the score to websocket
    broadcastScoreUpdate(studentId, totalScore);
 
    res.json({ message: 'Quiz submitted successfully', score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// API to fetch the total score for a student
app.get('/student/:studentId/total-score', async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await queryDb(
      'SELECT SUM(score) as totalScore FROM quiz_submissions WHERE student_id = $1',[studentId]);

    const totalScore = result[0]?.totalscore || 0;
    res.json({ totalScore });
  } catch (err) {
    console.error('Error fetching total score:', err);
    res.status(500).json({ error: 'Failed to fetch total score' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
