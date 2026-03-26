// Supabase Client Configuration
// يمكنك استبدال هذه القيم بمتغيرات البيئة في Vercel
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// تحميل مكتبة Supabase
if (typeof supabase === 'undefined') {
    console.warn('Supabase library not loaded. Make sure to include the CDN.');
}

// تهيئة عميل Supabase
let supabaseClient = null;

// دالة لتهيئة Supabase
async function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded');
        return null;
    }
    
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully');
        
        // اختبار الاتصال
        const { data, error } = await supabaseClient.from('your_table').select('count');
        if (error) {
            console.warn('Supabase connection test failed:', error.message);
        } else {
            console.log('Supabase connection successful');
        }
        
        return supabaseClient;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        return null;
    }
}

// دالة لإرسال رسالة تواصل
async function sendContactMessage(name, email, message) {
    if (!supabaseClient) {
        await initSupabase();
    }
    
    if (!supabaseClient) {
        console.error('Supabase client not available');
        return { success: false, error: 'Supabase not configured' };
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('contacts')
            .insert([
                { name, email, message, created_at: new Date().toISOString() }
            ]);
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false, error: error.message };
    }
}

// دالة للحصول على المميزات من قاعدة البيانات (اختياري)
async function getFeatures() {
    if (!supabaseClient) {
        await initSupabase();
    }
    
    if (!supabaseClient) {
        return [];
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('features')
            .select('*')
            .order('order', { ascending: true });
        
        if (error) throw error;
        
        return data;
    } catch (error) {
        console.error('Error fetching features:', error);
        return [];
    }
}

// تصدير الدوال للاستخدام في main.js
window.supabaseHelpers = {
    initSupabase,
    sendContactMessage,
    getFeatures
};

// تهيئة Supabase تلقائياً عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
});
