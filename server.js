const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

// إعداد body-parser لتحليل بيانات النموذج
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',   // المستخدم الافتراضي في XAMPP
  password: '',   // كلمة المرور الافتراضية في XAMPP هي فارغة
  database: 'my_website'  // اسم قاعدة البيانات التي أنشأتها في phpMyAdmin
});

// التحقق من الاتصال بقاعدة البيانات
db.connect((err) => {
  if (err) {
    console.log('فشل الاتصال بقاعدة البيانات:', err);
    return;
  }
  console.log('تم الاتصال بقاعدة البيانات بنجاح');
});

// لتقديم ملفات HTML ثابتة
app.use(express.static(path.join(__dirname, 'public')));

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// صفحة الشكر بعد إرسال البيانات
app.post('/submit-form', async (req, res) => {
  const { name, email, phone, password } = req.body;
  
  // تشفير كلمة المرور باستخدام bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // إدخال البيانات في قاعدة البيانات
  const query = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, phone, hashedPassword], (err, result) => {
    if (err) {
      console.log('فشل في إدخال البيانات:', err);
      res.status(500).send('حدث خطأ أثناء إدخال البيانات');
      return;
    }
    console.log('تم إدخال البيانات بنجاح:', result);
    res.redirect('/thankyou.html');
  });
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`السيرفر يعمل على http://localhost:${port}`);
});
