# Deploying SSL Certificate on EC2

## Quick Steps

### 1. Transfer the Script to EC2

**Option A: Using SCP (from your local machine)**
```bash
# From your local machine
scp generate-cert.sh ec2-user@your-ec2-ip:/home/ec2-user/
# Or if using a key file:
scp -i your-key.pem generate-cert.sh ec2-user@your-ec2-ip:/home/ec2-user/
```

**Option B: Using Git (if you have a repo)**
```bash
# On EC2
cd /path/to/your/project
git pull
```

**Option C: Copy-paste the script**
```bash
# On EC2, create the file
nano generate-cert.sh
# Then copy-paste the entire script content
```

### 2. Make the Script Executable

```bash
# On EC2
chmod +x generate-cert.sh
```

### 3. Edit the Email Address

```bash
# On EC2
nano generate-cert.sh
# Find the line: EMAIL="your-email@example.com"
# Change it to your actual email address
```

### 4. Run the Script

```bash
# On EC2, navigate to where the script is
cd /path/to/your/project

# Run the script (generates wildcard certificate by default)
sudo ./generate-cert.sh
```

### 5. Follow the Prompts

The script will:
1. Check if certbot is installed (install if needed)
2. Stop nginx temporarily
3. Prompt you to add a DNS TXT record
4. Wait for you to add the TXT record in your DNS provider
5. Generate the certificate
6. Restart nginx

## Important Notes

- **Run with sudo**: The script needs root privileges to access `/etc/letsencrypt/`
- **DNS TXT Record**: You'll need to add a TXT record in your DNS provider (Namecheap, GoDaddy, etc.)
- **Wait for DNS Propagation**: After adding the TXT record, wait 1-5 minutes before pressing Enter
- **Certificate Location**: The certificate will be stored at `/etc/letsencrypt/live/allin1url.in/`

## Verification After Running

```bash
# Check certificate exists
sudo ls -la /etc/letsencrypt/live/allin1url.in/

# Verify it's a wildcard certificate
sudo openssl x509 -in /etc/letsencrypt/live/allin1url.in/fullchain.pem -text -noout | grep "*.allin1url.in"

# Test nginx configuration
docker exec nginx nginx -t

# Reload nginx (if needed)
docker exec nginx nginx -s reload

# Test subdomain SSL
curl -I https://dpkrn.allin1url.in
```

## Troubleshooting

### If script fails with "permission denied"
```bash
sudo chmod +x generate-cert.sh
sudo ./generate-cert.sh
```

### If nginx container is not found
```bash
# Check if using docker-compose
docker-compose ps

# Or check docker containers
docker ps | grep nginx
```

### If ports 80/443 are not accessible
- Check EC2 Security Group: Ensure ports 80 and 443 are open
- Check if nginx is running: `docker ps` or `docker-compose ps`

### If DNS TXT record doesn't work
```bash
# Check DNS propagation
dig _acme-challenge.allin1url.in TXT +short

# Try different DNS server
dig @8.8.8.8 _acme-challenge.allin1url.in TXT
```

## Alternative: Run Commands Directly on EC2

If you prefer to run commands directly without the script:

```bash
# On EC2
sudo certbot certonly --manual \
    --preferred-challenges dns \
    --agree-tos \
    --email your-email@example.com \
    -d "*.allin1url.in" \
    -d "allin1url.in" \
    --server https://acme-v02.api.letsencrypt.org/directory
```

Then follow the prompts to add the DNS TXT record.

