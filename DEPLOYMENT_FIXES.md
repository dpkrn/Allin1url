# EC2 Deployment Issues - Fixed

## Issues Found:

### 1. **Nginx Location Block Order** ❌
  
   - **Problem**: The `location /` block was catching all requests, including `/app`, before the more specific `/app` location could be matched.
  
   - **Fix**: Reordered location blocks so `/app` comes first with `^~` prefix, and backend routes are more specific.

### 2. **API Base URL Configuration** ❌
   - **Problem**: `VITE_API_URL` was set to `http://backend:8080` (internal Docker network), but browser requests need the public URL.
   - **Fix**: Changed to `https://allin1url.in` in docker-compose.yml and updated api.js to use environment variable with fallback.

### 3. **Vite Dev Server Proxy Configuration** ⚠️
   - **Problem**: Vite dev server needs proper proxy headers for HMR (Hot Module Replacement).
   - **Fix**: Added proper proxy headers including Upgrade and Connection for WebSocket support.

## Changes Made:

### nginx/nginx.conf
- Reordered location blocks: `/app` first, then specific backend routes
- Added Vite HMR support with proper timeout settings
- Added specific regex patterns for username routes
- Root path now redirects to `/app/`

### frontend/src/utils/api.js
- Now uses `import.meta.env.VITE_API_URL` with fallback
- Added `withCredentials: true` for cookie support

### docker-compose.yml
- Changed `VITE_API_URL` from `http://backend:8080` to `https://allin1url.in`

## Deployment Steps on EC2:

1. **Pull the latest changes:**
   ```bash
   git pull
   ```

2. **Restart Docker containers:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

3. **Check nginx logs if issues persist:**
   ```bash
   docker logs nginx
   docker logs frontend
   docker logs backend
   ```

4. **Verify SSL certificates exist:**
   ```bash
   sudo ls -la /etc/letsencrypt/live/allin1url.in/
   ```

5. **If certificates don't exist, generate them:**
   ```bash
   ./generate-cert.sh
   ```

## Testing:

1. **Frontend should be accessible at:**
   - `https://allin1url.in/app/`
   - `https://www.allin1url.in/app/`

2. **Backend API should work at:**
   - `https://allin1url.in/auth/...`
   - `https://allin1url.in/source/...`

3. **User profiles should work at:**
   - `https://allin1url.in/username`
   - `https://allin1url.in/username/source`

## Troubleshooting:

If frontend still not accessible:

1. **Check if frontend container is running:**
   ```bash
   docker ps | grep frontend
   ```

2. **Check frontend logs:**
   ```bash
   docker logs frontend
   ```

3. **Test nginx configuration:**
   ```bash
   docker exec nginx nginx -t
   ```

4. **Check if port 443 is open in EC2 security group**

5. **Verify DNS is pointing to EC2 IP:**
   ```bash
   dig allin1url.in
   ```

