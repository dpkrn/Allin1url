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
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const COLORS = [
  '#8b5cf6',
  '#ec4899',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#a855f7',
];

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

  // Analytics data states
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
  
  // Statistics summary
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalProfileVisits, setTotalProfileVisits] = useState(0);
  const [uniqueCountries, setUniqueCountries] = useState(0);
  const [topReferrer, setTopReferrer] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [username, timeRange]);

  // Set responsive chart height based on window size
  useEffect(() => {
    const updateChartHeight = () => {
      if (window.innerWidth < 640) {
        setChartHeight(300);
      } else if (window.innerWidth < 1024) {
        setChartHeight(350);
      } else {
        setChartHeight(400);
      }
    };
    
    updateChartHeight();
    window.addEventListener('resize', updateChartHeight);
    return () => window.removeEventListener('resize', updateChartHeight);
  }, []);

  // Reset axis types and ensure chart re-renders when metric changes
  useEffect(() => {
    // Metrics that support date/name switching
    const dateMetrics = ['profileVisits', 'clicks'];
    
    // Metrics that always use 'value' field (not 'clicks' or 'visits')
    const valueBasedMetrics = ['location', 'os', 'browser', 'device'];
    
    // Metrics that use 'clicks' field
    const clicksBasedMetrics = ['hourly', 'dayOfWeek', 'clicks', 'platform', 'link'];
    
    // Referrer metrics (have both value and clicks)
    const referrerMetrics = ['referrer', 'referrerDetails'];
    
    // Reset Y-axis type based on metric for consistency
    // Only change if current yAxisType doesn't make sense for the metric
    if (valueBasedMetrics.includes(selectedMetric)) {
      // Value-based metrics work best with 'value' or 'percentage'
      // Don't auto-change, let user choose, but validate in renderChart
    } else if (clicksBasedMetrics.includes(selectedMetric)) {
      // Clicks-based metrics work with 'count', 'value', or 'percentage'
      // Keep current yAxisType - all are valid
    } else if (referrerMetrics.includes(selectedMetric)) {
      // Referrer metrics have both 'value' and 'clicks'
      // Don't auto-change, but will use appropriate key in renderChart
    } else if (selectedMetric === 'profileVisits') {
      // Profile visits uses 'visits' - yAxisType doesn't affect the field used
    }
    
    // Note: renderChart will use the correct Y-key regardless of yAxisType
    // yAxisType mainly affects display format, not the actual field selected
  }, [selectedMetric]); // Only depend on selectedMetric to avoid infinite loops

  const fetchAnalytics = async () => {
    if (!username) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        '/analytics/get',
        { username, timeRange },
        { withCredentials: true }
      );

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
        
        // Calculate statistics
        const total = (data.clickCounts || []).reduce((sum, item) => sum + (item.clicks || 0), 0);
        const totalVisits = (data.profileVisits || []).reduce((sum, item) => sum + (item.visits || 0), 0);
        setTotalClicks(total);
        setTotalProfileVisits(totalVisits);
        setUniqueCountries((data.locationData || []).length);
        setTopReferrer((data.referrerData || [])[0]?.name || 'Direct');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Use mock data if API fails
      generateMockData();
      toast.error('Using simulated data. Analytics API unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Generate mock data based on actual links
    const mockDates = generateDateRange(timeRange);
    const totalClicks = links.reduce((sum, link) => sum + (link.clicked || 0), 0);
    
    const mockProfileVisits = mockDates.map((date) => ({
      date,
      visits: Math.floor(Math.random() * 50) + 10,
    }));

    const mockClickCounts = mockDates.map((date) => ({
      date,
      clicks: Math.floor(Math.random() * 100) + 20,
    }));

    const mockLocationData = [
      { name: 'United States', value: Math.floor(totalClicks * 0.35) },
      { name: 'India', value: Math.floor(totalClicks * 0.25) },
      { name: 'United Kingdom', value: Math.floor(totalClicks * 0.15) },
      { name: 'Canada', value: Math.floor(totalClicks * 0.10) },
    ];

    const mockOsData = [
      { name: 'Windows', value: Math.floor(totalClicks * 0.40) },
      { name: 'macOS', value: Math.floor(totalClicks * 0.25) },
      { name: 'Linux', value: Math.floor(totalClicks * 0.15) },
      { name: 'iOS', value: Math.floor(totalClicks * 0.12) },
      { name: 'Android', value: Math.floor(totalClicks * 0.08) },
    ];

    const mockBrowserData = [
      { name: 'Chrome', value: Math.floor(totalClicks * 0.50) },
      { name: 'Safari', value: Math.floor(totalClicks * 0.25) },
      { name: 'Firefox', value: Math.floor(totalClicks * 0.15) },
      { name: 'Edge', value: Math.floor(totalClicks * 0.10) },
    ];

    const mockDeviceData = [
      { name: 'Desktop', value: Math.floor(totalClicks * 0.60) },
      { name: 'Mobile', value: Math.floor(totalClicks * 0.35) },
      { name: 'Tablet', value: Math.floor(totalClicks * 0.05) },
    ];

    const mockReferrerData = [
      { name: 'Direct', value: Math.floor(totalClicks * 0.40), category: 'direct', clicks: Math.floor(totalClicks * 0.40) },
      { name: 'google.com', value: Math.floor(totalClicks * 0.25), category: 'search', clicks: Math.floor(totalClicks * 0.25) },
      { name: 'twitter.com', value: Math.floor(totalClicks * 0.15), category: 'social', clicks: Math.floor(totalClicks * 0.15) },
      { name: 'linkedin.com', value: Math.floor(totalClicks * 0.10), category: 'social', clicks: Math.floor(totalClicks * 0.10) },
      { name: 'facebook.com', value: Math.floor(totalClicks * 0.10), category: 'social', clicks: Math.floor(totalClicks * 0.10) },
    ];

    const mockReferrerCategoryData = [
      { name: 'Direct', value: mockReferrerData.find(r => r.category === 'direct')?.value || 0, clicks: mockReferrerData.find(r => r.category === 'direct')?.clicks || 0 },
      { name: 'Search', value: mockReferrerData.filter(r => r.category === 'search').reduce((sum, r) => sum + r.value, 0), clicks: mockReferrerData.filter(r => r.category === 'search').reduce((sum, r) => sum + r.clicks, 0) },
      { name: 'Social', value: mockReferrerData.filter(r => r.category === 'social').reduce((sum, r) => sum + r.value, 0), clicks: mockReferrerData.filter(r => r.category === 'social').reduce((sum, r) => sum + r.clicks, 0) },
    ];

    const mockPlatformData = links.map((link) => ({
      name: link.source,
      clicks: link.clicked || Math.floor(Math.random() * 100),
    }));

    const mockLinkData = links.map((link) => ({
      name: link.source,
      clicks: link.clicked || 0,
      visits: Math.floor((link.clicked || 0) * 1.2),
    }));

    const mockHourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      clicks: Math.floor(Math.random() * 50),
    }));

    const mockDayOfWeekData = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => ({
      name: day,
      clicks: Math.floor(Math.random() * 100),
      value: Math.floor(Math.random() * 100),
    }));

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
    
    // Set statistics for mock data
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
    let days = 7;

    switch (range) {
      case '7d':
        days = 7;
        break;
      case '30d':
        days = 30;
        break;
      case '90d':
        days = 90;
        break;
      case '1y':
        days = 365;
        break;
      case 'all':
        days = 365; // Match backend behavior for 'all' time range
        break;
      default:
        days = 30;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    return dates;
  };

  const getChartData = () => {
    // Return data based on selected metric, ensuring we always return an array
    switch (selectedMetric) {
      case 'profileVisits':
        return Array.isArray(profileVisits) ? profileVisits : [];
      case 'clicks':
        return Array.isArray(clickCounts) ? clickCounts : [];
      case 'location':
        return Array.isArray(locationData) ? locationData : [];
      case 'os':
        return Array.isArray(osData) ? osData : [];
      case 'browser':
        return Array.isArray(browserData) ? browserData : [];
      case 'device':
        return Array.isArray(deviceData) ? deviceData : [];
      case 'referrer':
        return Array.isArray(referrerCategoryData) ? referrerCategoryData : [];
      case 'referrerDetails':
        return Array.isArray(referrerData) ? referrerData : [];
      case 'hourly':
        return Array.isArray(hourlyData) ? hourlyData : [];
      case 'dayOfWeek':
        return Array.isArray(dayOfWeekData) ? dayOfWeekData : [];
      case 'platform':
        return Array.isArray(platformData) ? platformData : [];
      case 'link':
        return Array.isArray(linkData) ? linkData : [];
      default:
        return Array.isArray(clickCounts) ? clickCounts : [];
    }
  };

  const renderChart = () => {
    const rawData = getChartData();
    
    // Early return if no data
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <FaChartLine className="text-6xl mx-auto mb-4 opacity-50 text-gray-400 dark:text-gray-500" />
            <p className="text-xl text-gray-700 dark:text-gray-300">No data available for the selected metric and time range</p>
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">Metric: {selectedMetric}</p>
          </div>
        </div>
      );
    }

    // Create a mutable copy of the data to avoid issues with frozen arrays
    // This ensures we can safely pass data to chart libraries without mutation errors
    const data = rawData.map(item => ({ ...item }));

    // Determine X-axis key based on metric type and available data
    let actualXKey;
    const firstItem = data[0] || {};
    
    // Validate that firstItem is a valid object
    if (!firstItem || typeof firstItem !== 'object') {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <FaChartLine className="text-6xl mx-auto mb-4 opacity-50 text-gray-400 dark:text-gray-500" />
            <p className="text-xl text-gray-700 dark:text-gray-300">Invalid data format for the selected metric</p>
          </div>
        </div>
      );
    }
    
    // Metrics that have date/time data
    const timeBasedMetrics = ['profileVisits', 'clicks'];
    // Metrics that have hour data
    const hourBasedMetrics = ['hourly'];
    // Metrics that have name data
    const nameBasedMetrics = ['location', 'os', 'browser', 'device', 'referrer', 'referrerDetails', 'platform', 'link', 'dayOfWeek'];
    
    if (hourBasedMetrics.includes(selectedMetric)) {
      actualXKey = 'hour';
    } else if (nameBasedMetrics.includes(selectedMetric)) {
      actualXKey = 'name';
    } else if (timeBasedMetrics.includes(selectedMetric)) {
      // For time-based metrics, use date or name based on xAxisType selection
      actualXKey = xAxisType === 'date' ? 'date' : (firstItem.name ? 'name' : 'date');
    } else {
      // Fallback: check what fields exist in the data
      actualXKey = firstItem.date ? 'date' : (firstItem.name ? 'name' : (firstItem.hour ? 'hour' : 'date'));
    }
    
    // Determine Y-axis key based on metric type - use primary field for consistency
    // yAxisType (count/value/percentage) affects display, not field selection
    let actualYKey;
    
    // Define metric-specific Y-key mappings - always use the primary field
    // This ensures consistent behavior regardless of yAxisType selection
    const metricYKeyMap = {
      'hourly': 'clicks',
      'dayOfWeek': 'clicks',        // dayOfWeek has both clicks and value, prefer clicks for consistency
      'profileVisits': 'visits',
      'clicks': 'clicks',
      'os': 'value',                 // OS data: { name, value } - always use value
      'location': 'value',           // Location data: { name, value } - always use value
      'browser': 'value',            // Browser data: { name, value } - always use value
      'device': 'value',             // Device data: { name, value } - always use value
      'referrer': 'value',           // Referrer category: { name, value, clicks } - prefer value for consistency
      'referrerDetails': 'value',    // Referrer details: { name, value, clicks } - prefer value for consistency
      'platform': 'clicks',          // Platform data: { name, clicks, value } - prefer clicks for consistency
      'link': 'clicks',              // Link data: { name, clicks, visits } - always use clicks (no value field)
    };
    
    // Use predefined mapping for consistent behavior
    if (metricYKeyMap[selectedMetric]) {
      actualYKey = metricYKeyMap[selectedMetric];
    } else {
      // Fallback: check what fields exist in the data, prioritize value > clicks > visits
      actualYKey = firstItem.value !== undefined ? 'value' : 
                   (firstItem.clicks !== undefined ? 'clicks' : 
                   (firstItem.visits !== undefined ? 'visits' : 'value'));
    }

    // Validate that the keys exist in the data
    if (data.length > 0 && firstItem && typeof firstItem === 'object') {
      const availableKeys = Object.keys(firstItem);
      
      // Debug logging (only in development, less verbose)
      // In Vite, use import.meta.env instead of process.env
      const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
      if (isDevelopment && import.meta.env.VITE_DEBUG_ANALYTICS) {
        console.log(`[Analytics] Metric: ${selectedMetric}, X-Key: ${actualXKey}, Y-Key: ${actualYKey}`);
        console.log(`[Analytics] Available keys:`, availableKeys);
      }
      
      // Validate and fix X-axis key
      if (!firstItem.hasOwnProperty(actualXKey)) {
        // Try to find an alternative based on metric type
        const altXKey = availableKeys.find(k => {
          // Priority order based on metric
          if (selectedMetric === 'hourly') return k === 'hour';
          if (['location', 'os', 'browser', 'device', 'referrer', 'referrerDetails', 'platform', 'link', 'dayOfWeek'].includes(selectedMetric)) return k === 'name';
          if (['profileVisits', 'clicks'].includes(selectedMetric)) return k === 'date' || k === 'name';
          return ['name', 'date', 'hour'].includes(k);
        }) || availableKeys.find(k => ['name', 'date', 'hour'].includes(k)) || availableKeys[0] || 'name';
        
        if (altXKey !== actualXKey) {
          if (isDevelopment) {
            console.warn(`[Analytics] X-axis key "${actualXKey}" not found. Using: ${altXKey}`);
          }
          actualXKey = altXKey;
        }
      }
      
      // Validate and fix Y-axis key
      if (!firstItem.hasOwnProperty(actualYKey)) {
        // Try to find an alternative - prioritize value, clicks, visits
        const altYKey = availableKeys.find(k => {
          // Try metric-specific fields first
          if (selectedMetric === 'profileVisits') return k === 'visits';
          if (['clicks', 'hourly', 'dayOfWeek', 'platform', 'link'].includes(selectedMetric)) return k === 'clicks';
          if (['location', 'os', 'browser', 'device'].includes(selectedMetric)) return k === 'value';
          return ['value', 'clicks', 'visits'].includes(k);
        }) || availableKeys.find(k => ['value', 'clicks', 'visits'].includes(k)) || 
             availableKeys.find(k => typeof firstItem[k] === 'number') || 
             availableKeys[1] || 'value';
        
        if (altYKey !== actualYKey) {
          if (isDevelopment) {
            console.warn(`[Analytics] Y-axis key "${actualYKey}" not found. Using: ${altYKey}`);
          }
          actualYKey = altYKey;
        }
      }
    }

    const chartProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (selectedGraphType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey={actualXKey}
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                angle={selectedMetric === 'hourly' || (nameBasedMetrics.includes(selectedMetric) && data.length > 5) ? -45 : 0}
                textAnchor={selectedMetric === 'hourly' || (nameBasedMetrics.includes(selectedMetric) && data.length > 5) ? 'end' : 'middle'}
                height={selectedMetric === 'hourly' || (nameBasedMetrics.includes(selectedMetric) && data.length > 5) ? 80 : 30}
              />
              <YAxis
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={actualYKey}
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey={actualXKey}
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                angle={selectedMetric === 'hourly' || (nameBasedMetrics.includes(selectedMetric) && data.length > 5) ? -45 : 0}
                textAnchor={selectedMetric === 'hourly' || (nameBasedMetrics.includes(selectedMetric) && data.length > 5) ? 'end' : 'middle'}
                height={selectedMetric === 'hourly' || (nameBasedMetrics.includes(selectedMetric) && data.length > 5) ? 80 : 30}
              />
              <YAxis
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Legend />
              <Bar dataKey={actualYKey} fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart {...chartProps}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey={actualXKey}
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                angle={selectedMetric === 'hourly' || (nameBasedMetrics.includes(selectedMetric) && data.length > 5) ? -45 : 0}
                textAnchor={selectedMetric === 'hourly' || (nameBasedMetrics.includes(selectedMetric) && data.length > 5) ? 'end' : 'middle'}
                height={selectedMetric === 'hourly' || (nameBasedMetrics.includes(selectedMetric) && data.length > 5) ? 80 : 30}
              />
              <YAxis
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey={actualYKey}
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => {
                  // In Recharts Pie, entry contains: name, value, percent, payload (original data)
                  const payload = entry.payload || entry;
                  const displayName = (payload[actualXKey] || payload.name || entry.name || 'Item').toString();
                  const truncatedName = displayName.length > 15 ? displayName.substring(0, 12) + '...' : displayName;
                  const percent = entry.percent ? (entry.percent * 100).toFixed(0) : '0';
                  return `${truncatedName}: ${percent}%`;
                }}
                outerRadius={120}
                fill="#8884d8"
                dataKey={actualYKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                formatter={(value, name, props) => {
                  const payload = props.payload || {};
                  const label = payload[actualXKey] || payload.name || name || 'Value';
                  return [value, label];
                }}
              />
              <Legend 
                formatter={(value, entry, index) => {
                  const item = data[index];
                  if (item && item[actualXKey]) {
                    return item[actualXKey];
                  }
                  return value || `Item ${index + 1}`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const metrics = [
    { value: 'profileVisits', label: 'Profile Visits', icon: FaGlobe },
    { value: 'clicks', label: 'Click Counts', icon: FaChartLine },
    { value: 'location', label: 'Location Based', icon: FaMapMarkerAlt },
    { value: 'os', label: 'OS Based', icon: FaDesktop },
    { value: 'browser', label: 'Browser Based', icon: FaDesktop },
    { value: 'device', label: 'Device Based', icon: FaMobileAlt },
    { value: 'referrer', label: 'Referrer Categories', icon: FaGlobe },
    { value: 'referrerDetails', label: 'Referrer Sources', icon: FaGlobe },
    { value: 'hourly', label: 'Hourly Distribution', icon: FaCalendarAlt },
    { value: 'dayOfWeek', label: 'Day of Week', icon: FaCalendarAlt },
    { value: 'platform', label: 'Platform Based', icon: FaLink },
    { value: 'link', label: 'Link Based', icon: FaLink },
  ];

  if (!username) {
    return (
      <div className="w-full min-h-screen py-8 px-4 sm:px-6 md:px-10 lg:px-12 flex items-center justify-center">
        <div className="text-center">
          <FaChartLine className="text-6xl text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Please log in to view analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 md:px-10 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-400">
            Track and analyze your link performance with detailed insights
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6 mb-4 sm:mb-6"
        >
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${(['profileVisits', 'clicks'].includes(selectedMetric)) ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3 sm:gap-4`}>
            {/* Time Range */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                <FaCalendarAlt className="inline mr-1 sm:mr-2 text-xs sm:text-sm" />
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Metric Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Metric
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {metrics.map((metric) => (
                  <option key={metric.value} value={metric.value}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Graph Type */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Graph Type
              </label>
              <select
                value={selectedGraphType}
                onChange={(e) => setSelectedGraphType(e.target.value)}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {graphTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* X-Axis - Only show for metrics that support both date and name */}
            {(['profileVisits', 'clicks'].includes(selectedMetric)) && (
            <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                X-Axis
              </label>
              <select
                value={xAxisType}
                onChange={(e) => setXAxisType(e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
              </select>
            </div>
            )}
          </div>

          {/* Y-Axis Control */}
          <div className="mt-3 sm:mt-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Y-Axis
            </label>
            <select
              value={yAxisType}
              onChange={(e) => setYAxisType(e.target.value)}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="count">Count</option>
              <option value="value">Value</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
        </motion.div>

        {/* Chart Container */}
        <motion.div
          key={`chart-${selectedMetric}-${selectedGraphType}-${timeRange}-${yAxisType}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6"
        >
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-700 dark:text-gray-400">Loading analytics...</p>
              </div>
            </div>
          ) : (
            renderChart()
          )}
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-6"
        >
          <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {totalClicks.toLocaleString()}
                </p>
              </div>
              <FaChartLine className="text-3xl sm:text-4xl text-purple-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Profile Visits</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {totalProfileVisits.toLocaleString()}
                </p>
              </div>
              <FaGlobe className="text-3xl sm:text-4xl text-pink-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Countries</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {uniqueCountries}
                </p>
              </div>
              <FaMapMarkerAlt className="text-3xl sm:text-4xl text-blue-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Top Referrer</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 truncate max-w-[120px] sm:max-w-none">
                  {topReferrer}
                </p>
              </div>
              <FaLink className="text-3xl sm:text-4xl text-green-500 flex-shrink-0" />
            </div>
          </div>
        </motion.div>

        {/* Detailed Breakdown Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Referrer Analytics Section */}
          <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <FaGlobe className="text-purple-500" />
              <span>Referrer Analytics</span>
            </h2>
            
            {referrerCategoryData && referrerCategoryData.length > 0 ? (
              <div className="space-y-4">
                {/* Referrer Categories */}
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">By Category</h3>
                  <div className="space-y-2">
                    {[...referrerCategoryData]
                      .sort((a, b) => (b.value || b.clicks || 0) - (a.value || a.clicks || 0))
                      .map((item, index) => {
                        const total = referrerCategoryData.reduce((sum, cat) => sum + (cat.value || cat.clicks || 0), 0);
                        const percentage = total > 0 ? ((item.value || item.clicks || 0) / total * 100).toFixed(1) : 0;
                        return (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-200 dark:border-gray-700/30">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 capitalize">
                                {item.name}
                              </span>
                              <span className="text-sm sm:text-base font-bold text-purple-600 dark:text-purple-400">
                                {item.value || item.clicks || 0} ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Top Referrer Sources */}
                {referrerData && referrerData.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Top Referrer Sources</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {[...referrerData]
                        .sort((a, b) => (b.value || b.clicks || 0) - (a.value || a.clicks || 0))
                        .slice(0, 10)
                        .map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-100 dark:bg-gray-800/20 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/40 transition-colors border border-gray-200 dark:border-gray-700/30">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                                {item.category}
                              </p>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 ml-3 flex-shrink-0">
                              {item.value || item.clicks || 0}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center py-8">
                No referrer data available
              </p>
            )}
          </div>

          {/* Device & Browser Breakdown */}
          <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <FaDesktop className="text-blue-500" />
              <span>Device & Browser</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Device Types */}
              {deviceData && deviceData.length > 0 && (
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Device Types</h3>
                  <div className="space-y-2">
                      {[...deviceData]
                        .sort((a, b) => (b.value || 0) - (a.value || 0))
                        .slice(0, 5)
                        .map((item, index) => {
                        const total = deviceData.reduce((sum, d) => sum + (d.value || 0), 0);
                        const percentage = total > 0 ? ((item.value || 0) / total * 100).toFixed(1) : 0;
                        return (
                          <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-700 dark:text-gray-400">{item.name}</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{item.value || 0} ({percentage}%)</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Top Browsers */}
              {browserData && browserData.length > 0 && (
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Top Browsers</h3>
                  <div className="space-y-2">
                      {[...browserData]
                        .sort((a, b) => (b.value || 0) - (a.value || 0))
                        .slice(0, 5)
                        .map((item, index) => {
                        const total = browserData.reduce((sum, b) => sum + (b.value || 0), 0);
                        const percentage = total > 0 ? ((item.value || 0) / total * 100).toFixed(1) : 0;
                        return (
                          <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-700 dark:text-gray-400">{item.name}</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{item.value || 0} ({percentage}%)</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Top Operating Systems */}
            {osData && osData.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Operating Systems</h3>
                <div className="space-y-2">
                  {[...osData]
                    .sort((a, b) => (b.value || 0) - (a.value || 0))
                    .slice(0, 5)
                    .map((item, index) => {
                      const total = osData.reduce((sum, os) => sum + (os.value || 0), 0);
                      const percentage = total > 0 ? ((item.value || 0) / total * 100).toFixed(1) : 0;
                      return (
                        <div key={index} className="bg-gray-100 dark:bg-gray-800/20 rounded-lg p-2 sm:p-3 border border-gray-200 dark:border-gray-700/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200">{item.name}</span>
                            <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{item.value || 0} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Location Breakdown */}
        {locationData && locationData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-500" />
              <span>Geographic Distribution</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[...locationData]
                .sort((a, b) => (b.value || 0) - (a.value || 0))
                .map((item, index) => {
                  const total = locationData.reduce((sum, loc) => sum + (loc.value || 0), 0);
                  const percentage = total > 0 ? ((item.value || 0) / total * 100).toFixed(1) : 0;
                  return (
                    <div key={index} className="bg-gray-100 dark:bg-gray-800/20 rounded-lg p-3 sm:p-4 hover:bg-gray-200 dark:hover:bg-gray-800/40 transition-colors border border-gray-200 dark:border-gray-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-200">
                          {item.name}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400">
                          {item.value || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">{percentage}% of total</p>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {/* Time-Based Analytics */}
        {(hourlyData.length > 0 || dayOfWeekData.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Hourly Distribution */}
            {hourlyData.length > 0 && (
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-500" />
                  <span>Peak Hours</span>
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {hourlyData.map((item, index) => {
                    const maxClicks = Math.max(...hourlyData.map(h => h.clicks || 0));
                    const percentage = maxClicks > 0 ? ((item.clicks || 0) / maxClicks * 100).toFixed(0) : 0;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-500 w-16 flex-shrink-0">
                          {item.hour}
                        </span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700/50 rounded-full h-4 sm:h-5 overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            {item.clicks > 0 && (
                              <span className="text-xs font-bold text-white">{item.clicks}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Day of Week Distribution */}
            {dayOfWeekData.length > 0 && (
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500" />
                  <span>Day of Week</span>
                </h2>
                <div className="space-y-2">
                  {dayOfWeekData.map((item, index) => {
                    const maxClicks = Math.max(...dayOfWeekData.map(d => d.clicks || d.value || 0));
                    const percentage = maxClicks > 0 ? (((item.clicks || item.value || 0) / maxClicks) * 100).toFixed(0) : 0;
                    return (
                      <div key={index} className="bg-gray-100 dark:bg-gray-800/20 rounded-lg p-3 border border-gray-200 dark:border-gray-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-200">
                            {item.name}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
                            {item.clicks || item.value || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Platform Performance Table */}
        {platformData && platformData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4 sm:p-5 md:p-6 overflow-x-auto"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <FaLink className="text-pink-500" />
              <span>Platform Performance</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-400 py-2 sm:py-3 px-2 sm:px-4">Platform</th>
                    <th className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-400 py-2 sm:py-3 px-2 sm:px-4 text-right">Clicks</th>
                    <th className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-400 py-2 sm:py-3 px-2 sm:px-4 text-right">Percentage</th>
                    <th className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-400 py-2 sm:py-3 px-2 sm:px-4 text-right hidden sm:table-cell">Bar</th>
                  </tr>
                </thead>
                <tbody>
                    {[...platformData]
                      .sort((a, b) => (b.clicks || b.value || 0) - (a.clicks || a.value || 0))
                      .map((item, index) => {
                      const total = platformData.reduce((sum, p) => sum + (p.clicks || p.value || 0), 0);
                      const percentage = total > 0 ? (((item.clicks || item.value || 0) / total) * 100).toFixed(1) : 0;
                      return (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-800/20 transition-colors">
                          <td className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200 py-2 sm:py-3 px-2 sm:px-4 capitalize">
                            {item.name}
                          </td>
                          <td className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 py-2 sm:py-3 px-2 sm:px-4 text-right">
                            {(item.clicks || item.value || 0).toLocaleString()}
                          </td>
                          <td className="text-xs sm:text-sm text-gray-600 dark:text-gray-500 py-2 sm:py-3 px-2 sm:px-4 text-right">
                            {percentage}%
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right hidden sm:table-cell">
                            <div className="w-24 sm:w-32 bg-gray-200 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden ml-auto">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* View Detailed Clicks Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/click-details')}
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white text-sm sm:text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaTable className="text-lg sm:text-xl" />
            <span>View Detailed Click Information</span>
            <FaExternalLinkAlt className="text-sm sm:text-base" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;


