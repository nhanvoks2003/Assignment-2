import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Khởi tạo giỏ hàng từ localStorage nếu có
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Mỗi khi giỏ hàng thay đổi, lưu lại vào localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Hàm thêm vào giỏ
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const isExist = prevCart.find(item => item.id === product.id);
      if (isExist) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    alert("Đã thêm vào giỏ hàng!");
  };

  // Hàm xóa khỏi giỏ
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Hàm cập nhật số lượng
  const updateQuantity = (id, amount) => {
    setCart(prevCart => prevCart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    ));
  };

  // Tính tổng tiền
  const getSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getSubtotal, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);