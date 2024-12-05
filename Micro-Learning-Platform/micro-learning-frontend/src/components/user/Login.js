import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Login = ({ onLogin, onToggleRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://13.235.83.147:5000/login', { email, password })
      .then((response) => { const { token } = response.data;
        onLogin(token);
      }).catch(() => {
        alert("Login failed. Please check your credentials.");
      });
  };
  const handleAdminLoginRedirect = () => {
    navigate('/admin/login');
  };

  return (
    <div className="w-80 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md">Login</button>
      </form>
      <div className="mt-4 text-center">
        <p>Don't have an account? <button onClick={onToggleRegister} className="text-blue-600">Register</button></p>
      </div>
      <div className="mt-4 text-center">
        <p>Click here for admin login? <button onClick={handleAdminLoginRedirect} className="text-blue-600">Admin login</button></p>
      </div>
    </div>
  );
};

export default Login;
