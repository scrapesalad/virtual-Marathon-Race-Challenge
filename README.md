# Virtual Race

A virtual race platform built with Next.js, Prisma, and Strava integration.

## Live Demo

The application is deployed at [https://virtual-race.vercel.app/](https://virtual-race.vercel.app/)

## Features

- User authentication with NextAuth.js
- Strava integration for activity tracking
- Interactive race maps with Mapbox
- Real-time race progress tracking
- Mobile-responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js
- Mapbox GL JS
- Tailwind CSS
- Vercel Deployment

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in all required environment variables

4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Add all required environment variables
5. Deploy!

## License

MIT
