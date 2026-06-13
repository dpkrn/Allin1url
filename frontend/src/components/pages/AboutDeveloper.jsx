import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiGithub, FiLinkedin, FiGlobe, FiMail, FiServer, FiMonitor,
  FiWifi, FiArrowLeft, FiUsers, FiCode, FiExternalLink
} from "react-icons/fi";
import profile from "../../assets/profile.png";
import Footer from "../footer/Footer";

const techStack = [
  "React 18", "Redux Toolkit", "Tailwind CSS", "Framer Motion",
  "Node.js", "Express.js", "MongoDB", "Mongoose",
  "JWT Auth", "bcrypt", "Helmet.js", "Axios",
];

const roles = [
  {
    icon: FiServer,
    bg: "bg-violet-50 dark:bg-violet-950/30",
    color: "text-violet-600 dark:text-violet-400",
    title: "Backend Development",
    description: "REST API design, authentication (JWT + cookies), MongoDB schema design, analytics pipeline, email notifications, and server infrastructure.",
  },
  {
    icon: FiMonitor,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    color: "text-blue-600 dark:text-blue-400",
    title: "Frontend Development",
    description: "React SPA with Redux state management, responsive design with Tailwind CSS, animations with Framer Motion, and a full dashboard experience.",
  },
  {
    icon: FiWifi,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    color: "text-emerald-600 dark:text-emerald-400",
    title: "Network Architecture",
    description: "Subdomain routing, CORS configuration, HTTPS setup, request middleware pipeline, and domain-based tier detection for dev/production environments.",
  },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/DpkRn",
    icon: FiGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/deepak-kumar-b3181a236/",
    icon: FiLinkedin,
  },
  {
    label: "Portfolio",
    href: "https://deepak-aryan.vercel.app/",
    icon: FiGlobe,
  },
  {
    label: "Email",
    href: "mailto:d.wizard.techno@gmail.com",
    icon: FiMail,
  },
];

const AboutDeveloper = () => {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const res = await axios.get("https://api.github.com/repos/DpkRn/LinkBridger/collaborators", {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${import.meta.env?.VITE_GITHUB_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        setCollaborators(res.data);
      } catch {
        // silent — show page without collaborators if fetch fails
      }
    };
    fetchCollaborators();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Profile card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-violet-100 dark:ring-violet-900/40 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={profile}
                    alt="Deepak Kumar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">D</div>';
                    }}
                  />
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Available" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Deepak Kumar</h1>
                <span className="inline-flex self-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400">
                  Solo Developer
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Full-stack developer · Built All in1 url end-to-end
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 max-w-xl">
                I built All in1 url to solve a real problem — managing multiple social and professional links
                scattered across platforms. The idea is simple: one free subdomain, clean memorable URLs, and full
                control over who sees what. Every part of this project, from the API to the UI, was designed and
                written by me.
              </p>

              {/* Social links */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Roles */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-1">
            Contributions to this project
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div key={role.title} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
                  <div className={`w-8 h-8 rounded-lg ${role.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${role.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{role.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{role.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <FiCode className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tech Stack</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* GitHub collaborators */}
        {collaborators.length > 0 && (
          <section className="mb-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <FiUsers className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">GitHub Collaborators</h2>
                <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">{collaborators.length} contributor{collaborators.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {collaborators.map((c) => (
                  <a
                    key={c.id}
                    href={c.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-colors group"
                  >
                    <img
                      src={c.avatar_url}
                      alt={c.login}
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{c.login}</span>
                    <FiExternalLink className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Project link */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Open Source</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              The entire codebase is available on GitHub — read it, fork it, or contribute.
            </p>
          </div>
          <a
            href="https://github.com/DpkRn/LinkBridger"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-lg transition-colors"
          >
            <FiGithub className="w-4 h-4" />
            View on GitHub
          </a>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default AboutDeveloper;
