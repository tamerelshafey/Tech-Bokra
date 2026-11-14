# قائمة التحقق للنشر والتشغيل الإنتاجي (Production Deployment Checklist)
### منصة تيك بكرة للحلول الهندسية المتكاملة — Tech Bokra

---

## 1. جدول متغيرات البيئة (Environment Variables Matrix)

| اسم المتغير (Variable Name) | الغرض والوصف (Purpose & Description) | هل هو سر؟ (Secret?) | المكان (Scope) | ماذا يحدث عند غيابه؟ (Behavior When Missing) |
| :--- | :--- | :--- | :--- | :--- |
| `ADMIN_SESSION_SECRET` | **إجباري لدخول الإدارة**: سر التوقيع التشفيري لملف تعريف الجلسة `tb_admin_session` بخوارزمية HMAC-SHA256 | **نعم (سر أمني عالي الحساسية)** | Server Only | يفشل `/api/admin/auth` (POST/GET) ويعيد **HTTP 503** برسالة صريحة على شاشة الدخول: *"متغير ADMIN_SESSION_SECRET غير مضبوط أو ما زال قيمة افتراضية"* |
| `ADMIN_ALLOWED_EMAILS` | **إجباري لدخول الإدارة**: القائمة الحصرية لإيميلات المشرفين مفصولة بفواصل (مثال: `admin@tech-bokra.com,owner@gmail.com`) | **نعم (إعداد إداري إلزامي)** | Server Only | عند غيابه يعيد `/api/admin/auth` **HTTP 503** مع منع أي دخول؛ وعند عدم وجود إيميل المستخدم فيه يعيد **HTTP 403** موضحاً البريد الذي حاول الدخول |
| `BLOB_READ_WRITE_TOKEN` | **إجباري لرفع الوسائط**: التوكن السحابي لمخزن Vercel Blob | **نعم (سر سحابي إلزامي)** | Server Only | يعيد `/api/upload` رمز **HTTP 503** وتظهر في اللوحة رسالة: *"التخزين الدائم غير مفعّل على الخادم"* |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | *(اختياري تماماً)* مفتاح حساب خدمة Firebase Admin في حال الرغبة بفحص سحب الجلسات (`checkRevoked`) مستقبلاً. **ملاحظة:** التحقق الأساسي من التوكن على السيرفر يتم عبر مفاتيح Google x509 العامة (RS256) بدون الاعتماد على Web API Key ولا يتطلب هذا المتغير. | نعم (اختياري) | Server Only | لا يؤثر غيابه على تسجيل الدخول لأن السيرفر يتحقق تشفيرياً عبر شهادة Google العامة (`securetoken@system.gserviceaccount.com`) |
| `GEMINI_API_KEY` | مفتاح واجهة الذكاء الاصطناعي لأدوات وحاسبات الهندسة عبر السيرفر | **نعم (سر سحابي)** | Server Only | تتعطل استعلامات الذكاء الاصطناعي السيرفرية فقط |
| `APP_URL` | الرابط الأساسي للمنصة المنشورة (لـ Canonical والـ Metadata) | لا | Server Only | يُستخدم الدومين الافتراضي `https://tech-bokra.com` |
| `NEXT_PUBLIC_COMPANY_PHONE` | رقم الهاتف الرسمي المعتمد للشركة (يُخفى إذا كان فارغاً أو `TO_CONFIRM`) | لا | Client & Server | يُخفى رقم الهاتف من الواجهة |
| `NEXT_PUBLIC_COMPANY_WHATSAPP` | رقم الواتساب المخصص لطلبات المعاينات والدعم الفني | لا | Client & Server | يُخفى زر/رابط الواتساب |
| `NEXT_PUBLIC_COMPANY_EMAIL` | البريد الإلكتروني الرسمي لخدمة العملاء | لا | Client & Server | يُستخدم البريد البديل المعتمد أو يُخفى |
| `NEXT_PUBLIC_COMPANY_CR` | رقم السجل التجاري للشركة (إن كان فارغاً أو `TO_CONFIRM` يُخفى تماماً) | لا | Client & Server | يُخفى سطر السجل التجاري من الفوتر |
| `NEXT_PUBLIC_COMPANY_TAX_ID` | رقم البطاقة الضريبية للشركة (إن كان فارغاً أو `TO_CONFIRM` يُخفى تماماً) | لا | Client & Server | يُخفى سطر البطاقة الضريبية من الفوتر |

> **ملاحظة أمنية حاسمة:** لا تقم أبداً بوضع بادئة `NEXT_PUBLIC_` للمتغيرات `ADMIN_SESSION_SECRET` أو `ADMIN_ALLOWED_EMAILS` أو `BLOB_READ_WRITE_TOKEN` أو `FIREBASE_SERVICE_ACCOUNT_KEY` أو `GEMINI_API_KEY`.

---

## 2. متطلبات ملفات التكوين والمصادقة (Firebase Auth & Security Rules)

1. **ملف `firebase-applet-config.json` (إجباري لـ Client Auth وFirestore):**
   * يجب أن يحتوي على المعرفات الصحيحة لمشروع Firebase:
     - `projectId`: معرف المشروع السحابي (يُستخدم أيضاً في مطابقة `aud` و`iss` أثناء التحقق التشفيري للتوكن على السيرفر).
     - `apiKey`: مفتاح تطبيق الويب لمصادقة المتصفح (`signInWithPopup` / `signInWithEmailAndPassword`). في حال تقييده بـ HTTP Referrers في Google Cloud Console، **يستمر تحقق السيرفر في `/api/admin/auth` بالعمل بدون أي مشكلة** لأنه يعتمد على مفاتيح Google العامة (x509 RS256) وليس على `apiKey`.
     - `firestoreDatabaseId`: قاعدة بيانات Firestore المخصصة للمشروع (`ai-studio-techbokra-bb612efd-9fa2-4cc8-ac0c-3110827043fb`).
     - `authDomain`: نطاق المصادقة المصرح به في Firebase Console.
   * **عند غياب أو تلف `firebase-applet-config.json`:** يتعطل تسجيل الدخول عبر Google وكلمة المرور من المتصفح وتتوقف قراءة/كتابة Firestore.

2. **النطاقات المصرح بها (Firebase Authorized Domains):**
   * في **Firebase Console > Authentication > Settings > Authorized domains**، يجب إضافة كل نطاق تفتح منه لوحة التحكم (مثل `localhost`، `tech-bokra.com`، ونطاقات Vercel/AI Studio).
   * إذا فُتحت اللوحة من نطاق غير مضاف تظهر رسالة واضحة للمدير: `auth/unauthorized-domain`.

3. **سياسة التحقق من البريد والكوكيز (`tb_admin_session`):**
   * يرفض الخادم أي حساب بريده غير مُحقَّق (`email_verified = false`) برمز `403`.
   * تُصدر كوكي الجلسة `tb_admin_session` بخصائص `HttpOnly; SameSite=Lax; Path=/` مع `Secure=false` على `http://localhost` و`Secure=true` تلقائياً على `HTTPS` وبدون فرض `Domain` خاطئ.

4. **قواعد أمان Firestore (`firestore.rules`):**
   * التأكد من حظر الكتابة العامة على مجموعات `settings/general` و`settings/admin_vault` واقتصارها على المشرفين المصرح لهم.
   * السماح بالقراءة العامة لمجموعة `settings/general` لضمان وصول التحديثات اللحظية لكافة الزوار.

---

## 3. محرك تخزين الوسائط السحابي (Vercel Blob Integration)

* **الرفع السحابي عبر Vercel Blob:**
  يتم رفع الصور والوسائط من لوحة التحكم مباشرة إلى مخزن **Vercel Blob** (`*.public.blob.vercel-storage.com`) عبر نقطة النهاية الموثقة `/api/upload` المحمية بجلسة المشرف.
* **الضغط الذكي الفوري داخل المتصفح (Client-Side Compression):**
  1. فحص نوع الملف وقصر الرفع على الصيغ المدعومة (JPG وPNG وWebP).
  2. إذا كان الملف أقل من 400KB وبصيغة مدعومة، يُرفع مباشرة دون ضغط إضافي.
  3. في حال كان الملف أكبر حجماً، يتم ضغطه وتحويله إلى صيغة WebP بحد أقصى للأبعاد 1600px وبجودة 0.82 عبر Canvas مع الحفاظ التام على الشفافية للشعارات والأيقونات.
  4. لا يُستخدم مجلد `public/uploads` المحلي ولا Firebase Storage في رفع الوسائط لضمان التوافق التام مع معمارية Vercel السحابية Serverless.

---

## 4. خطوات النشر والتشغيل (Deployment Steps)

### الخطوة 1: الفحص والتحقق قبل النشر (Pre-flight Audit)
```bash
# 1. التحقق من خلو الشيفرة من أي أخطاء لغوية أو استيرادات مفقودة
npm run lint

# 2. التحقق من سلامة الأنواع الصارمة في TypeScript
npx tsc --noEmit

# 3. بناء تطبيق Next.js للإنتاج والتأكد من نجاح توليد المسارات بنجاح
npm run build
```

### الخطوة 2: تهيئة متغيرات البيئة في لوحة الاستضافة (Hosting Secrets Setup)
1. في لوحة تحكم المنصة المستضيفة (Vercel Project Settings):
2. أضف `ADMIN_SESSION_SECRET` كمتغير سري مشفر.
3. أضف `ADMIN_ALLOWED_EMAILS` بقائمة إيميلات الأدمن مفصولة بفواصل.
4. تأكد من ربط مخزن Vercel Blob (`tech-bokra-media`) بالمشروع، وهو ما يضيف متغير `BLOB_READ_WRITE_TOKEN` تلقائياً لكل البيئات.

### الخطوة 3: اختبار استجابة السيرفر بعد النشر (Post-Deployment Healthcheck)
```bash
# فحص كود الاستجابة لصفحة الهبوط (يجب أن يعيد 200)
curl -I https://tech-bokra.com/

# فحص كود الاستجابة لإندبوينت الرفع بدون مصادقة (يجب أن يعيد 401 Unauthorized)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://tech-bokra.com/api/upload
```

### الخطوة 4: تسجيل الدخول الأول وتأكيد الجلسة
1. الدخول إلى الرابط الإداري المشفر: `https://tech-bokra.com/tb-portal-9482x`.
2. تسجيل الدخول بالبريد الإلكتروني المضاف إلى متغير `ADMIN_ALLOWED_EMAILS`.
3. التأكد من حفظ كوكي `tb_admin_session` المشفر في المتصفح كـ `HttpOnly; Secure`.
4. تجربة رفع صورة من لوحة التحكم والتأكد من إرجاع الرابط بالبادئة المعتمدة من Vercel Blob (`*.public.blob.vercel-storage.com`)، أو إظهار "التخزين الدائم غير مفعّل على الخادم" في حال عدم ربط الـ Token.

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

---

## 6. قواعد وضوابط خفض استهلاك عمليات إعادة التوليد التزايدي (Minimizing Vercel ISR Writes)

لحماية باقة Vercel (Hobby Tier 200K writes/month) من التجاوز وضمان بقاء الموقع مجانياً وفائق السرعة:

1. **الاعتماد الصارم على التوليد الثابت (Static Generation):**
   * كافة صفحات الموقع العامة (`/`, `/services`, `/services/*`, `/projects`, `/projects/*`, `/faq`, `/process`, `/contact`, `/engineering-hub`, `/estimator`, `/tenders`, `/sitemap.xml`) تم ضبطها بـ `export const revalidate = false;` و`export const dynamic = 'force-static';`.
   * يمنع منعاً باتاً إضافة `export const revalidate = N;` (بالثواني) في أي صفحة عامة أو في `app/layout.tsx`، حيث كانت تسبب إعادة توليد مستمرة في الخلفية مع كل زيارة أو زحف من محركات البحث.

2. **التحديث عند الطلب فقط (On-Demand Revalidation):**
   * يتم تحديث صفحات الموقع فقط عند قيام المشرف بالضغط على "حفظ وتحديث فوري" في لوحة التحكم `/tb-portal-9482x`، حيث تستدعي الإندبوينت `/api/admin/config` دالة `revalidatePath` لتحديث الكاش مرة واحدة فقط عند الحاجة الحقيقية بدلاً من التحديث الزمني العشوائي.

3. **الفحص والبناء المحلي قبل النشر (Pre-deploy Build Audit):**
   * قبل رفع أي كود إلى GitHub/Vercel، نفّذ محلياً:
     ```bash
     npm run build && npx tsc --noEmit
     ```
   * تأكد من أن كل الصفحات تظهر بعلامة `○ (Static)` في مخرجات البناء، وخلوها من الأخطاء حتى لا تستهلك محاولات البناء رصيد الـ Writes.

4. **تجنب النشر البرمجي لتعديلات المحتوى (Content via Admin CMS):**
   * لتغيير أي نص أو رقم هاتف أو مشروع أو خدمة أو صورة، استخدم لوحة التحكم السحابية المباشرة `/tb-portal-9482x` بدلاً من تعديل الكود وعمل Git Commit/Deploy الذي يعيد بناء وتوليد كل الصفحات من الصفر.

5. **إيقاف الـ Preview Deployments غير الضرورية في Vercel:**
   * من إعدادات Vercel Project > Settings > Git:
   * اجعل النشر التلقائي محصوراً على فرع الإنتاج الأساسي (`main`), أو قم بإيقاف الـ Automatic Preview Deployments للفروع التجريبية لتفادي مضاعفة عمليات التوليد على بيئات الاختبار.

6. **المراقبة الدورية للـ ISR من لوحة Vercel:**
   * افتح دورياً: **Vercel Dashboard > Project > Observability / Monitoring > Data Cache / ISR**.
   * راقب مؤشر **ISR Writes** وتأكد من أن نسبة **HIT Rate** تتجاوز 98% وأن عدد الـ Revalidations يظل منخفضاً وقريباً من الصفر في الأيام العادية.

---

## 7. فحص الجودة والأمان الصارم بعد النشر (Post-Deployment Quality & Security Audit)

فور إتمام نشر أي تحديث جديد على Vercel أو النطاق الإنتاجي (`https://tech-bokra.com`)، يجب تنفيذ الخطوات الرقابية التالية بالترتيب:

### 1. اختبار كود الحالة 404 للمسارات المحظورة وغير الموثقة:
تأكد من أن السيرفر يعيد رمز الحالة `404 Not Found` لصفحة المشاريع ولأي مشروع محذوف أو غير موثق:
```bash
# يجب أن تعيد جميعها HTTP 404 حصراً
curl -s -o /dev/null -w "%{http_code}\n" https://tech-bokra.com/projects
curl -s -o /dev/null -w "%{http_code}\n" https://tech-bokra.com/projects/alrehla
curl -s -o /dev/null -w "%{http_code}\n" https://tech-bokra.com/projects/widad-tech
curl -s -o /dev/null -w "%{http_code}\n" https://tech-bokra.com/projects/helio-property

# فحص خريطة الموقع sitemap.xml والتأكد من خلوها تماماً من أي رابط مشاريع
curl -s https://tech-bokra.com/sitemap.xml | grep -i "projects"
```

### 2. فحص الفوتر وصفحة التواصل والتأكد من فلترة القيم غير المؤكدة:
- فتح الفوتر في الصفحة الرئيسية وصفحة `/contact`.
- التأكد من إخفاء سطر السجل التجاري والبطاقة الضريبية بالكامل في حال عدم تعيينهما رسمياً (تم حذف نص "قيد الاعتماد الرسمي" ليكون الفوتر أنيقاً وخالياً من أي نصوص مؤقتة).

### 3. فحص تسرب المعايير في مصدر الصفحة (Page Source Inspection):
افحص سورس صفحة الهبوط وإحدى صفحات الخدمات عبر تصفح كود الصفحة المصدري (View Page Source / `curl`):
```bash
# التحقق من عدم تسرب وسوم TO_CONFIRM في كود HTML أو نصوص JavaScript
curl -s https://tech-bokra.com/ | grep -i "TO_CONFIRM"

# التحقق من عدم وجود سلاسل Base64 ثقيلة مدمجة في صفحة الخدمات
curl -s https://tech-bokra.com/services/security/cctv-ai-analytics | grep -i "data:image"

# التحقق من عدم وجود معرفات المشاريع المحذوفة
curl -s https://tech-bokra.com/ | grep -E "alrehla|helio-property|widad-tech"
```

### 4. مراجعة مؤشرات Vercel Observability بعد 24 ساعة:
- الدخول إلى **Vercel Dashboard > Tech Bokra Project > Observability / Analytics**.
- التحقق من تبويب **Data Cache / ISR**:
  1. التأكد من أن معدل **ISR Writes** اليومي مستقر عند أقل من 100 كتابة (ناتجة فقط عن تحديثات المشرف الصريحة).
  2. التأكد من بقاء معدل الكاش **Cache Hit Rate** أعلى من 95%.
  3. التأكد من عدم وجود مسارات تسجل أخطاء 500 أو استدعاءات إبطال دورية.

