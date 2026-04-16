# BUILDORKILL

**AI that decides whether to build your SaaS idea—and shows you exactly what to do next.**

A decision intelligence system for early-stage SaaS founders that delivers structured, investment-style decision reports.

## Features

- **Two Modes:** Normal (optimistic) and Brutal (critical) analysis
- **Structured Scoring:** Market Demand, Competition, Monetization, Distribution, Founder Fit
- **Verdicts:** BUILD, PIVOT, or KILL with detailed reasoning
- **Execution Plans:** ICP, messaging, GTM channels, cold outreach scripts
- **History:** LocalStorage persistence for all past decisions
- **Dark Mode:** High-contrast UI with color-coded verdicts

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```
4. Get your free API key at [OpenRouter](https://openrouter.ai/keys)

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Deployment

Deploy to Vercel or Render. Set the `OPENROUTER_API_KEY` environment variable in your hosting dashboard.

## Tech Stack

- **Frontend:** Next.js 16 + Tailwind CSS
- **AI:** OpenRouter API (`openrouter/elephant-alpha`)
- **Storage:** Browser LocalStorage
