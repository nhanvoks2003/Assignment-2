import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate(); // Dùng để chuyển trang sau khi đăng ký thành công
  
  // 1. Khởi tạo State để lưu dữ liệu form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Hàm xử lý khi gõ vào input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Hàm xử lý khi bấm nút "Register Now"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang
    setError('');

    // Kiểm tra mật khẩu
    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp!');
    }

    setIsLoading(true);
    try {
      // Gửi request sang Backend
      const response = await fetch('https://assignment-2-tlxt.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName // Tùy chọn gửi thêm tên
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      // Đăng ký thành công -> Chuyển hướng sang trang đăng nhập
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex justify-center items-center p-6 lg:p-12 min-h-[80vh]">
      <div className="w-full max-w-[480px] flex flex-col gap-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-slate-900 text-3xl font-black leading-tight">Create an Account</h1>
          <p className="text-slate-600 text-base font-normal">Join us for a personalized shopping experience.</p>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 text-sm font-medium">Full Name</label>
            <input 
              name="fullName" value={formData.fullName} onChange={handleChange} required
              className="form-input flex w-full rounded-lg border border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-12 px-4 text-sm outline-none" 
              placeholder="Enter your full name" type="text" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-900 text-sm font-medium">Email Address</label>
            <input 
              name="email" value={formData.email} onChange={handleChange} required
              className="form-input flex w-full rounded-lg border border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-12 px-4 text-sm outline-none" 
              placeholder="example@email.com" type="email" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-900 text-sm font-medium">Password</label>
            <input 
              name="password" value={formData.password} onChange={handleChange} required minLength="6"
              className="form-input flex w-full rounded-lg border border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-12 px-4 text-sm outline-none" 
              placeholder="Create a password (min 6 chars)" type="password" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-900 text-sm font-medium">Confirm Password</label>
            <input 
              name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
              className="form-input flex w-full rounded-lg border border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 h-12 px-4 text-sm outline-none" 
              placeholder="Repeat your password" type="password" 
            />
          </div>

          <div className="pt-2">
            <button disabled={isLoading} className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-green-500 text-white text-base font-bold hover:bg-green-600 transition-all disabled:opacity-70" type="submit">
              {isLoading ? 'Đang xử lý...' : 'Register Now'}
            </button>
          </div>
        </form>

        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-600 text-sm">
            Already have an account? 
            <Link to="/login" className="text-green-500 font-bold hover:underline ml-1">Login here</Link>
          </p>
        </div>

      </div>
    </main>
  );
};

export default Register;