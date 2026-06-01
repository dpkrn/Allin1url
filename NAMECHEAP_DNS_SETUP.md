# Namecheap DNS TXT Record Setup - Step by Step

## Exact Steps for Namecheap

### Step 1: Log into Namecheap
1. Go to https://www.namecheap.com
2. Log in to your account
3. Click on **Domain List** from the left sidebar

### Step 2: Select Your Domain
1. Find `allin1url.in` in your domain list
2. Click the **Manage** button next to it

### Step 3: Go to Advanced DNS
1. You'll see several tabs at the top
2. Click on the **Advanced DNS** tab
3. Scroll down to the **Host Records** section

### Step 4: Add TXT Record
1. Click the **Add New Record** button
2. A new row will appear

### Step 5: Fill in the Record Details

**In the new record row, fill in exactly:**

| Field | Value |
|-------|-------|
| **Type** | Select **TXT Record** from dropdown |
| **Host** | `_acme-challenge` |
| **Value** | `xgPUGNyXbaKrC1ZSQR57af9lVwZz0Jj4UgoWTFTgLVQ` |
| **TTL** | **Automatic** (or select 300 if Automatic is not available) |

**Important Notes:**
- ✅ **Host field**: Enter exactly `_acme-challenge` (without quotes, no spaces)
- ✅ **Value field**: Enter exactly `xgPUGNyXbaKrC1ZSQR57af9lVwZz0Jj4UgoWTFTgLVQ` (no quotes, no spaces)
- ✅ Namecheap will automatically add `.allin1url.in` to the host name
- ✅ So `_acme-challenge` becomes `_acme-challenge.allin1url.in` automatically

### Step 6: Save the Record
1. Click the **Save All Changes** button (green checkmark icon) at the top right
2. You should see a confirmation message

### Step 7: Verify the Record
1. After saving, scroll down to see your records
2. Look for a TXT record that shows:
   - **Type**: TXT Record
   - **Host**: `_acme-challenge.allin1url.in` (Namecheap shows the full name)
   - **Value**: `xgPUGNyXbaKrC1ZSQR57af9lVwZz0Jj4UgoWTFTgLVQ`

**If you see this record, it's added correctly!**

## Visual Guide (What You Should See)

### Before Adding:
```
Host Records:
[Type] [Host]        [Value]                    [TTL]
A      @             123.45.67.89              Automatic
A      www           123.45.67.89              Automatic
```

### After Adding:
```
Host Records:
[Type] [Host]                    [Value]                    [TTL]
A      @                         123.45.67.89              Automatic
A      www                       123.45.67.89              Automatic
TXT    _acme-challenge.allin1url.in xgPUGNyXbaKrC1ZSQR57...  Automatic
```

## Common Mistakes to Avoid

❌ **DON'T enter**: `_acme-challenge.allin1url.in` in the Host field
- Namecheap will create: `_acme-challenge.allin1url.in.allin1url.in` (WRONG!)

✅ **DO enter**: `_acme-challenge` in the Host field
- Namecheap creates: `_acme-challenge.allin1url.in` (CORRECT!)

❌ **DON'T add quotes** around the value
- Wrong: `"xgPUGNyXbaKrC1ZSQR57af9lVwZz0Jj4UgoWTFTgLVQ"`

✅ **DO enter** the value without quotes
- Correct: `xgPUGNyXbaKrC1ZSQR57af9lVwZz0Jj4UgoWTFTgLVQ`

## Wait for DNS Propagation

After saving:
1. **Wait 2-5 minutes** for DNS to propagate
2. Don't press Enter in certbot yet!

## Verify DNS is Ready

**On your EC2 instance, run:**

```bash
dig _acme-challenge.allin1url.in TXT +short
```

**Expected output:**
```
"xgPUGNyXbaKrC1ZSQR57af9lVwZz0Jj4UgoWTFTgLVQ"
```

**Or use the verification script:**
```bash
./verify-dns.sh
```

**If you see the value above, DNS is ready!** ✅

## Continue with Certbot

Once DNS is verified:
1. Go back to your EC2 terminal where certbot is waiting
2. Press **Enter** to continue
3. Certbot should now successfully verify the DNS record

## Troubleshooting

### Issue: Record not showing in Namecheap
- Make sure you clicked **Save All Changes**
- Refresh the page and check again
- Look in the TXT Records section

### Issue: DNS not propagating
- Wait 5-10 minutes (can take longer)
- Try different DNS servers: `dig @8.8.8.8 _acme-challenge.allin1url.in TXT`
- Check if the record shows correctly in Namecheap dashboard

### Issue: Wrong host name created
- If you see `_acme-challenge.allin1url.in.allin1url.in`, you entered the full name
- Delete the record and add it again with just `_acme-challenge`

## Quick Checklist

- [ ] Logged into Namecheap
- [ ] Went to Domain List → allin1url.in → Manage → Advanced DNS
- [ ] Added new TXT record
- [ ] Host: `_acme-challenge` (just this, no domain)
- [ ] Value: `xgPUGNyXbaKrC1ZSQR57af9lVwZz0Jj4UgoWTFTgLVQ` (exact value)
- [ ] TTL: Automatic
- [ ] Clicked Save All Changes
- [ ] Verified record shows as `_acme-challenge.allin1url.in` in dashboard
- [ ] Waited 2-5 minutes
- [ ] Verified with `dig` command
- [ ] Pressed Enter in certbot

## Still Having Issues?

1. Double-check the record in Namecheap dashboard
2. Make sure the Host field shows `_acme-challenge.allin1url.in` (not double domain)
3. Verify the value matches exactly (no extra spaces)
4. Wait longer (up to 10 minutes)
5. Try the verification script: `./verify-dns.sh`

