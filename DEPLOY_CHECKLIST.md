# قائمة التحقق للنشر والتشغيل الإنتاجي (Production Deployment Checklist)
### منصة تيك بكرة للحلول الهندسية المتكاملة — Tech Bokra

---

## 1. جدول متغيرات البيئة (Environment Variables Matrix)

| اسم المتغير (Variable Name) | الغرض والوصف (Purpose & Description) | هل هو سر؟ (Secret?) | المكان (Scope) | القيمة الافتراضية / مثال |
| :--- | :--- | :--- | :--- | :--- |
| `ADMIN_SESSION_SECRET` | سر التوقيع التشفيري الإجباري لجلسات المشرفين بخوارزمية HMAC-SHA256 لمنع تزوير الكوكيز | **نعم (سر أمني عالي الحساسية)** | Server Only | سلسلة عشوائية 64 حرفاً (`openssl rand -hex 32`) |
| `ADMIN_ALLOWED_EMAILS` | القائمة البيضاء لعناوين البريد الإلكتروني المصرح لها بإدارة الموقع ولوحة التحكم | **نعم (إعداد إداري)** | Server Only | `tam.elshafey@gmail.com,admin@tech-bokra.com` |
| `GEMINI_API_KEY` | مفتاح واجهة الذكاء الاصطناعي لحسابات وأدوات الهندسة عبر السيرفر حصراً | **نعم (سر سحابي)** | Server Only | يتم حقنه تلقائياً في بيئة AI Studio |
| `APP_URL` | الرابط الأساسي للمنصة المنشورة (يستخدم في الروابط والـ Canonical والـ Metadata) | لا | Server Only | `https://tech-bokra.com` |
| `NEXT_PUBLIC_COMPANY_PHONE` | رقم الهاتف الرسمي المعتمد للشركة (يظهر للزوار فقط إن لم يكن TO_CONFIRM) | لا | Client & Server | `+20 101 234 5678` |
| `NEXT_PUBLIC_COMPANY_WHATSAPP` | رقم الواتساب المخصص لطلبات المعاينات والدعم الفني | لا | Client & Server | `201012345678` |
| `NEXT_PUBLIC_COMPANY_EMAIL` | البريد الإلكتروني الرسمي لخدمة العملاء | لا | Client & Server | `Support@tech-bokra.com` |
| `NEXT_PUBLIC_COMPANY_CR` | رقم السجل التجاري للشركة | لا | Client & Server | يُترك فارغاً أو يُحدد بعد التأكيد |
| `NEXT_PUBLIC_COMPANY_TAX_ID` | رقم البطاقة الضريبية المصرية للشركة | لا | Client & Server | يُترك فارغاً أو يُحدد بعد التأكيد |

> **ملاحظة أمنية حاسمة:** لا تقم أبداً بوضع بادئة `NEXT_PUBLIC_` للمتغيرات `ADMIN_SESSION_SECRET` أو `GEMINI_API_KEY`، حيث إن أي متغير يحمل هذه البادئة يتم تضمينه في ملفات الـ JavaScript المفتوحة للزوار في المتصفح.

---

## 2. متطلبات ملفات التكوين والخدمات السحابية (Cloud & Services)

1. **ملف `firebase-applet-config.json`:**
   * يجب أن يحتوي على المعرفات الصحيحة لمشروع Firebase:
     - `projectId`: معرف المشروع السحابي.
     - `apiKey`: مفتاح واجهة مصادقة Google Identity Toolkit.
     - `firestoreDatabaseId`: قاعدة بيانات Firestore المخصصة للمشروع (`ai-studio-techbokra-bb612efd-9fa2-4cc8-ac0c-3110827043fb`).
     - `authDomain`: نطاق المصادقة المصرح به في Firebase Console.

2. **قواعد أمان Firestore (`firestore.rules`):**
   * التأكد من حظر الكتابة العامة على مجموعات `settings/general` و`settings/admin_vault` واقتصارها على المشرفين المصرح لهم.
   * السماح بالقراءة العامة لمجموعة `settings/general` لضمان وصول التحديثات اللحظية لكافة الزوار.

---

## 3. محرك تخزين الوسائط (Cloud Storage Integration)

* **تم الربط الفعلي مع Firebase Storage:**
  يتم رفع الوسائط والصور المرفوعة من لوحة التحكم مباشرة إلى **Firebase Storage** (`eng-inverter-8jmtp.firebasestorage.app/uploads/`) مع حماية مشددة بموجب `storage.rules` (مقتصرة على المشرفين المصرح لهم للملفات تحت 5MB وقراءة عامة لزوار الموقع).
* **آلية التوافق المتعدد (Cascading Fallback):**
  1. الرفع المباشر إلى Firebase Storage مع رابط تحميل دائم وسريع.
  2. في حال انقطاع الاتصال بالسحابة: اللجوء إلى نقطة `/api/upload` للسيرفر.
  3. كخيار أخير: ضغط العميل الداخلي عبر المتصفح (Canvas WebP/JPEG) لضمان عدم تعطل واجهة المشرف إطلاقاً.

---

## 4. خطوات النشر والتشغيل (Deployment Steps)

### الخطوة 1: الفحص والتحقق قبل النشر (Pre-flight Audit)
```bash
# 1. التحقق من خلو الشيفرة من أي أخطاء لغوية أو استيرادات مفقودة
npm run lint

# 2. التحقق من سلامة الأنواع الصارمة في TypeScript
npx tsc --noEmit

# 3. بناء تطبيق Next.js للإنتاج والتأكد من نجاح توليد الـ 43 صفحة بنجاح
npm run build
```

### الخطوة 2: تهيئة متغيرات البيئة في لوحة الاستضافة (Hosting Secrets Setup)
1. في لوحة تحكم المنصة المستضيفة (Vercel Project Settings / Cloud Run Environment Variables):
2. أضف `ADMIN_SESSION_SECRET` كمتغير سري مشفر.
3. أضف `ADMIN_ALLOWED_EMAILS` بقائمة إيميلات الأدمن مفصولة بفواصل.

### الخطوة 3: اختبار استجابة السيرفر بعد النشر (Post-Deployment Healthcheck)
```bash
# فحص كود الاستجابة لصفحة الهبوط (يجب أن يعيد 200)
curl -I https://tech-bokra.com/

# فحص كود الاستجابة لإندبوينت الرفع بدون مصادقة (يجب أن يعيد 401 Unauthorized)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://tech-bokra.com/api/upload
```

### الخطوة 4: تسجيل الدخول الأول وتأكيد الجلسة
1. الدخول إلى الرابط الإداري المشفر: `https://tech-bokra.com/tb-portal-9482x`.
2. تسجيل الدخول بحساب البريد المصرح به (`tam.elshafey@gmail.com`).
3. التأكد من حفظ كوكي `tb_admin_session` المشفر في المتصفح كـ `HttpOnly; Secure`.
4. تجربة رفع صورة من لوحة التحكم والتأكد من إرجاع الرابط بالبادئة الآمنة من Firebase Storage.

---

## 5. إجراء تحديث المحتوى الافتراضي بعد النشر (Post-Deployment Content Seed Update)

عند نشر تحديث برمجي يتضمن تصحيحاً لنصوص المنتجات أو الخدمات أو إضافة عناصر جديدة:
1. **تحديث `CURRENT_CONTENT_VERSION`:** ترقية رقم الإصدار في `lib/siteConfig.ts` بمقدار 1 مع وضع `seedRevision` الجديد على العناصر المصححة.
2. **الدمج التلقائي بالمعرّفات (`mergeCollectionsById`):**
   - فور تشغيل الموقع، تكتشف الدالة تلقائياً العناصر التي يحمل الكود الخاص بها `seedRevision` أعلى من السحابة، وتستبدل النصوص القديمة بالنصوص المعتمدة مع الحفاظ الصارم على خيارات الإظهار والمسودات (`showOnSite`, `isDraft`).
3. **اعتماد التحديث في لوحة التحكم:**
   - الدخول إلى لوحة التحكم `/tb-portal-9482x`، حيث سيظهر شريط تنبيه: *"يوجد تحديث للقيم الافتراضية للنسخة (الإصدار X)"*.
   - الضغط على زر **"دمج المحتوى الجديد بالمعرّفات"**.
   - الضغط على **"حفظ وتحديث فوري"** لاعتماد الإصدار الجديد في مستند Firestore وإعادة تنشيط كاش السيرفر (`revalidateTag`/`revalidatePath`).

