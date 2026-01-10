import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
  FaUser,
  FaLock,
  FaLink,
  FaBell,
  FaSearch,
  FaSpinner,
  FaShieldAlt,
  FaPalette,
  FaChevronDown
} from "react-icons/fa";

const Settings = () => {
  const { username, _id } = useSelector((store) => store.admin.user);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Profile Visibility Settings
  const [profileSettings, setProfileSettings] = useState({
    isPublic: false,
    showInSearch: false,
    allowProfileView: false,
    showEmail: false,
    showLocation: true,
    showBio: true,
    showPassion: true,
    showProfileImage: true
  });

  // Link Display Settings
  const [linkSettings, setLinkSettings] = useState({
    showLinkCount: true,
    showClickStats: false
  });

  // Search Settings
  const [searchSettings, setSearchSettings] = useState({
    allowSearch: false,
    showInFeatured: false,
    searchKeywords: []
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    showAnalytics: false,
    showLastUpdated: false,
    requireAuth: false
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewClick: false,
    emailOnProfileView: false,
    emailOnLinkHubView: false,
    weeklyReport: false
  });

  // Template Settings
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const [newKeyword, setNewKeyword] = useState("");
  const [updatingFields, setUpdatingFields] = useState(new Set());

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Default templates fallback
  const defaultTemplates = [
    { template: 'default', displayName: 'Default', description: 'Clean and simple default template' },
    { template: 'minimal', displayName: 'Minimal', description: 'Minimalist design' },
    { template: 'modern', displayName: 'Modern', description: 'Modern and sleek design' },
    { template: 'dark', displayName: 'Dark', description: 'Dark theme template' },
    { template: 'light', displayName: 'Light', description: 'Light theme template' },
    { template: 'hacker', displayName: 'Hacker', description: 'Hacker-style template' },
    { template: 'glass', displayName: 'Glass', description: 'Glassmorphism design' },
    { template: 'neon', displayName: 'Neon', description: 'Neon glow effects' },
    { template: 'gradient', displayName: 'Gradient', description: 'Gradient backgrounds' },
    { template: 'cards', displayName: 'Cards', description: 'Card-based layout' },
    { template: 'particles', displayName: 'Particles', description: 'Particle effects' },
    { template: '3d', displayName: '3D', description: '3D effects template' },
    { template: 'retro', displayName: 'Retro', description: 'Retro style template' }
  ];

  // Fetch available templates from API
  const fetchAvailableTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const res = await api.get('/project/templates');
      if (res.status === 200 && res.data.success) {
        // Normalize API response (name/label) to expected format (template/displayName)
        const normalizedTemplates = (res.data.templates || []).map(t => ({
          template: t.name || t.template,
          displayName: t.label || t.displayName || t.name || t.template,
          description: t.description || ''
        }));
        setAvailableTemplates(normalizedTemplates.length > 0 ? normalizedTemplates : defaultTemplates);
      } else {
        setAvailableTemplates(defaultTemplates);
      }
    } catch (error) {
      console.error("Error fetching available templates:", error);
      setAvailableTemplates(defaultTemplates);
    } finally {
      setLoadingTemplates(false);
    }
  };

  // Load settings on mount
  useEffect(() => {
    loadSettings();
    fetchAvailableTemplates();
  }, [username]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTemplateDropdown && !event.target.closest('.template-dropdown-container')) {
        setShowTemplateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTemplateDropdown]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.post('/settings/get', { username }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        const settings = res.data.settings;
        if (settings.template) setSelectedTemplate(settings.template);
        if (settings.profile) setProfileSettings(settings.profile);
        if (settings.links) setLinkSettings(settings.links);
        if (settings.search) setSearchSettings(settings.search);
        if (settings.privacy) setPrivacySettings(settings.privacy);
        if (settings.notifications) setNotificationSettings(settings.notifications);
      } else {
        toast.error(res.data.message || "Failed to load settings");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      const message = error.response?.data?.message || "Failed to load settings";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update a single setting field immediately
  const updateSingleSetting = async (category, field, value) => {
    const fieldKey = `${category}.${field}`;
    
    // Fields that require profile to be public - don't update if profile is private
    const requiresPublicProfile = [
      'profile.showInSearch',
      'profile.allowProfileView',
      'profile.showEmail',
      'search.allowSearch',
      'search.showInFeatured'
    ];
    
    // If profile is private and this field requires public profile, don't update
    if (!profileSettings.isPublic && requiresPublicProfile.includes(fieldKey)) {
      console.log(`Skipping update for ${fieldKey} - profile is private`);
      return true; // Return true to prevent UI revert, but don't make API call
    }
    
    // Add to updating fields
    setUpdatingFields(prev => new Set(prev).add(fieldKey));
    
    try {
      const payload = {
        username,
        category,
        field,
        value
      };
      
      const res = await api.post(
        '/settings/update',
        payload,
        { withCredentials: true }
      );
      
      if (res.status === 200 && res.data.success) {
        toast.success("Setting updated successfully!", { duration: 2000 });
      } else {
        toast.error(res.data.message || "Failed to update setting");
        // Revert the change on error
        return false;
      }
    } catch (error) {
      console.error("Error updating setting:", error);
      const message = error.response?.data?.message || "Server Internal Error";
      toast.error(message);
      // Revert the change on error
      return false;
    } finally {
      setUpdatingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldKey);
        return newSet;
      });
    }
    return true;
  };

  // Update template
  const updateTemplate = async (template) => {
    setUpdatingFields(prev => new Set(prev).add('template'));
    
    try {
      const payload = {
        username,
        category: 'template',
        field: 'template',
        value: template
      };
      
      const res = await api.post(
        '/settings/update',
        payload,
        { withCredentials: true }
      );
      
      if (res.status === 200 && res.data.success) {
        setSelectedTemplate(template);
        toast.success("Template updated successfully!", { duration: 2000 });
      } else {
        toast.error(res.data.message || "Failed to update template");
        return false;
      }
    } catch (error) {
      console.error("Error updating template:", error);
      const message = error.response?.data?.message || "Server Internal Error";
      toast.error(message);
      return false;
    } finally {
      setUpdatingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete('template');
        return newSet;
      });
    }
    return true;
  };

  const addKeyword = async () => {
    const keywordToAdd = newKeyword.trim();
    if (!keywordToAdd) return;
    
    // Use functional update to get current state and avoid closure issues
    let updatedKeywords;
    setSearchSettings((prevSettings) => {
      // Check if keyword already exists
      if (prevSettings.searchKeywords.includes(keywordToAdd)) {
        return prevSettings; // No change if already exists
      }
      
      updatedKeywords = [...prevSettings.searchKeywords, keywordToAdd];
      setNewKeyword("");
      return {
        ...prevSettings,
        searchKeywords: updatedKeywords
      };
    });
    
    // Update immediately
    if (updatedKeywords) {
      const success = await updateSingleSetting('search', 'searchKeywords', updatedKeywords);
      if (!success) {
        // Revert on error using functional update to get latest state
        setSearchSettings((currentSettings) => ({
          ...currentSettings,
          searchKeywords: currentSettings.searchKeywords.filter(k => k !== keywordToAdd)
        }));
      }
    }
  };

  const removeKeyword = async (keyword) => {
    // Use functional update to get current state and avoid closure issues
    let updatedKeywords;
    setSearchSettings((prevSettings) => {
      updatedKeywords = prevSettings.searchKeywords.filter(k => k !== keyword);
      return {
        ...prevSettings,
        searchKeywords: updatedKeywords
      };
    });
    
    // Update immediately
    if (updatedKeywords !== undefined) {
      const success = await updateSingleSetting('search', 'searchKeywords', updatedKeywords);
      if (!success) {
        // Revert on error using functional update to get latest state
        setSearchSettings((currentSettings) => ({
          ...currentSettings,
          searchKeywords: [...currentSettings.searchKeywords, keyword]
        }));
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="w-full overflow-hidden relative min-h-screen" data-settings-page>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.5 - 200,
            y: mousePosition.y * 0.5 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.3 - 200,
            y: mousePosition.y * 0.3 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.7 - 200,
            y: mousePosition.y * 0.7 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <FaShieldAlt className="text-3xl text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Privacy & Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                  Control your profile visibility and privacy preferences
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Template Selection Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 relative z-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaPalette className="text-2xl text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">LinkHub Template</h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Choose a template style for your public LinkHub profile page
              </p>

              {/* Template Dropdown */}
              <div className="template-dropdown-container relative z-20">
                <motion.button
                  whileHover={updatingFields.has('template') || loadingTemplates ? {} : { 
                    scale: 1.01, 
                    y: -1,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={updatingFields.has('template') || loadingTemplates ? {} : { 
                    scale: 0.99,
                    transition: { duration: 0.1 }
                  }}
                  onClick={() => !updatingFields.has('template') && setShowTemplateDropdown(!showTemplateDropdown)}
                  disabled={updatingFields.has('template') || loadingTemplates}
                  className={`group w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-2 ${
                    selectedTemplate 
                      ? 'border-purple-600 dark:border-purple-400' 
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-xl text-left transition-all duration-200 ${
                    updatingFields.has('template') || loadingTemplates 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-400/20'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {updatingFields.has('template') ? (
                      <FaSpinner className="animate-spin text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    ) : (
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaPalette className="text-purple-600 dark:text-purple-400 flex-shrink-0 transition-colors group-hover:text-purple-700 dark:group-hover:text-purple-300" />
                      </motion.div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-0.5 transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {loadingTemplates ? (
                          'Loading templates...'
                        ) : (
                          availableTemplates.find(t => (t.template || t.name) === selectedTemplate)?.displayName || 
                          (selectedTemplate ? selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1) : 'Select a template') || 
                          'Select a template'
                        )}
                      </div>
                      {selectedTemplate && !loadingTemplates && availableTemplates.find(t => (t.template || t.name) === selectedTemplate)?.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300">
                          {availableTemplates.find(t => (t.template || t.name) === selectedTemplate)?.description}
                        </div>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: showTemplateDropdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronDown 
                        className="text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400"
                      />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showTemplateDropdown && !loadingTemplates && availableTemplates.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-[60] w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {availableTemplates.map((template, index) => {
                          const templateName = template.template || template.name || `template-${index}`;
                          const isSelected = selectedTemplate === templateName;
                          return (
                            <motion.button
                              key={templateName}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02, duration: 0.2 }}
                              whileHover={{ 
                                x: 4,
                                backgroundColor: isSelected 
                                  ? "rgba(147, 51, 234, 0.15)" 
                                  : "rgba(147, 51, 234, 0.1)",
                                transition: { duration: 0.2 }
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setShowTemplateDropdown(false);
                                if (templateName) {
                                  updateTemplate(templateName);
                                }
                              }}
                              className={`group/item w-full text-left px-4 py-3 transition-all duration-200 ${
                                isSelected
                                  ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-600 dark:border-purple-400'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent hover:border-l-4 hover:border-purple-400 dark:hover:border-purple-500'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <motion.div 
                                    className={`font-semibold mb-1 transition-colors ${
                                      isSelected
                                        ? 'text-purple-700 dark:text-purple-300'
                                        : 'text-gray-900 dark:text-white group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {template.displayName || template.label || (templateName ? templateName.charAt(0).toUpperCase() + templateName.slice(1) : 'Template')}
                                  </motion.div>
                                  {template.description && (
                                    <div className={`text-xs transition-colors ${
                                      isSelected
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-gray-600 dark:text-gray-400 group-hover/item:text-gray-700 dark:group-hover/item:text-gray-300'
                                    }`}>
                                      {template.description}
                                    </div>
                                  )}
                                </div>
                                {isSelected && (
                                  <motion.div 
                                    className="w-5 h-5 rounded-full bg-purple-600 dark:bg-purple-400 flex items-center justify-center flex-shrink-0"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                  >
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  </motion.div>
                                )}
                                {!isSelected && (
                                  <motion.div 
                                    className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    whileHover={{ scale: 1.1, borderColor: "rgba(147, 51, 234, 0.5)" }}
                                  >
                                  </motion.div>
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Profile Visibility Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaUser className="text-2xl text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Visibility</h2>
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Make Profile Public"
                  description="Allow others to view your profile"
                  value={profileSettings.isPublic}
                  onChange={async (val) => {
                    setProfileSettings({ ...profileSettings, isPublic: val });
                    const success = await updateSingleSetting('profile', 'isPublic', val);
                    if (!success) {
                      setProfileSettings({ ...profileSettings, isPublic: !val });
                    }
                  }}
                  updating={updatingFields.has('profile.isPublic')}
                />
                <ToggleSetting
                  label="Show in Search Results"
                  description="Allow your profile to appear in search"
                  value={profileSettings.showInSearch}
                  onChange={async (val) => {
                    setProfileSettings({ ...profileSettings, showInSearch: val });
                    const success = await updateSingleSetting('profile', 'showInSearch', val);
                    if (!success) {
                      setProfileSettings({ ...profileSettings, showInSearch: !val });
                    }
                  }}
                  disabled={!profileSettings.isPublic}
                  updating={updatingFields.has('profile.showInSearch')}
                />
                <ToggleSetting
                  label="Allow Profile View"
                  description="Let others view your full profile page"
                  value={profileSettings.allowProfileView}
                  onChange={async (val) => {
                    setProfileSettings({ ...profileSettings, allowProfileView: val });
                    const success = await updateSingleSetting('profile', 'allowProfileView', val);
                    if (!success) {
                      setProfileSettings({ ...profileSettings, allowProfileView: !val });
                    }
                  }}
                  disabled={!profileSettings.isPublic}
                  updating={updatingFields.has('profile.allowProfileView')}
                />
                <ToggleSetting
                  label="Show Email"
                  description="Display email on public profile"
                  value={profileSettings.showEmail}
                  onChange={async (val) => {
                    setProfileSettings({ ...profileSettings, showEmail: val });
                    const success = await updateSingleSetting('profile', 'showEmail', val);
                    if (!success) {
                      setProfileSettings({ ...profileSettings, showEmail: !val });
                    }
                  }}
                  disabled={!profileSettings.isPublic}
                  updating={updatingFields.has('profile.showEmail')}
                />
                <ToggleSetting
                  label="Show Location"
                  description="Display location on public profile"
                  value={profileSettings.showLocation}
                  onChange={async (val) => {
                    setProfileSettings({ ...profileSettings, showLocation: val });
                    const success = await updateSingleSetting('profile', 'showLocation', val);
                    if (!success) {
                      setProfileSettings({ ...profileSettings, showLocation: !val });
                    }
                  }}
                  updating={updatingFields.has('profile.showLocation')}
                />
                <ToggleSetting
                  label="Show Bio"
                  description="Display bio on public profile"
                  value={profileSettings.showBio}
                  onChange={async (val) => {
                    setProfileSettings({ ...profileSettings, showBio: val });
                    const success = await updateSingleSetting('profile', 'showBio', val);
                    if (!success) {
                      setProfileSettings({ ...profileSettings, showBio: !val });
                    }
                  }}
                  updating={updatingFields.has('profile.showBio')}
                />
                <ToggleSetting
                  label="Show Passion"
                  description="Display passion on public profile"
                  value={profileSettings.showPassion}
                  onChange={async (val) => {
                    setProfileSettings({ ...profileSettings, showPassion: val });
                    const success = await updateSingleSetting('profile', 'showPassion', val);
                    if (!success) {
                      setProfileSettings({ ...profileSettings, showPassion: !val });
                    }
                  }}
                  updating={updatingFields.has('profile.showPassion')}
                />
                <ToggleSetting
                  label="Show Profile Image"
                  description="Display profile picture on public profile"
                  value={profileSettings.showProfileImage}
                  onChange={async (val) => {
                    setProfileSettings({ ...profileSettings, showProfileImage: val });
                    const success = await updateSingleSetting('profile', 'showProfileImage', val);
                    if (!success) {
                      setProfileSettings({ ...profileSettings, showProfileImage: !val });
                    }
                  }}
                  updating={updatingFields.has('profile.showProfileImage')}
                />
              </div>
            </motion.div>

            {/* Link Display Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaLink className="text-2xl text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Link Display</h2>
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Show Link Count"
                  description="Display total number of links on public profile"
                  value={linkSettings.showLinkCount}
                  onChange={async (val) => {
                    setLinkSettings({ ...linkSettings, showLinkCount: val });
                    const success = await updateSingleSetting('links', 'showLinkCount', val);
                    if (!success) {
                      setLinkSettings({ ...linkSettings, showLinkCount: !val });
                    }
                  }}
                  updating={updatingFields.has('links.showLinkCount')}
                />
                <ToggleSetting
                  label="Show Click Statistics"
                  description="Display click statistics on public profile"
                  value={linkSettings.showClickStats}
                  onChange={async (val) => {
                    setLinkSettings({ ...linkSettings, showClickStats: val });
                    const success = await updateSingleSetting('links', 'showClickStats', val);
                    if (!success) {
                      setLinkSettings({ ...linkSettings, showClickStats: !val });
                    }
                  }}
                  updating={updatingFields.has('links.showClickStats')}
                />
              </div>
            </motion.div>

            {/* Search & Discovery Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaSearch className="text-2xl text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search & Discovery</h2>
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Allow Search"
                  description="Allow your profile to appear in search results"
                  value={searchSettings.allowSearch}
                  onChange={async (val) => {
                    setSearchSettings({ ...searchSettings, allowSearch: val });
                    const success = await updateSingleSetting('search', 'allowSearch', val);
                    if (!success) {
                      setSearchSettings({ ...searchSettings, allowSearch: !val });
                    }
                  }}
                  updating={updatingFields.has('search.allowSearch')}
                />
                <ToggleSetting
                  label="Show in Featured"
                  description="Allow your profile to appear in featured sections"
                  value={searchSettings.showInFeatured}
                  onChange={async (val) => {
                    setSearchSettings({ ...searchSettings, showInFeatured: val });
                    const success = await updateSingleSetting('search', 'showInFeatured', val);
                    if (!success) {
                      setSearchSettings({ ...searchSettings, showInFeatured: !val });
                    }
                  }}
                  disabled={!searchSettings.allowSearch}
                  updating={updatingFields.has('search.showInFeatured')}
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Search Keywords
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Add keywords to help others find your profile
                  </p>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                      placeholder="Add keyword..."
                      className="flex-1 px-4 py-2 bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addKeyword}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                    >
                      Add
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchSettings.searchKeywords.map((keyword, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm flex items-center gap-2"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="hover:text-purple-900 dark:hover:text-purple-100"
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Privacy Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaLock className="text-2xl text-red-600 dark:text-red-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy</h2>
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Show Analytics"
                  description="Display analytics data on public profile"
                  value={privacySettings.showAnalytics}
                  onChange={async (val) => {
                    setPrivacySettings({ ...privacySettings, showAnalytics: val });
                    const success = await updateSingleSetting('privacy', 'showAnalytics', val);
                    if (!success) {
                      setPrivacySettings({ ...privacySettings, showAnalytics: !val });
                    }
                  }}
                  updating={updatingFields.has('privacy.showAnalytics')}
                />
                <ToggleSetting
                  label="Show Last Updated"
                  description="Display last updated timestamp on public profile"
                  value={privacySettings.showLastUpdated}
                  onChange={async (val) => {
                    setPrivacySettings({ ...privacySettings, showLastUpdated: val });
                    const success = await updateSingleSetting('privacy', 'showLastUpdated', val);
                    if (!success) {
                      setPrivacySettings({ ...privacySettings, showLastUpdated: !val });
                    }
                  }}
                  updating={updatingFields.has('privacy.showLastUpdated')}
                />
                <ToggleSetting
                  label="Require Authentication"
                  description="Require users to be logged in to view your profile"
                  value={privacySettings.requireAuth}
                  onChange={async (val) => {
                    setPrivacySettings({ ...privacySettings, requireAuth: val });
                    const success = await updateSingleSetting('privacy', 'requireAuth', val);
                    if (!success) {
                      setPrivacySettings({ ...privacySettings, requireAuth: !val });
                    }
                  }}
                  updating={updatingFields.has('privacy.requireAuth')}
                />
              </div>
            </motion.div>

            {/* Notifications Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaBell className="text-2xl text-yellow-600 dark:text-yellow-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Email on New Click"
                  description="Receive email when a link receives a new click"
                  value={notificationSettings.emailOnNewClick}
                  onChange={async (val) => {
                    setNotificationSettings({ ...notificationSettings, emailOnNewClick: val });
                    const success = await updateSingleSetting('notifications', 'emailOnNewClick', val);
                    if (!success) {
                      setNotificationSettings({ ...notificationSettings, emailOnNewClick: !val });
                    }
                  }}
                  updating={updatingFields.has('notifications.emailOnNewClick')}
                />
                <ToggleSetting
                  label="Email on Profile View"
                  description="Receive email when someone views your profile page (ProfilePreview)"
                  value={notificationSettings.emailOnProfileView}
                  onChange={async (val) => {
                    setNotificationSettings({ ...notificationSettings, emailOnProfileView: val });
                    const success = await updateSingleSetting('notifications', 'emailOnProfileView', val);
                    if (!success) {
                      setNotificationSettings({ ...notificationSettings, emailOnProfileView: !val });
                    }
                  }}
                  updating={updatingFields.has('notifications.emailOnProfileView')}
                />
                <ToggleSetting
                  label="Email on LinkHub Visit"
                  description="Receive email when someone visits your LinkHub page (/:username)"
                  value={notificationSettings.emailOnLinkHubView}
                  onChange={async (val) => {
                    setNotificationSettings({ ...notificationSettings, emailOnLinkHubView: val });
                    const success = await updateSingleSetting('notifications', 'emailOnLinkHubView', val);
                    if (!success) {
                      setNotificationSettings({ ...notificationSettings, emailOnLinkHubView: !val });
                    }
                  }}
                  updating={updatingFields.has('notifications.emailOnLinkHubView')}
                />
                <ToggleSetting
                  label="Weekly Report"
                  description="Receive weekly analytics report via email"
                  value={notificationSettings.weeklyReport}
                  onChange={async (val) => {
                    setNotificationSettings({ ...notificationSettings, weeklyReport: val });
                    const success = await updateSingleSetting('notifications', 'weeklyReport', val);
                    if (!success) {
                      setNotificationSettings({ ...notificationSettings, weeklyReport: !val });
                    }
                  }}
                  updating={updatingFields.has('notifications.weeklyReport')}
                />
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Toggle Setting Component
const ToggleSetting = ({ label, description, value, onChange, disabled = false, updating = false }) => {
  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
          {label}
        </label>
        <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {updating && (
          <FaSpinner className="animate-spin text-purple-600 dark:text-purple-400 text-sm" />
        )}
        <motion.button
          whileTap={{ scale: updating || disabled ? 1 : 0.95 }}
          onClick={() => !disabled && !updating && onChange(!value)}
          disabled={disabled || updating}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            value ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
          } ${disabled || updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <motion.span
            animate={{ x: value ? 20 : 2 }}
            className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          />
        </motion.button>
      </div>
    </div>
  );
};

export default Settings;
