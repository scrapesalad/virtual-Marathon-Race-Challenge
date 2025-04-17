# Virtual Race

A virtual racing platform that integrates with Strava to create and participate in virtual races.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

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
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration values.

4. Start the database and pgAdmin:
```bash
docker-compose up -d
```

5. Access pgAdmin:
- Open http://localhost:5050 in your browser
- Login with:
  - Email: admin@virtualrace.com
  - Password: admin
- Add a new server in pgAdmin:
  - Name: Virtual Race
  - Host: postgres
  - Port: 5432
  - Database: virtual_race
  - Username: postgres
  - Password: password (or your custom password from .env)

6. Run database migrations:
```bash
npx prisma migrate dev
```

7. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Database Management

### Using pgAdmin 4
- Access pgAdmin at http://localhost:5050
- Use the GUI to manage your database, run queries, and view data

### Using Prisma Studio
```bash
npx prisma studio
```
Access Prisma Studio at http://localhost:5555

### Running Migrations
```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

## Environment Variables

Key environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `STRAVA_CLIENT_ID`: Your Strava API client ID
- `STRAVA_CLIENT_SECRET`: Your Strava API client secret

See `.env.example` for all available options.

## Development Tools

- **Next.js 14**: React framework
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **pgAdmin 4**: Database management
- **TailwindCSS**: Styling
- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset everything (including volumes)
docker-compose down -v
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details
