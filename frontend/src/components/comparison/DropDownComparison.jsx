import React, { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const ComparisonTable = () => {
  const [selectedColumn, setSelectedColumn] = useState(0);
  const [hoveredRow, setHoveredRow] = useState(null);

  const products = [
    'All in1 url',
    'Link Shorteners',
    'Linktree',
    'Bio.link',
    'Custom Domain'
  ];

  const features = [
    {
      name: 'Link Format',
      values: [
        'username.domain/platform',
        'bit.ly/xyz123',
        'linktr.ee/username',
        'bio.link/username',
        'custom.com/username'
      ],
      statuses: ['good', 'bad', 'warning', 'warning', 'good']
    },
    {
      name: 'Memorability',
      values: ['Human-readable, memorable', 'Random codes', 'Platform-dependent', 'Platform-dependent', 'Customizable'],
      statuses: ['good', 'bad', 'warning', 'warning', 'good']
    },
    {
      name: 'Professionalism',
      values: ['Branded, professional', 'Generic, unprofessional', 'Branded by platform', 'Branded by platform', 'Fully branded'],
      statuses: ['good', 'bad', 'warning', 'warning', 'good']
    },
    {
      name: 'Expiration',
      values: ['Never expires', 'Often expires', 'Usually permanent', 'Usually permanent', 'Permanent'],
      statuses: ['good', 'bad', 'good', 'good', 'good']
    },
    {
      name: 'Centralized Management',
      values: ['Update all links from one place', 'Must update each link', 'Yes', 'Yes', 'Varies'],
      statuses: ['good', 'bad', 'good', 'good', 'warning']
    },
    {
      name: 'Platform Hub',
      values: ['Single link for all profiles', 'Separate links', 'Yes', 'Yes', 'Varies'],
      statuses: ['good', 'bad', 'good', 'good', 'warning']
    },
    {
      name: 'Analytics',
      values: ['Built-in click tracking', 'Limited or premium', 'Premium feature', 'Premium feature', 'Varies'],
      statuses: ['good', 'warning', 'warning', 'warning', 'warning']
    },
    {
      name: 'Customization',
      values: ['Username-based personalization', 'No customization', 'Limited', 'Limited', 'Full control'],
      statuses: ['good', 'bad', 'warning', 'warning', 'good']
    },
    {
      name: 'Cost',
      values: ['Free and open source', 'Often requires paid plans', 'Premium features locked', 'Premium features locked', 'Expensive'],
      statuses: ['good', 'warning', 'warning', 'warning', 'bad']
    },
    {
      name: 'Transparency',
      values: ['Open source, auditable', 'Closed source', 'Closed source', 'Closed source', 'Varies'],
      statuses: ['good', 'bad', 'bad', 'bad', 'warning']
    },
    {
      name: 'No Vendor Lock-in',
      values: ['Self-hostable', 'Vendor-dependent', 'Vendor-dependent', 'Vendor-dependent', 'Self-hostable'],
      statuses: ['good', 'bad', 'bad', 'bad', 'good']
    },
    {
      name: 'Email Notifications',
      values: ['Fully customizable', 'Not available', 'Premium feature', 'Premium feature', 'Varies'],
      statuses: ['good', 'bad', 'warning', 'warning', 'warning']
    },
    {
      name: 'Dark Mode',
      values: ['Full support', 'Varies', 'Limited', 'Limited', 'Varies'],
      statuses: ['good', 'warning', 'warning', 'warning', 'warning']
    },
    {
      name: 'Link Privacy Controls',
      values: ['Public/Unlisted/Private', 'Not available', 'Limited', 'Limited', 'Varies'],
      statuses: ['good', 'bad', 'warning', 'warning', 'warning']
    },
    {
      name: 'Password Protection',
      values: ['Built-in', 'Not available', 'Premium feature', 'Premium feature', 'Varies'],
      statuses: ['good', 'bad', 'warning', 'warning', 'warning']
    }
  ];

  const getIcon = (status) => {
    switch (status) {
      case 'good':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'bad':
        return <X className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'bad':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 transition-all duration-500 ease-out">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            🆚 All in1 url vs. Competitors
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            See how we compare to other solutions
          </p>
        </div>

        {/* Mobile Product Selector */}
        <div className="md:hidden mb-6">
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(Number(e.target.value))}
            className="w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
          >
            {products.map((product, idx) => (
              <option key={idx} value={idx}>{product}</option>
            ))}
          </select>
        </div>

        {/* Desktop Product Tabs */}
        <div className="hidden md:flex gap-2 mb-6 overflow-x-auto pb-2">
          {products.map((product, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedColumn(idx)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedColumn === idx
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-102'
              }`}
            >
              {product}
            </button>
          ))}
        </div>

        {/* Comparison Cards */}
        <div className="space-y-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300 ${
                hoveredRow === idx
                  ? 'shadow-xl scale-[1.02] border-blue-300 dark:border-blue-600'
                  : 'shadow-md border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
                  {feature.name}
                </h3>
                
                {/* Desktop Grid View */}
                <div className="hidden md:grid grid-cols-5 gap-4">
                  {feature.values.map((value, colIdx) => (
                    <div
                      key={colIdx}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        getStatusColor(feature.statuses[colIdx])
                      } ${
                        selectedColumn === colIdx
                          ? 'ring-2 ring-blue-400 dark:ring-blue-500 scale-105'
                          : 'opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getIcon(feature.statuses[colIdx])}
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                          {products[colIdx]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mobile Single Column View */}
                <div className="md:hidden">
                  <div
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      getStatusColor(feature.statuses[selectedColumn])
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getIcon(feature.statuses[selectedColumn])}
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {products[selectedColumn]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {feature.values[selectedColumn]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
          <h3 className="text-2xl font-bold text-white mb-2">
            Ready to get started?
          </h3>
          <p className="text-blue-100 mb-4">
            Join thousands using All in1 url for their professional links
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105">
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;