# VICEVERSE Deployment & Setup Manual

Follow this guide to deploy the VICEVERSE platform to Vercel and connect your Supabase database.

---

## 1. Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bharathkumar000/judging.git
   cd judging
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. **Launch Local Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 2. Supabase Cloud Database Configuration

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](file:///Users/bharathkumara/Desktop/idea%20judge/supabase/schema.sql) to provision all tables, relations, and RLS policies.
4. Paste and run [`supabase/seed.sql`](file:///Users/bharathkumara/Desktop/idea%20judge/supabase/seed.sql) to populate the 6 mission tracks, default heist rubrics, and initial schedule.
5. In your Supabase Project Settings, copy your **Project URL** and **Anon Public API Key** into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

---

## 3. Production Deployment on Vercel

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete viceverse platform"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Click **Deploy**. Vercel will automatically build the Next.js production bundle.
