const crypto = require('crypto');

const hashData = (data) => {
  const algorithm = 'aes-256-cbc';
  const secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key-change-in-production-32chars!!';
  const key = crypto.scryptSync(secretKey, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};
  
  // Helper function to unhash/decrypt username and source
const unhashData = (hashedData) => {
  try {
    const algorithm = 'aes-256-cbc';
    const secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key-change-in-production-32chars!!';
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const parts = hashedData.split(':');
    if (parts.length !== 2) return null;
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    return null;
  }
};

const clientUrl=(tier)=>{
  if(tier==='dev'){
    return "http://localhost:5173/app"
  }
  return "https://clickly.cv/app"
}


const serverUrl=(tier)=>{
  if(tier==='dev'){
      return "http://localhost:8080"
  }
  return "https://clickly.cv"
}

const getUserLinkUrl = (username, source = null) => {
  if (!username) return '';

  // Check if we're explicitly in development mode
  // Default to production if not explicitly dev (safer for production)
  const isDev = process.env.TIER === 'dev';

  if (isDev) {
    // Development: Use localhost subdomain format
    const port = process.env.PORT || '8080';
    const baseUrl = `http://${username}.localhost:${port}`;
    return source ? `${baseUrl}/${source}` : baseUrl;
  } else {
    // Production: Use subdomain format (default)
    const baseUrl = `https://${username}.clickly.cv`;
    return source ? `${baseUrl}/${source}` : baseUrl;
  }
};

// Shared JavaScript code for all templates (image error handling and favicon creation)
// themeColors: { bgColor: string, textColor: string }
const getTemplateScripts = (themeColors = {}) => {
  const {
    bgColor = 'rgba(26, 26, 46, 0.8)',
    textColor = '#9333ea'
  } = themeColors;

  // Escape single quotes and backslashes for safe embedding in single-quoted JavaScript strings
  const escapeForJS = (str) => {
    return str.replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'");
  };

  const escapedBgColor = escapeForJS(bgColor);
  const escapedTextColor = escapeForJS(textColor);

  return '<script>\n' +
    '        (function() {\n' +
    '            \'use strict\';\n' +
    '            window.handleImageError = function(img, initial) {\n' +
    '                if (img.onerror) img.onerror = null;\n' +
    '                const svg = encodeURIComponent(\'<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><circle cx="80" cy="80" r="80" fill="' + escapedBgColor + '"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="70" fill="' + escapedTextColor + '" font-weight="bold">\' + initial + \'</text></svg>\');\n' +
    '                img.src = \'data:image/svg+xml,\' + svg;\n' +
    '            };\n' +
    '\n' +
    '            function createCircularFavicon(imageUrl) {\n' +
    '                if (!imageUrl || imageUrl === \'\' || imageUrl.includes(\'data:\')) {\n' +
    '                    return;\n' +
    '                }\n' +
    '                const img = new Image();\n' +
    '                img.crossOrigin = \'anonymous\';\n' +
    '                img.onload = function() {\n' +
    '                    try {\n' +
    '                        const canvas = document.createElement(\'canvas\');\n' +
    '                        const size = 32;\n' +
    '                        canvas.width = size;\n' +
    '                        canvas.height = size;\n' +
    '                        const ctx = canvas.getContext(\'2d\');\n' +
    '                        ctx.beginPath();\n' +
    '                        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);\n' +
    '                        ctx.clip();\n' +
    '                        const imgSize = Math.min(img.width, img.height);\n' +
    '                        const sx = (img.width - imgSize) / 2;\n' +
    '                        const sy = (img.height - imgSize) / 2;\n' +
    '                        ctx.drawImage(img, sx, sy, imgSize, imgSize, 0, 0, size, size);\n' +
    '                        const dataUrl = canvas.toDataURL(\'image/png\');\n' +
    '                        const favicon = document.getElementById(\'dynamic-favicon\');\n' +
    '                        if (favicon) {\n' +
    '                            favicon.href = dataUrl;\n' +
    '                        } else {\n' +
    '                            const link = document.createElement(\'link\');\n' +
    '                            link.id = \'dynamic-favicon\';\n' +
    '                            link.rel = \'icon\';\n' +
    '                            link.type = \'image/png\';\n' +
    '                            link.href = dataUrl;\n' +
    '                            document.head.appendChild(link);\n' +
    '                        }\n' +
    '                    } catch (e) {\n' +
    '                        console.log(\'Error creating circular favicon:\', e);\n' +
    '                    }\n' +
    '                };\n' +
    '                img.onerror = function() {\n' +
    '                    if (img.crossOrigin === \'anonymous\') {\n' +
    '                        const img2 = new Image();\n' +
    '                        img2.onload = img.onload;\n' +
    '                        img2.onerror = function() {};\n' +
    '                        img2.src = imageUrl;\n' +
    '                    }\n' +
    '                };\n' +
    '                img.src = imageUrl;\n' +
    '            }\n' +
    '\n' +
    '            window.addEventListener(\'load\', () => {\n' +
    '                const profilePic = document.querySelector(\'.profile-pic\');\n' +
    '                if (profilePic && profilePic.src && profilePic.src !== window.location.href) {\n' +
    '                    createCircularFavicon(profilePic.src);\n' +
    '                }\n' +
    '            });\n' +
    '        })();\n' +
    '    </script>';
};

// Helper function that returns only the createCircularFavicon function code (for templates with custom handleImageError)
const getFaviconScript = () => {
  return `
            function createCircularFavicon(imageUrl) {
                if (!imageUrl || imageUrl === '' || imageUrl.includes('data:')) {
                    return;
                }
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = function() {
                    try {
                        const canvas = document.createElement('canvas');
                        const size = 32;
                        canvas.width = size;
                        canvas.height = size;
                        const ctx = canvas.getContext('2d');
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
                        ctx.clip();
                        const imgSize = Math.min(img.width, img.height);
                        const sx = (img.width - imgSize) / 2;
                        const sy = (img.height - imgSize) / 2;
                        ctx.drawImage(img, sx, sy, imgSize, imgSize, 0, 0, size, size);
                        const dataUrl = canvas.toDataURL('image/png');
                        const favicon = document.getElementById('dynamic-favicon');
                        if (favicon) {
                            favicon.href = dataUrl;
                        } else {
                            const link = document.createElement('link');
                            link.id = 'dynamic-favicon';
                            link.rel = 'icon';
                            link.type = 'image/png';
                            link.href = dataUrl;
                            document.head.appendChild(link);
                        }
                    } catch (e) {
                        console.log('Error creating circular favicon:', e);
                    }
                };
                img.onerror = function() {
                    if (img.crossOrigin === 'anonymous') {
                        const img2 = new Image();
                        img2.onload = img.onload;
                        img2.onerror = function() {};
                        img2.src = imageUrl;
                    }
                };
                img.src = imageUrl;
            }

            window.addEventListener('load', () => {
                const profilePic = document.querySelector('.profile-pic');
                if (profilePic && profilePic.src && profilePic.src !== window.location.href) {
                    createCircularFavicon(profilePic.src);
                }
            });`;
};

module.exports = { hashData, unhashData, getUserLinkUrl, clientUrl, serverUrl, getTemplateScripts, getFaviconScript };
