// Vercel Serverless Function للتعامل مع MongoDB
import { MongoClient } from 'mongodb';

// متغيرات البيئة
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'agentsycode';
const COLLECTION_NAME = 'contacts';

export default async function handler(req, res) {
    // السماح بـ CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'POST') {
        try {
            const { name, email, message } = req.body;
            
            if (!name || !email || !message) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'الرجاء إدخال جميع البيانات المطلوبة' 
                });
            }
            
            // الاتصال بقاعدة البيانات
            const client = new MongoClient(MONGODB_URI);
            await client.connect();
            
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTION_NAME);
            
            // حفظ البيانات
            const result = await collection.insertOne({
                name,
                email,
                message,
                createdAt: new Date(),
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
            });
            
            await client.close();
            
            return res.status(200).json({
                success: true,
                message: 'تم إرسال رسالتك بنجاح',
                id: result.insertedId
            });
            
        } catch (error) {
            console.error('API Error:', error);
            return res.status(500).json({
                success: false,
                error: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً'
            });
        }
    }
    
    if (req.method === 'GET') {
        try {
            const client = new MongoClient(MONGODB_URI);
            await client.connect();
            
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTION_NAME);
            
            // جلب آخر 50 رسالة
            const messages = await collection
                .find({})
                .sort({ createdAt: -1 })
                .limit(50)
                .toArray();
            
            await client.close();
            
            return res.status(200).json({
                success: true,
                data: messages
            });
            
        } catch (error) {
            console.error('API Error:', error);
            return res.status(500).json({
                success: false,
                error: 'حدث خطأ في جلب البيانات'
            });
        }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
