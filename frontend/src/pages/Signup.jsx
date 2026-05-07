import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await signup(name, email, password, role);
      toast.success(data.message || 'Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Branding */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Team Task Manager</h1>
        <p className="mt-2 text-base text-slate-500">Manage projects, tasks, and teams efficiently</p>
      </div>

      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 transition-all">
        {/* Role Segmented Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('Member')}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-200 ${
              role === 'Member' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Member
          </button>
          <button
            type="button"
            onClick={() => setRole('Admin')}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-200 ${
              role === 'Admin' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Admin
          </button>
        </div>

        <div>
          <h2 className="text-center text-2xl font-bold text-slate-900 mt-2">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-indigo-600 bg-indigo-50 py-1.5 px-3 rounded-full inline-block mx-auto flex w-max">
            Creating {role} account
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                placeholder="•••••••• (Min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-600 pt-4 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
