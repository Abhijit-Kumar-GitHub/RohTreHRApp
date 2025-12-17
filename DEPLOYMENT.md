# RohTre HR App - Deployment Guide

## 🚀 Deploy to Vercel (FREE)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click **Deploy**

### Step 3: Setup Supabase
1. Go to https://supabase.com
2. Create new project (FREE tier)
3. Go to SQL Editor
4. Copy and paste the content from `backend/schema.sql`
5. Run the SQL
6. Go to Project Settings → API
7. Copy your **Project URL** and **anon/public key**
8. Add them to Vercel environment variables

## ✅ Done!
Your app will be live at `https://your-project.vercel.app`
