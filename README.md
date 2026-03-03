# Jornada de Emagrecimento

Weight tracking dashboard for Gabriel & Melissa.

## Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "initial"
gh repo create weight-tracker --public --push
```

### 2. Import to Vercel
Go to [vercel.com/new](https://vercel.com/new) and import your repo.

### 3. Add Vercel KV (for data persistence)
In your Vercel project dashboard:
- Go to **Storage** tab → **Create Database** → **KV**
- Click **Connect** to link it to your project
- Redeploy — the KV env vars are injected automatically

### 4. Done!
The app will load all historical data on first visit and persist
new entries to Vercel KV. All future deploys keep the stored data.

## Local development
```bash
npm install
# Pull env vars from Vercel (requires vercel CLI)
vercel env pull .env.local
npm run dev
```
