import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          
          {/* ================= LOGO ================= */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-green-500 rounded flex items-center justify-center text-white font-black text-lg">
              C
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-green-500 transition-colors hidden sm:block">
              Clothing Store
            </span>
          </Link>

          {/* ================= NAV LINKS (Tối giản) ================= */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-900 hover:text-green-500 transition-colors">Shop</Link>
            <Link to="#" className="text-sm font-medium text-slate-500 hover:text-green-500 transition-colors">Categories</Link>
            <Link to="#" className="text-sm font-medium text-slate-500 hover:text-green-500 transition-colors">About</Link>
          </nav>

          {/* ================= RIGHT ACTIONS (SVG Icons) ================= */}
          <div className="flex items-center gap-4">
            
            {/* Search Icon */}
            <button className="text-slate-500 hover:text-green-500 transition-colors p-2">
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="relative text-slate-500 hover:text-green-500 transition-colors p-2">
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white box-content">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Avatar & Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              {user ? (
                // Đã đăng nhập -> Hiện Avatar chữ cái
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-green-50 text-green-600 font-bold border border-green-200 flex items-center justify-center hover:bg-green-100 transition-colors focus:outline-none"
                >
                  <span className="text-sm">{getInitials(user.user_metadata?.full_name, user.email)}</span>
                </button>
              ) : (
                // Chưa đăng nhập -> Hiện icon User tối giản
                <Link to="/login" className="text-slate-500 hover:text-green-500 transition-colors p-2">
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </Link>
              )}

              {/* Popup Dropdown Tối giản */}
              {isDropdownOpen && user && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden z-50">
                  
                  {/* Header Popup */}
                  <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {user.user_metadata?.full_name || 'Khách hàng'}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1.5">
                    <Link 
                      to="/orders" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-green-600 hover:bg-slate-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Order History
                    </Link>
                    
                    <Link 
                      to="/admin/product/new" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-green-600 hover:bg-slate-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Add Product
                    </Link>
                  </div>
                  
                  {/* Nút Logout */}
                  <div className="border-t border-slate-100 py-1.5">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;