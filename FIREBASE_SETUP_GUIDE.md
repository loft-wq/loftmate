# دليل إعداد Firebase لتطبيق إدارة الحمام الزاجل

## المشاكل المحتملة التي تمنع حفظ البيانات

### 1. تكوين Firebase غير صحيح (الأهم)
**المشكلة:** القيم الافتراضية في الكود غير صحيحة
**الموقع:** السطور 20-25 في الملف

```javascript
const firebaseConfig = {
    apiKey: "your-api-key", // ❌ يجب استبدالها بقيم حقيقية
    authDomain: "your-project.firebaseapp.com", // ❌ يجب استبدالها
    projectId: "your-project-id", // ❌ يجب استبدالها
    storageBucket: "your-project.appspot.com", // ❌ يجب استبدالها
    messagingSenderId: "123456789", // ❌ يجب استبدالها
    appId: "your-app-id" // ❌ يجب استبدالها
};
```

### 2. قواعد أمان Firestore
**المشكلة:** قد تكون القواعد تمنع الكتابة
**الحل:** تأكد من وجود هذه القواعد في Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow test collection for connection testing
    match /test/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. مشاكل الشبكة أو الاتصال
**المشكلة:** انقطاع الاتصال أو مشاكل الشبكة
**الحل:** التطبيق الآن يتعامل مع هذه المشاكل تلقائياً

## خطوات الإصلاح

### الخطوة 1: الحصول على تكوين Firebase الصحيح
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك أو أنشئ مشروع جديد
3. اذهب إلى Project Settings (⚙️)
4. في قسم "Your apps"، اختر "Web app" أو أنشئ واحد جديد
5. انسخ التكوين الصحيح

### الخطوة 2: تحديث التكوين في الكود
استبدل القيم في السطور 20-25 بالتكوين الصحيح من Firebase Console

### الخطوة 3: تفعيل Authentication
1. في Firebase Console، اذهب إلى "Authentication"
2. اختر "Sign-in method"
3. فعّل "Email/Password"

### الخطوة 4: إعداد قواعد Firestore
1. اذهب إلى "Firestore Database"
2. اختر "Rules"
3. استبدل القواعد بالقواعد المذكورة أعلاه
4. اضغط "Publish"

### الخطوة 5: اختبار التطبيق
1. افتح Developer Console (F12)
2. اكتب: `window.runDiagnostics()`
3. تحقق من النتائج

## رسائل الخطأ الشائعة

### "Firebase configuration error"
- **السبب:** تكوين Firebase غير صحيح
- **الحل:** استبدل القيم الافتراضية بتكوين صحيح

### "Permission denied"
- **السبب:** قواعد Firestore تمنع الكتابة
- **الحل:** تحديث قواعد الأمان

### "Cannot connect to Firestore"
- **السبب:** مشاكل في الاتصال أو التكوين
- **الحل:** تحقق من التكوين وقواعد الأمان

### "Authentication required"
- **السبب:** المستخدم غير مسجل دخول
- **الحل:** تسجيل الدخول أولاً

## نصائح إضافية

1. **تحقق من Console:** افتح Developer Console لرؤية رسائل الخطأ التفصيلية
2. **استخدم Diagnostics:** اكتب `window.runDiagnostics()` في Console للفحص الشامل
3. **تحقق من Network:** تأكد من عدم حجب Firebase بواسطة firewall أو proxy
4. **اختبار تدريجي:** جرب تسجيل حساب جديد أولاً قبل اختبار الميزات الأخرى

## ملفات مهمة للفحص

- `firebase_pigeon_manager.html` - الملف الرئيسي للتطبيق
- Firebase Console - لإعدادات المشروع
- Developer Console - لرسائل الخطأ والتشخيص