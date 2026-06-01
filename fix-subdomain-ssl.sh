#!/bin/bash

# Quick script to fix SSL for subdomains
# This script helps diagnose and fix SSL certificate issues for wildcard subdomains

echo "=========================================="
echo "Subdomain SSL Certificate Fix Script"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script needs sudo privileges. Please run with sudo."
    exit 1
fi

# Step 1: Check existing certificates
echo "Step 1: Checking existing certificates..."
echo "----------------------------------------"
sudo certbot certificates
echo ""

# Step 2: Check if current cert includes wildcard
echo "Step 2: Checking if certificate includes wildcard..."
echo "----------------------------------------"
CERT_PATH="/etc/letsencrypt/live/allin1url.in/fullchain.pem"

if [ -f "$CERT_PATH" ]; then
    echo "Checking certificate at: $CERT_PATH"
    WILDCARD_CHECK=$(sudo openssl x509 -in "$CERT_PATH" -text -noout 2>/dev/null | grep -o "*.allin1url.in" || echo "")
    
    if [ -n "$WILDCARD_CHECK" ]; then
        echo "✅ Certificate includes wildcard (*.allin1url.in)"
    else
        echo "❌ Certificate does NOT include wildcard"
        echo "   Current certificate only covers:"
        sudo openssl x509 -in "$CERT_PATH" -text -noout 2>/dev/null | grep -A 1 "Subject Alternative Name" || echo "   (Could not read certificate)"
        echo ""
        echo "⚠️  You need to generate a wildcard certificate!"
        echo ""
        read -p "Do you want to generate a wildcard certificate now? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "Generating wildcard certificate..."
            echo "You will need to add a DNS TXT record when prompted."
            echo ""
            read -p "Enter your email address: " EMAIL
            
            # Stop nginx
            echo "Stopping nginx..."
            docker-compose stop nginx 2>/dev/null || systemctl stop nginx 2>/dev/null || true
            
            # Generate wildcard certificate
            sudo certbot certonly --manual \
                --preferred-challenges dns \
                --agree-tos \
                --email "$EMAIL" \
                -d "*.allin1url.in" \
                -d "allin1url.in" \
                --server https://acme-v02.api.letsencrypt.org/directory
            
            # Restart nginx
            echo "Restarting nginx..."
            docker-compose up -d nginx 2>/dev/null || systemctl start nginx 2>/dev/null || true
            
            echo ""
            echo "✅ Wildcard certificate generated!"
        else
            echo "Skipping certificate generation."
        fi
    fi
else
    echo "❌ Certificate not found at: $CERT_PATH"
    echo "   You need to generate a certificate first."
    echo "   Run: ./generate-cert.sh --wildcard"
fi
echo ""

# Step 3: Check certificate locations
echo "Step 3: Available certificate locations..."
echo "----------------------------------------"
sudo ls -la /etc/letsencrypt/live/ 2>/dev/null || echo "No certificates found"
echo ""

# Step 4: Check nginx configuration
echo "Step 4: Checking nginx SSL configuration..."
echo "----------------------------------------"
if [ -f "nginx/nginx.conf" ]; then
    echo "Checking nginx.conf for SSL certificate paths..."
    grep -A 2 "server_name \*\.clickly\.cv" nginx/nginx.conf | grep "ssl_certificate" || echo "Could not find subdomain SSL config"
else
    echo "⚠️  nginx.conf not found in current directory"
fi
echo ""

# Step 5: Test SSL connection
echo "Step 5: Testing SSL connections..."
echo "----------------------------------------"
echo "Testing main domain (allin1url.in)..."
curl -I https://allin1url.in 2>&1 | head -5 || echo "Failed to connect"
echo ""
echo "Testing subdomain (dpkrn.allin1url.in)..."
curl -I https://dpkrn.allin1url.in 2>&1 | head -5 || echo "Failed to connect"
echo ""

# Step 6: Check DNS
echo "Step 6: Checking DNS configuration..."
echo "----------------------------------------"
echo "Checking wildcard A record..."
dig *.allin1url.in +short || echo "DNS query failed"
echo ""

# Summary
echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "If subdomain SSL is still not working:"
echo "1. Verify wildcard certificate was generated: sudo certbot certificates"
echo "2. Check certificate includes wildcard: sudo openssl x509 -in /etc/letsencrypt/live/allin1url.in/fullchain.pem -text | grep '*.allin1url.in'"
echo "3. Update nginx.conf if certificate is in different location"
echo "4. Reload nginx: docker exec nginx nginx -s reload"
echo "5. Check DNS: dig *.allin1url.in"
echo ""
echo "For detailed instructions, see: TROUBLESHOOTING_SSL.md"
echo ""

