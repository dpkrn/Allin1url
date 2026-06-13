import { FiCheck, FiBriefcase, FiCode, FiUserCheck, FiBookOpen, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import DocLayout from "./DocLayout";

const audiences = [
  {
    icon: FiBriefcase,
    bg: "bg-violet-50 dark:bg-violet-950/30",
    color: "text-violet-600 dark:text-violet-400",
    title: "Professionals",
    description: "Consultants, managers, marketers, and anyone building a professional presence.",
    items: [
      "Put johndoe.allin1url.in/linkedin on a resume instead of a 90-character URL",
      "Hand out business cards with a single hub link covering every platform",
      "Change jobs? Update the destination URL once — all your shared links follow",
      "Analytics show which links recruiters and clients actually open",
      "Password-protect confidential portfolio links before a deal closes",
    ],
  },
  {
    icon: FiUserCheck,
    bg: "bg-pink-50 dark:bg-pink-950/30",
    color: "text-pink-600 dark:text-pink-400",
    title: "Content Creators",
    description: "YouTubers, streamers, writers, and creators with audiences across many platforms.",
    items: [
      "One hub link in your bio replaces a Linktree subscription",
      "Add or remove platforms any time without changing what you've shared",
      "Click tracking reveals which platform your audience comes from",
      "Cross-promote with a single URL across every platform's bio",
      "Keep merchandise or sponsor links unlisted so they don't clutter the hub",
    ],
  },
  {
    icon: FiCode,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    color: "text-blue-600 dark:text-blue-400",
    title: "Developers",
    description: "Open-source enthusiasts, job seekers, and engineers managing technical profiles.",
    items: [
      "Readable links (username.allin1url.in/github) look better in READMEs and docs",
      "Open-source codebase — audit it, fork it, self-host it",
      "Modern stack: React, Node.js, MongoDB, JWT auth — good learning resource",
      "Add LeetCode, Codeforces, HackerRank — any platform is supported",
      "No vendor lock-in: your data, your links",
    ],
  },
  {
    icon: FiBookOpen,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    color: "text-emerald-600 dark:text-emerald-400",
    title: "Students & Job Seekers",
    description: "Final-year students, bootcamp graduates, and anyone actively job hunting.",
    items: [
      "One clean link on your resume covers LinkedIn, GitHub, Portfolio, and more",
      "Update destinations as your profiles improve — no need to re-submit resumes",
      "Analytics reveal which links hiring managers actually visit",
      "Free forever — no subscription cost while you're still searching",
      "Professional appearance signals attention to detail to recruiters",
    ],
  },
];

const coreAdvantages = [
  {
    title: "Memorable, Brandable URLs",
    body: "Random short codes (bit.ly/x9z3k) mean nothing. Your links read as username.allin1url.in/platform — someone can guess your LinkedIn from your GitHub link without looking it up.",
    example: { before: "https://www.linkedin.com/in/john-doe-software-engineer-1234567/", after: "johndoe.allin1url.in/linkedin" },
  },
  {
    title: "Permanent Links, Zero Maintenance",
    body: "Unlike many shorteners that expire links or require paid plans to keep them active, All in1 url links work for as long as your account exists. No renewal fees, no expiry warnings.",
  },
  {
    title: "Change Destinations Without Re-sharing",
    body: "You've shared your GitHub link in a resume, 3 job applications, and your Twitter bio. If you rename your account, update the destination in one place — every copy of that link now points to the new URL automatically.",
  },
  {
    title: "Add Any Platform, No Limits",
    body: "Not constrained to a predefined list of platforms. If it has a URL, you can add it: Substack, Notion page, Ko-fi, custom portfolio, company website, anything. The platform name is free-form text.",
  },
];

const Benefits = () => {
  return (
    <DocLayout
      badge="Why All in1 url"
      title="Benefits"
      subtitle="Who benefits the most, and what specific problems All in1 url solves."
    >
      {/* Core advantages */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Core Advantages</h2>
        <div className="space-y-4">
          {coreAdvantages.map((adv) => (
            <div key={adv.title} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">{adv.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{adv.body}</p>
              {adv.example && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-slate-400 dark:text-slate-500 w-12 flex-shrink-0">Before</span>
                    <code className="px-2 py-1 rounded bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 font-mono break-all">{adv.example.before}</code>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-slate-400 dark:text-slate-500 w-12 flex-shrink-0">After</span>
                    <code className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-mono">{adv.example.after}</code>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Who is it for */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Who benefits most</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {audiences.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${a.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{a.title}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{a.description}</p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {a.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <FiCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 flex items-center justify-between gap-4 bg-violet-600 rounded-xl p-6 text-white">
        <div>
          <p className="font-semibold">Free for everyone, forever</p>
          <p className="text-sm text-violet-200 mt-0.5">No premium tier. Every feature available to every user.</p>
        </div>
        <Link
          to="/login"
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-white text-violet-700 hover:bg-violet-50 text-sm font-semibold rounded-lg transition-colors"
        >
          Get started <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </DocLayout>
  );
};

export default Benefits;
