import { FiUserPlus, FiMail, FiLogIn, FiLink, FiLock, FiShare2, FiExternalLink, FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import DocLayout from "./DocLayout";

const steps = [
  {
    number: "01",
    icon: FiUserPlus,
    title: "Create an account",
    description:
      "Sign up with your email and choose a username. The username becomes your subdomain — pick something short and memorable since you can't change it later.",
    details: [
      "Go to the Sign Up page",
      "Enter your email address",
      'Choose a username (e.g., "johndoe") — this becomes johndoe.allin1url.in',
      "Set a strong password",
      "Click Sign Up",
    ],
    tip: "Username is permanent and case-insensitive. Choose something you're happy sharing publicly.",
  },
  {
    number: "02",
    icon: FiMail,
    title: "Verify your email",
    description:
      "A one-time password (OTP) is sent to your email address. Enter it to activate your account. The code expires after a few minutes.",
    details: [
      "Check your inbox (and spam folder) for the verification email",
      "Copy the 6-digit OTP",
      "Enter it on the verification page",
      "Your account activates immediately after",
    ],
  },
  {
    number: "03",
    icon: FiLogIn,
    title: "Sign in to your dashboard",
    description: "Log in with your username or email and password. You'll land on the Dashboard where you can manage all your links.",
    details: [
      "Enter your username or email",
      "Enter your password",
      "Click Sign In",
      'You\'ll be redirected to the Dashboard (/home)',
    ],
  },
  {
    number: "04",
    icon: FiLink,
    title: "Add your first link",
    description:
      'From the Dashboard or Links page, click "Create Bridge". Enter a platform name and the destination URL. Your new link is live immediately.',
    details: [
      "Click Create Bridge on the Dashboard or Links page",
      'Enter a platform name — e.g., "linkedin", "github", "portfolio"',
      "Enter the full destination URL",
      "Click Create",
      "Your link is now live at username.allin1url.in/platformname",
    ],
    example: {
      platform: "github",
      destination: "https://github.com/yourhandle",
      result: "johndoe.allin1url.in/github",
    },
    tip: "Platform names are case-insensitive and must be unique per account.",
  },
  {
    number: "05",
    icon: FiLock,
    title: "Set link visibility",
    description:
      "By default, links are Public. Change visibility from the link card to control where each link appears.",
    details: [
      "Find the link card on the Links page",
      "Click the lock / visibility icon",
      "Choose Public, Unlisted, or Private",
      "For Private links, you'll be prompted to set a password",
      "Changes save immediately",
    ],
    levels: [
      { label: "Public", desc: "Hub, profile preview, and search", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
      { label: "Unlisted", desc: "Profile preview only — hidden from hub", color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
      { label: "Private", desc: "Nowhere — password required to access", color: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
    ],
  },
  {
    number: "06",
    icon: FiShare2,
    title: "Share your hub link",
    description:
      "Your hub (username.allin1url.in) is a landing page showing all your public links. Share this single URL everywhere.",
    details: [
      "Copy your hub URL: username.allin1url.in",
      "Put it in your resume header",
      "Add it to email signatures",
      "Use it as your social media bio link",
      "Print it on business cards",
    ],
    tip: "Visitors can browse all your links from one page and choose where to go.",
  },
  {
    number: "07",
    icon: FiExternalLink,
    title: "Share individual platform links",
    description:
      "When you need to point someone to a specific platform, share the direct link rather than the hub.",
    details: [
      "Each platform has its own URL: username.allin1url.in/platform",
      "Clicking it redirects straight to the destination",
      "Share the LinkedIn link in a job application, GitHub link in a PR review, etc.",
      "If you update the destination later, all existing shares auto-redirect",
    ],
  },
];

const HowToUse = () => {
  return (
    <DocLayout
      badge="Getting Started"
      title="How to Use"
      subtitle="From signup to sharing — a step-by-step guide to getting started with All in1 url."
    >
      {/* Quick start note */}
      <div className="mb-8 p-4 bg-violet-50 dark:bg-violet-950/20 rounded-xl border border-violet-100 dark:border-violet-900/50">
        <p className="text-sm text-violet-800 dark:text-violet-300 font-medium mb-0.5">Takes about 2 minutes</p>
        <p className="text-xs text-violet-600 dark:text-violet-400">Register → Verify email → Add a link → Share. That's the whole flow.</p>
      </div>

      {/* Steps */}
      <div className="space-y-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;
          return (
            <div key={step.number} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 z-10">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                {!isLast && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 my-1" />}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-8 ${isLast ? "" : ""}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-violet-500 dark:text-violet-400">{step.number}</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{step.description}</p>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
                  <ul className="space-y-1.5 mb-0">
                    {step.details.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <FiCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{d}</span>
                      </li>
                    ))}
                  </ul>

                  {step.example && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 dark:text-slate-500 w-20 flex-shrink-0">Platform</span>
                        <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">{step.example.platform}</code>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 dark:text-slate-500 w-20 flex-shrink-0">Destination</span>
                        <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono break-all">{step.example.destination}</code>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 dark:text-slate-500 w-20 flex-shrink-0">Your link</span>
                        <code className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-mono">{step.example.result}</code>
                      </div>
                    </div>
                  )}

                  {step.levels && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      {step.levels.map((l) => (
                        <div key={l.label} className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${l.dot} flex-shrink-0`} />
                          <span className={`text-xs font-medium ${l.color}`}>{l.label}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">— {l.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {step.tip && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Tip:</span> {step.tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ready CTA */}
      <div className="mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 text-center">
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Ready to set up your links?</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">The whole process takes under 2 minutes. No credit card required.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Create your free account
        </Link>
      </div>
    </DocLayout>
  );
};

export default HowToUse;
