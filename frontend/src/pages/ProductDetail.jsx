import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Lấy thông tin user để kiểm tra quyền mua hàng
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Gọi API từ Render đã deploy
    fetch(`https://assignment-2-tlxt.onrender.com/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setIsLoading(false);
      });
  }, [id]);

  // Xử lý khi bấm thêm vào giỏ hàng
  const handleAddToCart = () => {
    // CHẶN: Nếu chưa đăng nhập thì không cho thêm vào giỏ
    if (!user) {
      alert("Vui lòng đăng nhập để thực hiện tính năng mua hàng!");
      navigate('/login');
      return;
    }

    setIsAdding(true);
    
    // Thêm số lượng sản phẩm đã chọn vào giỏ hàng
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    // Hiệu ứng phản hồi cho người dùng
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center bg-slate-50/50">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-slate-50/50">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">production_quantity_limits</span>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-6">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
        <Link to="/" className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 py-10">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= BREADCRUMB ================= */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
          <Link to="/" className="hover:text-green-500 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">home</span>
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-400 capitalize">{product.category || 'Shop'}</span>
          <span>/</span>
          <span className="text-slate-900 truncate max-w-[200px] font-bold">{product.name}</span>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-10 flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* CỘT TRÁI: Hình ảnh sản phẩm */}
          <div className="w-full md:w-1/2 lg:w-[45%]">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 group shadow-inner">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=No+Image' }}
              />
            </div>
          </div>

          {/* CỘT PHẢI: Thông tin chi tiết */}
          <div className="w-full md:w-1/2 flex flex-col py-2 lg:py-4">
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">
                  {product.category || 'Premium'}
                </span>
                {user && (
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter italic">Authenticated User</span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tighter">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-green-500">${parseFloat(product.price).toFixed(2)}</span>
                <span className="text-slate-300 text-sm font-bold line-through">${(product.price * 1.2).toFixed(2)}</span>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 mb-8"></div>

            <div className="mb-10 flex-1">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-green-500"></span>
                Product Description
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm sm:text-base font-medium">
                {product.description || "Experience unparalleled comfort and style with this premium selection. Crafted with meticulous attention to detail, it's designed to elevate your everyday wardrobe effortlessly."}
              </p>
            </div>

            {/* Hành động: Số lượng & Thêm vào giỏ */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              
              {/* Bộ chọn số lượng */}
              <div className="flex items-center justify-between border border-slate-200 rounded-2xl px-4 py-4 sm:w-36 bg-slate-50/50 group hover:border-green-500 transition-colors">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-slate-400 hover:text-green-500 font-black text-2xl px-2 focus:outline-none transition-transform active:scale-125"
                >&minus;</button>
                <span className="font-black text-slate-900 text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-slate-400 hover:text-green-500 font-black text-2xl px-2 focus:outline-none transition-transform active:scale-125"
                >&#43;</button>
              </div>

              {/* Nút Add to Cart */}
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 flex items-center justify-center gap-3 rounded-2xl font-black text-sm uppercase tracking-widest py-5 transition-all shadow-lg active:scale-95
                  ${isAdding 
                    ? "bg-slate-900 text-white cursor-default" 
                    : "bg-green-500 hover:bg-green-600 shadow-green-500/20 text-white"}`}
              >
                {isAdding ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">Sync Processing...</span>
                    
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl"></span>
                    Add to Cart
                  </>
                )}
              </button>
            </div>
            
            {/* Cam kết bảo mật / Giao hàng */}
            <div className="mt-10 grid grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-green-500">
                  <span className="material-symbols-outlined"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-900 uppercase">Shipping</span>
                  <span className="text-[10px] font-bold text-slate-400">Free Delivery</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-green-500">
                  <span className="material-symbols-outlined"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-900 uppercase">Secure</span>
                  <span className="text-[10px] font-bold text-slate-400">Certified SSL</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default ProductDetail;