import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Import toàn bộ các trang (Hãy chắc chắn bạn đã tạo đủ các file này trong thư mục src/pages/)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import ProductForm from './pages/ProductForm';
import AddProduct from './pages/AddProduct';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f8fafc]">
        {/* Navbar hiển thị ở mọi trang */}
        <Navbar />
        
        {/* Khu vực nội dung thay đổi tùy theo URL */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/admin/product/new" element={<AddProduct />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/admin/product/new" element={<ProductForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;