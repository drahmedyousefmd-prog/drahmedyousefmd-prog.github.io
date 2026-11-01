# SPLIT_REPORT — فصل روشتة / استشارة إلى موقعين مستقلين

تقرير تنفيذ مراحل الفصل. تحديث بعد كل مرحلة، ثم توقّف بانتظار موافقة المستخدم
(القاعدة 4).

---

## المرحلة 0 — التحضير والجرد (2026-10-11)

الحالة: جرد كامل بدون أي تعديل على المصدر. فرعا الاحتياط جاهزان.

### 0.1 النسخة الاحتياطية

| مستودع | الفرع الاحتياطي | عند HEAD |
|---|---|---|
| rochetta-web (`drahmedyousefmd-prog.github.io`) | `backup/pre-split` (Jimأيضًا origin) | `6c03fc1` |
| estesharah (`drahmedyousefmd-prog/estesharah`) | `backup/pre-split` (on origin) | `018b068` |

### 0.2 التقنية الفعلية المستخدمة

| | روشتة | استشارة (الحالي) |
|---|---|---|
| Framework | **Next.js 16.3.5 (Turbopack)** — App Router | نفس |
| Rendering | `output: "export"` — موقع ثابت 100% | نفس |
| React / TS | React 19 + TypeScript strict + ESLint (`eslint-config-next`) | نفس |
| Styling | Tailwind v4 (`@tailwindcss/postcss`) + CSS يدوي في `globals.css` + طبقة رموز `design-tokens.css` | نفس |
| Fonts | `next/font` Cairo + Tajawal + Inter (محفوظة ذاتيًا) | نفس |
| Icons | lucide-react + أيقونات SVG مخصصة | نفس |
| Router | App Router قوائم ثابتة (generateStaticParams للـ 72 حالة/9 فصول/6 خدمات) | نفس |
| النشر (روشتة) | **User site** على جذر `dra…github.io`: فرع `gh-pages` + `.nojekyll` عبر `scripts/deploy.ps1` (بنية ثم مزامنة out/) | — |
| النشر (استشارة) | — | **Project site** على `/estesharah/`: `basePath`/`assetPrefix="/estesharah"` في `next.config.ts` + فرع `gh-pages` عبر `scripts/deploy.ps1` |
| كيفية عمل المسارات العميقة على GitHub Pages | يُخرج Next 16 لكل مسار ملف `route.html` **وإخًا** مجلدًا `route/` (بـ index.html للمسارات ذات معاملات). GitHub Pages يخدم `/doctor/inbox` بدون امتداد من `doctor/inbox.html` (friendly URL) — تحقّق حي: `/doctor/inbox` و `/patient` وتحديثات المسارات العميقة كلها 200. أي مسار غير موجود → `404.html` مخصص. لاستشارة: نفس الشيء لكن تحت البادئة `/estesharah` | |
| Backend | **لا شيء** — localStorage فقط (بلا أي Firebase/Tickets) | Firebase مُجهّز **مغلق**: `lib/firebase/config.ts` = `null` حتى الملء؛ لا يُحمَّل SDK إلا عند الضبط |
| مفاتيح localStorage | `rochetta-mode` (عرض), `rochetta-users`, `rochetta-tickets`, `rochetta-session`, `rochetta-guest-token`, `rochetta_recents`, `rochetta-animated` (session) | **يُعيد استخدام نفس مفاتيح `rochetta-*` حاليًا** (مصدر قصور = يتطلب البادئة `estesharah:` طبقًا للقاعدة 4.2) + `estesharah-mode` |

### 0.3 جرد يخص الاستشارة في روشتة (يُنسخ إلى استشارة ثم يُحذف لاحقًا في المرحلة 3)

**مسارات App (روشتة):**
```
app/doctor/inbox/page.tsx            ← لوحة طلبات المرضى (ينتقل إلى استشارة /doctor/inbox)
app/import/page.tsx + ImportClient.tsx ← صفحة الاستيراد عبر رابط واتساب/جيميل (يُلغى عند توفر Backend)
app/patient/*  (page, new/[serviceType], tickets) ← بوابة المريض (→ استشارة)
app/login/page.tsx                   ← دخول طبيب/مريض (→ استشارة: دخول الطبيب فقط)
app/layout.tsx (خطوط wa-fab + شارة "دعم 24/7") ← زر الواتساب العائم للاستشارة
```

**مكوّنات:**
```
components/patient/   PatientHome, PatientServices, ServiceForm, PatientTicketsApp
components/doctor/    DoctorInboxApp (يُعاد تشكيله لاستشارة + صفحة رد جديدة)
components/login/     PortalLogin (كارت الطبيب لنقل إلى استشارة)
components/portal/    PortalTopbar, PortalSafetyBanner, ticket-utils, RequireRole
components/icons.tsx  WhatsAppIcon + أيقونة القلب/سماعة الزهرية (تُنسخ)
```

**مكتبات:**
```
lib/services.ts        تعريف الخدمات الست
lib/portal-store.ts    تذاكر+حسابات+guest_token (سيُقسَّم: نسخة استشارة كاملة، ونسخة روشتة للطبيب فقط)
lib/firebase/*         موجود فقط في استشارة (مغلق) — يبقى هناك
```

**نصوص/عناصر واجهة:** Hero «اطلب خدمتك مباشرة…» + زر «اطلب خدمة» (فنethodاستشارة)، زر واتساب العائم + شارة «دعم على مدار الساعة 24/7»، شريط إخلاء المسؤولية + قائمة أعراض الطوارئ (SafetyBanner / قائمة الفحص في ServiceForm).

### 0.4 جرد يخص روشتة فقط (يبقى ويُحافظ عليه — لا تعديل على بيانات الحالات)

```
app/doctor/page.tsx (DoctorLanding), doctor/case/[id], doctor/chapter/[slug], doctor/categories
components/ HomeApp, SiteNav, CaseDetailClient, ChapterPageApp, ChapterCard, CaseRowCard,
            CaseCard, SearchBar, RecentsStrip, CreatorFooter, JsonLd, ui/* (تواتع عامة)
التوجيه/التذييل: دخول/خروج الطبيب الحالي، «أضف حالة»، روابط الرئيسية/التصنيفات/تواصل
lib/ chapters.ts, content.ts, recents.ts, transition.ts, types.ts, mode.tsx (عرض طبيب/مريض على
     صفحات الحالات — يُحذف تحوّل «المريض» منه في المرحلة 3 لصالح استشارة الخارجية)
data/prescriptions.json (72 حالة — لا يُلمس)
scripts/ validate-data.mjs, hero-doctor.mjs، generate-*، deploy.ps1
المواضيع اللونية الحالية: تركواز/أخضر في الطرفين — المرحلة 3 تجعلها زرقاء لروشتة وردية لاستشارة
```

### 0.5 شجرة ملفات مقترحة لمشروع استشارة الجديد (المرحلة 1)

```
estesharah/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # ثيم زهري، خطوط، تذييل إخلاء + «هل أنت طبيب؟ روشتة»، wa-fab
│   │   ├── page.tsx                  # 【አhenic】Hero + بطاقات الخدمات الست
│   │   ├── request/[service]/page.tsx  # نموذج الطلب (ضيف) — generateStaticParams للـ 6
│   │   ├── ticket/[id]/page.tsx        # شات التذكرة للمريض (guest_token)
│   │   ├── my-requests/page.tsx        # طلبات هذا المتصفح
│   │   ├── login/page.tsx              # دخول الطبيب فقط
│   │   ├── doctor/inbox/page.tsx       # لوحة طلبات المرضى (محمية)
│   │   ├── doctor/ticket/[id]/page.tsx # صفحة رد الطبيب + المرفقات + المساعد الآلي (محمية)
│   │   ├── manifest.webmanifest / not-found / robots.ts / sitemap.ts
│   ├── components/
│   │   ├── patient/   PatientHome, PatientServices, ServiceForm, GuestPage..., MyRequests…
│   │   ├── doctor/    DoctorInboxApp, DoctorReplyApp
│   │   ├── login/     PortalLogin (كارت الطبيب)
│   │   ├── portal/    PortalTopbar, RequireRole, SafetyBanner, ticket-utils
│   │   ├── icons.tsx (فساتين استشارة زهرية), JsonLd, CreatorFooter (نسخة استشارة)
│   ├── lib/
│   │   ├── site.ts (اسم «استشارة»، ROCHETTA_URL — رابط واحد مركزي)
│   │   ├── services.ts, portal-store.ts (بادئة `estesharah:`)، transition.ts, types.ts
│   │   └── firebase/ config.ts, firestore.ts  (المرحلة 2)
│   ├── styles/  tokens.css + components.css (بلوحة زهرية كاملة)
│   ├── firestore.rules / FIREBASE_SETUP.md (المرحلة 2 تفعّل وتملأ الإعداد)
├── scripts/ deploy.ps1 (كىما هو), generate-icons.mjs, generate-og.mjs
├── next.config.ts      # basePath/assetPrefix = /estesharah (مؤقت حتى الدومين الخاص)
```

**قرارات تُؤخذ لاحقًا (تُطرح على المستخدم):**
- استبدال المسارين الحاليين `app/new/[serviceType]` و`app/tickets` بالمسارات المطلوبة `/request/[service]` و`/ticket/[id]` و`/my-requests` (إعادة تسمية/إعادة هيكلة).
- صفحة `/import` في روشتة: مع وجود Backend (Firestore) يصبح الاستيراد اليدوي عبر الرابط زائدًا — يُقترح إلغاؤه من استشارة والاعتماد على التزامن اللحظي في `/doctor/inbox`.
- حساب حسابات المرضى عبر الأجهزة (email/phone) مؤجل — الضيف المزامَن عبر Firestore هو مسار العمل الأساسي.
- بدء مفاتيح localStorage الاستشارية بالبادئة `estesharah:` (تعمل الآن `rochetta-*`).

---

*نهاية تقرير المرحلة 0 — في انتظار موافقة المستخدم قبل المرحلة 1.*

---

## المرحلة 1 — بناء استشارة كاملة (بوابة المريض + دخول الطبيب) (2026-10-11)

الحالة: التنفيذ مكتمل، `lint` نظيف و`build` أخضر، والمخرجات متحقَّق منها. في
انتظار موافقة المستخدم قبل المرحلة 2.

### 1.1 القرارات المعتمدة من المستخدم (قبل البدء)

1. **إلغاء `/import` من استشارة** — التزامن اللحظي عبر Firestore (المرحلة 2) يغني عن
   الاستيراد اليدوي عبر الرابط.
2. **استبدال المسارات الحالية** بالبنية الجديدة: `/request/[service]`، `/ticket/[id]`،
   `/my-requests` (مع حذف `app/new/` و`app/tickets/`).
3. **تطبيق الثيم الزهري في هذه المرحلة** (لا تأجيله للمرحلة 3).

### 1.2 الهوية والثيم الزهري

| الطبقة | التعديل |
|---|---|
| `src/lib/site.ts` | `DOCTOR_SITE_URL` ← `ROCHETTA_URL` (نفس القيمة)؛ `brandLine` «استشارات طبية»؛ `themeColor #EC4899`؛ `backgroundColor #FDF6FA` |
| `src/styles/tokens.css` | لوحة زهرية كاملة: `--brand #ec4899`، `--brand-dark #be185d`، `--brand-tint #fdf2f8`، `--bg #fdf6fa`، `--surface-raised #fbeff6`، `--border #f3d4e5`، محاور النص `#2a1a24/#5e4452`؛ **حُذفت رموز تصنيفات الأدوية (`--cat-*`) ورموز تبويبات الحالة (`--tab-*`) غير المستخدمة** لإزالة أي أزرق/تركواز |
| `assets/css/design-tokens.css` | تدرجات الخلفية، `--color-primary/-dark/-light`، `--color-accent`، حدود، ظلال، حالة focus — كلها زهرية |
| `src/app/globals.css` | تدرّج صورة الـ Hero بنفسجي زهري، حالة focus، `.tab.active.patient → var(--color-accent)` |
| `src/app/manifest.webmanifest` | الاسم «استشارة — استشارات طبية»، `theme_color #ec4899`، `background_color #fdf6fa` |
| `src/lib/services.ts` | استشارة عامة `#ec4899`، خطة غذائية `#16a34a` |

### 1.3 الشعار المخصص (قلب + نبض)

- `src/components/icons.tsx`: `LogoGlyph` = قلب + خط نبض؛ `LogoMark` = مربع زهري + قلب أبيض.
- `scripts/generate-icons.mjs`: `BRAND` زهري + هندسة قلب جديدة (فصّان + إسفين + polyline النبض) بدلًا من الكبسولة؛ أُعيد توليد كل الأيقونات و`favicon.ico` (688B).
- `public/logo-mark.svg` مُعاد كتابته (مربع زهري + قلب أبيض + نبض زهري).
- `scripts/generate-og.mjs`: إعادة تلوين الـ OG إلى الزهري.

### 1.4 المسارات (App Router)

| المسار | الملف | الوصف |
|---|---|---|
| `/` | `src/app/page.tsx` | Hero + بطاقات الخدمات الست |
| `/request/[service]` | `src/app/request/[service]/page.tsx` | نموذج الطلب (ضيف) — 6 مسارات مُولَّدة |
| `/ticket/[id]` | `src/app/ticket/[id]/page.tsx` | شات التذكرة للمريض (guest_token) |
| `/my-requests` | `src/app/my-requests/page.tsx` | طلبات هذا المتصفح |
| `/login` | `src/app/login/page.tsx` | دخول الطبيب فقط → `/doctor/inbox` |
| `/doctor/inbox` | `src/app/doctor/inbox/page.tsx` | لوحة طلبات المرضى (محمية `RequireRole`) |
| `/doctor/ticket/[id]` | `src/app/doctor/ticket/[id]/page.tsx` | رد الطبيب + مرفقات + لوحة مساعد (محمية) |

حُذف `src/app/tickets/` و`src/app/new/`؛ وحُدِّث `src/app/sitemap.ts` من `/new/` إلى
`/request/${s.type}`.

**ملاحظة المسارات ذات المعامل (Static export):** `/ticket/[id]` و`/doctor/ticket/[id]`
تستخدمان `generateStaticParams` كعنصر نائب (`[{ id: "ticket" }]`) مع حلّ المعرّف من
`useParams` في المتصفح. تجربة الروابط العميقة لأي UUID حقيقي (تحويل 404) مؤجَّلة للمرحلة 4.

### 1.5 المكوّنات

**جديدة:** `src/components/portal/RequireRole.tsx`، `src/components/doctor/DoctorInboxApp.tsx`
(يُصدّر `DoctorTicketChat`)، `src/components/doctor/DoctorTicketByUrl.tsx`،
`src/components/patient/TicketByUrl.tsx`.

**مُعاد كتابتها:** `login/PortalLogin.tsx` (طبيب فقط)، `patient/PatientHome.tsx` (Hero +
قسم تواصل + تذييل «هل أنت طبيب؟ روشتة» + «روشتة — دليل الطبيب»)، `patient/PatientServices.tsx`
(عنوان «خدماتنا»، `href=/request/…`)، `patient/PatientTicketsApp.tsx` (شات «طلباتي»،
يُصدّر `PatientTicketChat`)، `patient/ServiceForm.tsx` (استخدام `ROCHETTA_URL`، زر متابعة
`/my-requests`، موضوع البريد «عبر استشارة»).

### 1.6 التحقق

| الفحص | النتيجة |
|---|---|
| `npm.cmd run lint` | 0 أخطاء، تحذيران `<img>` (موروثان، كما في روشتة) |
| `npm.cmd run build` | ناجح — 18 صفحة، TypeScript نظيف |
| `out/` — صفحات HTML | `index`، `login`، `my-requests`، `request/{6}`، `ticket/ticket`، `doctor/inbox`، `doctor/ticket/ticket`، `_not-found`/`404` |
| فحص الألوان | لا وجود لأي أزرق/تركواز برمجي في المخرجات — 16 موضعًا زهريًا، 0 بقايا |

### 1.7 تحذير مرحلة 1 (يُعالَج في المرحلة 2)

الرابط الأمامي في `ServiceForm` ما زال يستهدف `${ROCHETTA_URL}/import`. وبما أن روشتة
واستشارة أصلان (origin) مختلفان، فذاكرة `localStorage` غير مشتركة، لذا لن يظهر الاستيراد
اليدوي في صندوق استشارة. هذا يُلغى نهائيًا عند تفعيل Firestore في المرحلة 2.

### 1.8 ما زال مؤجلًا

- مفاتيح `localStorage` ما زالت `rochetta-*` (إعادة الترميز إلى `estesharah:` = المرحلة 4).
- تجربة الروابط العميقة لأي UUID (تحويل 404) = المرحلة 4.
- تفعيل Firebase وملء القواعد = المرحلة 2 (بانتظار قيم المستخدم).

*نهاية تقرير المرحلة 1 — في انتظار موافقة المستخدم قبل المرحلة 2.*

---

## المرحلة 2 — طبقة Firebase (Firestore + Storage + الحماية) (2026-10-11)

الحالة: **الكود مكتمل، `lint` نظيف و`build` أخضر، والمزامنة المُشغَّلة تبقى
مطفأة** (`FIREBASE_CONFIG = null`) حتى يزوّد المستخدم قيم مشروع Firebase.
قرار المستخدم: **بناء الكود الآن والتفعيل لاحقًا**، و**App Check عبر reCAPTCHA v3**.

### 2.1 نموذج البيانات (Firestore)

| المسار | المحتوى | من يقرأ |
|---|---|---|
| `tickets/{ticketId}` | حقول التذكرة + `owner_uid` + `attachments[{name,type,url}]` (رابط Storage) + `last_message` | صاحب التذكرة (owner_uid) أو الطبيب |
| `tickets/{ticketId}/messages/{id}` | رسائل الشات | صاحب التذكرة أو الطبيب |
| `tickets/{ticketId}/private/assistive` | مخرَج المحرك الآلي (`visible_to_patient:false`) | **الطبيب فقط** |
| `admin/doctors/{uid}` | دلالة الطبيب الموثوق (DOCTOR_UID) | القراءة عامة، الكتابة عبر الكونسول |

- `src/lib/firebase/firestore.ts` أُعيد كتابته: نُقل `assistive_engine_output`
  خارج وثيقة التذكرة العامة إلى `private/assistive`؛ وأُضيفت
  `writeAssistive`/`readAssistive` و`subscribeDoctorTickets`.

### 2.2 المرفقات عبر Cloud Storage

- `pushTicket` يرفع كل مرفق إلى `tickets/{ticketId}/{name}` ثم يخزّن
  `getDownloadURL` في وثيقة التذكرة. الحد **10 ميجابايت** ونوع **صورة/PDF**،
  مفروضًا في العميل (`MAX_ATTACHMENT_BYTES`) وفي `storage.rules`.
- `src/components/patient/ServiceForm.tsx`: رُفع حد الملف من 2.5 إلى 10 ميجابايت
  لتطابق القاعدة.

### 2.3 قواعد الأمان

- **`firestore.rules`** أُعيد كتابته: أُصلح خلل `isOwner` (كان يقارن
  `guest_token` بادّعاء غير موجود)؛ الملكية الآن `owner_uid == request.auth.uid`.
  أُضيفت قاعدة `private/{docId}` (الطبيب فقط) و`create` يفرض
  `owner_uid == request.auth.uid`. الطبيب = وجود وثيقة `admin/doctors/{uid}`.
- **`storage.rules`** (ملف جديد): رفع ≤10MB صورة/PDF، قراءة للطبيب أو صاحب
  التذكرة، والحذف للطبيب.

### 2.4 الحماية من إساءة الاستخدام

- **honeypot**: حقل مخفي (`company`) في `ServiceForm`؛ امتلاؤه = إسقاط صامت.
- **مهلة إرسال:** 20 ثانية بين الطلبات عبر `rochetta-last-submit`.
- **App Check:** `src/lib/firebase/appcheck.ts` (reCAPTCHA v3) يُهيّأ من
  `loadApp` عند وجود `APP_CHECK_SITE_KEY` في `config.ts` (فارغ الآن ⇒ مطفأ).

### 2.4 التحقق

| الفحص | النتيجة |
|---|---|
| `npm.cmd run lint` | 0 أخطاء، تحذيران `<img>` (موروثان) |
| `npm.cmd run build` | ناجح — لا أخطاء TypeScript |

### 2.5 حلّ قيد المرحلة 1

أُزيل رابط `/import` والاعتماد عليه من `ServiceForm` (لم يبقَ سوى إشعار
واتساب/جيميل اختياري)، إذ حلّ محلّه التزامن اللحظي عبر Firestore.

### 2.6 خطوات التفعيل (تحتاج إجراء المستخدم)

1. إنشاء مشروع Firebase وملء `FIREBASE_CONFIG` في `src/lib/firebase/config.ts`.
2. لصق مفتاح reCAPTCHA v3 في `APP_CHECK_SITE_KEY` (اختياري).
3. نشر القواعد: `firebase deploy --only firestore:rules,storage`.
4. إنشاء وثيقة `admin/doctors/{DOCTOR_UID}` بعد دخول الطبيب بـ Firebase Auth.

*نهاية تقرير المرحلة 2 — الكود مكتمل، والتفعيل بانتظار قيم Firebase من المستخدم.*

---

## المرحلة 3 — إعادة هوية روشتة + تحويل مسارات الاستشارة (2026-10-12)

الحالة: **مكتملة (إعادة تسمية + تحويل فقط، دون حذف).** قرار المستخدم:
**«Rebrand + redirect only, defer deletion»** — يبقى كود بوابة المريض على القرص
مؤقتًا (ملفات غير مستوردة) حتى اجتياز قائمة المرحلة 6.

### 3.1 لوحة الألوان الجديدة (أزرق طبي)

| الرمز | قبل (تركواز) | بعد (أزرق) |
|---|---|---|
| `--color-primary` / `--brand` | `#1ba39c` | `#2563eb` |
| `--color-primary-dark` / `--brand-dark` | `#14837d` | `#1d4ed8` |
| `--color-primary-light` / `--brand-tint` | `#e3f5f3` | `#dbeafe` |
| `--color-accent` | `#2d9cdb` | `#2563eb` |
| `--color-bg-start` / `--bg` | `#eaf6f8` | `#eef4fb` |
| `--color-bg-end` / `--surface-raised` | `#f6fbfc` | `#f8fbff` / `#f4f8fe` |
| `--color-text-heading` / `--text-primary` | `#16323a` | `#12233b` |
| `--color-text-body` / `--text-secondary` | `#5c7378` | `#5a7089` |
| `--color-text-muted` | `#8fa3a7` | `#8fa3b8` |
| `--color-border` | `#dceef0` | `#d9e6f5` |
| ظلال/تركيز | `rgba(27,73,79,…)` / `rgba(27,163,156,.14)` | `rgba(18,35,59,…)` / `rgba(37,99,235,.14)` |
| تدرّج الغلاف البطل | `rgba(234,246,248,…)` | `rgba(238,244,251,…)` |

المصادر: `assets/css/design-tokens.css`، `src/styles/tokens.css`، `src/app/globals.css`،
`src/components/icons.tsx`، `scripts/generate-icons.mjs` (`BRAND`)، `scripts/generate-og.mjs`.

### 3.2 النص والعنوان

- `src/lib/site.ts`: أُضيف `nameAr: "روشتة"`؛ `brandLine` → «دليل الطبيب»؛
  `taglineAr` → «دليلك كطبيب إلى أحدث الروشتات الطبية»؛ `themeColor` → `#2563eb`،
  `backgroundColor` → `#f8fbff`.
- `src/app/layout.tsx`: العنوان الافتراضي = «روشتة — دليل الطبيب».
- `src/app/manifest.webmanifest`: الاسم «روشتة — دليل الطبيب»، والألوان محدَّثة.
- `HomeApp` البطل: «دليل الطبيب الموثوق» + «دليلك كطبيب / إلى أحدث الروشتات»،
  والعنوان الفرعي = `SITE.heroLine`.

### 3.3 إزالة مبدّل «طبيب/مريض»

- `CaseDetailClient`: حُذف `useMode` و`ModeSwitch`؛ `isPatient = false` دائمًا.
- `HomeApp`: حُذف `useMode` وخاصية `forceDoctor`؛ طريقة العرض = طبيب دائمًا.
- `SiteNav`: أُزيل زر «طبيب» ووضع «خدمات المريض»؛ بقي رابط «استشارة» الخارجي فقط.
- `doctor/categories/page.tsx`: أُزيل تمرير `forceDoctor`.

### 3.4 تحويل مسارات الاستشارة إلى موقع estesharah

بما أن `output: "export"` يمنع تحويلات الخادم، أُنشئ مكوّن عميل
`src/components/RedirectToConsult.tsx` (`window.location.replace` + رابط يدوي):

| مسار روشتة | الهدف في استشارة |
|---|---|
| `/patient` | `PATIENT_SITE_URL` (الرئيسية) |
| `/patient/tickets` | `/my-requests` |
| `/patient/new/[serviceType]` | `/request/[serviceType]` |
| `/login` | `/login` |
- `/import` → الصفحة الرئيسية لموقع الاستشارة.

### 3.4 التحقق

| الفحص | النتيجة |
|---|---|
| `npm.cmd run lint` | 7 مشاكل (5 أخطاء، 2 تحذيران) — **مطابقة تمامًا لخط الأساس قبل تعديلات المرحلة 3** (لا أخطاء جديدة) |
| `npm.cmd run build` | ناجح — 101 صفحة ثابتة، TypeScript نظيف |
| فحص الألوان في `out/` | 0 بقايا تركواز (`1ba39c`/`1f5b54`/`e3f5f3`) |
| صفحات التحويل | `patient.html`، `patient/tickets.html`، `patient/new/*.html`، `login.html` تؤكد جميعها وجهة `estesharah` |
| `sitemap.ts` | أُزيل قسم `/patient*` (لم تعد صفحات قابلة للفهرسة) |

**ملاحظة:** أخطاء `lint` الخمسة موروثة من قبل المرحلة 3 (روابط `<a href="/">` في
`SiteNav`/`PortalLogin`/`PortalTopbar` وخطأ `setState` في `ImportClient`) — أُكِّد
ذلك بإخفاء تغييرات المرحلة 3 ثم إعادة تشغيل `lint` (نفس 7 مشاكل تمامًا).

### 3.4 المؤجل إلى المرحلة 6

- حذف فعلي لمكوّنات/مكتبات بوابة المريض (`patient/*`، `login/PortalLogin`،
  `ModeSwitch`، `portal-store`، `ImportClient`، `RedirectToConsult` بعد الاستقرار).
- معالجة أخطاء `lint` الموروثة (روابط `<a>` الداخلية → `next/link`).
- إزالة `/doctor/inbox` من روشتة (انتقل لصندوق استشارة) — قراره معلّق.

*نهاية تقرير المرحلة 3 — في انتظار موافقة المستخدم قبل المرحلة 4.*

---

## المرحلة 4 — بادئة مفاتيح التخزين + إعداد الروابط + رابط 404 العميق (2026-10-12)

الحالة: **مكتملة في المستودعين.** الهدف: منع تصادم `localStorage` بين الموقعين
(نفس أصل GitHub Pages)، وتثبيت مصدر واحد للروابط، وجعل الروابط العميقة للتذاكر
تعمل على الاستضافة الثابتة.

### 4.1 بادئة مفاتيح التخزين (إصلاح تصادم الأصل)

كلاهما يُخدَم من `drahmedyousefmd-prog.github.io` ⇒ `localStorage` مشترك. كانت
استشارة تعيد استخدام مفاتيح `rochetta-*` (تصادم مع بوابة الطبيب في روشتة).

| | قبل | بعد |
|---|---|---|
| **استشارة** | `rochetta-users`/`tickets`/`session`/`guest-token`، `rochetta-last-submit`، `estesharah-mode` | `estesharah:users`/`tickets`/`session`/`guest-token`/`last-submit`/`mode` |
| **روشتة** | `rochetta-users`/`tickets`/`session`/`guest-token`، `rochetta-mode`، `rochetta_recents`، `rochetta-animated` | `rochetta:users`/`tickets`/`session`/`guest-token`/`mode`/`recents`/`animated` |

- أُضيف `STORAGE_PREFIX` في `src/lib/site.ts` بكلا المستودعين، وكل المفاتيح تُبنى منه
  (مصدر واحد). `MODE_KEY` أصبح `${STORAGE_PREFIX}mode`.
- أثر جانبي مقصود: الجلسات/التذاكر القديمة في المتصفح لا تُقرأ (لا فقد بيانات حقيقي —
  Firebase مطفأ).

### 4.2 مصدر واحد للروابط

- **استشارة** `src/lib/site.ts`: `SITE_URL` (نطاق هذا الموقع)، `ROCHETTA_URL` (موقع
  الطبيب)، وأُضيف `BASE_PATH = "/estesharah"` المطابق لـ `basePath`/`assetPrefix`
  في `next.config.ts` (يُصفَّر عند النطاق النهائي).
- **روشتة** `src/lib/site.ts`: `SITE_URL` (نطاق روشتة) و`PATIENT_SITE_URL`
  (موقع الاستشارة) — تتطابق قيمها مع نظيرها في استشارة.

### 4.3 رابط 404 العميق للتذاكر (استشارة)

المسارات الديناميكية `/ticket/[id]` و`/doctor/ticket/[id]` تُصدَّر بصفحة نائبة واحدة
(`/ticket/ticket`)، لذا رابط مثل `/ticket/<uuid>` يقع على `404.html`. الحل:

1. `src/components/portal/NotFoundRedirect.tsx` (يُضاف داخل `app/not-found.tsx`):
   يكتشف المسار `/ticket/<uuid>` أو `/doctor/ticket/<uuid>` ويعيد التوجيه إلى
   الملف الثابت `/estesharah/<route>/ticket.html?id=<uuid>` (حاجز `deep-link-tried`
   مرة واحدة/جلسة ⇒ لا حلقات تكرار، وروابط 404 الحقيقية تبقى صفحة 404).
2. `TicketByUrl`/`DoctorTicketByUrl` يقرآن المعرّف من المسار إن وُجد، وإلا من `?id=`
   عبر `useSearchParams` (الصفحتان ملفوفتان بـ `Suspense`).

### 4.4 التحقق

| الفحص | النتيجة |
|---|---|
| `estesharah` `npm.cmd run lint` | 0 أخطاء، تحذيرا `<img>` (موروثان) |
| `estesharah` `npm.cmd run build` | ناجح — 18 صفحة |
| `out/404.html` + `ticket/ticket.html` + `doctor/ticket/ticket.html` | موجودة |
| `rochetta-web` `npm.cmd run lint` | 5 أخطاء/تحذيران — **نفس خط الأساس السابق** (لا جدد) |
| `rochetta-web` `npm.cmd run build` | ناجح — 101 صفحة |

### 4.5 المؤجل

- تحويل `BASE_PATH`/`basePath` إلى النطاق النهائي = المرحلة 6 (بعد اختيار الدومين).
- تجربة حية للرابط العميق على GitHub Pages (يُنصح باختبار يدوي: `/estesharah/ticket/<uuid>`).

*نهاية تقرير المرحلة 4 — في انتظار موافقة المستخدم قبل المرحلة 5.*

---

## المرحلة 5 — نظافة محركات البحث (SEO) (2026-10-12)

الحالة: **مكتملة في المستودعين.** الهدف: إظهار الصفحات العامة فقط وفهرسة
بوابات المريض/الطبيب والمسارات الخاصة بـ `noindex`.

### 5.1 استشارة

| المسار | قبل | بعد |
|---|---|---|
| `/` (الرئيسية) | مفهرس | مفهرس (كما هو) |
| `/request/[service]` | `noindex` (تعارض مع الـ sitemap) | **مفهرس** + `generateMetadata` بعنوان لكل خدمة و canonical لكل خدمة (`/request/<type>`) |
| `/ticket/[id]` | `noindex` | `noindex, nofollow` |
| `/doctor/ticket/[id]` | `noindex` | `noindex, nofollow` |
| `/doctor/inbox` | `noindex` | `noindex, nofollow` |
| `/login` | `noindex` | `noindex, nofollow` |
| `/my-requests` | `noindex` | `noindex, nofollow` |

- **`robots.ts`**: `Disallow: /ticket/`, `/doctor/`, `/my-requests`, `/login`؛ Sitemap معلن.
- **`sitemap.ts`**: يبقى الجذر + الخدمات الست (7 روابط)؛ حُدّث `lastModified` إلى 2026-10-12.

### 5.2 روشتة

| المسار | الحالة |
|---|---|
| `/` (الرئيسية) | مفهرس |
| `/doctor/chapter/[slug]`، `/doctor/case/[id]` | مفهرس (81 رابطًا في الـ sitemap) |
| `/patient`، `/patient/*`، `/login`، `/import` | `noindex, nofollow` + `Disallow` |
| `/doctor`، `/doctor/inbox`، `/doctor/categories` | `noindex, nofollow` + `Disallow` للصفحات المحددة |

- **`robots.ts`**: `Disallow: /patient`, `/login`, `/import`, `/doctor/inbox`,
  `/doctor/categories` — **دون** حظر بادئة `/doctor` كاملة (لأن
  `/doctor/case` و`/doctor/chapter` صفحات مرجعية عامة يجب فهرستها).
- **`sitemap.ts`**: بلا أي `/patient` أو `/login`؛ حُدّث `lastModified`.

### 5.3 التحقق

| الفحص | النتيجة |
|---|---|
| `estesharah` lint / build | 0 أخطاء / ناجح (18 صفحة) |
| `estesharah` robots.txt | Disallow للمسارات الخاصة + Sitemap |
| `estesharah` noindex | موجود على my-requests/login/doctor inbox/ticket؛ **غائب** عن `/request/*` (مفهرس) |
| `estesharah` sitemap | 7 روابط (لا مسارات خاصة) |
| `rochetta-web` lint / build | 5 أخطاء/تحذيران (خط الأساس) / ناجح (101 صفحة) |
| `rochetta-web` robots.txt | Disallow للمسارات الخاصة بدون حظر `/doctor/case|chapter` |
| `rochetta-web` sitemap | 0 مراجع patient/login؛ 81 مرجع case/chapter |
| `rochetta-web` noindex | الرئيسية مفهرسة؛ login/patient/doctor inbox/categories بـ noindex |

### 5.4 المؤجل

- تأكيد الفهرسة النهائية بعد اختيار النطاق ونشره (Google Search Console) = المرحلة 6.

*نهاية تقرير المرحلة 5 — في انتظار موافقة المستخدم قبل المرحلة 6.*

---

## المرحلة 6 — الإنهاء والتسليم (2026-10-12)

الحالة: **مكتملة (إنهاء + تحقق).** لا حذف ولا تغيير للنطاق بحسب قرارات المستخدم.

### 6.1 قرارات المستخدم (بوابة المرحلة 6)

| القرار | النتيجة |
|---|---|
| النطاق/الاستضافة | **إبقاء روابط GitHub Pages الحالية** (لا نطاق خاص الآن): روشتة = الجذر `…/`، استشارة = مشروع `…/estesharah/` |
| Firebase (استشارة) | **إبقاءه مُطفأ**؛ الموقع يعمل ضيفًا على localStorage (وضع تجريبي) |
| حذف كود الاستشارة المؤجل في روشتة | **مؤجّل حتى التحقق الحيّ** من استشارة (القاعدة 1) |

### 6.2 إعداد الروابط النهائي (بلا تغيير قيمة)

| | روشتة | استشارة |
|---|---|---|
| `SITE_URL` | `https://drahmedyousefmd-prog.github.io` | `https://drahmedyousefmd-prog.github.io/estesharah` |
| مقابل الموقع الآخر | `PATIENT_SITE_URL` = موقع استشارة | `ROCHETTA_URL` = موقع روشتة |
| `BASE_PATH`/`basePath` | — | `"/estesharah"` (يبقى) |

- طُبّعت تعليقات `src/lib/site.ts` في المستودعين لتعبّر أن الروابط **نهائية للمرحلة الحالية**
  (تُزال لو أُضيف نطاق خاص لاحقًا)، وأُزيل لفظ «مؤقت/بانتظار النطاق».

### 6.3 التحقق

| الفحص | النتيجة |
|---|---|
| `estesharah` lint / build | 0 أخطاء / ناجح |
| `rochetta-web` lint / build | 5 أخطاء/تحذيران (خط الأساس) / ناجح |
| روابط روشتة → استشارة في المخرجات | 11 موضعًا |
| روابط استشارة → جذر روشتة في المخرجات | 1 (تذييل «أنا طبيب») |
| نطاقات قديمة/محلية في المخرجات | 0 |
| تطابق `PATIENT_SITE_URL` (روشتة) = `SITE_URL` (استشارة) والعكس | مطابق |

### 6.4 ما زال مؤجلًا (بوعي)

- **تفعيل Firebase** في استشارة (يمنح المزامنة الحقيقية للتذاكر + Storage + App Check) — بانتظار قيم المستخدم.
- **حذف كود الاستشارة النائم من روشتة** (`/patient/*`, `/login`, `/import`, مكوّنات/مكتبات الطبيب/المريض القديمة) — بعد التحقق الحيّ.
- **اختبار يدوي حيّ**: فتح `/estesharah/ticket/<uuid>` على GitHub Pages للتأكد من تعمل إعادة التوجيه العميقة (4xx → `ticket.html?id=`).

*نهاية تقرير المرحلة 6 — جميع المراحل 0→6 مكتملة. ما تبقّى إجراءات تشغيلية بيد المستخدم.*

---

## نتيجة فحص الخطوة 0 — لماذا لا يظهر التصميم الجديد على الموقع الحيّ؟

**التاريخ:** جولة إعادة تصميم واجهة استشارة (هيدر زهري + هيرو + زر واحد → صفحة `/services`).

### السبب الجذري
1. **تعديلات استشارة غير مُودَعة/غير مدفوعة:** شجرة العمل تحتوي كل تعديلات إعادة التصميم
   كتغييرات غير مُودَعة؛ `main == origin/main` عند آخر إيداع قديم `018b068`، ولا يوجد
   `.github/workflows`.
2. **مصدر نشر GitHub Pages = فرع `gh-pages` (المجلد `/`)، `build_type:"legacy"`، حالة
   `built`.** رأس `origin/gh-pages` = `8ce5a10` (مخرجات البناء **القديم**). أي أن الموقع
   الحيّ يخدم بناءً قديمًا لا علاقة له بالإيداعات على `main`.
3. **نسخة التجهيز للنشر تالفة:** المجلد المؤقت `C:\Users\hp\AppData\Local\Temp\opencode\estesharah-pages`
   فقد ملف `.git`، ويحتوي مخرجات قديمة (`login/`, `new/`, `tickets/`)؛ لذلك
   `scripts/deploy.ps1` لا يستطيع الدفع إلى `gh-pages` قبل إعادة إنشاء النسخة
   (`gh repo clone drahmedyousefmd-prog/estesharah <dist>` ثم `git checkout gh-pages`).

### الخلاصة
- لا مشكلة في الكود: `out/` ينتج البناء الجديد الصحيح (19 صفحة، تشمل `/services`).
- المطلوب إجرائيًا: إعادة إنشاء نسخة `gh-pages` ثم `& .\scripts\deploy.ps1` (يعيد البناء +
   يدفع `gh-pages` بالقوة). التغييرات على `main` مسألة مستقلة (إيداع/دفع) ولا تؤثر على النشر.

### ملاحظة توجيه (تم التحقق)
- GitHub Pages يخدم `.html` بدون امتداد بنجاح (التحقق الحيّ: `/estesharah/login` و
  `/estesharah/new/general_consultation` كلاهما **200**). لذا `/estesharah/services` سيعمل
  بعد النشر مباشرة من `out/services.html` — لا حاجة لـ `trailingSlash` وليس خطأً أن
  المخرج `services.html` وليس `services/index.html`.

### الإصلاح والتحقق
1. حُذفت نسخة التجهيز التالفة وأُعيد إنشاؤها: `gh repo clone drahmedyousefmd-prog/estesharah <dist>`
   ثم `git checkout gh-pages`.
2. أُصلح سكربت النشر `scripts/deploy.ps1`: كان `git commit` يفشل بلا هوية مؤلف. الآن يُمرَّر
   مؤلف صريح عبر `git -c user.name="estesharah-bot" -c user.email="estesharah@local" commit`
   (بلا تعديل إعدادات git العامة).
3. النشر: بناء ناجح (19 صفحة) → دفع قسري `gh-pages` = `8ce5a10..1bb82db`.
4. **التحقق الحيّ:** `…/estesharah/` (200)تهيئة زهرية `#EC4899` + زر واحد «طلب استشارة» →
   `/services` + لا أزرق قديم؛ `…/estesharah/services` (200) + 6 بطاقات → `/request/<type>`.

---

## جولة: تحسين التخطيط للموبايل (روشتة + استشارة)

**الهدف:** تمرير مواصفة الموبايل (ترويسة هامبرغر، هيرو عمودي، بطاقة بحث داخل التدفق،
شبكة تصنيفات 1–2 عمود، إصلاح الجداول/واتساب، ثم تدقيق Playwright) على الموقعين دون تغيير
محتوى أو بيانات أي صفحة.

### روشتة
- **الترويسة** (`src/components/SiteNav.tsx`): صف واحد لاصق (sticky) بارتفاع متغيّر `--nav-h`
  (64 سطح المكتب / 60 موبايل). موبايل: شعار + هامبرغر فقط، والقائمة داخل درج (drawer) يحوي
  الرئيسية/التصنيفات/تواصل + زر «الحصول على استشارة طبية» + أزرار الطبيب/المريض. تنقل
  لوحة المفاتيح (focus trap)، إغلاق بـ Esc/الخلفية/رابط، قفل تمرير الصفحة، وسمات
  `aria-expanded/aria-controls`. سطح المكتب: صف الروابط + الأزرار + «استشارة» (الروابط القديمة
  `nav-consult`). حُذف الصف الثاني `site-nav-mode`.
- **الهيرو** (`HomeApp.tsx` + `globals.css`): عمودي على الموبايل (eyebrow ثم العنوان ثم الوصف
  ثم الأزرار بعرض كامل ثم شبكة إحصائيات 3 أعمدة ثابتة) ثم صورة `<img class="hero-img-mobile">`
  بنسبة 16:10 و`object-position:center top`؛ أُزيلت صورة الخلفية على المقاسات الصغيرة وأُخفي
  البادج العائم، وقلّت الهوامش العلوية (كانت 148px لتجاوز ترويسة ثابتة).
- **بطاقة البحث** صارت في التدفق (`margin:22px auto 0`) بدل `-52px`، وحقول متراصّة بعرض كامل
  على الموبايل، وارتفاع أزرار/حقول ≥44px.
- **«آخر الاطلاع»** صف أفقي قابل للتمرير (`scroll-snap`)، و**بطاقات التصنيفات** شبكة
  `1 → 2 (≥340px) → 3 (≥768px)` بأحجام مصغّرة على الموبايل.
- **صفحة الحالة:** الجداول داخل `.table-scroll`، عنوان الحالة `clamp`، زر الرجوع 44px.
- **واتساب** نُقل إلى `inset-inline-start` (يمين RTL) مع `env(safe-area-inset-bottom)` لتجنّب
  تراكبه مع زر «الروشتة»؛ مسافة سفلية `body` على الموبايل.
- `viewportFit:"cover"` في `layout.tsx`.

### استشارة
- **الترويسة** (`PatientHeader.tsx`): نفس نموذج الدرج/الهامبرغر؛ سطح المكتب يعرض الروابط +
  «هل أنت طبيب؟ روشتة».
- **شبكة `/services`**: `1 → 2 (≥340px) → 3 (≥1024px) وأحجام بطاقات مصغّرة.
- صورة الهيرو موبايل بنسبة 16:10، وواتساب/الأحجام كما في روشتة، و`viewportFit:"cover"`.

### التحقق
- بناء ناجح: روشتة **101 مسار**، استشارة **19 مسار**.
- Lint: استشارة **0 أخطاء / 3 تحذيرات** (كما قبل). روشتة: لا أخطاء جديدة (4 أخطاء سابقة
  موجودة في `ImportClient`/`PortalLogin`/`PortalTopbar`).
- **تدقيق Playwright** (`scripts/mobile-audit.mjs`، عبر `playwright-core` + Chrome النظام
  `channel:"chrome"`): يشغّل `out/` محليًا ويفحص عبر `360×800, 390×844, 412×915, 768×1024`
  عدم وجود تمرير أفقي وعناصر اللمس <44px، ويسجّل صورًا في `mobile-audit-screenshots/`.
  النتيجة: **لا مشاكل** على صفحات روشتة (`/`, `/doctor/categories`, `/doctor/chapter/psychiatry`,
  `/doctor/case/rochetta-001`) ولا على استشارة (`/`, `/services`). فحص تفاعلي للدرج (فتح/Hamburger/
  Esc) ناجح، وسطح المكتب يُخفي الهامبرغر ويُظهر الروابط.

### النشر
- أُعيد إنشاء نسخة تجهيز `gh-pages` التالفة: `gh repo clone drahmedyousefmd-prog/drahmedyousefmd-prog.github.io`
  ثم `git checkout gh-pages` (كان `.git` بلا HEAD/config).
- `scripts/deploy.ps1`: أُضيفت هوية المؤلف الصريحة عبر `git -c user.name="rochetta-bot" ...`.
- النشر: دفع قسري `gh-pages` = `2bbf139..983153f`.
- **التحقق الحيّ:** `https://drahmedyousefmd-prog.github.io/` (200) يحتوي `nav-burger` و`hero-img-mobile`
  و`nav-drawer`؛ `…/estesharah/` (200) يحتوي الدرج، و`…/estesharah/services` (200) + 6 بطاقات.
