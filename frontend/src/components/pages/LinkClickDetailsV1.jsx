import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  FiMousePointer, FiCalendar, FiMapPin, FiMonitor, FiSmartphone,
  FiTablet, FiGlobe, FiLink, FiSearch, FiX, FiFilter,
  FiChevronDown, FiExternalLink, FiTrendingUp, FiEye, FiUsers,
  FiClock, FiChevronRight, FiInfo
} from "react-icons/fi";
import api from "../../utils/api";

const DetailRow = ({ label, value, mono }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    <span className={`text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[60%] text-right ${mono ? "font-mono" : ""}`}>
      {value || "—"}
    </span>
  </div>
);

const LinkClickDetailsV1 = () => {
  const { username } = useSelector((store) => store.admin.user);
  const [searchParams] = useSearchParams();
  const preFilterLinkId = searchParams.get("linkId");

  const [clicks, setClicks] = useState([]);
  const [filteredClicks, setFilteredClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLink, setSelectedLink] = useState(preFilterLinkId || "all");
  const [showFilters, setShowFilters] = useState(!!preFilterLinkId);
  const [selectedClick, setSelectedClick] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const uniqueLinks = [...new Set(clicks.map((c) => c.linkId))].map((linkId) => {
    const click = clicks.find((c) => c.linkId === linkId);
    return { id: linkId, title: click.linkSource || "Unknown Link" };
  });

  const allClicksCount = clicks.length;
  const uniqueVisitors = new Set(clicks.map((c) => c.location?.ipAddress).filter(Boolean)).size;
  const topCountry = clicks.reduce((acc, c) => {
    if (c.location?.country) acc[c.location.country] = (acc[c.location.country] || 0) + 1;
    return acc;
  }, {});
  const topCountryName = Object.keys(topCountry).sort((a, b) => topCountry[b] - topCountry[a])[0] || "N/A";

  const fetchClickDetails = async () => {
    try {
      setLoading(true);
      const res = await api.post("/analytics/click-details-v1", { username });
      if (res.data.success) {
        setClicks(res.data.data);
        setFilteredClicks(res.data.data);
        if (preFilterLinkId) {
          const exists = res.data.data.some((c) => c.linkId === preFilterLinkId);
          if (exists) setSelectedLink(preFilterLinkId);
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (clickId) => {
    try {
      await api.post("/analytics/mark-read", { clickId });
      const update = (prev) => prev.map((c) => c._id === clickId ? { ...c, seen: true } : c);
      setClicks(update);
      setFilteredClicks(update);
    } catch { /* silent */ }
  };

  useEffect(() => {
    if (username) fetchClickDetails();
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let filtered = clicks;
    if (selectedLink !== "all") filtered = filtered.filter((c) => c.linkId === selectedLink);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.linkSource?.toLowerCase().includes(q) ||
          c.location?.city?.toLowerCase().includes(q) ||
          c.location?.country?.toLowerCase().includes(q) ||
          c.device?.type?.toLowerCase().includes(q) ||
          c.browser?.name?.toLowerCase().includes(q) ||
          c.os?.name?.toLowerCase().includes(q)
      );
    }
    if (startDate || endDate) {
      filtered = filtered.filter((c) => {
        const d = new Date(c.clickDate);
        if (startDate && d < new Date(startDate)) return false;
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (d > end) return false;
        }
        return true;
      });
    }
    setFilteredClicks(filtered);
  }, [selectedLink, searchQuery, startDate, endDate, clicks]);

  const getDeviceIcon = (type) => {
    if (type === "mobile") return <FiSmartphone className="w-4 h-4" />;
    if (type === "tablet") return <FiTablet className="w-4 h-4" />;
    return <FiMonitor className="w-4 h-4" />;
  };

  const getRelativeTime = (date) => {
    const ms = Date.now() - new Date(date).getTime();
    const m = Math.floor(ms / 60000);
    const h = Math.floor(ms / 3600000);
    const d = Math.floor(ms / 86400000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (d < 7) return `${d}d ago`;
    return new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const getReferrerHost = (ref) => {
    if (!ref || ref === "direct") return "Direct";
    try { return new URL(ref).hostname; } catch { return ref; }
  };

  const clearFilters = () => {
    setSelectedLink("all");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const hasFilters = selectedLink !== "all" || searchQuery || startDate || endDate;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading click details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Click Details</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Every click on your links — location, device, referrer and more
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <FiTrendingUp className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Clicks</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{allClicksCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <FiUsers className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Unique Visitors</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{uniqueVisitors}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <FiGlobe className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Top Country</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{topCountryName}</p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by link, location, device, browser..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors ${
              showFilters || hasFilters
                ? "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <FiFilter className="w-4 h-4" />
            Filters
            {hasFilters && (
              <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
            )}
            <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            {/* Link filter */}
            {uniqueLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLink("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedLink === "all"
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  All Links ({clicks.length})
                </button>
                {uniqueLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => setSelectedLink(link.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedLink === link.id
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {link.title} ({clicks.filter((c) => c.linkId === link.id).length})
                  </button>
                ))}
              </div>
            )}

            {/* Date range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {hasFilters && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  <FiX className="w-3.5 h-3.5" /> Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        {filteredClicks.length === clicks.length
          ? `${clicks.length} clicks`
          : `${filteredClicks.length} of ${clicks.length} clicks`}
      </p>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Click list */}
        <div className="lg:col-span-3 space-y-2">
          {filteredClicks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-12 text-center">
              <FiMousePointer className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No clicks found</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredClicks.map((click) => (
              <button
                key={click._id}
                onClick={() => {
                  setSelectedClick(click);
                  if (!click.seen) markAsRead(click._id);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedClick?._id === click._id
                    ? "bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800 ring-1 ring-violet-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                    selectedClick?._id === click._id
                      ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                    {getDeviceIcon(click.device?.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {click.linkSource || "Link"}
                        </span>
                        {!click.seen && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400">
                            New
                          </span>
                        )}
                      </div>
                      <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">
                        {getRelativeTime(click.clickDate)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FiMapPin className="w-3 h-3" />
                        {[click.location?.city, click.location?.country].filter(Boolean).join(", ") || "Unknown"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FiMonitor className="w-3 h-3" />
                        {click.device?.type || "—"} · {click.os?.name || "—"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FiGlobe className="w-3 h-3" />
                        {getReferrerHost(click.referrer)}
                      </span>
                    </div>
                  </div>
                  <FiChevronRight className={`flex-shrink-0 w-4 h-4 mt-2 transition-colors ${
                    selectedClick?._id === click._id ? "text-violet-500" : "text-slate-300 dark:text-slate-600"
                  }`} />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selectedClick ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 sticky top-6 overflow-hidden">
              {/* Panel header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <FiEye className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Click Details</h2>
                {!selectedClick.seen && (
                  <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400">
                    New
                  </span>
                )}
              </div>

              <div className="p-4 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {/* Link info */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FiLink className="w-3 h-3" /> Link
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedClick.linkSource || "Unknown"}</p>
                    {selectedClick.linkDestination && (
                      <a
                        href={selectedClick.linkDestination}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 truncate"
                      >
                        {selectedClick.linkDestination}
                        <FiExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FiClock className="w-3 h-3" /> Time
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg divide-y divide-slate-100 dark:divide-slate-700/50">
                    <DetailRow label="Date" value={selectedClick.clickedTime?.date} />
                    <DetailRow label="Time" value={selectedClick.clickedTime?.time} />
                    <DetailRow label="Timezone" value={selectedClick.clickedTime?.timezone} />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FiMapPin className="w-3 h-3" /> Location
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg divide-y divide-slate-100 dark:divide-slate-700/50">
                    <DetailRow label="Country" value={selectedClick.location?.country} />
                    <DetailRow label="City" value={selectedClick.location?.city} />
                    <DetailRow label="Region" value={selectedClick.location?.region} />
                    <DetailRow label="IP Address" value={selectedClick.location?.ipAddress} mono />
                  </div>
                </div>

                {/* Device */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FiMonitor className="w-3 h-3" /> Device
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg divide-y divide-slate-100 dark:divide-slate-700/50">
                    <DetailRow label="Type" value={selectedClick.device?.type} />
                    {selectedClick.device?.brand && <DetailRow label="Brand" value={selectedClick.device.brand} />}
                    {selectedClick.device?.model && <DetailRow label="Model" value={selectedClick.device.model} />}
                    <DetailRow label="OS" value={`${selectedClick.os?.name || "—"} ${selectedClick.os?.version || ""}`.trim()} />
                    <DetailRow label="Browser" value={`${selectedClick.browser?.name || "—"} ${selectedClick.browser?.version || ""}`.trim()} />
                  </div>
                </div>

                {/* Referrer */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FiGlobe className="w-3 h-3" /> Referrer
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3">
                    {selectedClick.referrer && selectedClick.referrer !== "direct" ? (
                      (() => {
                        try {
                          new URL(selectedClick.referrer);
                          return (
                            <a
                              href={selectedClick.referrer}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-violet-600 dark:text-violet-400 hover:underline break-all flex items-start gap-1"
                            >
                              {selectedClick.referrer}
                              <FiExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            </a>
                          );
                        } catch {
                          return <span className="text-xs text-slate-600 dark:text-slate-400 break-all">{selectedClick.referrer}</span>;
                        }
                      })()
                    ) : (
                      <span className="text-xs text-slate-500 dark:text-slate-400">Direct Traffic</span>
                    )}
                  </div>
                </div>

                {/* User Agent */}
                {selectedClick.userAgent && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FiInfo className="w-3 h-3" /> User Agent
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3">
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 break-all leading-relaxed">
                        {selectedClick.userAgent}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-12 text-center sticky top-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <FiMousePointer className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Select a click</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Pick any click from the list to see full details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkClickDetailsV1;
