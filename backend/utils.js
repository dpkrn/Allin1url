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

module.exports = { hashData, unhashData, getUserLinkUrl,clientUrl,serverUrl };
