# Environment Variables Setup

## Frontend Environment Variables

In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

## Required Variables

### For Production (EC2):

```bash
# In your .env file or environment
VITE_TIER=prod
VITE_API_URL=https://allin1url.in
```

### For Development (Local):

```bash
# In your .env file or environment
VITE_TIER=dev
VITE_API_URL=http://localhost:8080
```

## How to Set on EC2

### Option 1: Environment File

Create or update `.env` file in the frontend directory:

```bash
cd frontend
echo "VITE_TIER=prod" >> .env
echo "VITE_API_URL=https://allin1url.in" >> .env
```

### Option 2: Docker Environment

If using Docker, add to `docker-compose.yml`:

```yaml
frontend:
  environment:
    - VITE_TIER=prod
    - VITE_API_URL=https://allin1url.in
```

### Option 3: Build-time Variables

Set during build:

```bash
VITE_TIER=prod VITE_API_URL=https://allin1url.in npm run build
```

## Verification

After setting variables, rebuild the frontend:

```bash
cd frontend
npm run build
```

The build will include the environment variables.

## How It Works

The `isProduction()` function in `utils.js` checks:
1. `VITE_TIER` environment variable first (explicit override)
2. `import.meta.env.PROD` (Vite's production flag)
3. `VITE_API_URL` containing 'allin1url.in'
4. Current hostname containing 'allin1url.in'

## Important Notes

- ⚠️ **Environment variables must be set BEFORE building**
- ⚠️ **Variables must be prefixed with `VITE_`**
- ⚠️ **After changing env vars, rebuild the frontend**
- ⚠️ **Runtime environment variables won't work - they're baked into the build**

## Quick Fix for EC2

```bash
# On EC2, in the frontend directory
echo "VITE_TIER=prod" > .env
echo "VITE_API_URL=https://allin1url.in" >> .env

# Rebuild
npm run build

# Restart frontend container
docker-compose restart frontend
```

