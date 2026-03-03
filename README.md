# Campaign Brief to Content Pack

Turn a campaign brief into a full content pack in seconds. Input product details, audience, goal, channels, and tone — get back headlines, email subjects, social captions, CTAs, and ad hooks, all tagged by channel and funnel stage.

**Guest mode:** Generate without an account. Results are accessible via a unique shareable URL.
**Signed-in mode:** Save campaigns and revisit them from your dashboard (Google OAuth).

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v3 |
| Database + Auth | Supabase (Postgres + Google OAuth) |
| AI Generation | Claude API (`claude-sonnet-4-6`) |
| Hosting | Vercel |

---

## Project Structure

```
brief-to-content-pack/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — fonts (Bricolage Grotesque + DM Sans), metadata
│   ├── globals.css               # Tailwind directives + base styles
│   ├── page.tsx                  # Landing page
│   ├── middleware.ts             # Redirects unauthenticated users from /dashboard to /login
│   │
│   ├── login/
│   │   └── page.tsx              # Google OAuth sign-in page
│   │
│   ├── campaign/
│   │   └── new/
│   │       └── page.tsx          # Brief input form (guest + authenticated)
│   │
│   ├── result/
│   │   └── [id]/
│   │       └── page.tsx          # Content pack viewer — copy buttons, guest save banner
│   │
│   ├── dashboard/
│   │   └── page.tsx              # Saved campaigns list (authenticated only)
│   │
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # Supabase OAuth callback — exchanges code for session
│   │
│   └── api/
│       └── campaigns/
│           ├── route.ts          # POST /api/campaigns — validate, generate, save
│           │                     # GET  /api/campaigns — list user's campaigns
│           └── [id]/
│               └── route.ts      # GET    /api/campaigns/[id] — fetch single campaign
│                                 # DELETE /api/campaigns/[id] — delete (auth required)
│
├── components/
│   ├── ui/
│   │   └── CopyButton.tsx        # Clipboard copy button with "Copied!" feedback
│   │
│   ├── campaign/
│   │   ├── BriefForm.tsx         # 7-field brief form — client component, calls POST /api/campaigns
│   │   └── ContentPack.tsx       # Renders sections (headlines, CTAs, etc.) with funnel/channel badges
│   │
│   └── dashboard/
│       └── Actions.tsx           # Client components: SignOutButton, DeleteButton
│
├── lib/
│   ├── supabase.ts               # createSupabaseBrowserClient() + createSupabaseServerClient()
│   └── claude.ts                 # generateContentPack() — Claude API call, max_tokens: 1024
│
├── .env.example                  # Template for all required environment variables
├── .gitignore                    # Blocks .env.local, node_modules, .next
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Supabase account](https://supabase.com) (free)
- [Anthropic account](https://console.anthropic.com) (for Claude API key)
- [Google Cloud account](https://console.cloud.google.com) (for OAuth credentials)
- [Vercel account](https://vercel.com) (for deployment)
- [GitHub account](https://github.com) (for version control + Vercel integration)

---

## Setup Guide

### 1. Install dependencies

```bash
cd brief-to-content-pack
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your real values (see each section below for where to find them).

---

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → **New project** → choose a name and free-tier region
2. Wait ~2 minutes for provisioning
3. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` *(server-side only — never expose to the client)*

4. Go to **SQL Editor** and run the following schema:

```sql
create table campaigns (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  created_at  timestamptz default now(),
  title       text not null,
  brief_data  jsonb not null,
  output_data jsonb,
  status      text default 'pending'
);

alter table campaigns enable row level security;

-- Authenticated users can read, update, and delete their own rows
create policy "users own their campaigns"
  on campaigns for all
  using (auth.uid() = user_id);

-- Anyone (including guests) can insert a campaign with no user_id
create policy "allow guest insert"
  on campaigns for insert
  with check (user_id is null);

-- Anyone can read a campaign by its UUID (enables guest result pages)
create policy "allow read by id"
  on campaigns for select
  using (user_id is null or auth.uid() = user_id);
```

---

### 4. Set up Google OAuth

You need a Google Cloud OAuth app so Supabase can handle "Sign in with Google".

**Step A — Create OAuth credentials in Google Cloud:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Under **Authorized redirect URIs**, add:
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   *(Replace `YOUR_SUPABASE_PROJECT_ID` with the ID from your Supabase project URL)*
6. Click **Create** — copy the **Client ID** and **Client Secret**

**Step B — Enable Google provider in Supabase:**

1. In your Supabase project, go to **Authentication → Providers → Google**
2. Toggle it on
3. Paste the **Client ID** and **Client Secret** from Google Cloud
4. Save

---

### 5. Get your Claude API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. **API Keys → Create Key**
3. Copy it → `ANTHROPIC_API_KEY` in `.env.local`
4. Recommended: set a **spend alert at $20/month** under Billing settings

---

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Test the guest flow:**
1. Click "Generate now — no account needed"
2. Fill out the brief form
3. You should arrive at `/result/[uuid]` with a full content pack

**Test the auth flow:**
1. Click "Sign in with Google" → completes OAuth → lands on `/dashboard`
2. Generate a brief while signed in → campaign appears in dashboard

---

### 7. Set up GitHub

```bash
git init
git branch -M main

# Commit security files first
git add .gitignore .env.example
git commit -m "chore: add gitignore and env template"

# Commit the project
git add .
git commit -m "feat: initial MVP scaffold"

# Create an empty repo on github.com (no README), then:
git remote add origin https://github.com/YOUR_USERNAME/brief-to-content-pack.git
git push -u origin main

# Work on a feature branch
git checkout -b dev
```

---

### 8. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import from GitHub
2. Select `brief-to-content-pack`
3. Framework: **Next.js** (auto-detected)
4. Add all environment variables from `.env.example` with real values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_APP_URL` → set to your Vercel URL after first deploy
5. Click **Deploy** → wait ~2 minutes → copy the live URL

**Post-deploy steps:**
- Update `NEXT_PUBLIC_APP_URL` in Vercel env vars to the real live URL
- In Supabase → **Authentication → URL Configuration**:
  - **Site URL**: your live Vercel URL
  - **Redirect URLs**: add your live Vercel URL (e.g. `https://your-app.vercel.app/**`)

---

## Environment Variables Reference

| Variable | Where to find it | Exposed to client? |
|----------|-----------------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Yes (safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Yes (safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | **No — server only** |
| `ANTHROPIC_API_KEY` | console.anthropic.com | **No — server only** |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL | Yes (safe) |

---

## Cost Control

Every Claude API call in `lib/claude.ts` includes `max_tokens: 1024`. Estimated cost per generation: **~$0.01–0.03** using `claude-sonnet-4-6`.

**Recommended for launch:**
- Use a waitlist for the first 2 weeks — manually onboard users before opening public access
- Monitor usage in [Anthropic Console](https://console.anthropic.com) → set a $20/month spend alert

---

## Key URLs (after deployment)

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/campaign/new` | Generate a new content pack (no login needed) |
| `/result/[id]` | View a generated content pack |
| `/dashboard` | Saved campaigns (requires Google sign-in) |
| `/login` | Google OAuth sign-in |
