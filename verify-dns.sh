#!/bin/bash

# Script to verify DNS TXT record for Let's Encrypt wildcard certificate

echo "=========================================="
echo "DNS TXT Record Verification Script"
echo "=========================================="
echo ""

# Check if dig is installed
if ! command -v dig &> /dev/null; then
    echo "Installing dig..."
    sudo apt-get update
    sudo apt-get install -y dnsutils
fi

echo "Checking DNS TXT record for: _acme-challenge.allin1url.in"
echo ""

# Check with multiple DNS servers
echo "1. Checking with default DNS server:"
RESULT1=$(dig _acme-challenge.allin1url.in TXT +short)
if [ -z "$RESULT1" ]; then
    echo "   ❌ No TXT record found"
else
    echo "   ✅ Found: $RESULT1"
fi
echo ""

echo "2. Checking with Google DNS (8.8.8.8):"
RESULT2=$(dig @8.8.8.8 _acme-challenge.allin1url.in TXT +short)
if [ -z "$RESULT2" ]; then
    echo "   ❌ No TXT record found"
else
    echo "   ✅ Found: $RESULT2"
fi
echo ""

echo "3. Checking with Cloudflare DNS (1.1.1.1):"
RESULT3=$(dig @1.1.1.1 _acme-challenge.allin1url.in TXT +short)
if [ -z "$RESULT3" ]; then
    echo "   ❌ No TXT record found"
else
    echo "   ✅ Found: $RESULT3"
fi
echo ""

echo "4. Checking with Quad9 DNS (9.9.9.9):"
RESULT4=$(dig @9.9.9.9 _acme-challenge.allin1url.in TXT +short)
if [ -z "$RESULT4" ]; then
    echo "   ❌ No TXT record found"
else
    echo "   ✅ Found: $RESULT4"
fi
echo ""

# Summary
if [ -z "$RESULT1" ] && [ -z "$RESULT2" ] && [ -z "$RESULT3" ] && [ -z "$RESULT4" ]; then
    echo "=========================================="
    echo "❌ TXT RECORD NOT FOUND"
    echo "=========================================="
    echo ""
    echo "The DNS TXT record is not visible from any DNS server."
    echo ""
    echo "Please check:"
    echo "  1. Did you add the TXT record in your DNS provider?"
    echo "  2. Is the Host/Name field exactly: _acme-challenge (not _acme-challenge.allin1url.in)?"
    echo "  3. Did you wait 5-10 minutes after adding the record?"
    echo "  4. Is the record type TXT (not A or CNAME)?"
    echo "  5. Does the value match exactly what certbot showed you?"
    echo ""
    echo "To add the record:"
    echo "  - Namecheap: Advanced DNS → Add TXT Record"
    echo "  - Host: _acme-challenge"
    echo "  - Value: [paste the value from certbot]"
    echo "  - TTL: Automatic"
    echo ""
else
    echo "=========================================="
    echo "✅ TXT RECORD FOUND"
    echo "=========================================="
    echo ""
    echo "The DNS TXT record is visible. You can now retry certbot."
    echo ""
    echo "If certbot still fails, try:"
    echo "  1. Wait 2-3 more minutes"
    echo "  2. Run certbot with verbose mode: sudo certbot certonly --manual -v ..."
    echo "  3. Check certbot logs: sudo cat /var/log/letsencrypt/letsencrypt.log"
    echo ""
fi

echo "=========================================="
echo "Additional DNS Information"
echo "=========================================="
echo ""
echo "Checking all TXT records for allin1url.in:"
dig allin1url.in TXT +short
echo ""
echo "Checking A record for allin1url.in:"
dig allin1url.in A +short
echo ""

