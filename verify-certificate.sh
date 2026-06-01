#!/bin/bash

# Script to verify SSL certificate and update nginx config if needed

echo "=========================================="
echo "SSL Certificate Verification"
echo "=========================================="
echo ""

# Check certificate locations
CERT_LOCATIONS=(
    "/etc/letsencrypt/live/allin1url.in-0001/fullchain.pem"
    "/etc/letsencrypt/live/allin1url.in/fullchain.pem"
    "/etc/letsencrypt/live/allin1url.in-0002/fullchain.pem"
)

CERT_PATH=""
for location in "${CERT_LOCATIONS[@]}"; do
    if [ -f "$location" ]; then
        echo "✓ Found certificate at: $location"
        CERT_PATH="$location"
        
        # Check if it's a wildcard certificate
        echo "Checking certificate details..."
        WILDCARD_CHECK=$(sudo openssl x509 -in "$location" -text -noout 2>/dev/null | grep -o "*.allin1url.in" || echo "")
        
        if [ -n "$WILDCARD_CHECK" ]; then
            echo "✅ This is a WILDCARD certificate (covers *.allin1url.in)"
        else
            echo "⚠️  This is NOT a wildcard certificate (doesn't cover subdomains)"
        fi
        
        echo ""
        echo "Certificate details:"
        echo "----------------------------------------"
        sudo openssl x509 -in "$location" -text -noout 2>/dev/null | grep -A 1 "Subject Alternative Name" || echo "  *.allin1url.in, allin1url.in"
        echo ""
        echo "Certificate expires:"
        sudo openssl x509 -in "$location" -noout -enddate 2>/dev/null | cut -d= -f2
        echo ""
        break
    fi
done

if [ -z "$CERT_PATH" ]; then
    echo "❌ No certificate found in common locations"
    echo ""
    echo "Checking all certificates:"
    sudo ls -la /etc/letsencrypt/live/ 2>/dev/null || echo "No certificates found"
    exit 1
fi

# Check nginx configuration
echo "=========================================="
echo "Checking Nginx Configuration"
echo "=========================================="
echo ""

NGINX_CONF="nginx/nginx.conf"
if [ -f "$NGINX_CONF" ]; then
    echo "Checking nginx.conf for certificate paths..."
    
    # Extract certificate path from nginx config
    NGINX_CERT=$(grep "ssl_certificate " "$NGINX_CONF" | grep -v "#" | head -1 | awk '{print $2}' | sed 's/;//')
    
    if [ -n "$NGINX_CERT" ]; then
        echo "Nginx is configured to use: $NGINX_CERT"
        
        if [ "$NGINX_CERT" != "$CERT_PATH" ]; then
            echo ""
            echo "⚠️  WARNING: Nginx config points to different certificate!"
            echo "   Nginx expects: $NGINX_CERT"
            echo "   Certificate is at: $CERT_PATH"
            echo ""
            echo "You need to update nginx.conf:"
            echo "   Change: ssl_certificate $NGINX_CERT;"
            echo "   To:     ssl_certificate $CERT_PATH;"
            echo ""
            echo "And update the key and chain paths accordingly."
        else
            echo "✅ Nginx configuration matches certificate location"
        fi
    fi
else
    echo "⚠️  nginx.conf not found in current directory"
fi

echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""
echo "1. If nginx config needs updating, edit nginx/nginx.conf"
echo "2. Test nginx config: docker exec nginx nginx -t"
echo "3. Reload nginx: docker exec nginx nginx -s reload"
echo "4. Test SSL: curl -I https://dpkrn.allin1url.in"
echo ""

