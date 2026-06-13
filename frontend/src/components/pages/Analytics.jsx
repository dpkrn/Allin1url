import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaMapMarkerAlt,
  FaDesktop,
  FaMobileAlt,
  FaLink,
  FaCalendarAlt,
  FaGlobe,
  FaExternalLinkAlt,
  FaTable,
} from 'react-icons/fa';
import { FiBarChart2, FiEye, FiGlobe, FiList } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#ec4899'];

const graphTypes = [
  { value: 'line', label: 'Line Chart', icon: FaChartLine },
  { value: 'bar', label: 'Bar Chart', icon: FaChartBar },
  { value: 'area', label: 'Area Chart', icon: FaChartLine },
  { value: 'pie', label: 'Pie Chart', icon: FaChartPie },
];

const timeRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' },
  { value: 'all', label: 'All Time' },
];

const selectClass = "w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors";

const Analytics = () => {
  const navigate = useNavigate();
  const username = useSelector((store) => store.admin.user?.username);
  const links = useSelector((store) => store.admin.links);
  const darkMode = useSelector((store) => store.page.darkMode);

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('clicks');
  const [selectedGraphType, setSelectedGraphType] = useState('line');
  const [xAxisType, setXAxisType] = useState('date');
  const [yAxisType, setYAxisType] = useState('count');
  const [chartHeight, setChartHeight] = useState(350);

  const [profileVisits, setProfileVisits] = useState([]);
  const [clickCounts, setClickCounts] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [osData, setOsData] = useState([]);
  const [browserData, setBrowserData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [referrerData, setReferrerData] = useState([]);
  const [referrerCategoryData, setReferrerCategoryData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [linkData, setLinkData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [dayOfWeekData, setDayOfWeekData] = useState([]);

  const [totalClicks, setTotalClicks] = useState(0);
  const [totalProfileVisits, setTotalProfileVisits] = useState(0);
  const [uniqueCountries, setUniqueCountries] = useState(0);
  const [topReferrer, setTopReferrer] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [username, timeRange]);

  useEffect(() => {
    const updateChartHeight = () => {
      if (window.innerWidth < 640) setChartHeight(260);
      else if (window.innerWidth < 1024) setChartHeight(320);
      else setChartHeight(380);
    };
    updateChartHeight();
    window.addEventListener('resize', updateChartHeight);
    return () => window.removeEventListener('resize', updateChartHeight);
  }, []);

  useEffect(() => {
    // no-op: yAxisType affects display only; renderChart uses metric-specific key mapping
  }, [selectedMetric]);

  const fetchAnalytics = async () => {
    if (!username) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await api.post('/analytics/get', { username, timeRange }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        const data = res.data.analytics;
        setProfileVisits(data.profileVisits || []);
        setClickCounts(data.clickCounts || []);
        setLocationData(data.locationData || []);
        setOsData(data.osData || []);
        setBrowserData(data.browserData || []);
        setDeviceData(data.deviceData || []);
        setReferrerData(data.referrerData || []);
        setReferrerCategoryData(data.referrerCategoryData || []);
        setPlatformData(data.platformData || []);
        setLinkData(data.linkData || []);
        setHourlyData(data.hourlyData || []);
        setDayOfWeekData(data.dayOfWeekData || []);
        const total = (data.clickCounts || []).reduce((sum, item) => sum + (item.clicks || 0), 0);
        const totalVisits = (data.profileVisits || []).reduce((sum, item) => sum + (item.visits || 0), 0);
        setTotalClicks(total);
        setTotalProfileVisits(totalVisits);
        setUniqueCountries((data.locationData || []).length);
        setTopReferrer((data.referrerData || [])[0]?.name || 'Direct');
      }
    } catch (err) {
      generateMockData();
      toast.error('Using simulated data. Analytics API unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockDates = generateDateRange(timeRange);
    const totalClks = links.reduce((sum, link) => sum + (link.clicked || 0), 0);
    const mockProfileVisits = mockDates.map((date) => ({ date, visits: Math.floor(Math.random() * 50) + 10 }));
    const mockClickCounts = mockDates.map((date) => ({ date, clicks: Math.floor(Math.random() * 100) + 20 }));
    const mockLocationData = [
      { name: 'United States', value: Math.floor(totalClks * 0.35) },
      { name: 'India', value: Math.floor(totalClks * 0.25) },
      { name: 'United Kingdom', value: Math.floor(totalClks * 0.15) },
      { name: 'Canada', value: Math.floor(totalClks * 0.10) },
    ];
    const mockOsData = [
      { name: 'Windows', value: Math.floor(totalClks * 0.40) },
      { name: 'macOS', value: Math.floor(totalClks * 0.25) },
      { name: 'Linux', value: Math.floor(totalClks * 0.15) },
      { name: 'iOS', value: Math.floor(totalClks * 0.12) },
      { name: 'Android', value: Math.floor(totalClks * 0.08) },
    ];
    const mockBrowserData = [
      { name: 'Chrome', value: Math.floor(totalClks * 0.50) },
      { name: 'Safari', value: Math.floor(totalClks * 0.25) },
      { name: 'Firefox', value: Math.floor(totalClks * 0.15) },
      { name: 'Edge', value: Math.floor(totalClks * 0.10) },
    ];
    const mockDeviceData = [
      { name: 'Desktop', value: Math.floor(totalClks * 0.60) },
      { name: 'Mobile', value: Math.floor(totalClks * 0.35) },
      { name: 'Tablet', value: Math.floor(totalClks * 0.05) },
    ];
    const mockReferrerData = [
      { name: 'Direct', value: Math.floor(totalClks * 0.40), category: 'direct', clicks: Math.floor(totalClks * 0.40) },
      { name: 'google.com', value: Math.floor(totalClks * 0.25), category: 'search', clicks: Math.floor(totalClks * 0.25) },
      { name: 'twitter.com', value: Math.floor(totalClks * 0.15), category: 'social', clicks: Math.floor(totalClks * 0.15) },
      { name: 'linkedin.com', value: Math.floor(totalClks * 0.10), category: 'social', clicks: Math.floor(totalClks * 0.10) },
      { name: 'facebook.com', value: Math.floor(totalClks * 0.10), category: 'social', clicks: Math.floor(totalClks * 0.10) },
    ];
    const mockReferrerCategoryData = [
      { name: 'Direct', value: mockReferrerData.find(r => r.category === 'direct')?.value || 0, clicks: mockReferrerData.find(r => r.category === 'direct')?.clicks || 0 },
      { name: 'Search', value: mockReferrerData.filter(r => r.category === 'search').reduce((sum, r) => sum + r.value, 0), clicks: mockReferrerData.filter(r => r.category === 'search').reduce((sum, r) => sum + r.clicks, 0) },
      { name: 'Social', value: mockReferrerData.filter(r => r.category === 'social').reduce((sum, r) => sum + r.value, 0), clicks: mockReferrerData.filter(r => r.category === 'social').reduce((sum, r) => sum + r.clicks, 0) },
    ];
    const mockPlatformData = links.map((link) => ({ name: link.source, clicks: link.clicked || Math.floor(Math.random() * 100) }));
    const mockLinkData = links.map((link) => ({ name: link.source, clicks: link.clicked || 0, visits: Math.floor((link.clicked || 0) * 1.2) }));
    const mockHourlyData = Array.from({ length: 24 }, (_, hour) => ({ hour: `${hour}:00`, clicks: Math.floor(Math.random() * 50) }));
    const mockDayOfWeekData = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => ({ name: day, clicks: Math.floor(Math.random() * 100), value: Math.floor(Math.random() * 100) }));

    setProfileVisits(mockProfileVisits);
    setClickCounts(mockClickCounts);
    setLocationData(mockLocationData);
    setOsData(mockOsData);
    setBrowserData(mockBrowserData);
    setDeviceData(mockDeviceData);
    setReferrerData(mockReferrerData);
    setReferrerCategoryData(mockReferrerCategoryData);
    setPlatformData(mockPlatformData);
    setLinkData(mockLinkData);
    setHourlyData(mockHourlyData);
    setDayOfWeekData(mockDayOfWeekData);
    const total = mockClickCounts.reduce((sum, item) => sum + (item.clicks || 0), 0);
    const totalVisits = mockProfileVisits.reduce((sum, item) => sum + (item.visits || 0), 0);
    setTotalClicks(total);
    setTotalProfileVisits(totalVisits);
    setUniqueCountries(mockLocationData.length);
    setTopReferrer(mockReferrerData[0]?.name || 'Direct');
  };

  const generateDateRange = (range) => {
    const dates = [];
    const today = new Date();
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365, 'all': 365 };
    const days = daysMap[range] || 30;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return dates;
  };

  const getChartData = () => {
    const map = {
      profileVisits, clicks: clickCounts, location: locationData, os: osData,
      browser: browserData, device: deviceData, referrer: referrerCategoryData,
      referrerDetails: referrerData, hourly: hourlyData, dayOfWeek: dayOfWeekData,
      platform: platformData, link: linkData,
    };
    const data = map[selectedMetric] ?? clickCounts;
    return Array.isArray(data) ? data : [];
  };

  const renderChart = () => {
    const rawData = getChartData();
    if (!rawData || rawData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="text-center">
            <FaChartLine className="text-4xl mx-auto mb-3 opacity-40" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No data for the selected metric and time range</p>
          </div>
        </div>
      );
    }

    const data = rawData.map(item => ({ ...item }));
    const firstItem = data[0] || {};
    if (!firstItem || typeof firstItem !== 'object') return null;

    const nameBasedMetrics = ['location', 'os', 'browser', 'device', 'referrer', 'referrerDetails', 'platform', 'link', 'dayOfWeek'];
    let actualXKey = selectedMetric === 'hourly' ? 'hour'
      : nameBasedMetrics.includes(selectedMetric) ? 'name'
      : (xAxisType === 'date' ? 'date' : (firstItem.name ? 'name' : 'date'));

    const metricYKeyMap = {
      hourly: 'clicks', dayOfWeek: 'clicks', profileVisits: 'visits', clicks: 'clicks',
      os: 'value', location: 'value', browser: 'value', device: 'value',
      referrer: 'value', referrerDetails: 'value', platform: 'clicks', link: 'clicks',
    };
    let actualYKey = metricYKeyMap[selectedMetric] || (firstItem.value !== undefined ? 'value' : firstItem.clicks !== undefined ? 'clicks' : 'visits');

    // Validate keys exist, fallback gracefully
    const availableKeys = Object.keys(firstItem);
    if (!firstItem.hasOwnProperty(actualXKey)) {
      actualXKey = availableKeys.find(k => ['name', 'date', 'hour'].includes(k)) || availableKeys[0] || 'name';
    }
    if (!firstItem.hasOwnProperty(actualYKey)) {
      actualYKey = availableKeys.find(k => ['value', 'clicks', 'visits'].includes(k)) || availableKeys.find(k => typeof firstItem[k] === 'number') || availableKeys[1] || 'value';
    }

    const needsRotation = selectedMetric === 'hourly' || (nameBasedMetrics.includes(selectedMetric) && data.length > 5);
    const chartProps = { data, margin: { top: 5, right: 20, left: 10, bottom: 5 } };
    const gridProps = { strokeDasharray: '3 3', stroke: darkMode ? '#334155' : '#e2e8f0' };
    const axisStyle = { stroke: darkMode ? '#64748b' : '#94a3b8', tick: { fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 11 } };
    const tooltipStyle = {
      contentStyle: { backgroundColor: darkMode ? '#1e293b' : '#ffffff', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`, borderRadius: '8px', fontSize: '12px' },
      labelStyle: { color: darkMode ? '#f1f5f9' : '#0f172a' },
    };
    const xAxisProps = {
      dataKey: actualXKey,
      stroke: axisStyle.stroke,
      tick: axisStyle.tick,
      angle: needsRotation ? -40 : 0,
      textAnchor: needsRotation ? 'end' : 'middle',
      height: needsRotation ? 70 : 30,
    };
    const yAxisProps = { stroke: axisStyle.stroke, tick: axisStyle.tick };

    if (selectedGraphType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={data} cx="50%" cy="50%" labelLine={false} outerRadius={110}
              dataKey={actualYKey}
              label={(entry) => {
                const payload = entry.payload || entry;
                const name = (payload[actualXKey] || payload.name || '').toString();
                const truncated = name.length > 14 ? name.slice(0, 11) + '…' : name;
                return `${truncated}: ${entry.percent ? (entry.percent * 100).toFixed(0) : 0}%`;
              }}
            >
              {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip {...tooltipStyle} formatter={(value, name, props) => [value, props.payload?.[actualXKey] || name]} />
            <Legend formatter={(value, entry, index) => data[index]?.[actualXKey] || value || `Item ${index + 1}`} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (selectedGraphType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart {...chartProps}>
            <CartesianGrid {...gridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipStyle} />
            <Legend />
            <Bar dataKey={actualYKey} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (selectedGraphType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipStyle} />
            <Legend />
            <Area type="monotone" dataKey={actualYKey} stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#areaGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // default: line
    return (
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart {...chartProps}>
          <CartesianGrid {...gridProps} />
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip {...tooltipStyle} />
          <Legend />
          <Line type="monotone" dataKey={actualYKey} stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const metrics = [
    { value: 'profileVisits', label: 'Profile Visits' },
    { value: 'clicks', label: 'Click Counts' },
    { value: 'location', label: 'Location Based' },
    { value: 'os', label: 'OS Based' },
    { value: 'browser', label: 'Browser Based' },
    { value: 'device', label: 'Device Based' },
    { value: 'referrer', label: 'Referrer Categories' },
    { value: 'referrerDetails', label: 'Referrer Sources' },
    { value: 'hourly', label: 'Hourly Distribution' },
    { value: 'dayOfWeek', label: 'Day of Week' },
    { value: 'platform', label: 'Platform Based' },
    { value: 'link', label: 'Link Based' },
  ];

  if (!username) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-64">
        <div className="text-center">
          <FiBarChart2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Please log in to view analytics</p>
        </div>
      </div>
    );
  }

  const cardClass = "bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track and analyze your link performance</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: FiBarChart2, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30' },
          { label: 'Profile Visits', value: totalProfileVisits.toLocaleString(), icon: FiEye, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Countries', value: uniqueCountries, icon: FiGlobe, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'Top Referrer', value: topReferrer || '—', icon: FaLink, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${cardClass} p-4`}>
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`text-xl font-bold truncate ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className={`${cardClass} p-4 mb-4`}>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${['profileVisits', 'clicks'].includes(selectedMetric) ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3`}>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Time Range</label>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className={selectClass}>
              {timeRanges.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Metric</label>
            <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)} className={selectClass}>
              {metrics.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Chart Type</label>
            <select value={selectedGraphType} onChange={(e) => setSelectedGraphType(e.target.value)} className={selectClass}>
              {graphTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {['profileVisits', 'clicks'].includes(selectedMetric) && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">X-Axis</label>
              <select value={xAxisType} onChange={(e) => setXAxisType(e.target.value)} className={selectClass}>
                <option value="date">Date</option>
                <option value="name">Name</option>
              </select>
            </div>
          )}
        </div>
        <div className="mt-3">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Y-Axis</label>
          <select value={yAxisType} onChange={(e) => setYAxisType(e.target.value)} className={`${selectClass} max-w-xs`}>
            <option value="count">Count</option>
            <option value="value">Value</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <motion.div
        key={`chart-${selectedMetric}-${selectedGraphType}-${timeRange}-${yAxisType}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`${cardClass} p-4 sm:p-6 mb-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {metrics.find(m => m.value === selectedMetric)?.label || 'Chart'}
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">
            {timeRanges.find(t => t.value === timeRange)?.label}
          </span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading analytics…</p>
            </div>
          </div>
        ) : renderChart()}
      </motion.div>

      {/* Referrer + Device breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Referrer analytics */}
        <div className={`${cardClass} p-4 sm:p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <FiGlobe className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Referrer Analytics</h2>
          </div>
          {referrerCategoryData && referrerCategoryData.length > 0 ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">By Category</p>
                <div className="space-y-2">
                  {[...referrerCategoryData]
                    .sort((a, b) => (b.value || b.clicks || 0) - (a.value || a.clicks || 0))
                    .map((item, index) => {
                      const total = referrerCategoryData.reduce((sum, cat) => sum + (cat.value || cat.clicks || 0), 0);
                      const pct = total > 0 ? (((item.value || item.clicks || 0) / total) * 100).toFixed(1) : 0;
                      return (
                        <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">{item.name}</span>
                            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">{item.value || item.clicks || 0} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              {referrerData && referrerData.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Top Sources</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {[...referrerData].sort((a, b) => (b.value || b.clicks || 0) - (a.value || a.clicks || 0)).slice(0, 10).map((item, index) => (
                      <div key={index} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{item.category}</p>
                        </div>
                        <span className="text-xs font-bold text-violet-600 dark:text-violet-400 ml-3 flex-shrink-0">{item.value || item.clicks || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No referrer data available</p>
          )}
        </div>

        {/* Device & Browser */}
        <div className={`${cardClass} p-4 sm:p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <FaDesktop className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Device & Browser</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {deviceData && deviceData.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Devices</p>
                <div className="space-y-1.5">
                  {[...deviceData].sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 5).map((item, index) => {
                    const total = deviceData.reduce((sum, d) => sum + (d.value || 0), 0);
                    const pct = total > 0 ? (((item.value || 0) / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {browserData && browserData.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Browsers</p>
                <div className="space-y-1.5">
                  {[...browserData].sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 5).map((item, index) => {
                    const total = browserData.reduce((sum, b) => sum + (b.value || 0), 0);
                    const pct = total > 0 ? (((item.value || 0) / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {osData && osData.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Operating Systems</p>
              <div className="space-y-2">
                {[...osData].sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 5).map((item, index) => {
                  const total = osData.reduce((sum, os) => sum + (os.value || 0), 0);
                  const pct = total > 0 ? (((item.value || 0) / total) * 100).toFixed(1) : 0;
                  return (
                    <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{item.value || 0} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Geographic distribution */}
      {locationData && locationData.length > 0 && (
        <div className={`${cardClass} p-4 sm:p-5 mb-4`}>
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Geographic Distribution</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[...locationData].sort((a, b) => (b.value || 0) - (a.value || 0)).map((item, index) => {
              const total = locationData.reduce((sum, loc) => sum + (loc.value || 0), 0);
              const pct = total > 0 ? (((item.value || 0) / total) * 100).toFixed(1) : 0;
              return (
                <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.value || 0}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{pct}% of total</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Time-based analytics */}
      {(hourlyData.length > 0 || dayOfWeekData.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {hourlyData.length > 0 && (
            <div className={`${cardClass} p-4 sm:p-5`}>
              <div className="flex items-center gap-2 mb-4">
                <FaCalendarAlt className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Peak Hours</h2>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {hourlyData.map((item, index) => {
                  const maxClicks = Math.max(...hourlyData.map(h => h.clicks || 0));
                  const pct = maxClicks > 0 ? (((item.clicks || 0) / maxClicks) * 100).toFixed(0) : 0;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-12 flex-shrink-0 font-mono">{item.hour}</span>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
                        <div className="h-full bg-violet-500 transition-all duration-500 flex items-center justify-end pr-1.5" style={{ width: `${pct}%`, minWidth: item.clicks > 0 ? '1.5rem' : '0' }}>
                          {item.clicks > 0 && <span className="text-xs font-bold text-white leading-none">{item.clicks}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {dayOfWeekData.length > 0 && (
            <div className={`${cardClass} p-4 sm:p-5`}>
              <div className="flex items-center gap-2 mb-4">
                <FaCalendarAlt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Day of Week</h2>
              </div>
              <div className="space-y-2">
                {dayOfWeekData.map((item, index) => {
                  const maxClicks = Math.max(...dayOfWeekData.map(d => d.clicks || d.value || 0));
                  const pct = maxClicks > 0 ? ((((item.clicks || item.value || 0) / maxClicks)) * 100).toFixed(0) : 0;
                  return (
                    <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.clicks || item.value || 0}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Platform performance table */}
      {platformData && platformData.length > 0 && (
        <div className={`${cardClass} p-4 sm:p-5 mb-6 overflow-x-auto`}>
          <div className="flex items-center gap-2 mb-4">
            <FaLink className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Platform Performance</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-xs font-semibold text-slate-500 dark:text-slate-400 pb-2 px-2">Platform</th>
                <th className="text-xs font-semibold text-slate-500 dark:text-slate-400 pb-2 px-2 text-right">Clicks</th>
                <th className="text-xs font-semibold text-slate-500 dark:text-slate-400 pb-2 px-2 text-right">Share</th>
                <th className="text-xs font-semibold text-slate-500 dark:text-slate-400 pb-2 px-2 text-right hidden sm:table-cell">Bar</th>
              </tr>
            </thead>
            <tbody>
              {[...platformData].sort((a, b) => (b.clicks || b.value || 0) - (a.clicks || a.value || 0)).map((item, index) => {
                const total = platformData.reduce((sum, p) => sum + (p.clicks || p.value || 0), 0);
                const pct = total > 0 ? ((((item.clicks || item.value || 0) / total)) * 100).toFixed(1) : 0;
                return (
                  <tr key={index} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="text-sm font-medium text-slate-800 dark:text-slate-200 py-2.5 px-2 capitalize">{item.name}</td>
                    <td className="text-sm font-bold text-violet-600 dark:text-violet-400 py-2.5 px-2 text-right">{(item.clicks || item.value || 0).toLocaleString()}</td>
                    <td className="text-sm text-slate-500 dark:text-slate-400 py-2.5 px-2 text-right">{pct}%</td>
                    <td className="py-2.5 px-2 text-right hidden sm:table-cell">
                      <div className="w-28 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden ml-auto">
                        <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => navigate('/click-details')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <FiList className="w-4 h-4" />
          View Detailed Click Information
          <FaExternalLinkAlt className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Analytics;
