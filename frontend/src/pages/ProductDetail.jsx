import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ trên thanh URL
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Gọi API lấy thông tin chi tiết của 1 sản phẩm
  useEffect(() => {
    window.scrollTo(0, 0); // Tự động cuộn lên đầu trang khi vào
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
    setIsAdding(true);
    
    // Gọi hàm addToCart từ Context
    // (Nếu Context của bạn chỉ nhận 1 sản phẩm mỗi lần, ta có thể dùng vòng lặp, 
    // hoặc đơn giản là gọi 1 lần. Ở đây tôi gọi vòng lặp để add đúng số lượng khách chọn)
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    // Hiệu ứng nút nhấp nháy chữ "Added!" trong 1 giây
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  // Nếu đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center bg-slate-50/50">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Nếu nhập sai ID hoặc sản phẩm bị xóa
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
          <Link to="/" className="hover:text-green-500 transition-colors capitalize">
            {product.category || 'Shop'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-8 flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* CỘT TRÁI: Hình ảnh sản phẩm */}
          <div className="w-full md:w-1/2 lg:w-[45%]">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=No+Image' }}
              />
            </div>
          </div>

          {/* CỘT PHẢI: Thông tin chi tiết */}
          <div className="w-full md:w-1/2 flex flex-col py-2 lg:py-6">
            
            {/* Tên & Giá */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                {product.category || 'New Arrival'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">
                {product.name}
              </h1>
              <div className="text-3xl font-black text-green-500">
                ${parseFloat(product.price).toFixed(2)}
              </div>
            </div>

            {/* Đường kẻ ngang */}
            <div className="w-full h-px bg-slate-100 mb-6"></div>

            {/* Mô tả sản phẩm */}
            <div className="mb-8 flex-1">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {product.description || "Chưa có mô tả chi tiết cho sản phẩm này. Đây là một sản phẩm chất lượng cao được thiết kế tỉ mỉ mang lại sự thoải mái tối đa cho người sử dụng."}
              </p>
            </div>

            {/* Hành động: Số lượng & Thêm vào giỏ */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              
              {/* Bộ chọn số lượng */}
              <div className="flex items-center justify-between border-2 border-slate-200 rounded-xl px-4 py-3 sm:w-32 bg-slate-50">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-slate-400 hover:text-green-500 font-bold text-xl px-2 focus:outline-none transition-colors"
                >&minus;</button>
                <span className="font-bold text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-slate-400 hover:text-green-500 font-bold text-xl px-2 focus:outline-none transition-colors"
                >&#43;</button>
              </div>

              {/* Nút Add to Cart */}
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-bold text-lg py-4 transition-all shadow-sm
                  ${isAdding 
                    ? "bg-slate-800 text-white cursor-default" 
                    : "bg-green-500 hover:bg-green-600 hover:shadow-md text-white"}`}
              >
                {isAdding ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-bounce"></span>
                    Added to Cart!
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
            <div className="mt-8 grid grid-cols-2 gap-4 text-slate-500">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="material-symbols-outlined text-green-500">local_shipping</span>
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="material-symbols-outlined text-green-500">verified_user</span>
                Secure Checkout
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default ProductDetail;