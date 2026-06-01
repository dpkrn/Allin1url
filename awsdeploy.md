# AWS EC2 + GoDaddy + Docker + Nginx + Wildcard SSL Deployment Guide

## Overview

This guide deploys:

* Frontend → `allin1url.in`
* Backend APIs → `*.allin1url.in`
* n8n → `n8n.allin1url.in`
* Dockerized services
* Nginx reverse proxy
* Wildcard SSL using Let's Encrypt

---

# Step 1: Install Required Packages

```bash
sudo apt update
sudo apt install git docker.io certbot -y
```

## Why?

### Git

Used to pull the latest code from GitHub.

### Docker

Runs frontend, backend, nginx and supporting services in containers.

### Certbot

Generates SSL certificates from Let's Encrypt.

---

# Step 2: Enable Docker For Current User

```bash
sudo usermod -aG docker $USER
newgrp docker
```

## Why?

Without this:

```bash
sudo docker ps
```

would be required every time.

This adds your user to the Docker group.

---

# Step 3: Configure GitHub SSH

Generate SSH key:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Show public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Add it to:

GitHub → Settings → SSH Keys

Verify:

```bash
ssh -T git@github.com
```

Clone repository:

```bash
git clone git@github.com:your-org/your-repo.git
```

## Why?

SSH avoids typing GitHub credentials repeatedly.

---

# Step 4: Setup Project

Go to project root.

Create:

```text
.env
frontend/.env
backend/.env
```

Copy environment variables from local machine.

## Why?

Application configuration should not be hardcoded.

Examples:

* Database URLs
* JWT secrets
* API keys
* Environment variables

---

# Step 5: Update Domain References

Before deployment:

* Update domain names
* Update frontend URLs
* Update backend URLs
* Update nginx config

Commit and push:

```bash
git add .
git commit -m "update domain"
git push
```

On server:

```bash
git pull
```

## Why?

Server always deploys latest source from GitHub.

---

# Step 6: Build Project

```bash
./make.sh
```

## Why?

Builds and prepares project for deployment.

May include:

* frontend build
* backend build
* docker build

---

# Step 7: Configure DNS In GoDaddy

## Root Domain

```text
Type: A
Host: @
Value: EC2_PUBLIC_IP
```

### Why?

Maps:

```text
allin1url.in
```

to EC2.

---

## Wildcard Domain

```text
Type: A
Host: *
Value: EC2_PUBLIC_IP
```

### Why?

Makes all subdomains point to server.

Examples:

```text
john.allin1url.in
api.allin1url.in
n8n.allin1url.in
anything.allin1url.in
```

without creating separate records.

---

# Step 8: Generate Wildcard SSL Certificate

```bash
sudo certbot certonly \
  --manual \
  --preferred-challenges dns \
  -d allin1url.in \
  -d '*.allin1url.in'
```

## Why?

Need SSL for:

```text
allin1url.in
```

and

```text
*.allin1url.in
```

A wildcard certificate alone DOES NOT cover root domain.

Therefore both are requested.

---

# Step 9: Create ACME TXT Records

Certbot generates:

```text
_acme-challenge.allin1url.in
value1
```

and

```text
_acme-challenge.allin1url.in
value2
```

Create BOTH:

```text
TXT _acme-challenge value1
TXT _acme-challenge value2
```

## Why?

Let's Encrypt validates:

```text
allin1url.in
```

and

```text
*.allin1url.in
```

separately.

Each validation gets its own token.

---

# Step 10: Verify DNS Propagation

```bash
dig TXT _acme-challenge.allin1url.in +short
```

Expected:

```text
"value1"
"value2"
```

## Why?

If only one value appears:

Certificate validation fails.

Wait until both appear before continuing.

---

# Step 11: Verify Certificate Creation

```bash
sudo certbot certificates
```

Expected:

```text
Domains: allin1url.in *.allin1url.in
```

## Why?

Confirms certificate was successfully issued.

---

# Step 12: Certificate Location

Expected files:

```text
/etc/letsencrypt/live/allin1url.in/
```

Contains:

```text
cert.pem
chain.pem
fullchain.pem
privkey.pem
```

## Meaning

### cert.pem

Server certificate.

### chain.pem

Intermediate CA certificates.

### fullchain.pem

cert.pem + chain.pem combined.

Used by Nginx.

### privkey.pem

Private key.

Must remain secret.

---

# Step 13: Configure Nginx SSL

Use:

```nginx
ssl_certificate /etc/letsencrypt/live/allin1url.in/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/allin1url.in/privkey.pem;
ssl_trusted_certificate /etc/letsencrypt/live/allin1url.in/chain.pem;
```

## Why?

### ssl_certificate

Certificate presented to browser.

### ssl_certificate_key

Private key matching certificate.

### ssl_trusted_certificate

Used for OCSP stapling verification.

---

# Important

Always verify actual certificate path:

```bash
sudo certbot certificates
```

Do NOT assume:

```text
allin1url.in-0001
```

exists.

Use whatever Certbot created.

---

# Step 14: Deploy Containers

```bash
git pull
docker compose up -d --build
```

## Why?

### git pull

Fetch latest code.

### docker compose up

Creates containers.

### -d

Runs in background.

### --build

Forces fresh image build.

---

# Step 15: Verify Nginx

```bash
docker exec nginx nginx -t
```

Expected:

```text
syntax is ok
test is successful
```

## Why?

Prevents broken nginx configuration from being loaded.

---

# Step 16: Verify Public Access

```bash
curl -I https://allin1url.in
```

```bash
curl -I https://n8n.allin1url.in
```

```bash
curl -I https://dpkrn.allin1url.in
```

## Why?

Confirms:

* DNS works
* SSL works
* Nginx works
* Containers are reachable

---

# Biggest Lesson Learned

Before touching nginx SSL paths:

```bash
sudo certbot certificates
```

Check where Certbot actually stored certificates.



when the real certificate lives at:

```text
/etc/letsencrypt/live/allin1url.in/
```

go and change the auth 2.0 redirection url
All in1 url gmail
https://console.cloud.google.com/auth/clients?project=All in1 url