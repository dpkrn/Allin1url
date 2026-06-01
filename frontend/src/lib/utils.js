import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { tier, serverUrl, clientUrl } from "../utils/urlConfig";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Check if we're in production environment
 * @returns {boolean} True if production, false if development
 */
function isProduction() {
  return tier === 'prod';
}

/**
 * Get the base domain and port for subdomain URLs
 * @returns {object} Object with domain and port
 */
function getSubdomainConfig() {
  if (isProduction()) {
    return {
      domain: 'allin1url.in',
      protocol: 'https',
      port: '' // No port in production
    };
  }

  // Development: Use localhost format
  return {
    domain: 'localhost',
    protocol: 'http',
    port: ':8080' // Default development port
  };
}

/**
 * Generate user link URL in subdomain format for both dev and prod
 * @param {string} username - User's username
 * @param {string} source - Optional source/platform name
 * @returns {string} Full URL (e.g., https://username.allin1url.in or http://username.localhost:8080)
 */
export function getUserLinkUrl(username, source = null) {
  if (!username) return '';
  
  const config = getSubdomainConfig();
  const baseUrl = `${config.protocol}://${username}.${config.domain}${config.port}`;
  return source ? `${baseUrl}/${source}` : baseUrl;
}

/**
 * Get the base URL for the application (main domain, not subdomain)
 * @returns {string} Base URL (production: https://allin1url.in, dev: http://localhost:8080)
 */
function getBaseUrl() {
  return serverUrl();
}

/**
 * Generate user link URL in legacy format (for backward compatibility or main domain)
 * @param {string} username - User's username
 * @param {string} source - Optional source/platform name
 * @returns {string} Full URL (e.g., https://allin1url.in/username or https://allin1url.in/username/source)
 */
export function getUserLinkUrlLegacy(username, source = null) {
  if (!username) return '';
  
  const baseUrl = getBaseUrl();
  return source ? `${baseUrl}/${username}/${source}` : `${baseUrl}/${username}`;
}
