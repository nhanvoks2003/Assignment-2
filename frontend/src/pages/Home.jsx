import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Kiểm tra thông tin người dùng từ LocalStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    // Gọi API từ Backend đã deploy trên Render
    fetch('https://assignment-2-tlxt.onrender.com/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải sản phẩm:", err);
        setIsLoading(false);
      });
  }, []);

  // Hàm xử lý thêm vào giỏ hàng có kiểm tra đăng nhập
  const handleAddToCart = (product) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thực hiện tính năng này!");
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= HERO SECTION ================= */}
        <div className="relative w-full h-[400px] md:h-[450px] rounded-[2rem] overflow-hidden mb-12 flex items-center justify-center shadow-sm">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 flex flex-col items-center mt-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight drop-shadow-lg">
              Summer Collection<br/>2026
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium drop-shadow-md">
              Discover the latest trends in fashion and elevate your wardrobe with our fresh seasonal arrivals.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-10 rounded-xl transition-all shadow-lg hover:shadow-green-500/20 active:scale-95"
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* ================= SẢN PHẨM NỔI BẬT ================= */}
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Featured Products</h2>
          {user && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Mode Active</span>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">inventory_2</span>
            <p className="text-slate-500 font-medium">Chưa có sản phẩm nào trong kho hàng.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-50 flex flex-col hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                
                {/* Ảnh sản phẩm */}
                <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-50 mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=No+Image' }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                </Link>
                
                {/* Thông tin sản phẩm */}
                <div className="flex flex-col flex-1 px-1">
                  <div className="mb-1">
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">
                      {product.category || 'New Arrival'}
                    </span>
                  </div>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-slate-900 font-bold text-lg truncate hover:text-green-500 transition-colors duration-200">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Price</span>
                      <span className="text-xl font-black text-slate-900">${parseFloat(product.price).toFixed(2)}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 bg-slate-900 hover:bg-green-500 text-white hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 active:scale-90"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full py-12 mt-12 bg-white border-t border-slate-100 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            <a href="#" className="hover:text-green-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-green-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-green-500 transition-colors">Shipping</a>
            <a href="#" className="hover:text-green-500 transition-colors">Help</a>
          </div>
          <p className="text-xs text-slate-300 font-medium tracking-tight italic">
            © 2026 Clothing Store. Designed for PRN232 Assignment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;