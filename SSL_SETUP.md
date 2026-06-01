# SSL Certificate Setup for Custom Domains

This guide explains how to set up SSL certificates for your LinkBridger application with wildcard subdomain support.

## Prerequisites

- Domain `allin1url.in` pointing to your EC2 instance
- Wildcard A record (`*`) pointing to your EC2 instance IP
- Ports 80 and 443 open in your EC2 security group
- Docker and docker-compose installed

## SSL Certificate Options

### Option 1: Standard Certificate (Main Domain Only)

Covers: `allin1url.in` and `www.allin1url.in`

```bash
./generate-cert.sh
```

**Note:** This does NOT cover subdomains. Subdomains will show SSL warnings.

### Option 2: Wildcard Certificate (Recommended for Subdomains)

Covers: `*.allin1url.in` and `allin1url.in`

```bash
./generate-cert.sh --wildcard
```

**Requirements:**
- DNS-01 challenge (manual DNS verification)
- You'll need to add a TXT record to your DNS during certificate generation

## Step-by-Step: Wildcard Certificate Setup

### 1. Run the Certificate Generation Script

```bash
chmod +x generate-cert.sh
./generate-cert.sh --wildcard
```

### 2. Add DNS TXT Record

When certbot prompts you, it will ask you to add a TXT record:

```
Name: _acme-challenge.allin1url.in
Value: [provided by certbot]
TTL: 300 (or default)
```

**In Namecheap:**
1. Go to Advanced DNS
2. Add new TXT record
3. Host: `_acme-challenge`
4. Value: [paste the value from certbot]
5. TTL: Automatic (or 300)
6. Save changes

### 3. Wait for DNS Propagation

```bash
# Check if TXT record is propagated
dig _acme-challenge.allin1url.in TXT
```

Wait 1-5 minutes for DNS to propagate, then press Enter in the certbot prompt.

### 4. Verify Certificate

```bash
# Check certificate location
sudo ls -la /etc/letsencrypt/live/

# Test SSL connection
openssl s_client -connect allin1url.in:443 -servername allin1url.in

# Test subdomain
openssl s_client -connect dpkrn.allin1url.in:443 -servername dpkrn.allin1url.in
```

### 5. Update Nginx Configuration (if needed)

If your wildcard certificate is in a different location, update `nginx/nginx.conf`:

```nginx
# For subdomain server block
ssl_certificate /etc/letsencrypt/live/allin1url.in-0001/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/allin1url.in-0001/privkey.pem;
```

### 6. Reload Nginx

```bash
# Test configuration
docker exec nginx nginx -t

# Reload nginx
docker exec nginx nginx -s reload
```

## Auto-Renewal Setup

Let's Encrypt certificates expire every 90 days. Set up auto-renewal:

### 1. Test Renewal

```bash
sudo certbot renew --dry-run
```

### 2. Add Cron Job

```bash
sudo crontab -e
```

Add this line (runs twice daily, renews if within 30 days of expiration):

```
0 0,12 * * * certbot renew --quiet --deploy-hook "docker exec nginx nginx -s reload"
```

## Troubleshooting

### Certificate Not Found

```bash
# Check certificate location
sudo ls -la /etc/letsencrypt/live/

# List all certificates
sudo certbot certificates
```

### DNS Not Propagated

```bash
# Check TXT record
dig _acme-challenge.allin1url.in TXT +short

# Use different DNS server
dig @8.8.8.8 _acme-challenge.allin1url.in TXT
```

### Nginx SSL Errors

```bash
# Check nginx error logs
docker logs nginx

# Test nginx configuration
docker exec nginx nginx -t

# Check certificate permissions
sudo ls -la /etc/letsencrypt/live/allin1url.in/
```

### Subdomain SSL Not Working

1. Verify wildcard certificate includes `*.allin1url.in`:
   ```bash
   sudo openssl x509 -in /etc/letsencrypt/live/allin1url.in/fullchain.pem -text -noout | grep -A 1 "Subject Alternative Name"
   ```

2. Check nginx is using the correct certificate path

3. Ensure subdomain DNS is pointing to your server:
   ```bash
   dig dpkrn.allin1url.in
   ```

## Verification Checklist

- [ ] Main domain (`allin1url.in`) loads with HTTPS
- [ ] WWW domain (`www.allin1url.in`) redirects or loads with HTTPS
- [ ] Subdomain (`dpkrn.allin1url.in`) loads with HTTPS (no SSL warnings)
- [ ] Subdomain path (`dpkrn.allin1url.in/github`) works
- [ ] Certificate auto-renewal is configured
- [ ] Nginx configuration is tested and reloaded

## Additional Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot User Guide](https://certbot.eff.org/docs/)
- [Nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)

