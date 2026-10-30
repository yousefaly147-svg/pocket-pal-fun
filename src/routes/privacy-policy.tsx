import { createFileRoute, Link } from '@tanstack/react-router';
import { LogoMark } from '@/components/cartoon';
import { LangToggle } from '@/components/pocket/lang-toggle';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/privacy-policy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy | Pocketjr' },
      {
        name: 'description',
        content: 'Learn what information Pocketjr collects, how it is used, and how to request account and data deletion.',
      },
      { property: 'og:title', content: 'Privacy Policy | Pocketjr' },
      { property: 'og:description', content: 'Learn how Pocketjr handles account details, financial entries, privacy choices and data deletion.' },
      { name: 'twitter:title', content: 'Privacy Policy | Pocketjr' },
      { name: 'twitter:description', content: 'Information about Pocketjr privacy and data handling.' },
    ],
    links: [
      { rel: 'canonical', href: 'https://pocketjr.lovable.app/privacy-policy' },
      { rel: 'alternate', hrefLang: 'en', href: 'https://pocketjr.lovable.app/privacy-policy' },
      { rel: 'alternate', hrefLang: 'ar', href: 'https://pocketjr.lovable.app/ar/privacy-policy' },
      { rel: 'alternate', hrefLang: 'x-default', href: 'https://pocketjr.lovable.app/privacy-policy' },
    ],
  }),
  component: PrivacyPolicyPage,
});

export export function PrivacyPolicyPage() {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  const homePath = ar ? '/ar/' : '/';
  const deleteAccountPath = ar ? '/ar/delete-account' : '/delete-account';

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <article className="panel mx-auto w-full max-w-3xl space-y-8 p-6 md:p-10">
        <header className="flex items-center gap-3">
          <LogoMark />
          <LangToggle className="ml-auto" />
          <div>
            <p className="text-sm text-muted-foreground">Pocketjr</p>
            <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
            <p className="mt-1 text-sm text-muted-foreground">Last updated: 30 October 2026</p>
          </div>
        </header>

        <p className="leading-7 text-muted-foreground">
          This policy explains how Pocketjr (also shown as Pocket Pal in some screens), including the
          Pocketjr website and Android app, handles information when you use the service.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">1. Information we handle</h2>
          <h3 className="font-semibold">Account information</h3>
          <p className="leading-7 text-muted-foreground">
            If you create an account, we process your email address and username. For password-based
            accounts, the server stores a password hash rather than your readable password. If you
            sign in with Google, we receive the verified account information needed to sign you in and
            link your account; Google handles its own sign-in process under Google's privacy policy.
          </p>
          <h3 className="font-semibold">Finance entries and preferences</h3>
          <p className="leading-7 text-muted-foreground">
            We store the information you choose to enter or sync, which can include income and expense
            amounts, transaction type, category, optional description, date and time, investment
            entries and notes, budget amounts, savings goals, and currency preferences. Treat these
            records as private financial information and do not enter card PINs, CVVs, passwords for
            Telda, or full card numbers.
          </p>
          <h3 className="font-semibold">Optional Telda notification import (Android only)</h3>
          <p className="leading-7 text-muted-foreground">
            If you enable the feature and grant Android Notification Access, Pocketjr reads
            notifications from the Telda app on your device. The app processes the notification text
            on the device to identify the transaction amount, direction, merchant text, and original
            notification time. It sends a parsed transaction record and a deduplication identifier to
            Pocketjr's server so the transaction can be added to your account. The full notification
            text is not sent as the transaction description; the imported record contains the parsed
            merchant text, amount, direction, and timestamp. Pending alerts may be held temporarily
            in the app's on-device queue until they sync or you clear that queue. Pocketjr does not
            ask for or collect your Telda password, PIN, CVV, or full card number.
          </p>
          <h3 className="font-semibold">Device and local storage information</h3>
          <p className="leading-7 text-muted-foreground">
            For Telda imports, the Android app registers a device and uses an authentication token to
            associate an import with your account. The server stores a hash of the device token and
            limited device-registration timestamps. The app keeps session information securely on
            Android using Android Keystore and may keep pending Telda alerts locally until they sync.
            The website uses browser storage for your signed-in session and a local cache; guest-mode
            entries are stored on your device/browser and are not synced to the server unless you
            choose to create and use an account. Daily reminder schedules are configured locally on
            your Android device.
          </p>
          <p className="leading-7 text-muted-foreground">
            We do not request your contacts, camera, microphone, or precise location for the finance
            tracking features.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. How we use information</h2>
          <p className="leading-7 text-muted-foreground">
            We use the information to provide sign-in, synchronize your entries across devices, show
            your finance dashboard, save preferences, import transactions you enable, prevent
            duplicate imports, maintain service reliability and security, troubleshoot failures, and
            respond to privacy or support requests.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">3. Service providers and sharing</h2>
          <p className="leading-7 text-muted-foreground">
            We do not sell your personal or transaction data. Advertising is not currently active
            on Pocketjr. The website is configured to use Google Analytics to measure general website
            usage, such as visits and pages viewed. Google may process technical and usage information
            under its own privacy terms. We do not intentionally send transaction amounts, balances,
            or transaction descriptions as Google Analytics event data. Information is also shared
            as needed to operate the service with providers such as Google for sign-in, Render for API
            hosting, Supabase for database hosting, and Lovable for website hosting and deployment.
            We may disclose information if required by law or when reasonably necessary to protect
            the service, users, or others.
          </p>
          <p className="leading-7 text-muted-foreground">
            Relevant provider policies: <a className="underline underline-offset-4" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a>,
            {' '}<a className="underline underline-offset-4" href="https://render.com/privacy" target="_blank" rel="noopener noreferrer">Render</a>,
            {' '}<a className="underline underline-offset-4" href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase</a>, and
            {' '}<a className="underline underline-offset-4" href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer">Lovable</a>.
          </p>
          <p className="leading-7 text-muted-foreground">
            A Google AdSense site-ownership verification meta tag is included in the website's HTML
            head. It identifies the publisher account for site ownership checks; it does not load
            advertising code or display ads. Advertising is not currently active on Pocketjr. If ads
            are introduced later, advertising partners such as Google may use cookies or similar
            technologies to deliver and measure ads and, where permitted, personalize them according
            to applicable settings and your choices. We will provide any required notice and consent
            choices before enabling ads. No advertising placements are currently configured, and
            we do not intend to include transaction amounts, balances or descriptions in advertising
            requests. You can learn more about Google's practices in its <a className="underline underline-offset-4" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">advertising technologies policy</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">4. Security</h2>
          <p className="leading-7 text-muted-foreground">
            Network requests to Pocketjr's API use HTTPS. Passwords are hashed before storage, API
            access requires authentication, and Android session/device tokens are protected using
            Android Keystore. We use reasonable safeguards, but no online service or device storage
            can be guaranteed completely secure. Keep your device and account credentials protected.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Retention and account deletion</h2>
          <p className="leading-7 text-muted-foreground">
            Account information and synced finance records are kept while your account is active.
            You can initiate permanent account deletion from Settings in Pocketjr or from our
            <Link to={deleteAccountPath} className="mx-1 underline underline-offset-4">account deletion page</Link>.
            After a verified deletion succeeds, the live account record and associated server-stored
            transactions, investments, device registrations, and preferences are deleted. We may
            retain limited records where required by law or for legitimate security purposes.
          </p>
          <p className="leading-7 text-muted-foreground">
            Local guest entries, browser storage, Android app data, operating-system notification
            history, and any unsynced notification queue are stored on your own device and may need
            to be cleared from that device separately. Uninstalling the Android app or clearing its
            storage removes app-local data; Android Notification Access can also be disabled in
            system settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">6. Your choices</h2>
          <p className="leading-7 text-muted-foreground">
            You can choose whether to create an account, use guest mode, enable Telda importing,
            grant notification access, or enable daily reminders. You can disable Telda importing
            and revoke notification access at any time in Android settings. You can request account
            deletion using the method described above.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">7. Changes and contact</h2>
          <p className="leading-7 text-muted-foreground">
            We may update this policy when the service or its data practices change. The latest
            version will be posted at this URL with a revised update date. For privacy questions or
            support, email
            {' '}<a className="underline underline-offset-4" href="mailto:yousefaly147@gmail.com">yousefaly147@gmail.com</a>
            {' '}or contact us on
            {' '}<a className="underline underline-offset-4" href="https://www.instagram.com/youssef3lyy/" target="_blank" rel="noopener noreferrer">Instagram @youssef3lyy</a>.
          </p>
          <p className="leading-7 text-muted-foreground">
            Pocketjr is a personal recordkeeping tool, not a bank and not financial, tax, or
            investment advice.
          </p>
        </section>

        <hr className="border-border" />
        <div dir="rtl" lang="ar" className="space-y-5 text-right">
          <h2 className="text-2xl font-extrabold">سياسة الخصوصية</h2>
          <p className="leading-8 text-muted-foreground">
            توضح هذه السياسة كيفية تعامل Pocketjr (الذي يظهر أحيانًا باسم Pocket Pal) مع المعلومات عند استخدام الموقع وتطبيق أندرويد.
            آخر تحديث: ٣٠ أكتوبر ٢٠٢٦.
          </p>
          <section className="space-y-2">
            <h3 className="text-lg font-bold">المعلومات التي نتعامل معها</h3>
            <p className="leading-8 text-muted-foreground">
              عند إنشاء حساب، نتعامل مع البريد الإلكتروني واسم المستخدم، ونخزن كلمة المرور بصيغة مشفّرة أحادية الاتجاه (تجزئة) وليس كنص مقروء.
              وقد تشمل البيانات المالية التي تضيفها: مبالغ الدخل والصرف، والفئة والوصف الاختياري والتاريخ، وسجلات الاستثمار وملاحظاتها،
              والميزانية والأهداف الادخارية والعملة المختارة.
            </p>
            <p className="leading-8 text-muted-foreground">
              إذا فعّلت استيراد تيلدا ومنحت التطبيق إذن الوصول إلى الإشعارات في أندرويد، يعالج التطبيق إشعارات تيلدا على الجهاز لاستخراج المبلغ
              ونوع العملية والتاجر ووقت الإشعار الأصلي، ثم يرسل سجل العملية المستخرج ومعرّفًا لمنع التكرار إلى خادم Pocketjr. لا نطلب كلمة مرور
              تيلدا أو الرقم السري أو رمز CVV أو رقم البطاقة الكامل.
            </p>
            <p className="leading-8 text-muted-foreground">
              يستخدم الموقع مساحة التخزين المحلية في المتصفح للجلسة وذاكرة مؤقتة، وتبقى بيانات وضع الضيف على جهازك. وقد يحتفظ تطبيق أندرويد
              بالإشعارات التي لم تتم مزامنتها في قائمة انتظار محلية إلى أن تتم المزامنة أو يتم مسحها.
            </p>
          </section>
          <section className="space-y-2">
            <h3 className="text-lg font-bold">كيف نستخدم المعلومات ونشاركها</h3>
            <p className="leading-8 text-muted-foreground">
              نستخدم البيانات لتسجيل الدخول ومزامنة المعاملات وعرض لوحة التحكم وحفظ تفضيلاتك واستيراد العمليات التي تختارها وتحسين أمان الخدمة.
              لا نبيع بياناتك الشخصية أو المالية، والإعلانات غير مفعّلة حاليًا في Pocketjr. الموقع مُعد لاستخدام Google Analytics لقياس الاستخدام العام للموقع،
              مثل الزيارات والصفحات التي تمت مشاهدتها. وقد تعالج Google معلومات تقنية ومعلومات استخدام وفقًا لسياسة الخصوصية الخاصة بها. لا نضيف عمدًا مبالغ المعاملات
              أو الأرصدة أو أوصاف المعاملات كبيانات لأحداث Google Analytics. وقد تتم أيضًا معالجة البيانات اللازمة لتشغيل الخدمة عبر Google لتسجيل الدخول،
              وRender لاستضافة واجهة API، وSupabase لاستضافة قاعدة البيانات، وLovable لاستضافة الموقع ونشره، كما قد نفصح عن معلومات إذا ألزمنا القانون بذلك.
            </p>
            <p className="leading-8 text-muted-foreground">
              يوجد وسم تحقق من ملكية الموقع في Google AdSense داخل قسم الرأس (head) في صفحات الموقع.
              يعرّف هذا الوسم حساب الناشر للتحقق من الملكية، ولا يحمّل شيفرة إعلانية ولا يعرض إعلانات. الإعلانات غير مفعّلة حاليًا في Pocketjr.
              إذا أضفنا إعلانات مستقبلًا، فقد يستخدم شركاء الإعلان مثل Google ملفات تعريف الارتباط أو تقنيات مشابهة لعرض الإعلانات وقياس أدائها وتخصيصها
              حيثما تسمح القواعد والإعدادات واختياراتك. سنوفر أي إشعار وخيارات موافقة مطلوبة قبل تفعيل الإعلانات. لا توجد حاليًا مواضع إعلانية مفعّلة،
              ولا ننوي تضمين مبالغ المعاملات أو الأرصدة أو أوصاف المعاملات في طلبات الإعلانات.
            </p>
          </section>
          <section className="space-y-2">
            <h3 className="text-lg font-bold">الأمان والاحتفاظ والحذف</h3>
            <p className="leading-8 text-muted-foreground">
              تستخدم اتصالات الخادم HTTPS، وتُجزّأ كلمات المرور قبل تخزينها، وتُحمى رموز الجلسة والجهاز في أندرويد باستخدام Android Keystore.
              نحتفظ ببيانات الحساب والسجلات المتزامنة ما دام الحساب نشطًا. يمكنك بدء حذف الحساب نهائيًا من الإعدادات أو من
              <Link to={deleteAccountPath} className="mx-1 underline underline-offset-4">صفحة حذف الحساب</Link>.
              عند نجاح الحذف، تُحذف سجلات الحساب والمعاملات والاستثمارات والأجهزة والتفضيلات المخزنة على الخادم.
            </p>
            <p className="leading-8 text-muted-foreground">
              قد تحتاج إلى مسح بيانات وضع الضيف وذاكرة المتصفح وبيانات التطبيق في جهازك بشكل منفصل، بما في ذلك إشعارات تيلدا غير المتزامنة وسجل الإشعارات في نظام أندرويد.
              يمكنك تعطيل استيراد تيلدا وسحب إذن الوصول إلى الإشعارات من إعدادات أندرويد.
            </p>
          </section>
          <section className="space-y-2">
            <h3 className="text-lg font-bold">التواصل والتعديلات</h3>
            <p className="leading-8 text-muted-foreground">
              ممكن نحدّث سياسة الخصوصية دي لو الخدمة أو طريقة التعامل مع البيانات اتغيّرت. هتلاقي أحدث نسخة على نفس الصفحة مع تاريخ التحديث.
              لو عندك سؤال عن الخصوصية أو محتاج مساعدة، ابعت إيميل على
              <a className="mx-1 underline underline-offset-4" href="mailto:yousefaly147@gmail.com">yousefaly147@gmail.com</a>
              أو تواصل معانا على
              <a className="mx-1 underline underline-offset-4" href="https://www.instagram.com/youssef3lyy/" target="_blank" rel="noopener noreferrer">إنستغرام @youssef3lyy</a>.
              Pocketjr أداة لتسجيل الشؤون المالية الشخصية، مش بنك ومش بيقدّم نصايح مالية أو ضريبية أو استثمارية.
            </p>
          </section>
        </div>
        <footer className="flex flex-wrap gap-4 border-t border-border pt-5 text-sm">
          <Link to={homePath} className="font-medium underline underline-offset-4">Home</Link>
          <Link to={deleteAccountPath} className="font-medium underline underline-offset-4">Delete account</Link>
        </footer>
      </article>
    </main>
  );
}
