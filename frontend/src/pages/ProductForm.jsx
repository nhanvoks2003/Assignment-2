import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductForm = () => {
  const navigate = useNavigate();

  // 1. Tạo state để lưu dữ liệu nhập vào form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'outerwear',
    image: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. Hàm xử lý khi gõ vào các ô input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 3. Hàm gửi dữ liệu lên Backend khi bấm "Save Product"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Lấy thông tin user hiện tại từ LocalStorage để biết ai là người tạo sản phẩm
      const userString = localStorage.getItem('user');
      if (!userString) {
        throw new Error('Bạn cần đăng nhập để thêm sản phẩm!');
      }
      const user = JSON.parse(userString);

      // Gọi API thêm sản phẩm
      const response = await fetch('https://assignment-2-tlxt.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Tùy chọn: Gửi token nếu bạn có bảo mật route ở backend
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price), // Đảm bảo giá là số
          image: formData.image,
          user_id: user.id // Truyền ID của người tạo vào
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi thêm sản phẩm');
      }

      alert('Thêm sản phẩm thành công!');
      navigate('/'); // Quay về trang chủ để xem sản phẩm mới

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col max-w-[800px] w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
        
        <div className="flex flex-wrap justify-between gap-3 mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <h1 className="tracking-light text-[32px] font-bold leading-tight text-slate-900">Create Product</h1>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-slate-900" htmlFor="name">Product Name</label>
            <input 
              id="name" value={formData.name} onChange={handleChange} required
              className="form-input flex w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-1 focus:ring-green-500 outline-none" 
              placeholder="e.g. Vintage Denim Jacket" type="text" 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-slate-900" htmlFor="description">Description</label>
            <textarea 
              id="description" value={formData.description} onChange={handleChange} required
              className="form-textarea flex w-full min-h-[120px] p-4 rounded-lg border border-slate-300 focus:ring-1 focus:ring-green-500 outline-none" 
              placeholder="Describe the product details..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-slate-900" htmlFor="price">Price ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">$</div>
                <input 
                  id="price" value={formData.price} onChange={handleChange} required
                  className="form-input flex w-full h-12 pl-8 pr-4 rounded-lg border border-slate-300 focus:ring-1 focus:ring-green-500 outline-none" 
                  placeholder="0.00" step="0.01" type="number" 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-slate-900" htmlFor="category">Category</label>
              <select 
                id="category" value={formData.category} onChange={handleChange}
                className="form-select flex w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-1 focus:ring-green-500 outline-none bg-white" 
              >
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="outerwear">Outerwear</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-slate-900">Product Image URL</label>
            <input 
              id="image" value={formData.image} onChange={handleChange} required
              className="form-input flex w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-1 focus:ring-green-500 outline-none" 
              placeholder="https://example.com/image.jpg" type="url" 
            />
            {/* Hiển thị ảnh xem trước nếu đã nhập URL */}
            {formData.image && (
                <div className="mt-4 w-32 h-32 rounded-lg border border-slate-200 overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
            )}
          </div>
          
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
            <Link to="/" className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium">
              Cancel
            </Link>
            <button disabled={isLoading} className="px-6 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors font-semibold disabled:opacity-70" type="submit">
              {isLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
        
      </div>
    </main>
  );
};

export default ProductForm;