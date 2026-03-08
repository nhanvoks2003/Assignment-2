require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./supabase'); // Import kết nối Supabase từ file supabase.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// API KIỂM TRA SERVER
// ==========================================
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend E-commerce đang chạy ngon lành!' });
});

// ==========================================
// 1. API XÁC THỰC (AUTHENTICATION)
// ==========================================

// Đăng ký (Register)
app.post('/api/auth/register', async (req, res) => {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Vui lòng cung cấp email và password' });
    }

    // Gửi request tạo user lên Supabase
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { full_name: fullName } // Lưu thêm tên người dùng vào metadata
        }
    });

    if (error) return res.status(400).json({ error: error.message });
    
    res.status(201).json({ message: 'Đăng ký thành công!', user: data.user });
});

// Đăng nhập (Login)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });

    res.status(200).json({ 
        message: 'Đăng nhập thành công', 
        token: data.session.access_token,
        user: data.user 
    });
});

// ==========================================
// 2. API SẢN PHẨM (PRODUCTS CRUD)
// ==========================================

// Lấy danh sách tất cả sản phẩm
app.get('/api/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
});

// Lấy chi tiết 1 sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return res.status(400).json({ error: 'Không tìm thấy sản phẩm' });
    res.status(200).json(data);
});

// Thêm sản phẩm mới 
app.post('/api/products', async (req, res) => {
    const { name, description, price, image, user_id } = req.body;

    if (!name || !description || !price || !user_id) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    const { data, error } = await supabase
        .from('products')
        .insert([{ name, description, price, image, user_id }])
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Thêm sản phẩm thành công!', product: data[0] });
});

// Cập nhật thông tin sản phẩm
app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    const { data, error } = await supabase
        .from('products')
        .update({ name, description, price, image })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Cập nhật sản phẩm thành công!', product: data[0] });
});

// Xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Xóa sản phẩm thành công!' });
});

// ==========================================
// 3. API ĐƠN HÀNG (ORDERS)
// ==========================================
app.get('/api/orders/:orderId/items', async (req, res) => {
    const { orderId } = req.params;

    // Lấy order_items và tự động "join" sang bảng products để lấy tên và ảnh sản phẩm
    const { data, error } = await supabase
        .from('order_items')
        .select(`
            *,
            product:products (
                name,
                image
            )
        `)
        .eq('order_id', orderId);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
});
// Tạo đơn hàng mới (Checkout)
app.post('/api/orders', async (req, res) => {
    const { user_id, items, total_amount } = req.body;
    
    if (!user_id || !items || items.length === 0) {
        return res.status(400).json({ error: 'Thông tin đơn hàng không hợp lệ' });
    }

    // 1. Tạo đơn hàng trong bảng 'orders'
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{ user_id, total_amount, status: 'paid' }]) // Giả lập thanh toán thành công (paid)
        .select();

    if (orderError) return res.status(400).json({ error: orderError.message });

    // 2. Lưu chi tiết sản phẩm vào bảng 'order_items'
    const orderItems = items.map(item => ({
        order_id: order[0].id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    
    if (itemsError) return res.status(400).json({ error: itemsError.message });

    res.status(201).json({ message: 'Đặt hàng thành công!', orderId: order[0].id });
});

// Lấy lịch sử đơn hàng của 1 User cụ thể
app.get('/api/orders/user/:userId', async (req, res) => {
    const { userId } = req.params;

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }); 

    if (error) return res.status(400).json({ error: error.message });
    
    res.status(200).json(data);
});

// ==========================================
// KHỞI ĐỘNG SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});