import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
        <div className="space-y-6">
          <button onClick={() => navigate('/admin/add-topic')} className="w-full block py-3 px-6 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Topic
          </button>
          <button onClick={() => navigate('/admin/add-question')} className="w-full block py-3 px-6 text-center bg-green-600 text-white rounded-md hover:bg-green-700">
            Add Question
          </button>
        </div>

        <div className="mt-6">
          <button onClick={handleLogout} className="w-full py-3 px-6 text-center bg-red-600 text-white rounded-md hover:bg-red-700" > Logout from Admin </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
