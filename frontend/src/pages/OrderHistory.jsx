import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ----- STATE MỚI CHO MODAL CHI TIẾT -----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    fetch(`http://localhost:5000/api/orders/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải đơn hàng:", err);
        setIsLoading(false);
      });
  }, [navigate]);

  // Hàm mở Modal và gọi API lấy chi tiết sản phẩm
  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setIsLoadingDetails(true);

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${order.id}/items`);
      const data = await res.json();
      setOrderItems(data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'processing';
    if (s === 'delivered') return 'bg-green-100 text-green-800 border-green-200';
    if (s === 'shipped') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (s === 'returned') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusText = (status) => {
    const s = status ? status.toLowerCase() : 'processing';
    if (s === 'paid' || s === 'pending') return 'Processing';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <main className="w-full max-w-[1200px] mx-auto flex-1 flex flex-col py-8 px-4 md:px-10 relative">
      
      {/* Breadcrumb & Header giữ nguyên */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link to="/" className="text-slate-500 hover:text-green-500 transition-colors text-sm font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">home</span>Home
        </Link>
        <span className="text-slate-400 text-sm font-medium">/</span>
        <span className="text-slate-900 text-sm font-medium">Order History</span>
      </div>
      
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-[-0.033em]">Order History</h1>
        <p className="text-slate-600 text-base font-normal">View and manage your past orders and their delivery status.</p>
      </div>
      
      {/* Bảng Danh sách đơn hàng */}
      <div className="bg-white rounded-xl border border-green-500/20 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">receipt_long</span>
            <p className="text-slate-500 mb-4 text-lg">Bạn chưa có đơn hàng nào.</p>
            <Link to="/" className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600">Mua sắm ngay</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-green-500/5 border-b border-green-500/20">
                  <th className="px-6 py-4 text-slate-700 text-sm font-semibold uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-slate-700 text-sm font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-slate-700 text-sm font-semibold uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-slate-700 text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-slate-700 text-sm font-semibold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-500/10">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-green-500/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#ORD-{order.id.substring(0, 5).toUpperCase()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">${parseFloat(order.total_amount).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* --- NÚT VIEW DETAILS ĐƯỢC GẮN SỰ KIỆN onClick --- */}
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="text-green-500 hover:text-green-600 inline-flex items-center gap-1 group-hover:underline focus:outline-none"
                      >
                        View Details
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"></span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL CHI TIẾT ĐƠN HÀNG ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          {/* Hộp Modal */}
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-fade-in-down overflow-hidden border border-slate-100">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900">Order Details</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">#ORD-{selectedOrder?.id.substring(0, 5).toUpperCase()}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body Modal (Danh sách sản phẩm) */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              {isLoadingDetails ? (
                <div className="flex justify-center items-center py-10">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center p-3 rounded-xl border border-slate-100 hover:border-green-200 bg-slate-50/30 transition-colors">
                      {/* Ảnh sản phẩm lấy từ bảng products */}
                      <img 
                        src={item.product?.image || 'https://via.placeholder.com/150'} 
                        alt={item.product?.name} 
                        className="w-20 h-20 rounded-lg object-cover bg-white border border-slate-200 flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{item.product?.name || 'Sản phẩm đã bị xóa'}</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Unit Price: ${parseFloat(item.price).toFixed(2)}</p>
                        <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-black text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Modal (Tổng tiền) */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">Total Paid</span>
              <span className="text-2xl font-black text-green-500">${parseFloat(selectedOrder?.total_amount).toFixed(2)}</span>
            </div>
            
          </div>
        </div>
      )}

    </main>
  );
};

export default OrderHistory;