# 🐦 Racing Pigeon Manager - Firebase Edition

نظام إدارة الحمام الزاجل المتقدم مع تكامل Firebase

## 📋 الوصف

نظام شامل لإدارة الحمام الزاجل يوفر:
- إدارة قاعدة بيانات الحمام
- تتبع نتائج السباقات
- شجرة النسب والأقارب
- تصدير واستيراد البيانات
- واجهة عربية/إنجليزية
- مزامنة سحابية مع Firebase

## 🚀 المميزات الرئيسية

### إدارة الحمام
- ✅ إضافة وتعديل بيانات الحمام
- ✅ البحث والفلترة المتقدمة
- ✅ تنظيم حسب السنوات
- ✅ معلومات النسب والوالدين
- ✅ إدارة الصور والملاحظات

### إدارة السباقات
- 🏆 تسجيل نتائج السباقات
- 📊 إحصائيات الأداء
- 🎯 تتبع المواقع والسرعات
- 📈 تحليل البيانات

### المزايا التقنية
- 🔐 مصادقة آمنة مع Firebase
- ☁️ تخزين سحابي آمن
- 📱 تصميم متجاوب لجميع الأجهزة
- 🌙 دعم الوضع المظلم/المضيء
- 🔄 مزامنة تلقائية

## 🛠️ التثبيت والإعداد

### المتطلبات
- حساب Firebase
- متصفح حديث يدعم ES6+
- اتصال بالإنترنت للمزامنة

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone https://github.com/username/racing-pigeon-manager.git
cd racing-pigeon-manager
```

2. **إعداد Firebase**
   - إنشاء مشروع Firebase جديد
   - تفعيل Authentication و Firestore
   - نسخ إعدادات Firebase إلى `js/firebase-config.js`

3. **تشغيل التطبيق**
   - فتح `index.html` في المتصفح
   - أو استخدام خادم محلي مثل Live Server

### إعداد Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. إنشاء مشروع جديد
3. تفعيل Authentication (Email/Password)
4. تفعيل Cloud Firestore
5. نسخ إعدادات التطبيق إلى `js/firebase-config.js`

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

## 📖 طريقة الاستخدام

### تسجيل الدخول
1. إنشاء حساب جديد أو تسجيل الدخول
2. التحقق من البريد الإلكتروني إذا لزم الأمر

### إدارة الحمام
1. النقر على "إضافة حمامة جديدة"
2. ملء المعلومات المطلوبة
3. حفظ البيانات

### البحث والفلترة
- استخدام مربع البحث للبحث السريع
- اختيار الفلاتر حسب الدولة، السلالة، اللون
- مسح الفلاتر للعودة للعرض الكامل

### تصدير البيانات
1. اختيار "خيارات التصدير"
2. تحديد نوع التصدير المطلوب
3. تحميل الملف

## 🔧 البنية التقنية

### الملفات الرئيسية
- `index.html` - الواجهة الرئيسية
- `css/styles.css` - التنسيقات والستايلات
- `js/firebase-config.js` - إعدادات Firebase
- `js/auth.js` - وظائف المصادقة
- `js/pigeon-manager.js` - الوظائف الأساسية
- `js/utils.js` - الوظائف المساعدة

### التقنيات المستخدمة
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase (Auth + Firestore)
- **UI/UX**: Responsive Design, CSS Grid/Flexbox
- **Security**: Firebase Authentication & Security Rules

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للـ branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف `LICENSE` للتفاصيل.

## 🐛 الإبلاغ عن المشاكل

إذا واجهت أي مشاكل، يرجى فتح issue جديد في GitHub.

## 📞 التواصل

- GitHub: [@username](https://github.com/username)
- Email: your-email@example.com

## 🙏 شكر وتقدير

شكر خاص لجميع المساهمين في تطوير هذا المشروع.

---

**📸 لقطات الشاشة**

[إضافة صور للواجهة هنا]

**🔄 آخر التحديثات**

- v5.0.0 - إضافة Firebase integration
- v4.0.0 - تحسينات UI/UX الرئيسية
- v3.0.0 - إضافة خاصية التصدير/الاستيراد

---

⭐ إذا أعجبك المشروع، لا تنس إعطاؤه نجمة!