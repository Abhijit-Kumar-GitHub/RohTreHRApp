# 🚀 Quick Setup Guide

## 1. Install Dependencies
```bash
cd frontend
npm install
```

## 2. Create Supabase Project (FREE)

### Go to https://supabase.com
1. Sign up with GitHub (FREE)
2. Create New Project:
   - **Name**: RohTre HR App
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to you
   - Click **Create new project**

### Setup Database
1. Click **SQL Editor** in sidebar
2. Open `backend/schema.sql` in your code editor
3. Copy ALL the SQL code
4. Paste into Supabase SQL Editor
5. Click **Run**
6. You should see "Success" message

### Get API Keys
1. Click **Project Settings** (gear icon)
2. Click **API** tab
3. Copy:
   - **Project URL** (looks like: https://abc123.supabase.co)
   - **anon public** key (long string)

## 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# In RohTreHRApp directory (root)
cd ..
# Copy the example
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
```

## 4. Run the App Locally

```bash
cd frontend
npm run dev
```

The app will open at: http://localhost:3000

## 5. Test the App

1. Click "Sign Up" to create an account
2. Check your email for verification (check spam folder)
3. After verification, login with your credentials
4. Test all features:
   - ✅ Check-in/Check-out (will ask for location permission)
   - ✅ Apply for leave
   - ✅ View dashboard

⚠️ **Note**: Payroll will be empty initially. Admin needs to create payroll records.

## 6. Deploy to Vercel (FREE)

See `DEPLOYMENT.md` for detailed deployment instructions.

---

## 🆘 Troubleshooting

### "Invalid API key" error
- Double check your `.env` file has correct Supabase URL and key
- Make sure there are NO spaces or quotes around the values
- Restart the dev server after changing `.env`

### Database errors
- Make sure you ran the SQL schema in Supabase
- Check Supabase dashboard → Table Editor to verify tables exist

### Location not working
- Make sure you're using HTTPS or localhost
- Allow location permissions in browser when prompted
