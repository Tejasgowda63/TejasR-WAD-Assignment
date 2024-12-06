import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('http://13.235.83.147:5000/admin/login', { email, password });
      localStorage.setItem('admin_token', response.data.token);
      navigate('/admin/dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || 'Login failed');
      } else {
        setErrorMessage('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="w-80 p-6 bg-white shadow-md rounded-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required/>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md">Login</button>
      </form>
      {errorMessage && (
        <div className="mt-4 text-center text-red-600">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
