import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Khởi tạo state cho Form
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Tops',
    image: '',
    description: ''
  });

  // Chỉ cho phép người đã đăng nhập mới được vào trang này
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert("⚠️ Vui lòng đăng nhập để truy cập trang Quản trị!");
      navigate('/login');
    } else {
      setUser(JSON.parse(userStr));
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang
    
    // Validate cơ bản
    if (!formData.name || !formData.price || !formData.image) {
      return alert("Vui lòng điền đầy đủ Tên, Giá và Link ảnh!");
    }

    setIsLoading(true);
    try {
      // Gọi API gửi dữ liệu xuống Backend
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image: formData.image,
          category: formData.category,
          user_id: user.id // Gắn ID của Admin đang tạo sản phẩm
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Thêm sản phẩm thất bại");

      alert("🎉 Thêm sản phẩm thành công rực rỡ!");
      navigate('/'); // Đẩy về trang chủ để ngắm thành quả
      
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
            <Link to="/" className="hover:text-green-500 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">home</span>Home
            </Link>
            <span>/</span>
            <span className="text-slate-900">Admin</span>
            <span>/</span>
            <span className="text-slate-900">Add Product</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Thêm Sản Phẩm Mới</h1>
          <p className="text-slate-500 mt-1">Cập nhật kho hàng của bạn với những mặt hàng mới nhất.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ================= CỘT TRÁI: FORM NHẬP LIỆU ================= */}
          <div className="flex-1 w-full bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Tên sản phẩm */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input 
                  name="name" value={formData.name} onChange={handleChange} 
                  placeholder="VD: Áo thun trắng Basic..." required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
              </div>

              {/* Giá & Danh mục */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Giá ($) <span className="text-red-500">*</span></label>
                  <input 
                    name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} 
                    placeholder="0.00" required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Danh mục</label>
                  <select 
                    name="category" value={formData.category} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                  >
                    <option value="Tops">Tops (Áo)</option>
                    <option value="Bottoms">Bottoms (Quần)</option>
                    <option value="Outerwear">Outerwear (Áo khoác)</option>
                    <option value="Footwear">Footwear (Giày dép)</option>
                    <option value="Accessories">Accessories (Phụ kiện)</option>
                  </select>
                </div>
              </div>

              {/* Link Ảnh */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Đường dẫn ảnh (Image URL) <span className="text-red-500">*</span></label>
                <input 
                  name="image" value={formData.image} onChange={handleChange} 
                  placeholder="https://example.com/image.jpg" required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm text-slate-600"
                />
              </div>

              {/* Mô tả chi tiết */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả sản phẩm</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleChange} 
                  placeholder="Nhập mô tả chi tiết về chất liệu, form dáng..." rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm leading-relaxed"
                ></textarea>
              </div>

              {/* Nút Submit */}
              <div className="pt-2">
                <button 
                  type="submit" disabled={isLoading}
                  className={`w-full h-[52px] flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all shadow-sm
                    ${isLoading ? "bg-slate-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 hover:shadow-md"}`}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl"></span>
                      Lưu Sản Phẩm
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* ================= CỘT PHẢI: PREVIEW SẢN PHẨM ================= */}
          <div className="w-full lg:w-[350px] lg:sticky lg:top-24">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Xem trước hiển thị</h2>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 group">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-100">
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Invalid+Image+URL' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-5xl mb-2 opacity-50">image</span>
                    <span className="text-sm font-medium">Chưa có ảnh</span>
                  </div>
                )}
              </div>
              
              <div className="px-1">
                <h3 className="text-slate-900 font-bold truncate text-lg">
                  {formData.name || 'Tên sản phẩm'}
                </h3>
                <p className="text-slate-400 text-xs mt-1 mb-3">{formData.category}</p>
                <div className="text-xl font-black text-green-500">
                  ${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <span className="font-bold flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-[18px]">lightbulb</span> Mẹo nhỏ
              </span>
              Bạn có thể copy địa chỉ hình ảnh (Copy image address) từ Google Images hoặc Pinterest để dán vào ô Đường dẫn ảnh nhé.
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AddProduct;