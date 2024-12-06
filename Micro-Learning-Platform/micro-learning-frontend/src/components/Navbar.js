import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = ({ isLoggedIn, onLogout, studentId }) => {
  const [totalScore, setTotalScore] = useState(null); 
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isLoggedIn && studentId) {
      //get the score from database
      const fetchTotalScore = async () => {
        try {
          const response = await axios.get(`http://13.235.83.147:5000/student/${studentId}/total-score`);
          setTotalScore(response.data.totalScore || 0);
        } catch (err) {
          console.error('Error fetching total score:', err);
          setTotalScore(0);
        }
      };
      fetchTotalScore();

      // WebSocket connection sourse from https://github.com/websockets/ws#simple-server
      const socket = new WebSocket('ws://13.235.83.147:5001');
      setSocket(socket);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.studentId === studentId) {
          setTotalScore(data.totalScore);
        }
      };
      return () => {
        socket.close();
      };
    }
  }, [isLoggedIn, studentId]);

  return (
    <header className="bg-white">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <a className="block text-teal-600" href="#">
          <span className="sr-only">Home</span>
          <img src="https://microlearningassets.s3.ap-south-1.amazonaws.com/quiz.png" alt="Logo" className="h-10"/>
        </a>
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <h1 className="text-2xl font-bold text-center text-custom-green">Micro-Learning Platform</h1>
          <div className="flex items-center gap-4">
            {isLoggedIn && totalScore !== null && (
              <p className="text-sm font-medium text-gray-700">
                Total Score: <span className="font-bold">{totalScore}</span>
              </p>
            )}
            <div className="sm:flex sm:gap-4">
              {!isLoggedIn ? ( <a className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700" href="/login" > User Login </a> ) 
                : (<button onClick={onLogout} className="block rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"> Logout </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
