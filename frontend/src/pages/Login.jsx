import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://assignment-2-tlxt.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sai email hoặc mật khẩu');
      }

      // 1. Lưu Token và thông tin User vào LocalStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 2. Chuyển hướng về Trang Chủ
      alert('Đăng nhập thành công!');
      navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-6 min-h-[80vh]">
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-sm border border-slate-100 p-8 sm:p-10 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Please enter your details to sign in.</p>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="email">Email address</label>
            <input 
              name="email" value={formData.email} onChange={handleChange}
              className="form-input w-full rounded-lg border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none border" 
              id="email" placeholder="Enter your email" required type="email" 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <a className="text-sm text-green-500 hover:underline font-medium" href="#">Forgot password?</a>
            </div>
            <input 
              name="password" value={formData.password} onChange={handleChange}
              className="form-input w-full rounded-lg border-slate-200 bg-transparent px-4 py-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none border" 
              id="password" placeholder="••••••••" required type="password" 
            />
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <input className="rounded border-slate-300 text-green-500 focus:ring-green-500 h-4 w-4 bg-transparent cursor-pointer" id="remember" type="checkbox" />
            <label className="text-sm text-slate-600 cursor-pointer" htmlFor="remember">Remember me</label>
          </div>
          
          <button disabled={isLoading} className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white text-base font-bold rounded-lg h-12 flex items-center justify-center transition-colors disabled:opacity-70" type="submit">
            {isLoading ? 'Đang đăng nhập...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-600">
          Don't have an account? 
          <Link to="/register" className="text-green-500 font-semibold hover:underline ml-1">
            Register for an account
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Login;