import { FiCheck, FiX, FiMinus, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import DocLayout from "./DocLayout";

const comparisonRows = [
  { feature: "Human-readable URLs", allin1: true, bitly: false, linktree: false, biolink: false },
  { feature: "Custom subdomain (free)", allin1: true, bitly: false, linktree: false, biolink: false },
  { feature: "Links never expire", allin1: true, bitly: "paid", linktree: true, biolink: true },
  { feature: "Per-click analytics (free)", allin1: true, bitly: "paid", linktree: "paid", biolink: "paid" },
  { feature: "Password-protected links", allin1: true, bitly: false, linktree: "paid", biolink: "paid" },
  { feature: "Link visibility controls", allin1: true, bitly: false, linktree: "limited", biolink: "limited" },
  { feature: "Update destination without resharing", allin1: true, bitly: true, linktree: true, biolink: true },
  { feature: "Hub landing page", allin1: true, bitly: false, linktree: true, biolink: true },
  { feature: "User search / discovery", allin1: true, bitly: false, linktree: false, biolink: false },
  { feature: "Granular profile privacy", allin1: true, bitly: false, linktree: "limited", biolink: "limited" },
  { feature: "Open source & self-hostable", allin1: true, bitly: false, linktree: false, biolink: false },
  { feature: "No third-party tracking", allin1: true, bitly: false, linktree: false, biolink: false },
  { feature: "Free forever (no paid tier)", allin1: true, bitly: false, linktree: false, biolink: false },
];

const cols = [
  { key: "allin1", label: "All in1 url", highlight: true },
  { key: "bitly", label: "Bit.ly / TinyURL" },
  { key: "linktree", label: "Linktree" },
  { key: "biolink", label: "Bio.link" },
];

const CellIcon = ({ value }) => {
  if (value === true) return <FiCheck className="w-4 h-4 text-emerald-500 mx-auto" />;
  if (value === false) return <FiX className="w-4 h-4 text-red-400 mx-auto" />;
  return (
    <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap">
      {value === "paid" ? "Paid only" : value}
    </span>
  );
};

const differentiators = [
  {
    title: "Links that mean something",
    body: "Most link shorteners produce codes like bit.ly/3xZ9k. With All in1 url, every link follows the pattern username.allin1url.in/platform. Someone who sees your LinkedIn link can correctly guess what your GitHub link looks like — that's memorable by design.",
  },
  {
    title: "Everything free, no upgrade wall",
    body: "Linktree charges $6–24/month for analytics and password protection. Bio.link charges $3–9/month for similar features. All in1 url provides all features — including per-click analytics and password-protected links — at no cost and with no paid tier.",
  },
  {
    title: "Open source — audit and self-host",
    body: "The entire codebase is on GitHub. You can read exactly how your data is handled, check the security implementation, contribute improvements, or self-host the service entirely if you want full control. No black boxes.",
  },
  {
    title: "Privacy-first by architecture",
    body: "No Google Analytics. No tracking pixels. No third-party scripts watching your visitors. The click analytics system is built in-house and the data exists only for your own dashboard — never aggregated for advertising.",
  },
  {
    title: "No vendor lock-in",
    body: "Because All in1 url is open source, you're never stuck. If the service ever goes down, the codebase exists to recreate it. Your links are readable enough that manually migrating them is practical.",
  },
  {
    title: "SEO and accessibility",
    body: "Screen readers, email clients, and search engines all handle descriptive URLs better than opaque codes. username.allin1url.in/linkedin conveys intent before the click happens — random codes convey nothing.",
  },
];

const Different = () => {
  return (
    <DocLayout
      badge="Comparison"
      title="How it's Different"
      subtitle="All in1 url compared to link shorteners and bio link tools — feature by feature."
    >
      {/* Comparison table */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Feature comparison</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 w-48 bg-slate-50 dark:bg-slate-900">
                    Feature
                  </th>
                  {cols.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-center text-xs font-semibold ${
                        col.highlight
                          ? "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400"
                          : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {col.highlight && (
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-violet-500 mb-0.5">
                          This app
                        </span>
                      )}
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={idx % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-slate-50/50 dark:bg-slate-900/30"}
                  >
                    <td className="px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">{row.feature}</td>
                    {cols.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-2.5 text-center ${
                          col.highlight ? "bg-violet-50/50 dark:bg-violet-950/10" : ""
                        }`}
                      >
                        <CellIcon value={row[col.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1"><FiCheck className="w-3 h-3 text-emerald-500" /> Available free</span>
            <span className="flex items-center gap-1"><span className="text-[9px] font-bold text-amber-500">Paid</span> Paid plan required</span>
            <span className="flex items-center gap-1"><FiX className="w-3 h-3 text-red-400" /> Not available</span>
          </div>
        </div>
      </section>

      {/* Why different */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Why All in1 url stands apart</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {differentiators.map((d, idx) => (
            <div key={d.title} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{d.title}</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">See for yourself</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Signup takes under a minute. No payment info needed.</p>
        </div>
        <Link
          to="/login"
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Get started <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </DocLayout>
  );
};

export default Different;
