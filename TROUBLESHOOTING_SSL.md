# Troubleshooting SSL for Subdomains

## Problem: "Unsecure" or SSL Warning for Subdomains

If you're seeing SSL warnings for subdomains like `https://dpkrn.allin1url.in/`, it means your SSL certificate doesn't cover wildcard subdomains.

## Quick Fix: Generate Wildcard SSL Certificate

### Step 1: Check Current Certificate

```bash
# Check what certificates you have
sudo certbot certificates

# Check if certificate includes wildcard
sudo openssl x509 -in /etc/letsencrypt/live/allin1url.in/fullchain.pem -text -noout | grep -A 1 "Subject Alternative Name"
```

If you see `DNS:*.allin1url.in` in the output, you have a wildcard cert. If not, you need to generate one.

### Step 2: Generate Wildcard Certificate

**Option A: Using the Script (Recommended)**

```bash
cd /path/to/LinkBridger
chmod +x generate-cert.sh

# Edit the script to set your email
nano generate-cert.sh  # Change EMAIL variable

# Generate wildcard certificate
./generate-cert.sh --wildcard
```

**Option B: Manual Generation**

```bash
# Stop nginx temporarily
docker-compose stop nginx

# Generate wildcard certificate
sudo certbot certonly --manual \
    --preferred-challenges dns \
    --agree-tos \
    --email your-email@example.com \
    -d "*.allin1url.in" \
    -d "allin1url.in" \
    --server https://acme-v02.api.letsencrypt.org/directory
```

### Step 3: Add DNS TXT Record

When certbot prompts you, it will show something like:

```
Please deploy a DNS TXT record under the name
_acme-challenge.allin1url.in with the following value:

[some-long-string-here]
```

**In Namecheap (or your DNS provider):**

1. Go to your domain's Advanced DNS settings
2. Add a new TXT record:
   - **Host**: `_acme-challenge`
   - **Value**: [paste the value from certbot]
   - **TTL**: Automatic (or 300)
3. Save changes

### Step 4: Verify DNS Propagation

```bash
# Check if TXT record is propagated
dig _acme-challenge.allin1url.in TXT +short

# Or use Google DNS
dig @8.8.8.8 _acme-challenge.allin1url.in TXT
```

Wait 1-5 minutes for DNS to propagate, then press Enter in the certbot terminal.

### Step 5: Find Certificate Location

After generation, find where certbot stored the certificate:

```bash
sudo ls -la /etc/letsencrypt/live/
```

Common locations:
- `/etc/letsencrypt/live/allin1url.in-0001/` (if you had a previous cert)
- `/etc/letsencrypt/live/allin1url.in/` (if this is the first wildcard cert)

### Step 6: Update Nginx Configuration

Update `nginx/nginx.conf` to use the correct certificate path:

```nginx
# For wildcard subdomain server block (around line 134)
ssl_certificate /etc/letsencrypt/live/allin1url.in/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/allin1url.in/privkey.pem;
ssl_trusted_certificate /etc/letsencrypt/live/allin1url.in/chain.pem;
```

If your certificate is in a different location (like `allin1url.in-0001`), update the paths accordingly.

### Step 7: Test and Reload Nginx

```bash
# Test nginx configuration
docker exec nginx nginx -t

# If test passes, reload nginx
docker exec nginx nginx -s reload

# Or restart the container
docker-compose restart nginx
```

### Step 8: Verify SSL Works

```bash
# Test main domain
curl -I https://allin1url.in

# Test subdomain
curl -I https://dpkrn.allin1url.in

# Check SSL certificate details
openssl s_client -connect dpkrn.allin1url.in:443 -servername dpkrn.allin1url.in < /dev/null 2>/dev/null | openssl x509 -noout -text | grep -A 1 "Subject Alternative Name"
```

You should see `DNS:*.allin1url.in` in the output.

## Alternative: Use Same Certificate for Both (If Wildcard Cert is in Same Location)

If your wildcard certificate is stored in the same location as your main domain certificate (`/etc/letsencrypt/live/allin1url.in/`), the nginx config should already work. Just make sure:

1. The certificate includes `*.allin1url.in` in Subject Alternative Names
2. Nginx is using the correct certificate path
3. Nginx has been reloaded after certificate generation

## Common Issues

### Issue: Certificate doesn't include wildcard

**Solution**: Generate a new wildcard certificate. The old certificate only covers `allin1url.in` and `www.allin1url.in`.

### Issue: DNS TXT record not propagating

**Solution**: 
- Wait longer (can take up to 10 minutes)
- Check with different DNS servers: `dig @8.8.8.8 _acme-challenge.allin1url.in TXT`
- Make sure the TXT record is added correctly (no extra spaces, correct host name)

### Issue: Nginx can't find certificate

**Solution**:
- Check certificate location: `sudo ls -la /etc/letsencrypt/live/`
- Update nginx.conf with correct path
- Check file permissions: `sudo ls -la /etc/letsencrypt/live/allin1url.in/`

### Issue: Certificate works for main domain but not subdomain

**Solution**:
- Verify wildcard cert was generated: `sudo openssl x509 -in /etc/letsencrypt/live/allin1url.in/fullchain.pem -text -noout | grep "*.allin1url.in"`
- Check nginx subdomain server block is using correct certificate
- Ensure DNS wildcard A record exists: `dig *.allin1url.in`

## Auto-Renewal for Wildcard Certificates

Wildcard certificates require DNS-01 challenge, so auto-renewal needs special setup:

```bash
# Test renewal
sudo certbot renew --dry-run

# For production, you may need a DNS plugin or manual renewal script
# See: https://certbot.eff.org/docs/using.html#dns-plugins
```

## Quick Verification Checklist

- [ ] Wildcard certificate generated: `sudo certbot certificates` shows `*.allin1url.in`
- [ ] Certificate includes wildcard: `openssl x509 -in /path/to/cert -text | grep "*.allin1url.in"`
- [ ] Nginx config updated with correct certificate path
- [ ] Nginx reloaded: `docker exec nginx nginx -s reload`
- [ ] DNS wildcard A record exists: `dig *.allin1url.in`
- [ ] Subdomain loads with HTTPS: `curl -I https://dpkrn.allin1url.in`
- [ ] No SSL warnings in browser

