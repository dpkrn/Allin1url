import { FiCheck, FiGlobe, FiEyeOff, FiLock, FiShield, FiServer, FiUser } from "react-icons/fi";
import DocLayout from "./DocLayout";

const privacyLevels = [
  {
    name: "Public",
    color: "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20",
    badge: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    description: "Fully visible and accessible everywhere.",
    items: [
      "Shows in your link hub (username.allin1url.in)",
      "Visible in profile preview",
      "Appears in user search results",
      "Accessible via direct URL",
      "No password required",
    ],
  },
  {
    name: "Unlisted",
    color: "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20",
    badge: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    description: "Accessible but not listed in the hub. Good for managing 100+ links without cluttering the main page.",
    items: [
      "Not shown in link hub",
      "Visible in profile preview",
      "Accessible via direct URL",
      "No password required",
      "Still tracked in analytics",
    ],
  },
  {
    name: "Private",
    color: "border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20",
    badge: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400",
    dot: "bg-red-500",
    description: "Hidden from all listings. Requires a password to access the destination.",
    items: [
      "Not shown in link hub",
      "Not shown in profile preview",
      "Not visible in search results",
      "Password prompt before redirect",
      "Password hashed with bcrypt",
    ],
  },
];

const profileSettings = [
  "Profile visibility (public / private)",
  "Search visibility (opt out of user search)",
  "Email address visibility",
  "Location visibility",
  "Bio visibility",
  "Passion / interests visibility",
  "Profile image visibility",
  "Link count display",
  "Click statistics display",
];

const securityStack = [
  { label: "Authentication", value: "JWT tokens in HTTP-only cookies" },
  { label: "Password hashing", value: "bcrypt (salted, adaptive cost)" },
  { label: "Transport", value: "HTTPS enforced" },
  { label: "Security headers", value: "Helmet.js (XSS, CSP, HSTS, etc.)" },
  { label: "CORS", value: "Allowlist-based cross-origin policy" },
  { label: "Input handling", value: "Client and server-side validation" },
  { label: "Injection prevention", value: "Mongoose ORM (parameterized queries)" },
];

const privacyPrinciples = [
  "No third-party analytics scripts (no Google Analytics, no tracking pixels)",
  "No user data is sold to third parties",
  "Open-source code — the entire codebase is publicly auditable on GitHub",
  "You can delete your account and all associated data at any time",
  "Click data is stored only for your own analytics — never aggregated for ads",
];

const Security = () => {
  return (
    <DocLayout
      badge="Security & Privacy"
      title="Security"
      subtitle="How All in1 url protects your links, your data, and your profile."
    >

      {/* Link Privacy Levels */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Link visibility levels</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Every link has a visibility setting. Change it any time from the link card in your dashboard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {privacyLevels.map((level) => (
            <div key={level.name} className={`rounded-xl border p-4 ${level.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${level.dot}`} />
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.badge}`}>{level.name}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{level.description}</p>
              <ul className="space-y-1.5">
                {level.items.map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <FiCheck className="w-3 h-3 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Password protection */}
      <section className="mb-10">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center flex-shrink-0">
              <FiLock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Password-Protected Links</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                When a private link is visited, a password prompt is shown before the redirect happens. The password is stored
                as a bcrypt hash — the plaintext is never saved. On verification, the user is forwarded to the destination URL.
                Click tracking records the event regardless of whether the correct password was entered.
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Password stored as bcrypt hash (never plaintext)",
              "Username and source encoded in Base64 for URL safety",
              "User-friendly error on wrong password",
              "Click still tracked on valid access",
              "Only accessible via direct URL — not discoverable",
              "No brute-force limit currently (planned)",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <FiCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600 dark:text-slate-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profile Privacy */}
      <section className="mb-10">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
              <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Profile Privacy Settings</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Each field can be toggled independently from your Settings page.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profileSettings.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-sm bg-violet-500" />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">Hide your profile entirely:</span>{" "}
              Set profile visibility to private and your profile won't appear in search results. The profile URL still works if someone has a direct link.
            </p>
          </div>
        </div>
      </section>

      {/* Tech security */}
      <section className="mb-10">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center flex-shrink-0">
              <FiShield className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Technical Security Measures</h3>
          </div>
          <div className="space-y-2">
            {securityStack.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 text-right max-w-[55%]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy principles */}
      <section>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center flex-shrink-0">
              <FiServer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Privacy Principles</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">What we do (and don't do) with your data.</p>
            </div>
          </div>
          <ul className="space-y-2.5">
            {privacyPrinciples.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <FiCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </DocLayout>
  );
};

export default Security;
