import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('login'); // 'login' or 'otp'
  const [role, setRole] = useState('Member');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(email, password);
      if (data.requiresOtp) {
        setStep('otp');
        toast.success(data.message || 'OTP sent to email');
      } else {
        toast.success('Logged in successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
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
        {step === 'login' ? (
          <>
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
                Welcome back
              </h2>
              <p className="mt-2 text-center text-sm font-medium text-indigo-600 bg-indigo-50 py-1.5 px-3 rounded-full inline-block mx-auto flex w-max">
                Signing in as {role}
              </p>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleLoginSubmit}>
              <div className="space-y-4">
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
                    className="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-4">
              <button 
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center justify-center w-full focus:outline-none"
              >
                {showDemo ? 'Hide Demo Credentials' : 'Show Demo Credentials'}
                <svg className={`ml-1 w-4 h-4 transition-transform ${showDemo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDemo && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="font-semibold text-indigo-700">Admin Account</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 select-all cursor-text">admin@taskmanager.com / admin123</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-semibold text-slate-600">Member Account</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 select-all cursor-text">rahul@taskmanager.com / member123</span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-center text-sm text-slate-600 pt-4 border-t border-slate-100">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Create one now
              </Link>
            </p>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-center text-2xl font-bold text-slate-900 mt-2">
                Verify OTP
              </h2>
              <p className="mt-2 text-center text-sm text-slate-600">
                Check your email (or server console) for the 6-digit code.
              </p>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleOtpSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="otp">Enter OTP</label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm text-center tracking-widest font-mono text-lg"
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : 'Verify & Sign In'}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Back to login
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
