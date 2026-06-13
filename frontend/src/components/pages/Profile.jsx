import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiUser, FiMapPin, FiHeart, FiEdit2, FiSave, FiX, FiCamera, FiLink, FiBarChart2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [passion, setPassion] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("profile.png");
  const [isEditable, setEditable] = useState(false);
  const [hover, setHover] = useState(false);
  const [loader, setLoader] = useState(false);
  const [imageLoader, setImageLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { username } = useSelector((store) => store.admin.user);
  const links = useSelector((store) => store.admin.links) || [];
  const totalClicks = links.reduce((sum, l) => sum + (l.clicked || 0), 0);

  const handleSaveEditClick = async () => {
    if (isEditable) {
      try {
        setLoader(true);
        const res = await api.post("/profile/update", { username, name, passion, location, bio }, { withCredentials: true });
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
        const { name, location, bio, passion, image } = res.data.userinfo;
        setName(name || "");
        setLocation(location || "");
        setBio(bio || "");
        setPassion(passion || "");
        setImage(image || "profile.png");
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

  useEffect(() => {
    if (username) getProfileInfo();
  }, [username, getProfileInfo]);

  const inputClass = "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800/50";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your profile information</p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditable ? (
            <button
              onClick={handleSaveEditClick}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={loader}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors disabled:opacity-50"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSaveEditClick}
                disabled={loader}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {loader ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
                {loader ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Left: Avatar + Stats */}
        <div className="space-y-4">
          {/* Avatar card */}
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
                  <img
                    src={image}
                    alt="Profile"
                    className="w-24 h-24 object-cover"
                    onError={(e) => { e.target.src = "profile.png"; }}
                  />
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

          {/* Stats */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
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
            <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => navigate(`/profile/${username}`)}
                className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:underline font-medium"
              >
                <FiEye className="w-4 h-4" />
                View public profile
              </button>
            </div>
          </div>
        </div>

        {/* Right: Form */}
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
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                <FiUser className="w-3.5 h-3.5" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                disabled={!isEditable}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                <FiMapPin className="w-3.5 h-3.5" />
                Location
              </label>
              <input
                type="text"
                placeholder="City, Country"
                value={location}
                disabled={!isEditable}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Passion */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                <FiHeart className="w-3.5 h-3.5" />
                Passion
              </label>
              <input
                type="text"
                placeholder="What are you passionate about?"
                value={passion}
                disabled={!isEditable}
                onChange={(e) => setPassion(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                <FiEdit2 className="w-3.5 h-3.5" />
                Bio
              </label>
              <textarea
                placeholder="Tell people about yourself..."
                value={bio}
                disabled={!isEditable}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
