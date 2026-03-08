import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getSubtotal } = useCart();

  return (
    <main className="px-4 md:px-10 lg:px-40 py-8 min-h-[70vh]">
      <h1 className="text-3xl font-black mb-6 text-slate-900">Shopping Cart ({cart.length} items)</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 mb-4 text-lg">Giỏ hàng của bạn đang trống.</p>
            <Link to="/" className="inline-block bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
                Mua sắm ngay
            </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái: Danh sách sản phẩm */}
          <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-slate-600">Product</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Details</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Price</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 text-center">Quantity</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {cart.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 w-24">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-900">{item.name}</div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs mt-1 hover:underline font-medium">Remove</button>
                        </td>
                        <td className="p-4 text-slate-700 font-medium">${item.price}</td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center gap-3 border border-slate-200 rounded-lg p-1 bg-white">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 font-medium">-</button>
                              <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 font-medium">+</button>
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
          
          {/* Cột phải: Tổng tiền (Order Summary) */}
          <div className="w-full lg:w-[350px]">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6">
                <h2 className="text-xl font-bold mb-4 text-slate-900">Order Summary</h2>
                <div className="flex justify-between text-slate-600 mb-4 pb-4 border-b border-slate-200">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black mb-6 text-slate-900">
                    <span>Total</span>
                    <span className="text-green-500">${getSubtotal().toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="w-full bg-green-500 text-white py-3 rounded-lg font-bold flex justify-center hover:bg-green-600 transition-colors shadow-sm">
                    Proceed to Checkout
                </Link>
              </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;