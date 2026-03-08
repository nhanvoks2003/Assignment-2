import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart(); // Lấy hàm thêm vào giỏ hàng từ Context

  // Kiểm tra xem có ai đang đăng nhập không (để hiện dòng "Admin Mode Active")
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    // Gọi API lấy dữ liệu từ Backend
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => console.error("Lỗi tải sản phẩm:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= HERO SECTION ================= */}
        <div className="relative w-full h-[400px] md:h-[450px] rounded-[2rem] overflow-hidden mb-12 flex items-center justify-center shadow-sm">
          {/* Background Image & Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}
          >
            {/* Lớp phủ làm tối ảnh nền một chút để chữ nổi bật hơn */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 flex flex-col items-center mt-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Summer Collection<br/>2026
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium">
              Discover the latest trends in fashion and elevate your wardrobe with our fresh seasonal arrivals.
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-10 rounded-lg transition-colors shadow-md">
              Shop Now
            </button>
          </div>
        </div>

        {/* ================= SẢN PHẨM NỔI BẬT ================= */}
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Featured Products</h2>
          {user && <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Admin Mode Active</span>}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
            Chưa có sản phẩm nào. Hãy vào Admin Mode để thêm sản phẩm nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow group">
                
                {/* Ảnh sản phẩm */}
                <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=No+Image' }}
                  />
                </Link>
                
                {/* Thông tin sản phẩm */}
                <div className="flex flex-col flex-1 px-1">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-slate-900 font-bold truncate hover:text-green-500 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-slate-400 text-xs mt-1 mb-4 capitalize">{product.category || 'Outerwear'}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900">${parseFloat(product.price).toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1.5 text-green-500 font-bold text-sm px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      {/* Icon Giỏ hàng siêu nhỏ gọn */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full py-10 mt-12 border-t border-slate-200 text-center bg-transparent">
        <div className="flex justify-center gap-8 text-xs font-medium text-slate-500 mb-4">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Contact Us</a>
        </div>
        <p className="text-xs text-slate-400">© 2023 Clothing Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;