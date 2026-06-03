# BlackJackLab

BlackJackLab is an interactive blackjack training table built with Next.js. It lets signed-in players practice hands, tune table rules, track card count, review basic strategy, and save session history for later review.

## What It Does

- Runs an interactive blackjack table with betting, bankroll tracking, hit, stand, double, split, surrender, blackjack payouts, busts, pushes, and dealer play.
- Supports configurable table rules, including deck count, soft 17 behavior, reshuffle mode, surrender options, double-after-split, resplitting aces, insurance, blackjack payout, and shoe penetration.
- Includes training aids for running count, dealer score, player score, hidden dealer card visibility, optimal-play hints, dealer speed, and a basic strategy cheat sheet.
- Saves authenticated training sessions with moves and table-state snapshots so players can suspend, resume, end, and review sessions.
- Provides a session history area with summaries, logged moves, and recent snapshots.

## Tools And Stack

- **Framework:** Next.js App Router with React 19 and TypeScript
- **Authentication:** Clerk
- **Database:** PostgreSQL with Prisma 7
- **State management:** Redux Toolkit and React Redux
- **UI:** Tailwind CSS 4, shadcn-style Radix UI components, lucide-react icons, next-themes
- **Animation and interaction:** Framer Motion
- **Linting:** ESLint with Next.js config

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local `.env` file with the required app secrets:

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."
```

Run Prisma migrations against your database:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - start the Next.js development server with Turbopack
- `npm run build` - build the production app
- `npm run start` - start the production server
- `npm run lint` - run ESLint
- `npm run postinstall` - generate the Prisma client

## Project Structure

- `src/app` - Next.js routes, layout, API routes, and Redux store setup
- `src/components` - table UI, game controls, navigation, settings panels, and shared UI primitives
- `src/hooks` - session and inactivity hooks
- `src/lib` - blackjack session helpers, card counting, betting validation, Prisma, auth, and shared utilities
- `prisma` - database schema and migrations
- `public/cards` - playing card image assets
- `public/sounds` - card sound effects

## Notes

BlackJackLab is designed as a training environment rather than a real-money gambling app. Session data is tied to Clerk users, and table state is stored in PostgreSQL through Prisma so interrupted sessions can be resumed or reviewed.
