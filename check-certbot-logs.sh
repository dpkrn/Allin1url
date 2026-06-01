#!/bin/bash

# Script to check certbot logs for detailed error information

echo "=========================================="
echo "Certbot Log Analysis"
echo "=========================================="
echo ""

LOG_FILE="/var/log/letsencrypt/letsencrypt.log"

if [ ! -f "$LOG_FILE" ]; then
    echo "❌ Log file not found: $LOG_FILE"
    echo "   Run certbot first to generate logs."
    exit 1
fi

echo "Last 50 lines of certbot log:"
echo "----------------------------------------"
sudo tail -50 "$LOG_FILE"
echo ""
echo "----------------------------------------"
echo ""

echo "Searching for error messages:"
echo "----------------------------------------"
sudo grep -i "error\|fail\|unauthorized\|challenge" "$LOG_FILE" | tail -20
echo ""
echo "----------------------------------------"
echo ""

echo "Searching for DNS/TXT record mentions:"
echo "----------------------------------------"
sudo grep -i "txt\|dns\|_acme-challenge" "$LOG_FILE" | tail -20
echo ""
echo "----------------------------------------"
echo ""

echo "Most recent certificate attempt:"
echo "----------------------------------------"
sudo grep -A 10 "allin1url.in" "$LOG_FILE" | tail -30
echo ""

