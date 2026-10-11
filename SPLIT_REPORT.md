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