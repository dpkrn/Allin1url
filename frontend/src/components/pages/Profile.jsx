import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
  FiUser, FiMapPin, FiHeart, FiEdit2, FiSave, FiX, FiCamera,
  FiLink, FiBarChart2, FiEye, FiCopy, FiCheck, FiGlobe,
  FiMail, FiCalendar, FiTag, FiTrendingUp, FiAward,
  FiPhone, FiMessageSquare, FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiYoutube, FiLink2,
} from "react-icons/fi";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [passion, setPassion] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [headline, setHeadline] = useState("");
  const [website, setWebsite] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [image, setImage] = useState("profile.png");
  const [isEditable, setEditable] = useState(false);
  const [hover, setHover] = useState(false);
  const [loader, setLoader] = useState(false);
  const [imageLoader, setImageLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);
  const user = useSelector((store) => store.admin.user);
  const { username } = user || {};
  const links = useSelector((store) => store.admin.links) || [];
  const totalClicks = links.reduce((sum, l) => sum + (l.clicked || 0), 0);
  const topLink = links.length > 0
    ? links.reduce((best, l) => (l.clicked || 0) > (best.clicked || 0) ? l : best, links[0])
    : null;

  const profileUrl = `${username}.allin1url.in`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${profileUrl}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveEditClick = async () => {
    if (isEditable) {
      try {
        setLoader(true);
        const res = await api.post(
          "/profile/update",
          { username, name, passion, location, bio, headline, website, skills, phone, whatsapp, twitter, linkedin, github, instagram, youtube },
          { withCredentials: true }
        );
        if (res.status === 201 && res.data.success) {
          toast.success(res.data.msg || "Profile updated");
          setEditable(false);
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Server error");
      } finally {
        setLoader(false);
      }
    } else {
      setEditable(true);
    }
  };

  const getProfileInfo = useCallback(async () => {
    try {
      const res = await api.post("/profile/getprofileinfo", { username }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        const info = res.data.userinfo;
        setName(info.name || "");
        setLocation(info.location || "");
        setBio(info.bio || "");
        setPassion(info.passion || "");
        setHeadline(info.headline || "");
        setWebsite(info.website || "");
        setSkills(Array.isArray(info.skills) ? info.skills : []);
        setImage(info.image || "profile.png");
        setPhone(info.phone || "");
        setWhatsapp(info.whatsapp || "");
        setTwitter(info.twitter || "");
        setLinkedin(info.linkedin || "");
        setGithub(info.github || "");
        setInstagram(info.instagram || "");
        setYoutube(info.youtube || "");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to load profile");
    }
  }, [username]);

  const handleCancel = () => {
    setEditable(false);
    if (username) getProfileInfo();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/webp"];
    if (!validTypes.includes(file.type)) { toast.error("Please select a valid image (JPG, PNG, SVG, WEBP)"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setImageLoading(true);
      try {
        const res = await api.post("/profile/updatepic", { username, image: reader.result }, { withCredentials: true });
        if (res.status === 201 && res.data.success) {
          setImage(res.data.resImage);
          toast.success("Profile picture updated!");
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to upload image");
      } finally {
        setImageLoading(false);
      }
    };
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s || skills.includes(s) || skills.length >= 12) return;
    setSkills(prev => [...prev, s]);
    setNewSkill("");
  };

  const removeSkill = (skill) => setSkills(prev => prev.filter(s => s !== skill));

  useEffect(() => {
    if (username) getProfileInfo();
  }, [username, getProfileInfo]);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  const inputClass = "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800/50";
  const labelClass = "flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your public profile information</p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditable ? (
            <button onClick={handleSaveEditClick} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
              <FiEdit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleCancel} disabled={loader} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors disabled:opacity-50">
                <FiX className="w-4 h-4" />Cancel
              </button>
              <button onClick={handleSaveEditClick} disabled={loader} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                {loader ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
                {loader ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* ── Left Column ── */}
        <div className="space-y-4">
          {/* Avatar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 text-center">
            <div
              className="relative inline-block cursor-pointer mb-4"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-violet-100 dark:ring-violet-900/30 mx-auto">
                {imageLoader ? (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <img src={image} alt="Profile" className="w-24 h-24 object-cover" onError={(e) => { e.target.src = "profile.png"; }} />
                )}
              </div>
              {hover && !imageLoader && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <FiCamera className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp" />
            <p className="text-base font-semibold text-slate-900 dark:text-white">@{username}</p>
            <p className="text-xs text-slate-400 mt-0.5">Click avatar to change photo</p>
          </div>

          {/* Profile URL */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Your Profile URL</p>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="flex-1 text-xs text-slate-700 dark:text-slate-300 font-mono truncate">{profileUrl}</span>
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors flex-shrink-0"
              >
                {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <a
              href={`https://${profileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 mt-2 text-xs text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
            >
              <FiEye className="w-3 h-3" />
              Preview public page
            </a>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overview</p>
            </div>
            {[
              { label: "Total Links", value: links.length, icon: FiLink, color: "text-violet-600 dark:text-violet-400" },
              { label: "Total Clicks", value: totalClicks, icon: FiBarChart2, color: "text-blue-600 dark:text-blue-400" },
            ].map(({ label, value, icon: Icon, color }, i) => (
              <div key={label} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}>
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                </div>
                <span className={`text-sm font-bold ${color}`}>{value}</span>
              </div>
            ))}
            {topLink && topLink.clicked > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <FiTrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top Link</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{topLink.source}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{topLink.clicked} clicks</span>
                </div>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account</p>
            </div>
            <div className="px-4 py-3 space-y-3">
              {user?.email && (
                <div className="flex items-start gap-2.5">
                  <FiMail className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 break-all">{user.email}</p>
                  </div>
                </div>
              )}
              {memberSince && (
                <div className="flex items-start gap-2.5">
                  <FiCalendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Member since</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{memberSince}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column: Form ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6">
          {isEditable && (
            <div className="flex items-center gap-2 mb-5 p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
              <FiEdit2 className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <p className="text-xs font-medium text-violet-700 dark:text-violet-300">Edit mode active — make changes and click Save</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className={labelClass}><FiUser className="w-3.5 h-3.5" />Full Name</label>
              <input type="text" placeholder="Your full name" value={name} disabled={!isEditable} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>

            {/* Headline */}
            <div>
              <label className={labelClass}><FiAward className="w-3.5 h-3.5" />Headline</label>
              <input
                type="text"
                placeholder="e.g. Full Stack Developer · Open Source Enthusiast"
                value={headline}
                disabled={!isEditable}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={80}
                className={inputClass}
              />
              {isEditable && <p className="mt-1 text-xs text-slate-400">{headline.length}/80 — shown below your name on your public page</p>}
            </div>

            {/* Location */}
            <div>
              <label className={labelClass}><FiMapPin className="w-3.5 h-3.5" />Location</label>
              <input type="text" placeholder="City, Country" value={location} disabled={!isEditable} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
            </div>

            {/* Website */}
            <div>
              <label className={labelClass}><FiGlobe className="w-3.5 h-3.5" />Website</label>
              <input type="text" placeholder="yoursite.com" value={website} disabled={!isEditable} onChange={(e) => setWebsite(e.target.value)} className={inputClass} />
            </div>

            {/* Passion */}
            <div>
              <label className={labelClass}><FiHeart className="w-3.5 h-3.5" />Passion</label>
              <input type="text" placeholder="What are you passionate about?" value={passion} disabled={!isEditable} onChange={(e) => setPassion(e.target.value)} className={inputClass} />
            </div>

            {/* Bio */}
            <div>
              <label className={labelClass}><FiEdit2 className="w-3.5 h-3.5" />Bio</label>
              <textarea placeholder="Tell people about yourself..." value={bio} disabled={!isEditable} onChange={(e) => setBio(e.target.value)} rows={4} className={`${inputClass} resize-none`} />
            </div>

            {/* Skills */}
            <div>
              <label className={labelClass}><FiTag className="w-3.5 h-3.5" />Skills & Interests</label>
              {isEditable && (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); } }}
                    placeholder="e.g. React, Design, Marketing…"
                    disabled={skills.length >= 12}
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    disabled={!newSkill.trim() || skills.length >= 12}
                    className="px-3 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              )}
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded-full text-xs font-medium">
                      {skill}
                      {isEditable && (
                        <button onClick={() => removeSkill(skill)} className="text-violet-400 hover:text-violet-600 leading-none">
                          <FiX className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">{isEditable ? "No skills added yet. Press Enter or comma to add." : "No skills added."}</p>
              )}
              {isEditable && <p className="mt-1.5 text-xs text-slate-400">{skills.length}/12 skills</p>}
            </div>

            {/* Contact & Social */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Contact & Social</p>

              {/* Contact subsection */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className={labelClass}><FiMail className="w-3.5 h-3.5" />Email (account)</label>
                  <input type="text" value={user?.email || ""} disabled className={inputClass} />
                  <p className="mt-1 text-xs text-slate-400">This is your login email — managed in account settings</p>
                </div>
                <div>
                  <label className={labelClass}><FiPhone className="w-3.5 h-3.5" />Phone</label>
                  <input type="text" placeholder="+1 555 000 0000" value={phone} disabled={!isEditable} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><FiMessageSquare className="w-3.5 h-3.5" />WhatsApp</label>
                  <input type="text" placeholder="+1 555 000 0000" value={whatsapp} disabled={!isEditable} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Social Links subsection */}
              <div className="space-y-4">
                <div>
                  <label className={labelClass}><FiTwitter className="w-3.5 h-3.5" />Twitter / X</label>
                  <input type="text" placeholder="@username or username" value={twitter} disabled={!isEditable} onChange={(e) => setTwitter(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><FiLinkedin className="w-3.5 h-3.5" />LinkedIn</label>
                  <input type="text" placeholder="username or full URL" value={linkedin} disabled={!isEditable} onChange={(e) => setLinkedin(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><FiGithub className="w-3.5 h-3.5" />GitHub</label>
                  <input type="text" placeholder="@username or username" value={github} disabled={!isEditable} onChange={(e) => setGithub(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><FiInstagram className="w-3.5 h-3.5" />Instagram</label>
                  <input type="text" placeholder="@username or username" value={instagram} disabled={!isEditable} onChange={(e) => setInstagram(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><FiYoutube className="w-3.5 h-3.5" />YouTube</label>
                  <input type="text" placeholder="@handle or full channel URL" value={youtube} disabled={!isEditable} onChange={(e) => setYoutube(e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
