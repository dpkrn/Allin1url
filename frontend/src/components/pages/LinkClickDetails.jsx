import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  FaSearch,
  FaFilter,
  FaLink,
  FaGlobe,
  FaMobileAlt,
  FaDesktop,
  FaTabletAlt,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa';
import { FiBarChart2 } from 'react-icons/fi';
import { MdContentCopy } from 'react-icons/md';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const inputClass = "w-full pl-10 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors";

const LinkClickDetails = () => {
  const { username } = useSelector((store) => store.admin.user);

  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLink, setSelectedLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClicks, setTotalClicks] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [links, setLinks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchClickDetails = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.post('/analytics/click-details', {
        username,
        linkId: selectedLink || undefined,
        page,
        limit: 50,
        search: searchTerm,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      if (response.data.success) {
        setClicks(response.data.data.clicks);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalClicks(response.data.data.pagination.totalClicks);
        setCurrentPage(response.data.data.pagination.currentPage);
      }
    } catch (error) {
      toast.error('Failed to load click details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLinks = async () => {
    try {
      const response = await api.post('/source/getallsource', { username }, { withCredentials: true });
      if (response.status === 200 && response.data.success) setLinks(response.data.sources);
    } catch (error) {}
  };

  useEffect(() => {
    if (username) {
      fetchUserLinks();
      fetchClickDetails();
    }
  }, [username]);

  useEffect(() => {
    const timer = setTimeout(() => { if (username) fetchClickDetails(1); }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedLink, startDate, endDate, username]);

  const handlePageChange = (page) => fetchClickDetails(page);

  const handleSortToggle = () => {
    setSortOrder(o => o === 'desc' ? 'asc' : 'desc');
    setClicks(c => [...c].reverse());
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  const getDeviceIcon = (type) => {
    if (type === 'mobile') return <FaMobileAlt className="text-blue-500" />;
    if (type === 'tablet') return <FaTabletAlt className="text-emerald-500" />;
    return <FaDesktop className="text-violet-500" />;
  };

  const getBrowserIcon = (name) => {
    const n = name?.toLowerCase() || '';
    if (n.includes('chrome')) return <FaChrome className="text-emerald-500" />;
    if (n.includes('firefox')) return <FaFirefox className="text-orange-500" />;
    if (n.includes('safari')) return <FaSafari className="text-blue-500" />;
    if (n.includes('edge')) return <FaEdge className="text-blue-600" />;
    return <FaGlobe className="text-slate-400" />;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

  const cardClass = "bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Click Details</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Detailed analytics for every click on your links</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30' },
          { label: 'Showing', value: clicks.length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Page', value: `${currentPage} / ${totalPages}`, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${cardClass} p-3 sm:p-4`}>
            <div className={`inline-flex p-1.5 rounded-lg ${bg} mb-2`}>
              <FiBarChart2 className={`w-3.5 h-3.5 ${color}`} />
            </div>
            <div className={`text-lg font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`${cardClass} p-4 mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaFilter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filters</span>
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
          >
            {showFilters ? 'Hide' : 'Show'} filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="text" placeholder="Search by keyword…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={inputClass} />
            </div>
            <div className="relative">
              <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <select value={selectedLink} onChange={(e) => setSelectedLink(e.target.value)} className={inputClass}>
                <option value="">All Links</option>
                {links.map((link) => (
                  <option key={link._id} value={link._id}>{link.source} → {link.destination.substring(0, 30)}…</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handleSortToggle}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            {sortOrder === 'desc' ? <FaSortAmountDown className="w-3.5 h-3.5" /> : <FaSortAmountUp className="w-3.5 h-3.5" />}
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
          <button
            onClick={() => { setSearchTerm(''); setSelectedLink(''); setStartDate(''); setEndDate(''); }}
            className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className={`${cardClass} overflow-hidden mb-4`}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : clicks.length === 0 ? (
          <div className="text-center py-16">
            <FaLink className="mx-auto text-3xl mb-3 text-slate-300 dark:text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">No clicks found</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {['Link', 'Date & Time', 'Device', 'Browser', 'OS', 'Location', 'Referrer', 'Status'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${i === 2 ? 'hidden md:table-cell' : ''} ${i === 3 || i === 4 ? 'hidden lg:table-cell' : ''} ${i === 5 ? 'hidden xl:table-cell' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {clicks.map((click, index) => (
                  <tr key={click._id || index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <FaLink className="flex-shrink-0 w-3.5 h-3.5 text-violet-500" />
                        <div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{click.linkSource}</div>
                          <div className="text-xs text-slate-400 truncate max-w-32" title={click.linkDestination}>{click.linkDestination}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm text-slate-800 dark:text-slate-200">{formatDate(click.clickDate)}</div>
                      <div className="text-xs text-slate-400">{click.clickedTime?.time}</div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(click.device?.type)}
                        <div>
                          <div className="text-sm capitalize text-slate-800 dark:text-slate-200">{click.device?.type || 'Unknown'}</div>
                          {click.device?.brand && <div className="text-xs text-slate-400">{click.device.brand} {click.device.model}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        {getBrowserIcon(click.browser?.name)}
                        <div>
                          <div className="text-sm text-slate-800 dark:text-slate-200">{click.browser?.name || 'Unknown'}</div>
                          {click.browser?.version && <div className="text-xs text-slate-400">v{click.browser.version}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="text-sm text-slate-800 dark:text-slate-200">{click.os?.name || 'Unknown'}</div>
                      {click.os?.version && <div className="text-xs text-slate-400">v{click.os.version}</div>}
                    </td>
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <div className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-red-400 flex-shrink-0 w-3 h-3" />
                        <div>
                          <div className="text-sm text-slate-800 dark:text-slate-200">{click.location?.city || 'Unknown'}</div>
                          <div className="text-xs text-slate-400">{click.location?.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {click.referrer === 'direct' || !click.referrer ? (
                        <span className="text-sm text-slate-400">Direct</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-28" title={click.referrer}>{click.referrer}</span>
                          <button onClick={() => copyToClipboard(click.referrer)} className="text-slate-400 hover:text-violet-500 transition-colors flex-shrink-0">
                            <MdContentCopy className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {click.seen ? (
                        <div className="flex items-center gap-1.5">
                          <FaEye className="text-emerald-500 w-3.5 h-3.5" />
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Seen</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <FaEyeSlash className="text-slate-400 w-3.5 h-3.5" />
                          <span className="text-xs text-slate-400">Unseen</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile card view */}
      {!loading && clicks.length > 0 && (
        <div className="md:hidden space-y-3 mb-4">
          {clicks.map((click, index) => (
            <div key={click._id || index} className={`${cardClass} p-4`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaLink className="flex-shrink-0 w-3.5 h-3.5 text-violet-500" />
                  <div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{click.linkSource}</div>
                    <div className="text-xs text-slate-400 truncate max-w-48" title={click.linkDestination}>{click.linkDestination}</div>
                  </div>
                </div>
                {click.seen ? (
                  <div className="flex items-center gap-1">
                    <FaEye className="text-emerald-500 w-3.5 h-3.5" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Seen</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <FaEyeSlash className="text-slate-400 w-3.5 h-3.5" />
                    <span className="text-xs text-slate-400">Unseen</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300 mb-3">{formatDate(click.clickDate)}</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="font-medium text-slate-500 dark:text-slate-400 mb-1">Device</div>
                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    {getDeviceIcon(click.device?.type)}
                    <span className="capitalize">{click.device?.type || 'Unknown'}</span>
                  </div>
                  {click.device?.brand && <div className="text-slate-400 mt-0.5">{click.device.brand} {click.device.model}</div>}
                </div>
                <div>
                  <div className="font-medium text-slate-500 dark:text-slate-400 mb-1">Browser</div>
                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    {getBrowserIcon(click.browser?.name)}
                    <span>{click.browser?.name || 'Unknown'}</span>
                  </div>
                  {click.browser?.version && <div className="text-slate-400 mt-0.5">v{click.browser.version}</div>}
                </div>
                <div>
                  <div className="font-medium text-slate-500 dark:text-slate-400 mb-1">OS</div>
                  <div className="text-slate-700 dark:text-slate-300">{click.os?.name || 'Unknown'}</div>
                  {click.os?.version && <div className="text-slate-400 mt-0.5">v{click.os.version}</div>}
                </div>
                <div>
                  <div className="font-medium text-slate-500 dark:text-slate-400 mb-1">Location</div>
                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <FaMapMarkerAlt className="text-red-400 w-3 h-3 flex-shrink-0" />
                    <span>{click.location?.city || 'Unknown'}</span>
                  </div>
                  {click.location?.country && <div className="text-slate-400 mt-0.5">{click.location.country}</div>}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="font-medium text-xs text-slate-500 dark:text-slate-400 mb-1">Referrer</div>
                {click.referrer === 'direct' || !click.referrer ? (
                  <span className="text-xs text-slate-400">Direct</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-700 dark:text-slate-300 truncate">{click.referrer}</span>
                    <button onClick={() => copyToClipboard(click.referrer)} className="text-slate-400 hover:text-violet-500 flex-shrink-0">
                      <MdContentCopy className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 text-sm rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-violet-600 text-white font-semibold'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkClickDetails;
