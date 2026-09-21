# Paper Hour

A small magazine that turns over every hour.

Public notes land on the stoop. Private drafts stay in the desk drawer. Sign in with email and password or a magic link. The masthead copy changes with the clock; `/api/tick` is meant to run on the hour (see `vercel.json`).

## Run locally

```bash
npm i
cp .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Deploy

Connect this repo to Vercel, set the two `NEXT_PUBLIC_SUPABASE_*` variables, and enable cron. Auth confirmation emails come from the linked Supabase project.
