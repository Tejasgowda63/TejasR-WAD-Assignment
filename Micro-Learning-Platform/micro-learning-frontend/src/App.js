import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Including Tailwind CSS
import './App.css'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Login from './components/user/Login';
import Register from './components/user/Register';
import TopicList from './components/user/TopicsList';
import Quiz from './components/user/Quiz';
import Navbar from './components/Navbar';


const App = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [score, setScore] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [tkstudentId, setTkStudentId] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }}, []);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const tkstudentId = decodedToken.id; 
      setTkStudentId(tkstudentId);
      console.log(tkstudentId);
      axios
        .get('http://13.235.83.147:5000/topics', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setTopics(response.data));
    }}, [token]);

  const handleLogin = (token) => {
    setToken(token);
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };

  const handleRegister = () => {
    setIsRegistering(false);
  };

  const fetchQuiz = (topicId) => {
    setSelectedTopic(topicId);
    axios.get(`http://13.235.83.147:5000/quiz/${topicId}`)
      .then((response) => setQuizQuestions(response.data));
  };

  const submitQuiz = (answers) => {
    const studentId = tkstudentId;
    const topicId = selectedTopic;
    const quizAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      selectedAnswer: answers[questionId],
    }));
    axios.post('http://13.235.83.147:5000/submit-quiz', { studentId, answers: quizAnswers, topicId })
      .then((response) => {
        setScore(response.data.score);
      }); };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} studentId={tkstudentId}  />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
        <Router>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/user/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={!isLoggedIn ? (isRegistering ? (<Register onRegister={handleRegister} onToggleLogin={() => setIsRegistering(false)} />) 
            : (<Login onLogin={handleLogin} onToggleRegister={() => setIsRegistering(true)} />)) 
            : (<Navigate to="/user/dashboard" />)}
            />
            <Route path="/user/dashboard" element={isLoggedIn ? (
              <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-md">
                <TopicList topics={topics} onSelectTopic={fetchQuiz} />
                {selectedTopic && <Quiz quizQuestions={quizQuestions} onSubmitQuiz={submitQuiz} />}
                {score !== null && (
                  <div className="mt-6 text-center">
                  <h2 className="text-2xl font-semibold">Your Score: {score}</h2>
                    </div>
                )}
              </div>) : (<Navigate to="/login" />)
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
