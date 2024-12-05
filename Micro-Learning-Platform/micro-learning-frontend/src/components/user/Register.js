import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister, onToggleLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('http://13.235.83.147:5000/register', { name, email, password })
      .then(() => {
        alert('Registration successful! You can now log in.');
        onRegister();
      })
      .catch(() => {
        alert("Registration failed. Please check your credentials.");
      });
  };

  return (
    <div className="w-80 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
          <input type="email"  id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}  className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md">Register</button>
      </form>
      <div className="mt-4 text-center">
        <p>Already have an account? <button onClick={onToggleLogin} className="text-blue-600">Login</button></p>
      </div>
    </div>
  );
};

export default Register;
