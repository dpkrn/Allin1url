
const detectTier = () => {
  // Check Vite environment variable first (highest priority)
  if (import.meta.env?.VITE_TIER) {
    return import.meta.env.VITE_TIER;
  }

  // Check if running on localhost (development)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
      return 'dev';
    }

    // Check if running on production domain
    if (hostname.includes('allin1url.in')) {
      return 'prod';
    }
  }

  // Check import.meta.env.PROD (Vite's production flag)
  if (import.meta.env?.PROD) {
    return 'prod';
  }

  // Default to production
  return 'prod';
};

// Global tier variable - can be used anywhere in the app
export const tier = detectTier();

// Make tier globally available on window object for easy access
if (typeof window !== 'undefined') {
  window.tier = tier;
  // Debug log to show detected tier (remove in production)
  console.log('🌍 Detected tier:', tier);
}

export const serverUrl=(tierOverride)=>{
    const currentTier = tierOverride || tier;
    if(currentTier=='dev'){
        return "http://localhost:8080"
    }
    return "https://api.allin1url.in"
}

export const clientUrl=(tierOverride)=>{
    const currentTier = tierOverride || tier;
    if(currentTier=='dev'){
      return "http://localhost:5173"
    }
    return "https://allin1url.in/"
  }

// Utility function to check if we're in development
export const isDevelopment = () => tier === 'dev';

// Utility function to check if we're in production
export const isProduction = () => tier === 'prod';
