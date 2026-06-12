
const detectTier = () => {
  // Hostname wins over env — avoids VITE_TIER=dev breaking production OAuth
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
      return 'dev';
    }
    if (hostname.includes('allin1url.in')) {
      return 'prod';
    }
  }

  if (import.meta.env?.VITE_TIER) {
    return import.meta.env.VITE_TIER;
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
    return "https://allin1url.in"
  }

// Utility function to check if we're in development
export const isDevelopment = () => tier === 'dev';

// Utility function to check if we're in production
export const isProduction = () => tier === 'prod';

/** URL-safe base64 OAuth state (avoids +/= breaking in query strings) */
export const encodeOAuthState = (data) => {
  const json = JSON.stringify(data);
  const base64 = btoa(json);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const buildGoogleOAuthUrl = (stateData) => {
  const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('Google sign-in is not configured');
  }

  const redirectUri = `${serverUrl()}/auth/google`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state: encodeOAuthState({
      ...stateData,
      redirectUri,
    }),
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};
