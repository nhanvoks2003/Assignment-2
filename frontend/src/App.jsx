import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Import các trang từ thư mục src/pages/
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AddProduct from './pages/AddProduct'; // Sử dụng bản AddProduct xịn nhất

/**
 * COMPONENT BẢO VỆ (PROTECTED ROUTE)
 * Kiểm tra xem người dùng đã đăng nhập chưa từ LocalStorage
 * Nếu chưa có dữ liệu 'user', đá người dùng về trang /login
 */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    // Lưu lại thông báo nhỏ hoặc đơn giản là điều hướng
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        {/* Navbar hiển thị cố định ở đầu mọi trang */}
        <Navbar />
        
        {/* Khu vực nội dung chính */}
        <main className="flex-grow">
          <Routes>
            {/* ================= CÁC ROUTE CÔNG KHAI (AI CŨNG XEM ĐƯỢC) ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ================= CÁC ROUTE BẢO MẬT (PHẢI LOGIN MỚI VÀO ĐƯỢC) ================= */}
            
            {/* Trang Giỏ hàng */}
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />

            {/* Trang Thanh toán */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />

            {/* Trang Lịch sử đơn hàng */}
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } />

            {/* Trang Admin: Thêm sản phẩm mới */}
            <Route path="/admin/product/new" element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            } />

            {/* ROUTE DỰ PHÒNG: Nếu gõ sai URL thì về trang chủ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;