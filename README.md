# Virtual Race Platform

A modern web application for organizing and participating in virtual races, with Strava integration and real-time progress tracking.

## Features

- 🏃‍♂️ Create and join virtual races
- 🗺️ Interactive race route visualization
- 📊 Real-time progress tracking
- 🔄 Strava integration
- 📱 Responsive design
- 🌍 Global leaderboard
- 🏆 Achievement system

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Maps**: Mapbox
- **Activity Tracking**: Strava API

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Strava API credentials
- Mapbox API token

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/virtual-race.git
   cd virtual-race
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your credentials:
     - Database URL
     - NextAuth secret
     - Strava API credentials
     - Mapbox token

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

1. Set up a PostgreSQL database (e.g., on Railway, Supabase, or your preferred provider)

2. Deploy to Vercel:
   - Connect your repository to Vercel
   - Set up environment variables in Vercel dashboard
   - Deploy!

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/virtual_race"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-at-least-32-chars"

# Strava API
STRAVA_CLIENT_ID="your-strava-client-id"
STRAVA_CLIENT_SECRET="your-strava-client-secret"
STRAVA_WEBHOOK_VERIFY_TOKEN="your-webhook-verify-token"

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Database Management

- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
