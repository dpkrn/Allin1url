import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaCheck, FaTimes, FaExclamationCircle, FaEllipsisV } from 'react-icons/fa';

const ComparisonTable = () => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [columnWidths, setColumnWidths] = useState([200, 180, 180, 180, 180, 180]);
  const [isDragging, setIsDragging] = useState(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const products = [
    { name: 'LinkBridger', highlight: true },
    { name: 'Link Shorteners', highlight: false },
    { name: 'Linktree', highlight: false },
    { name: 'Bio.link', highlight: false },
    { name: 'Custom Domain', highlight: false }
  ];

  // Priority features at the top
  const priorityFeatures = [
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
      name: 'Profile Visit Email Notification',
      values: ['Yes, customizable', 'Not available', 'Premium feature', 'Premium feature', 'Varies'],
      statuses: ['good', 'bad', 'warning', 'warning', 'warning']
    },
    {
      name: 'Click Email Notification',
      values: ['Yes, customizable', 'Not available', 'Premium feature', 'Premium feature', 'Varies'],
      statuses: ['good', 'bad', 'warning', 'warning', 'warning']
    },
    {
      name: 'Platform Hub',
      values: ['Single link for all profiles', 'Separate links', 'Yes', 'Yes', 'Varies'],
      statuses: ['good', 'bad', 'good', 'good', 'warning']
    },
    {
      name: 'Link Privacy',
      values: ['Public/Unlisted/Private', 'Not available', 'Limited', 'Limited', 'Varies'],
      statuses: ['good', 'bad', 'warning', 'warning', 'warning']
    },
    {
      name: 'Link Password Protection',
      values: ['Built-in', 'Not available', 'Premium feature', 'Premium feature', 'Varies'],
      statuses: ['good', 'bad', 'warning', 'warning', 'warning']
    }
  ];

  // Other features below
  const otherFeatures = [
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
      name: 'Analytics',
      values: ['Comprehensive dashboard with device/browser/OS/referrer analytics', 'Limited or premium', 'Premium feature', 'Premium feature', 'Varies'],
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
      name: 'Dark Mode',
      values: ['Full support with proper text contrast', 'Varies', 'Limited', 'Limited', 'Varies'],
      statuses: ['good', 'warning', 'warning', 'warning', 'warning']
    },
    {
      name: 'Mobile Responsive Design',
      values: ['Fully optimized with responsive text sizing', 'Varies', 'Yes', 'Yes', 'Varies'],
      statuses: ['good', 'warning', 'good', 'good', 'warning']
    },
    {
      name: 'Advanced Analytics',
      values: ['Device/Browser/OS/Referrer analytics with multiple chart types', 'Basic click tracking', 'Premium feature', 'Premium feature', 'Varies'],
      statuses: ['good', 'warning', 'warning', 'warning', 'warning']
    },
    {
      name: 'Security Features',
      values: ['JWT auth, bcrypt, HTTPS, Helmet.js, password-protected links', 'Basic', 'Standard', 'Standard', 'Varies'],
      statuses: ['good', 'warning', 'warning', 'warning', 'warning']
    }
  ];

  const features = [...priorityFeatures, ...otherFeatures];

  // Calculate column widths based on content
  const calculateColumnWidths = useCallback((screenWidth) => {
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;

    // Estimate character width based on font size (optimized for mobile)
    // Mobile: text-[10px] ≈ 5px per char, text-[11px] ≈ 5.5px per char
    // Desktop: text-sm (14px) ≈ 8px per char
    const getTextWidth = (text, isMobile, isHeader = false) => {
      const charWidth = isMobile ? (isHeader ? 5 : 4.5) : (isHeader ? 7.5 : 7);
      const padding = isMobile ? 12 : 32; // Reduced padding on mobile
      const iconWidth = isHeader ? 0 : (isMobile ? 16 : 22); // Smaller icon on mobile
      const extraSpace = isHeader ? 0 : 2; // Minimal extra space
      return Math.max(text.length * charWidth + padding + iconWidth + extraSpace, isMobile ? 80 : 120);
    };

    // Find longest feature name
    const longestFeatureName = features.reduce((max, f) => 
      f.name.length > max ? f.name.length : max, 0
    );

    // Find longest value in each product column (considering both header and content)
    const longestValues = products.map((_, colIdx) => {
      const longestContent = features.reduce((max, f) => {
        const valueLength = f.values[colIdx]?.length || 0;
        return valueLength > max ? valueLength : max;
      }, 0);
      // Compare with product name length
      return Math.max(longestContent, products[colIdx].name.length);
    });

    // Calculate base widths
    const featureColWidth = getTextWidth(' '.repeat(longestFeatureName), isMobile, true);
    
    const productColWidths = longestValues.map((longest, idx) => {
      // Calculate width for both header and content, take the larger
      const headerWidth = getTextWidth(products[idx].name, isMobile, true);
      const contentWidth = getTextWidth(' '.repeat(longest), isMobile, false);
      return Math.max(headerWidth, contentWidth);
    });

    // Apply responsive multipliers (optimized for mobile)
    let multiplier = 1;
    if (isMobile) {
      multiplier = 0.85; // More compact on mobile to fit more content
    } else if (isTablet) {
      multiplier = 1.0; // Base size on tablet
    } else {
      multiplier = 1.1; // Slight increase on desktop (keep as is)
    }

    // Set minimum widths per breakpoint (more compact on mobile)
    const minFeatureWidth = isMobile ? 90 : isTablet ? 140 : 160;
    const minProductWidth = isMobile ? 85 : isTablet ? 130 : 150;

    return [
      Math.max(featureColWidth * multiplier, minFeatureWidth),
      ...productColWidths.map(w => Math.max(w * multiplier, minProductWidth))
    ];
  }, [features, products]);

  // Detect mobile screen size and calculate column widths
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      if (isMobile !== mobile) setIsMobile(mobile);
      const calculatedWidths = calculateColumnWidths(width);
      // Only update if widths actually changed
      if (JSON.stringify(columnWidths) !== JSON.stringify(calculatedWidths)) {
        setColumnWidths(calculatedWidths);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [calculateColumnWidths, isMobile, columnWidths]);

  const getIcon = (status, mobile = false) => {
    const iconSize = mobile ? 'w-3 h-3' : 'w-4 h-4 sm:w-5 sm:h-5';
    switch (status) {
      case 'good':
        return <FaCheck className={`${iconSize} text-green-500 flex-shrink-0`} />;
      case 'bad':
        return <FaTimes className={`${iconSize} text-red-500 flex-shrink-0`} />;
      case 'warning':
        return <FaExclamationCircle className={`${iconSize} text-amber-500 flex-shrink-0`} />;
      default:
        return null;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'bad':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  const handleMouseDown = (e, colIndex) => {
    // Only allow resizing on desktop
    if (isMobile) return;
    e.preventDefault();
    setIsDragging(colIndex);
    startXRef.current = e.clientX;
    startWidthRef.current = columnWidths[colIndex];
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging !== null) {
      const diff = e.clientX - startXRef.current;
      const newWidth = Math.max(120, startWidthRef.current + diff);
      setColumnWidths(prev => {
        const newWidths = [...prev];
        newWidths[isDragging] = newWidth;
        return newWidths;
      });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 px-3 sm:py-6 md:py-8 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-2">
            🆚 LinkBridger vs. Competitors
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 px-2">
            Complete feature comparison at a glance
          </p>
          {!isMobile && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">
              💡 Drag column edges to resize
            </p>
          )}
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Table Header */}
            <div className="flex border-b-2 border-gray-200 dark:border-gray-700">
              <div 
                className={`bg-gray-50 dark:bg-gray-900 font-bold text-gray-700 dark:text-gray-300 flex-shrink-0 relative flex items-center ${
                  isMobile 
                    ? 'p-1.5 sm:p-2 text-[10px] sm:text-[11px]' 
                    : 'p-4 text-sm'
                }`}
                style={{ 
                  width: `${columnWidths[0]}px`,
                  minWidth: `${columnWidths[0]}px`,
                  maxWidth: `${columnWidths[0]}px`,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                <span className="whitespace-normal break-words word-break break-all">Feature</span>
                {!isMobile && (
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors group"
                    onMouseDown={(e) => handleMouseDown(e, 0)}
                  >
                    <FaEllipsisV className="w-4 h-4 text-gray-400 group-hover:text-blue-500 absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2" />
                  </div>
                )}
              </div>
              {products.map((product, idx) => (
                <div
                  key={idx}
                  className={`text-center font-bold transition-all duration-300 flex-shrink-0 relative flex items-center justify-center ${
                    product.highlight
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                  } ${
                    isMobile 
                      ? 'p-1.5 sm:p-2 text-[10px] sm:text-[11px]' 
                      : 'p-4 text-sm'
                  }`}
                  style={{ 
                    width: `${columnWidths[idx + 1]}px`,
                    minWidth: `${columnWidths[idx + 1]}px`,
                    maxWidth: `${columnWidths[idx + 1]}px`,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  <span className="whitespace-normal break-words word-break break-all text-center">{product.name}</span>
                  {!isMobile && (
                    <div
                      className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors group"
                      onMouseDown={(e) => handleMouseDown(e, idx + 1)}
                    >
                      <FaEllipsisV className={`w-4 h-4 ${product.highlight ? 'text-white/50 group-hover:text-white' : 'text-gray-400 group-hover:text-blue-500'} absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2`} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {features.map((feature, rowIdx) => (
                <div
                  key={rowIdx}
                  onMouseEnter={() => !isMobile && setHoveredRow(rowIdx)}
                  onMouseLeave={() => !isMobile && setHoveredRow(null)}
                  className={`flex transition-all duration-300 ${
                    hoveredRow === rowIdx && !isMobile
                      ? 'bg-blue-50 dark:bg-blue-900/10 shadow-lg scale-[1.01]'
                      : ''
                  }`}
                >
                  {/* Feature Name */}
                  <div 
                    className={`font-semibold text-gray-800 dark:text-gray-200 flex items-start border-r border-gray-200 dark:border-gray-700 flex-shrink-0 ${
                      isMobile 
                        ? 'p-1.5 sm:p-2 text-[10px] sm:text-[11px] leading-tight' 
                        : 'p-4 text-sm'
                    }`}
                    style={{ 
                      width: `${columnWidths[0]}px`,
                      minWidth: `${columnWidths[0]}px`,
                      maxWidth: `${columnWidths[0]}px`,
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  >
                    <span className="break-words whitespace-normal word-break break-all">{feature.name}</span>
                  </div>

                  {/* Feature Values */}
                  {feature.values.map((value, colIdx) => (
                    <div
                      key={colIdx}
                      className={`transition-all duration-300 flex-shrink-0 flex items-start ${
                        products[colIdx].highlight
                          ? 'bg-blue-50/50 dark:bg-blue-900/20 border-r-2 border-l-2 border-blue-200 dark:border-blue-700'
                          : ''
                      } ${getStatusBg(feature.statuses[colIdx])} ${
                        isMobile 
                          ? 'p-1.5 sm:p-2' 
                          : 'p-4'
                      }`}
                      style={{ 
                        width: `${columnWidths[colIdx + 1]}px`,
                        minWidth: `${columnWidths[colIdx + 1]}px`,
                        maxWidth: `${columnWidths[colIdx + 1]}px`,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      <div className={`flex items-start w-full ${isMobile ? 'gap-1' : 'gap-1.5 sm:gap-2'}`}>
                        <div className={`flex-shrink-0 ${isMobile ? 'mt-0' : 'mt-0.5'}`}>
                          {getIcon(feature.statuses[colIdx], isMobile)}
                        </div>
                        <span className={`text-gray-700 dark:text-gray-300 break-words whitespace-normal word-break break-all flex-1 ${
                          isMobile 
                            ? 'text-[10px] sm:text-[11px] leading-tight' 
                            : 'text-sm leading-relaxed'
                        }`}>
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-center p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] sm:hover:scale-[1.02]">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Ready to get started?
          </h3>
          <p className="text-sm sm:text-base text-blue-100 mb-3 sm:mb-4 px-2">
            Join thousands using LinkBridger for their professional links
          </p>
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base">
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;