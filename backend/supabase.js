require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Lấy URL và KEY từ file môi trường (.env)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Khởi tạo kết nối
const supabase = createClient(supabaseUrl, supabaseKey);

// Xuất ra để các file khác (như index.js) có thể sử dụng
module.exports = supabase;