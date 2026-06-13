import {
  FiLink, FiSettings, FiBarChart2, FiRefreshCw, FiLayout,
  FiShield, FiUsers, FiLock, FiEye, FiGlobe, FiTrendingUp
} from "react-icons/fi";
import DocLayout from "./DocLayout";

const features = [
  {
    icon: FiGlobe,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    title: "Your Own Subdomain — Free",
    description:
      "Every account gets a personalized subdomain at no cost. Once you register, your hub lives at username.allin1url.in — a clean, branded URL you own as long as your account is active.",
  },
  {
    icon: FiLink,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    title: "Smart Personalized Links",
    description:
      "Links follow a clear, human-readable pattern: username.allin1url.in/platform. Instead of bit.ly/x4z9, you get johndoe.allin1url.in/linkedin — instantly recognizable, easy to say aloud, and memorable.",
  },
  {
    icon: FiSettings,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    title: "Add Any Platform",
    description:
      "Not limited to a predefined list. Add GitHub, LinkedIn, Portfolio, Instagram, LeetCode, Codeforces, Behance, or any custom platform with a URL. The platform name becomes the path segment.",
  },
  {
    icon: FiLayout,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    title: "Link Hub Page",
    description:
      "Visiting username.allin1url.in shows a beautiful landing page listing all your public links. Share a single URL on your resume, bio, or business card — visitors pick where to go from there.",
  },
  {
    icon: FiRefreshCw,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    title: "Update Once, Propagates Everywhere",
    description:
      "Change the destination URL of any link from your dashboard. All existing places you've shared that link automatically redirect to the new URL — no need to update resumes, bios, or cards.",
  },
  {
    icon: FiShield,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    title: "Three-Tier Link Visibility",
    description:
      "Public links appear everywhere (hub, profile, search). Unlisted links are visible in your profile but hidden from the hub — useful for 100+ links. Private links are password-protected and not listed anywhere.",
  },
  {
    icon: FiLock,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    title: "Password-Protected Links",
    description:
      "Set a password on any private link. Visitors are shown a password prompt before being redirected. Passwords are stored as bcrypt hashes — never in plaintext. Click tracking still records the visit.",
  },
  {
    icon: FiEye,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    title: "Granular Profile Privacy",
    description:
      "Toggle what's visible on your public profile independently: email, location, bio, profile image, link count, click stats, and more. You control each field individually.",
  },
  {
    icon: FiUsers,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    title: "User Search & Discovery",
    description:
      "Search for other users by username in real-time. View their public profiles and links. Control your own discoverability — disable search visibility from privacy settings to opt out.",
  },
  {
    icon: FiBarChart2,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    title: "Click Analytics Dashboard",
    description:
      "See click trends over time for any link. Filter by date range, compare platforms, and understand which of your links drives the most engagement. Data visualized with charts.",
  },
  {
    icon: FiTrendingUp,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    title: "Per-Click Detail Records",
    description:
      "Every click is stored with full context: timestamp, geographic location (country, city, region), device type, OS, browser version, referrer URL, and user agent string. Browse the full history in Click Details.",
  },
];

const Features = () => {
  return (
    <DocLayout
      badge="All Features"
      title="Features"
      subtitle="Everything All in1 url provides — from smart links and privacy controls to per-click analytics."
    >
      {/* Feature count */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-sm text-slate-500 dark:text-slate-400">{features.length} features available</span>
        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all"
            >
              <div className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${f.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">All features, completely free</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">No paid tiers. No feature gates. No expiring links.</p>
        </div>
        <a
          href="/login"
          className="flex-shrink-0 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Get Started Free
        </a>
      </div>
    </DocLayout>
  );
};

export default Features;
