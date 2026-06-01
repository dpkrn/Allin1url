#!/bin/bash

# Script to generate SSL certificates for allin1url.in
# 
# IMPORTANT: For subdomain routing (e.g., dpkrn.allin1url.in), you MUST use a wildcard certificate.
# This script generates a wildcard certificate by default to support all dynamic subdomains.
#
# Usage: 
#   ./generate-cert.sh              # Generate wildcard certificate (recommended for subdomains)
#   ./generate-cert.sh --standard    # Generate standard certificate (main domain only, no subdomains)

CERT_PATH="/etc/letsencrypt/live/allin1url.in/fullchain.pem"
WILDCERT_PATH="/etc/letsencrypt/live/allin1url.in-0001/fullchain.pem"
EMAIL="your-email@example.com"  # Change this to your email
USE_WILDCARD=true  # Default to wildcard for subdomain support

# Check for standard flag (non-wildcard)
if [[ "$1" == "--standard" ]]; then
    USE_WILDCARD=false
    echo "⚠️  WARNING: Standard certificate will NOT work for subdomains!"
    echo "   Subdomains like dpkrn.allin1url.in will show SSL warnings."
    echo "   Use wildcard certificate (default) for subdomain support."
    echo ""
    read -p "Continue with standard certificate? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted. Use ./generate-cert.sh (without --standard) for wildcard certificate."
        exit 0
    fi
fi

echo "=========================================="
echo "SSL Certificate Generation Script"
echo "=========================================="
echo ""

# Check if certificate already exists
if [ "$USE_WILDCARD" = true ]; then
    # Check multiple possible locations for wildcard cert
    EXISTING_CERT=""
    
    # Check allin1url.in-0001 first (most common for renewals)
    if [ -f "$WILDCERT_PATH" ]; then
        WILDCARD_CHECK=$(sudo openssl x509 -in "$WILDCERT_PATH" -text -noout 2>/dev/null | grep -o "*.allin1url.in" || echo "")
        if [ -n "$WILDCARD_CHECK" ]; then
            EXISTING_CERT="$WILDCERT_PATH"
        fi
    fi
    
    # Check main location
    if [ -z "$EXISTING_CERT" ] && [ -f "$CERT_PATH" ]; then
        WILDCARD_CHECK=$(sudo openssl x509 -in "$CERT_PATH" -text -noout 2>/dev/null | grep -o "*.allin1url.in" || echo "")
        if [ -n "$WILDCARD_CHECK" ]; then
            EXISTING_CERT="$CERT_PATH"
        fi
    fi
    
    # Check other possible locations
    if [ -z "$EXISTING_CERT" ] && [ -f "/etc/letsencrypt/live/allin1url.in-0002/fullchain.pem" ]; then
        WILDCARD_CHECK=$(sudo openssl x509 -in "/etc/letsencrypt/live/allin1url.in-0002/fullchain.pem" -text -noout 2>/dev/null | grep -o "*.allin1url.in" || echo "")
        if [ -n "$WILDCARD_CHECK" ]; then
            EXISTING_CERT="/etc/letsencrypt/live/allin1url.in-0002/fullchain.pem"
        fi
    fi
    
    if [ -n "$EXISTING_CERT" ]; then
        echo "✓ Wildcard certificate already exists at $EXISTING_CERT"
        echo "Certificate expires on: $(sudo openssl x509 -enddate -noout -in $EXISTING_CERT 2>/dev/null | cut -d= -f2)"
        echo ""
        echo "Certificate covers:"
        sudo openssl x509 -in "$EXISTING_CERT" -text -noout 2>/dev/null | grep -A 1 "Subject Alternative Name" || echo "  *.allin1url.in, allin1url.in"
        echo ""
        echo "✅ Your wildcard certificate is ready to use!"
        echo "   Certificate location: $EXISTING_CERT"
        echo ""
        echo "Next steps:"
        echo "  1. Verify nginx is using this certificate: ./verify-certificate.sh"
        echo "  2. Test nginx config: docker exec nginx nginx -t"
        echo "  3. Reload nginx: docker exec nginx nginx -s reload"
        echo "  4. Test SSL: curl -I https://dpkrn.allin1url.in"
        exit 0
    fi
else
    if [ -f "$CERT_PATH" ]; then
        echo "✓ Certificate already exists at $CERT_PATH"
        echo "Certificate expires on: $(openssl x509 -enddate -noout -in $CERT_PATH 2>/dev/null | cut -d= -f2)"
        echo ""
        echo "⚠️  Note: Standard certificate does NOT cover subdomains (*.allin1url.in)"
        echo "   Subdomains will show SSL warnings."
        echo "   Run without --standard flag to generate wildcard certificate."
        exit 0
    fi
fi

if [ "$USE_WILDCARD" = true ]; then
    echo "Generating WILDCARD certificate for subdomain support..."
else
    echo "Generating standard certificate (main domain only)..."
fi
echo ""

# Install certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
fi

# Stop nginx container temporarily to free up ports 80 and 443
echo "Stopping nginx container..."
cd "$(dirname "$0")"
docker-compose stop nginx 2>/dev/null || true

# Create necessary directories
sudo mkdir -p /var/www/certbot
sudo mkdir -p /etc/letsencrypt

if [ "$USE_WILDCARD" = true ]; then
    echo ""
    echo "=========================================="
    echo "Generating WILDCARD Certificate"
    echo "This will cover: *.allin1url.in and allin1url.in"
    echo "=========================================="
    echo ""
    echo "This certificate will work for ALL dynamic subdomains:"
    echo "  ✓ dpkrn.allin1url.in"
    echo "  ✓ username.allin1url.in (any username)"
    echo "  ✓ allin1url.in (main domain)"
    echo ""
    echo "This requires DNS-01 challenge (manual DNS verification)"
    echo ""
    echo "You will need to add a TXT record to your DNS:"
    echo "  Name: _acme-challenge"
    echo "  Value: (will be provided by certbot)"
    echo "  TTL: Automatic (or 300)"
    echo ""
    echo "DNS Provider Instructions:"
    echo "  - Namecheap: Advanced DNS → Add TXT Record"
    echo "  - GoDaddy: DNS Management → Add TXT Record"
    echo "  - Cloudflare: DNS → Add Record (Type: TXT)"
    echo ""
    read -p "Press Enter when ready to continue..."
    echo ""
    
    # Generate wildcard certificate using DNS-01 challenge
    echo "Starting certificate generation..."
    echo ""
    echo "⚠️  IMPORTANT: Certbot will prompt you to add a DNS TXT record."
    echo "   When it shows the TXT record value, you MUST:"
    echo "   1. Add it to your DNS provider (Namecheap, GoDaddy, etc.)"
    echo "   2. Host/Name should be: _acme-challenge (NOT _acme-challenge.allin1url.in)"
    echo "   3. Wait 2-5 minutes for DNS propagation"
    echo "   4. Verify with: dig _acme-challenge.allin1url.in TXT +short"
    echo "   5. Then press Enter in certbot"
    echo ""
    read -p "Press Enter to start certbot..."
    echo ""
    
    sudo certbot certonly --manual \
        --preferred-challenges dns \
        --agree-tos \
        --email "$EMAIL" \
        -d "*.allin1url.in" \
        -d "allin1url.in" \
        --server https://acme-v02.api.letsencrypt.org/directory
    
    # Check for wildcard cert in different possible locations
    # Certbot may store it in different locations depending on existing certs
    # Check allin1url.in-0001 first (common for renewals)
    if [ -f "/etc/letsencrypt/live/allin1url.in-0001/fullchain.pem" ]; then
        WILDCARD_CHECK=$(sudo openssl x509 -in "/etc/letsencrypt/live/allin1url.in-0001/fullchain.pem" -text -noout 2>/dev/null | grep -o "*.allin1url.in" || echo "")
        if [ -n "$WILDCARD_CHECK" ]; then
            CERT_PATH="/etc/letsencrypt/live/allin1url.in-0001/fullchain.pem"
        fi
    fi
    
    # Check main location
    if [ -f "/etc/letsencrypt/live/allin1url.in/fullchain.pem" ] && [ -z "$CERT_PATH" ]; then
        WILDCARD_CHECK=$(sudo openssl x509 -in "/etc/letsencrypt/live/allin1url.in/fullchain.pem" -text -noout 2>/dev/null | grep -o "*.allin1url.in" || echo "")
        if [ -n "$WILDCARD_CHECK" ]; then
            CERT_PATH="/etc/letsencrypt/live/allin1url.in/fullchain.pem"
        fi
    fi
    
    # Check other possible locations
    if [ -z "$CERT_PATH" ] && [ -f "$WILDCERT_PATH" ]; then
        CERT_PATH="$WILDCERT_PATH"
    elif [ -z "$CERT_PATH" ] && [ -f "/etc/letsencrypt/live/allin1url.in-0002/fullchain.pem" ]; then
        CERT_PATH="/etc/letsencrypt/live/allin1url.in-0002/fullchain.pem"
    fi
else
    echo ""
    echo "=========================================="
    echo "Generating standard certificate"
    echo "This will cover: allin1url.in and www.allin1url.in"
    echo "=========================================="
    echo ""
    
    # Generate certificate using HTTP-01 challenge (standalone mode)
    echo "Generating certificate for allin1url.in and www.allin1url.in..."
    sudo certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        -d allin1url.in \
        -d www.allin1url.in
fi

# Find the actual certificate path (certbot may have created it in different location)
# Also check if certbot kept an existing certificate
ACTUAL_CERT_PATH=""
for possible_path in \
    "/etc/letsencrypt/live/allin1url.in-0001/fullchain.pem" \
    "/etc/letsencrypt/live/allin1url.in/fullchain.pem" \
    "/etc/letsencrypt/live/allin1url.in-0002/fullchain.pem" \
    "$WILDCERT_PATH" \
    "$CERT_PATH"; do
    if [ -f "$possible_path" ]; then
        # Verify it's a wildcard cert if we're generating wildcard
        if [ "$USE_WILDCARD" = true ]; then
            WILDCARD_CHECK=$(sudo openssl x509 -in "$possible_path" -text -noout 2>/dev/null | grep -o "*.allin1url.in" || echo "")
            if [ -n "$WILDCARD_CHECK" ]; then
                ACTUAL_CERT_PATH="$possible_path"
                break
            fi
        else
            ACTUAL_CERT_PATH="$possible_path"
            break
        fi
    fi
done

# Use actual cert path if found, otherwise use expected path
if [ -n "$ACTUAL_CERT_PATH" ]; then
    CERT_PATH="$ACTUAL_CERT_PATH"
fi

# Check if certificate exists (either newly generated or kept existing)
if [ -f "$CERT_PATH" ]; then
    echo ""
    echo "=========================================="
    echo "✓ Certificate generated successfully!"
    echo "=========================================="
    echo "Certificate location: $CERT_PATH"
    echo "Certificate expires on: $(openssl x509 -enddate -noout -in $CERT_PATH | cut -d= -f2)"
    echo ""
    
    # Show certificate details
    echo "Certificate details:"
    sudo openssl x509 -in "$CERT_PATH" -noout -subject -issuer 2>/dev/null || true
    echo ""
    
    if [ "$USE_WILDCARD" = true ]; then
        echo "Certificate covers:"
        sudo openssl x509 -in "$CERT_PATH" -text -noout 2>/dev/null | grep -A 1 "Subject Alternative Name" || echo "  *.allin1url.in, allin1url.in"
        echo ""
        echo "✅ This wildcard certificate will work for:"
        echo "   • Main domain: https://allin1url.in"
        echo "   • All subdomains: https://username.allin1url.in (any username)"
        echo "   • Examples: https://dpkrn.allin1url.in, https://john.allin1url.in, etc."
    else
        echo "⚠️  This certificate only covers:"
        echo "   • Main domain: https://allin1url.in"
        echo "   • www: https://www.allin1url.in"
        echo "   • Does NOT cover subdomains (*.allin1url.in)"
    fi
    echo ""
    
    # Restart nginx
    echo "Restarting nginx container..."
    cd "$(dirname "$0")"
    docker compose up -d nginx 2>/dev/null || systemctl restart nginx 2>/dev/null || true
    
    echo ""
    echo "✓ Setup complete! Your site should now work with HTTPS."
    if [ "$USE_WILDCARD" = true ]; then
        echo ""
        echo "✅ Wildcard certificate installed! All dynamic subdomains are now secured."
        echo ""
        echo "Next steps:"
        echo "  1. Test main domain: curl -I https://allin1url.in"
        echo "  2. Test subdomain: curl -I https://dpkrn.allin1url.in"
        echo "  3. Verify SSL: openssl s_client -connect dpkrn.allin1url.in:443 -servername dpkrn.allin1url.in"
    else
        echo ""
        echo "⚠️  WARNING: This certificate does NOT cover subdomains!"
        echo "   Subdomains will show SSL warnings."
        echo "   Run without --standard flag to generate wildcard certificate."
    fi
else
    echo ""
    echo "=========================================="
    echo "✗ Certificate generation failed!"
    echo "=========================================="
    echo "Please check the error messages above."
    echo ""
    echo "Common issues:"
    echo "  1. DNS not pointing to this server"
    echo "  2. Ports 80/443 not accessible"
    echo "  3. For wildcard: DNS TXT record not added correctly"
    echo ""
    echo ""
    echo "=========================================="
    echo "Troubleshooting Steps"
    echo "=========================================="
    echo ""
    echo "1. Verify DNS TXT record exists:"
    echo "   Run: ./verify-dns.sh"
    echo "   Or manually: dig _acme-challenge.allin1url.in TXT +short"
    echo ""
    echo "2. Check certbot logs:"
    echo "   Run: ./check-certbot-logs.sh"
    echo "   Or manually: sudo cat /var/log/letsencrypt/letsencrypt.log"
    echo ""
    echo "3. Common DNS issues:"
    echo "   • Host name should be: _acme-challenge (NOT _acme-challenge.allin1url.in)"
    echo "   • Wait 5-10 minutes after adding the record"
    echo "   • Verify in your DNS provider dashboard"
    echo "   • Check the value matches exactly what certbot showed"
    echo ""
    echo "4. Retry after fixing DNS:"
    echo "   sudo ./generate-cert.sh"
    echo ""
    echo "Restarting nginx container..."
    cd "$(dirname "$0")"
    docker-compose up -d nginx 2>/dev/null || systemctl restart nginx 2>/dev/null || true
    exit 1
fi

if [ "$USE_WILDCARD" = true ]; then
    echo ""
    echo "Additional notes:"
    echo "  • This wildcard certificate works for ALL dynamic subdomains automatically"
    echo "  • No need to generate separate certificates for each username"
    echo "  • Certificate auto-renewal may require manual DNS verification"
    echo "  • Set up auto-renewal: sudo certbot renew --dry-run"
else
    echo ""
    echo "Additional notes:"
    echo "  • Update nginx.conf if using cert with different path"
    echo "  • Test SSL: openssl s_client -connect allin1url.in:443 -servername allin1url.in"
    echo "  • Set up auto-renewal: sudo certbot renew --dry-run"
fi

