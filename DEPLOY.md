# 🚀 ENBE Digital Election System — Deployment Guide

## Prerequisites

- Ubuntu 22.04 VPS (DigitalOcean, Hetzner, Linode — $10–20/month)
- Node.js 18+, npm, PM2, Nginx, Certbot
- Domain name (e.g. `vote.enbe.gov.et`)
- MongoDB Atlas account (free tier works for pilot)

---

## Step 1 — Configure Environment

Edit `backend/.env` with your **real** values:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/voterdb
JWT_SECRET=<64-byte random hex — generate with node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
RECEIPT_SECRET=<another 64-byte random hex>
FRONTEND_URL=https://yourdomain.com

EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

GEMINI_API_KEY=AIza...your_key
AFRICASTALKING_USERNAME=your_username
AFRICASTALKING_API_KEY=your_key
AFRICASTALKING_SENDER_ID=ENBE-Vote
```

---

## Step 2 — Install Global Tools on Server

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

---

## Step 3 — Deploy the App

```bash
# Clone repo on your server
git clone https://github.com/your-repo/election-system.git /var/www/enbe-election
cd /var/www/enbe-election

# Install backend dependencies
cd backend && npm install --omit=dev && cd ..

# Build frontend
npm install && npm run build

# Copy frontend build
sudo cp -r dist /var/www/enbe-election/dist
```

---

## Step 4 — Configure Nginx

```bash
sudo cp nginx.conf /etc/nginx/sites-available/enbe-election
# Edit: replace "yourdomain.com" with your real domain
sudo nano /etc/nginx/sites-available/enbe-election

sudo ln -s /etc/nginx/sites-available/enbe-election /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 5 — SSL Certificate (Free, Auto-Renewing)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Step 6 — Start the Backend with PM2

```bash
cd /var/www/enbe-election
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup   # follow the printed command
```

---

## Step 7 — Verify

```bash
# Check backend health
curl https://yourdomain.com/health

# Check PM2 status
pm2 status

# View logs
pm2 logs enbe-election-api
```

---

## Maintenance

| Task | Command |
|---|---|
| Restart backend | `pm2 restart enbe-election-api` |
| View logs | `pm2 logs enbe-election-api` |
| Renew SSL | Auto-renewed; test with `sudo certbot renew --dry-run` |
| Update app | `git pull && npm run build && pm2 restart enbe-election-api` |
| MongoDB backup | Use Atlas automated backups |

---

## 🔐 Security Checklist Before Going Live

- [ ] JWT_SECRET is 64+ random bytes (not "change_this_secret")
- [ ] RECEIPT_SECRET is different from JWT_SECRET
- [ ] MongoDB Atlas IP whitelist set (only your server IP)
- [ ] NODE_ENV=production
- [ ] Email App Password used (not your real password)
- [ ] Africa's Talking production credentials (not sandbox)
- [ ] Nginx firewall: only port 80/443 open (`sudo ufw allow 'Nginx Full'`)
- [ ] Run `npm audit fix` on both frontend and backend

---

## Testing SMS (Africa's Talking Sandbox)

```
Username: sandbox
API Key:  (from your Africa's Talking dashboard)
```

In sandbox mode, OTPs appear in the AT dashboard — no real SMS sent.
Switch to production credentials when ready for real users.
