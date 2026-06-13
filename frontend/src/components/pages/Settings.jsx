import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiUser, FiLock, FiLink, FiBell, FiSearch, FiLoader, FiShield, FiLayout, FiChevronDown, FiCheck, FiX } from "react-icons/fi";

const ToggleSetting = ({ label, description, value, onChange, disabled = false, updating = false }) => (
  <div className={`flex items-center justify-between py-3.5 ${disabled ? 'opacity-50' : ''}`}>
    <div className="flex-1 mr-4">
      <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      {updating && <FiLoader className="w-3.5 h-3.5 text-violet-600 animate-spin" />}
      <button
        onClick={() => !disabled && !updating && onChange(!value)}
        disabled={disabled || updating}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
          value ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'
        } ${disabled || updating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-[3px]'}`}
        />
      </button>
    </div>
  </div>
);

const SettingsSection = ({ icon: Icon, title, children }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
      <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
    </div>
    <div className="px-5 divide-y divide-slate-100 dark:divide-slate-800">
      {children}
    </div>
  </div>
);

const Settings = () => {
  const { username } = useSelector((store) => store.admin.user);
  const [loading, setLoading] = useState(false);

  const [profileSettings, setProfileSettings] = useState({
    isPublic: false, showInSearch: false, allowProfileView: false,
    showEmail: false, showHeadline: true, showWebsite: true, showSkills: true,
    showLocation: true, showBio: true, showPassion: true, showProfileImage: true
  });
  const [linkSettings, setLinkSettings] = useState({ showLinkCount: true, showClickStats: false });
  const [searchSettings, setSearchSettings] = useState({ allowSearch: false, showInFeatured: false, searchKeywords: [] });
  const [privacySettings, setPrivacySettings] = useState({ showAnalytics: false, showLastUpdated: false, requireAuth: false });
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewClick: false, emailOnProfileView: false, emailOnLinkHubView: false, weeklyReport: false
  });
  const [linkhubSettings, setLinkhubSettings] = useState({
    showHeadline: true, showBio: true, showLocation: true, showWebsite: true, showSkills: true,
    showEmail: false, showPhone: false, showWhatsapp: false, showTwitter: true, showLinkedin: true,
    showGithub: true, showInstagram: false, showYoutube: false
  });
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [updatingFields, setUpdatingFields] = useState(new Set());

  const defaultTemplates = [
    { template: 'default', displayName: 'Default', description: 'Clean and simple' },
    { template: 'minimal', displayName: 'Minimal', description: 'Minimalist design' },
    { template: 'modern', displayName: 'Modern', description: 'Modern and sleek' },
    { template: 'dark', displayName: 'Dark', description: 'Dark theme' },
    { template: 'light', displayName: 'Light', description: 'Light theme' },
    { template: 'hacker', displayName: 'Hacker', description: 'Hacker style' },
    { template: 'glass', displayName: 'Glass', description: 'Glassmorphism' },
    { template: 'neon', displayName: 'Neon', description: 'Neon glow effects' },
    { template: 'gradient', displayName: 'Gradient', description: 'Gradient backgrounds' },
    { template: 'cards', displayName: 'Cards', description: 'Card-based layout' },
    { template: 'particles', displayName: 'Particles', description: 'Particle effects' },
    { template: '3d', displayName: '3D', description: '3D effects' },
    { template: 'retro', displayName: 'Retro', description: 'Retro style' }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showTemplateDropdown && !e.target.closest('.template-dropdown-container')) {
        setShowTemplateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTemplateDropdown]);

  const fetchAvailableTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const res = await api.get('/project/templates');
      if (res.status === 200 && res.data.success) {
        const normalized = (res.data.templates || []).map(t => ({
          template: t.name || t.template,
          displayName: t.label || t.displayName || t.name || t.template,
          description: t.description || ''
        }));
        setAvailableTemplates(normalized.length > 0 ? normalized : defaultTemplates);
      } else {
        setAvailableTemplates(defaultTemplates);
      }
    } catch {
      setAvailableTemplates(defaultTemplates);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.post('/settings/get', { username }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        const s = res.data.settings;
        if (s.template) setSelectedTemplate(s.template);
        if (s.profile) setProfileSettings(s.profile);
        if (s.links) setLinkSettings(s.links);
        if (s.search) setSearchSettings(s.search);
        if (s.privacy) setPrivacySettings(s.privacy);
        if (s.notifications) setNotificationSettings(s.notifications);
        if (s.linkhub) setLinkhubSettings(s.linkhub);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    fetchAvailableTemplates();
  }, [username]);

  const updateSingleSetting = async (category, field, value) => {
    const fieldKey = `${category}.${field}`;
    const requiresPublicProfile = ['profile.showInSearch', 'profile.allowProfileView', 'profile.showEmail', 'search.allowSearch', 'search.showInFeatured'];
    if (!profileSettings.isPublic && requiresPublicProfile.includes(fieldKey)) return true;

    setUpdatingFields(prev => new Set(prev).add(fieldKey));
    try {
      const res = await api.post('/settings/update', { username, category, field, value }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        toast.success("Saved", { duration: 1500 });
        return true;
      }
      toast.error(res.data.message || "Failed to save");
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
      return false;
    } finally {
      setUpdatingFields(prev => { const s = new Set(prev); s.delete(fieldKey); return s; });
    }
  };

  const updateTemplate = async (template) => {
    setUpdatingFields(prev => new Set(prev).add('template'));
    try {
      const res = await api.post('/settings/update', { username, category: 'template', field: 'template', value: template }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        setSelectedTemplate(template);
        toast.success("Template updated", { duration: 1500 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setUpdatingFields(prev => { const s = new Set(prev); s.delete('template'); return s; });
    }
  };

  const addKeyword = async () => {
    const kw = newKeyword.trim();
    if (!kw) return;
    let updated;
    setSearchSettings(prev => {
      if (prev.searchKeywords.includes(kw)) return prev;
      updated = [...prev.searchKeywords, kw];
      setNewKeyword("");
      return { ...prev, searchKeywords: updated };
    });
    if (updated) {
      const ok = await updateSingleSetting('search', 'searchKeywords', updated);
      if (!ok) setSearchSettings(p => ({ ...p, searchKeywords: p.searchKeywords.filter(k => k !== kw) }));
    }
  };

  const removeKeyword = async (keyword) => {
    let updated;
    setSearchSettings(prev => { updated = prev.searchKeywords.filter(k => k !== keyword); return { ...prev, searchKeywords: updated }; });
    if (updated !== undefined) {
      const ok = await updateSingleSetting('search', 'searchKeywords', updated);
      if (!ok) setSearchSettings(p => ({ ...p, searchKeywords: [...p.searchKeywords, keyword] }));
    }
  };

  const currentTemplate = availableTemplates.find(t => (t.template || t.name) === selectedTemplate);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 h-40 justify-center">
          <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your privacy, visibility, and notification preferences</p>
      </div>

      <div className="space-y-4">
        {/* Template */}
        <SettingsSection icon={FiLayout} title="LinkHub Template">
          <div className="py-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Choose a visual template for your public link hub page</p>
            <div className="relative template-dropdown-container">
              <button
                onClick={() => !updatingFields.has('template') && setShowTemplateDropdown(s => !s)}
                disabled={updatingFields.has('template') || loadingTemplates}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:border-violet-400 dark:hover:border-violet-600 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  {updatingFields.has('template')
                    ? <FiLoader className="w-4 h-4 text-violet-600 animate-spin" />
                    : <FiLayout className="w-4 h-4 text-slate-400" />}
                  <div className="text-left">
                    <span className="text-slate-900 dark:text-white font-medium">
                      {loadingTemplates ? 'Loading...' : (currentTemplate?.displayName || selectedTemplate || 'Select template')}
                    </span>
                    {currentTemplate?.description && (
                      <span className="ml-2 text-xs text-slate-400">{currentTemplate.description}</span>
                    )}
                  </div>
                </div>
                <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showTemplateDropdown && !loadingTemplates && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                  >
                    {availableTemplates.map((t) => {
                      const tName = t.template || t.name;
                      const isSelected = selectedTemplate === tName;
                      return (
                        <button
                          key={tName}
                          onClick={() => { setShowTemplateDropdown(false); updateTemplate(tName); }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${isSelected ? 'bg-violet-50 dark:bg-violet-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                          <div>
                            <span className={`font-medium ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-slate-900 dark:text-white'}`}>
                              {t.displayName || tName}
                            </span>
                            {t.description && <span className="ml-2 text-xs text-slate-400">{t.description}</span>}
                          </div>
                          {isSelected && <FiCheck className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </SettingsSection>

        {/* Profile Visibility */}
        <SettingsSection icon={FiUser} title="Profile Visibility">
          {[
            { label: "Make Profile Public", desc: "Allow others to view your profile", key: 'isPublic', state: profileSettings, setter: setProfileSettings, field: 'isPublic', category: 'profile' },
            { label: "Show in Search Results", desc: "Appear in user search results", key: 'showInSearch', state: profileSettings, setter: setProfileSettings, field: 'showInSearch', category: 'profile', disabled: !profileSettings.isPublic },
            { label: "Allow Profile View", desc: "Let others see your full profile page", key: 'allowProfileView', state: profileSettings, setter: setProfileSettings, field: 'allowProfileView', category: 'profile', disabled: !profileSettings.isPublic },
            { label: "Show Email", desc: "Display email on public profile", key: 'showEmail', state: profileSettings, setter: setProfileSettings, field: 'showEmail', category: 'profile', disabled: !profileSettings.isPublic },
            { label: "Show Headline", desc: "Display your tagline on public profile and LinkHub", key: 'showHeadline', state: profileSettings, setter: setProfileSettings, field: 'showHeadline', category: 'profile' },
            { label: "Show Website", desc: "Display website link on public profile and LinkHub", key: 'showWebsite', state: profileSettings, setter: setProfileSettings, field: 'showWebsite', category: 'profile' },
            { label: "Show Skills", desc: "Display skill tags on public profile and LinkHub", key: 'showSkills', state: profileSettings, setter: setProfileSettings, field: 'showSkills', category: 'profile' },
            { label: "Show Location", desc: "Display location on public profile and LinkHub", key: 'showLocation', state: profileSettings, setter: setProfileSettings, field: 'showLocation', category: 'profile' },
            { label: "Show Bio", desc: "Display bio on public profile and LinkHub", key: 'showBio', state: profileSettings, setter: setProfileSettings, field: 'showBio', category: 'profile' },
            { label: "Show Passion", desc: "Display passion on public profile", key: 'showPassion', state: profileSettings, setter: setProfileSettings, field: 'showPassion', category: 'profile' },
            { label: "Show Profile Image", desc: "Display profile picture on public profile and LinkHub", key: 'showProfileImage', state: profileSettings, setter: setProfileSettings, field: 'showProfileImage', category: 'profile' },
          ].map(({ label, desc, key, state, setter, field, category, disabled }) => (
            <ToggleSetting
              key={key}
              label={label}
              description={desc}
              value={state[key]}
              disabled={disabled}
              updating={updatingFields.has(`${category}.${field}`)}
              onChange={async (val) => {
                setter(prev => ({ ...prev, [key]: val }));
                const ok = await updateSingleSetting(category, field, val);
                if (!ok) setter(prev => ({ ...prev, [key]: !val }));
              }}
            />
          ))}
        </SettingsSection>

        {/* Link Display */}
        <SettingsSection icon={FiLink} title="Link Display">
          {[
            { label: "Show Link Count", desc: "Display total number of links on public profile", key: 'showLinkCount', field: 'showLinkCount', state: linkSettings, setter: setLinkSettings, category: 'links' },
            { label: "Show Click Statistics", desc: "Display click stats on public profile", key: 'showClickStats', field: 'showClickStats', state: linkSettings, setter: setLinkSettings, category: 'links' },
          ].map(({ label, desc, key, field, state, setter, category }) => (
            <ToggleSetting key={key} label={label} description={desc} value={state[key]}
              updating={updatingFields.has(`${category}.${field}`)}
              onChange={async (val) => {
                setter(prev => ({ ...prev, [key]: val }));
                const ok = await updateSingleSetting(category, field, val);
                if (!ok) setter(prev => ({ ...prev, [key]: !val }));
              }}
            />
          ))}
        </SettingsSection>

        {/* LinkHub Visibility */}
        <SettingsSection icon={FiLayout} title="LinkHub Visibility">
          <div className="py-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 py-2">Control what personal info appears on your public link hub page</p>
          </div>
          {[
            { label: "Show Headline", desc: "Display your tagline on your link hub", key: 'showHeadline', field: 'showHeadline' },
            { label: "Show Bio", desc: "Display bio on your link hub", key: 'showBio', field: 'showBio' },
            { label: "Show Location", desc: "Display location on your link hub", key: 'showLocation', field: 'showLocation' },
            { label: "Show Website", desc: "Display website link on your link hub", key: 'showWebsite', field: 'showWebsite' },
            { label: "Show Skills", desc: "Display skill tags on your link hub", key: 'showSkills', field: 'showSkills' },
            { label: "Show Email", desc: "Display email address on your link hub", key: 'showEmail', field: 'showEmail' },
            { label: "Show Phone", desc: "Display phone number on your link hub", key: 'showPhone', field: 'showPhone' },
            { label: "Show WhatsApp", desc: "Display WhatsApp link on your link hub", key: 'showWhatsapp', field: 'showWhatsapp' },
            { label: "Show Twitter / X", desc: "Display Twitter/X link on your link hub", key: 'showTwitter', field: 'showTwitter' },
            { label: "Show LinkedIn", desc: "Display LinkedIn link on your link hub", key: 'showLinkedin', field: 'showLinkedin' },
            { label: "Show GitHub", desc: "Display GitHub link on your link hub", key: 'showGithub', field: 'showGithub' },
            { label: "Show Instagram", desc: "Display Instagram link on your link hub", key: 'showInstagram', field: 'showInstagram' },
            { label: "Show YouTube", desc: "Display YouTube link on your link hub", key: 'showYoutube', field: 'showYoutube' },
          ].map(({ label, desc, key, field }) => (
            <ToggleSetting key={key} label={label} description={desc} value={linkhubSettings[key]}
              updating={updatingFields.has(`linkhub.${field}`)}
              onChange={async (val) => {
                setLinkhubSettings(prev => ({ ...prev, [key]: val }));
                const ok = await updateSingleSetting('linkhub', field, val);
                if (!ok) setLinkhubSettings(prev => ({ ...prev, [key]: !val }));
              }}
            />
          ))}
        </SettingsSection>

        {/* Search & Discovery */}
        <SettingsSection icon={FiSearch} title="Search & Discovery">
          <ToggleSetting label="Allow Search" description="Appear in search results"
            value={searchSettings.allowSearch} updating={updatingFields.has('search.allowSearch')}
            onChange={async (val) => {
              setSearchSettings(p => ({ ...p, allowSearch: val }));
              const ok = await updateSingleSetting('search', 'allowSearch', val);
              if (!ok) setSearchSettings(p => ({ ...p, allowSearch: !val }));
            }}
          />
          <ToggleSetting label="Show in Featured" description="Appear in featured sections"
            value={searchSettings.showInFeatured} disabled={!searchSettings.allowSearch}
            updating={updatingFields.has('search.showInFeatured')}
            onChange={async (val) => {
              setSearchSettings(p => ({ ...p, showInFeatured: val }));
              const ok = await updateSingleSetting('search', 'showInFeatured', val);
              if (!ok) setSearchSettings(p => ({ ...p, showInFeatured: !val }));
            }}
          />
          <div className="py-4">
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Search Keywords</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Help others find your profile</p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                placeholder="Add keyword..."
                className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
              />
              <button onClick={addKeyword} className="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                Add
              </button>
            </div>
            {searchSettings.searchKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {searchSettings.searchKeywords.map((kw) => (
                  <span key={kw} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-medium">
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="text-violet-400 hover:text-violet-600 leading-none">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection icon={FiShield} title="Privacy">
          {[
            { label: "Show Analytics", desc: "Display analytics on public profile", key: 'showAnalytics', field: 'showAnalytics', category: 'privacy', state: privacySettings, setter: setPrivacySettings },
            { label: "Show Last Updated", desc: "Display last updated timestamp on profile", key: 'showLastUpdated', field: 'showLastUpdated', category: 'privacy', state: privacySettings, setter: setPrivacySettings },
            { label: "Require Authentication", desc: "Require login to view your profile", key: 'requireAuth', field: 'requireAuth', category: 'privacy', state: privacySettings, setter: setPrivacySettings },
          ].map(({ label, desc, key, field, category, state, setter }) => (
            <ToggleSetting key={key} label={label} description={desc} value={state[key]}
              updating={updatingFields.has(`${category}.${field}`)}
              onChange={async (val) => {
                setter(p => ({ ...p, [key]: val }));
                const ok = await updateSingleSetting(category, field, val);
                if (!ok) setter(p => ({ ...p, [key]: !val }));
              }}
            />
          ))}
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection icon={FiBell} title="Email Notifications">
          {[
            { label: "On New Click", desc: "Email when a link receives a click", key: 'emailOnNewClick', field: 'emailOnNewClick', category: 'notifications', state: notificationSettings, setter: setNotificationSettings },
            { label: "On Profile View", desc: "Email when someone views your profile", key: 'emailOnProfileView', field: 'emailOnProfileView', category: 'notifications', state: notificationSettings, setter: setNotificationSettings },
            { label: "On LinkHub Visit", desc: "Email when someone visits your link hub", key: 'emailOnLinkHubView', field: 'emailOnLinkHubView', category: 'notifications', state: notificationSettings, setter: setNotificationSettings },
            { label: "Weekly Report", desc: "Weekly analytics summary via email", key: 'weeklyReport', field: 'weeklyReport', category: 'notifications', state: notificationSettings, setter: setNotificationSettings },
          ].map(({ label, desc, key, field, category, state, setter }) => (
            <ToggleSetting key={key} label={label} description={desc} value={state[key]}
              updating={updatingFields.has(`${category}.${field}`)}
              onChange={async (val) => {
                setter(p => ({ ...p, [key]: val }));
                const ok = await updateSingleSetting(category, field, val);
                if (!ok) setter(p => ({ ...p, [key]: !val }));
              }}
            />
          ))}
        </SettingsSection>
      </div>
    </div>
  );
};

export default Settings;
