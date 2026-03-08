import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, getSubtotal, setCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Quản lý trạng thái (State) cho tất cả các ô nhập liệu
  const [formData, setFormData] = useState({
    email: '', phone: '',
    firstName: '', lastName: '', address: '', city: '', state: 'New York', zip: '',
    cardNumber: '', expDate: '', cvc: ''
  });

  // 2. Tính toán tiền
  const subtotal = getSubtotal();
  const shipping = subtotal > 0 ? 12.00 : 0; // Phí ship
  const tax = subtotal * 0.08; // Thuế 8%
  const finalTotal = subtotal + shipping + tax;

  // 3. Hàm cập nhật dữ liệu khi người dùng gõ
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Kiểm tra xem người dùng đã điền ĐỦ thông tin chưa (Form Validation)
  // Trả về true nếu tất cả các trường đều có chữ (không bị trống)
  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  // 5. Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      return navigate('/login');
    }
    const user = JSON.parse(userStr);

    if (cart.length === 0) return alert("Giỏ hàng của bạn đang trống!");

    setIsLoading(true);
    try {
      // Gọi API đặt hàng lưu vào Supabase
      const response = await fetch('https://assignment-2-tlxt.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          items: cart,
          total_amount: finalTotal
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Đặt hàng thất bại");

      // Giả lập thanh toán thành công
      alert("🎉 Đặt hàng & Thanh toán thành công! Cảm ơn bạn.");
      setCart([]); // Xóa giỏ hàng
      localStorage.removeItem('cart');
      navigate('/orders'); // Chuyển về trang Lịch sử đơn hàng

    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Nếu giỏ hàng trống thì chuyển về trang giỏ hàng
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-slate-500 mt-1">Please enter your shipping and contact details.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ================= CỘT TRÁI: FORM NHẬP LIỆU ================= */}
          <div className="flex-1 w-full flex flex-col gap-6">
            
            {/* Contact Information */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" type="email" 
                         className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" type="tel" 
                         className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm" />
                </div>
              </div>
            </section>
            
            {/* Shipping Address */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" type="text" 
                         className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" type="text" 
                         className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm" />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address</label>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="123 Fashion Street, Apt 4B" type="text" 
                       className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="New York" type="text" 
                         className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">State/Province</label>
                  <select name="state" value={formData.state} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm bg-white">
                    <option value="New York">New York</option>
                    <option value="California">California</option>
                    <option value="Texas">Texas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Zip/Postal Code</label>
                  <input name="zip" value={formData.zip} onChange={handleChange} placeholder="10001" type="text" 
                         className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm" />
                </div>
              </div>
            </section>
            
            {/* Payment Method */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Payment Method</h2>
              
              <div className="border border-green-500 bg-green-50/30 rounded-xl p-4 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-[6px] border-green-500 bg-white"></div>
                  <span className="font-bold text-slate-900">Credit Card</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-6 bg-slate-200 rounded"></div>
                  <div className="w-10 h-6 bg-slate-200 rounded"></div>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Card Number</label>
                <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" type="text" 
                       className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiration Date</label>
                  <input name="expDate" value={formData.expDate} onChange={handleChange} placeholder="MM/YY" type="text" 
                         className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">CVC</label>
                  <input name="cvc" value={formData.cvc} onChange={handleChange} placeholder="123" type="password" 
                         className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm" />
                </div>
              </div>
            </section>
          </div>
          
          {/* ================= CỘT PHẢI: ORDER SUMMARY ================= */}
          <div className="w-full lg:w-[420px] lg:sticky lg:top-24">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              {/* Danh sách sản phẩm (Hiển thị thực tế từ Giỏ hàng) */}
              <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-900 font-bold text-sm truncate">{item.name}</h3>
                      <p className="text-slate-500 text-xs mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-slate-900 font-bold text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Chi tiết tính tiền */}
              <div className="flex flex-col gap-3 py-5 border-t border-b border-slate-100 mb-6">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Tổng cộng */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-slate-900 text-lg font-black">Total</span>
                <span className="text-slate-900 text-2xl font-black">${finalTotal.toFixed(2)}</span>
              </div>
              
              {/* Nút đặt hàng: Tự động khóa (xám đi) nếu chưa nhập đủ thông tin */}
              <button 
                onClick={handlePlaceOrder}
                disabled={!isFormValid || isLoading}
                className={`w-full h-[52px] rounded-xl font-bold text-white transition-all shadow-sm
                  ${isFormValid && !isLoading 
                    ? "bg-green-500 hover:bg-green-600 hover:shadow-md cursor-pointer" 
                    : "bg-slate-300 cursor-not-allowed"}`}
              >
                {isLoading ? "Processing..." : (isFormValid ? "Place Order" : "Please fill all fields")}
              </button>
              
              <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                By placing your order, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Checkout;