# What Should I Cook?

> A full-stack recipe discovery and meal planning app — built to answer the most important question of every evening.

**Live demo:** [whatshouldIcook.com](https://whatshouldIcook.com) &nbsp;|&nbsp; **Stack:** Next.js 15 · TypeScript · AWS · PostgreSQL

---

## Overview

What Should I Cook? lets you find recipes tailored to what's actually in your fridge, how much time you have, and how you like to eat. Search by cuisine, diet, prep time, health score, or specific ingredients. Save what you've cooked, build a live shopping list, and keep your preferences synced across sessions.

It's a complete product — not a tutorial clone. Custom auth, a real database, server-side data fetching, and a full account management flow.

---

## Features

| Feature | Details |
|---|---|
| **Recipe Search** | Filter by diet, cuisine, prep time, health score, budget, and ingredients on hand |
| **Recipe Detail Pages** | Ingredients, step-by-step instructions, and full nutritional info — statically generated with ISR |
| **Shopping List** | Add ingredients from any recipe, check them off while you shop |
| **Tried Recipes** | Log every meal you've made with a date stamp |
| **Accounts** | Register, verify email, sign in, update name/password, delete account |
| **Theme** | Dark / Light / System — preference saved per user in the database |
| **Forgot Password** | Full reset flow handled through AWS Cognito |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | shadcn/ui + Tailwind CSS |
| State | Redux Toolkit |
| Auth | AWS Cognito — email/password, verification, password reset |
| Database | PostgreSQL on AWS RDS |
| Recipes | Spoonacular API |
| Email | Resend |
| Deployment | AWS Amplify |

---

## Architecture highlights

- **API routes as a security boundary** — the Spoonacular API key and database credentials never reach the client. All external calls go through Next.js API routes.
- **Static generation with ISR** — recipe detail pages are pre-rendered at build time and revalidated in the background, so they load instantly without hitting the external API on every request.
- **AWS Cognito for auth** — no rolling your own password hashing or token management. Cognito handles verification emails, password reset flows, and JWT tokens.
- **Redux for session state** — auth state and search filters are managed globally, so the user's context persists across navigations without redundant server round-trips.

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- AWS account with a Cognito User Pool configured
- PostgreSQL database (local or AWS RDS)
- Spoonacular API key — free tier at [spoonacular.com/food-api](https://spoonacular.com/food-api)

### Setup

```bash
# 1. Clone
git clone https://github.com/ale1a/what-should-i-cook-public.git
cd what-should-i-cook-public

# 2. Install
pnpm install

# 3. Environment — create .env.local
SPOONACULAR_API_KEY=your_spoonacular_key
DATABASE_URL=postgresql://user:password@host:5432/dbname
COGNITO_CLIENT_ID=your_cognito_app_client_id
COGNITO_USER_POOL_ID=your_cognito_user_pool_id
COGNITO_REGION=eu-west-2

# 4. Database schema
psql $DATABASE_URL -f lib/schema.sql

# 5. Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Cognito setup:** In your User Pool → App client, enable `ALLOW_USER_PASSWORD_AUTH` and email verification. No client secret required.

---

## Project Structure

```
app/
├── api/                    # Server-only API routes
│   ├── auth/               # login, register, verify, forgot/reset password
│   ├── recipes/            # Spoonacular proxy — search and detail
│   ├── shopping-list/      # CRUD
│   └── user/               # Profile updates, theme, account deletion
├── recipe/[id]/            # Statically generated recipe pages (ISR)
├── search/                 # Recipe search with filters
├── shopping-list/          # Live shopping list
├── tried-recipes/          # Cooked meals log
├── login/                  # Login + register tabs
├── verify/                 # Email verification
├── forgot-password/        # Password reset flow
└── profile/                # Account settings

lib/
├── db.ts                   # PostgreSQL connection pool
├── cognito.ts              # Cognito client singleton
└── schema.sql              # Database schema

redux/
└── features/
    ├── auth/               # Session state
    ├── recipes/            # Recipe and search history state
    └── filters/            # Search filter state
```

---

## Deployment

Deployed on **AWS Amplify** with automatic builds on push to `main`. Environment variables are set in the Amplify Console under **App settings → Environment variables**.

---

## License

MIT
