import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';

// A simple dashboard placeholder for now
const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Team Task Manager</h1>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-100">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2">Welcome, {user?.name}!</h2>
          <p className="text-indigo-700">You are logged in as a <strong>{user?.role}</strong>.</p>
        </div>
      </div>
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
