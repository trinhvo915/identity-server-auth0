# Docker Configuration Guide

This project supports multiple environments: **local**, **dev**, **staging**, and **prod**.

## Environment Files

- `.env` - Default environment (local) - for developers running on their machine
- `.env.dev` - Development environment
- `.env.staging` - Staging environment
- `.env.prod` - Production environment

## Application Properties

- `application.properties` - Common configuration and default profile (local)
- `application-local.properties` - Local development settings (for developers)
- `application-dev.properties` - Development environment settings
- `application-staging.properties` - Staging-specific settings
- `application-prod.properties` - Production-specific settings

## Running with Docker Compose

### Local (Default - for developers)

```bash
# Using default .env file - automatically uses 'local' profile
docker-compose up -d
```

### Development

```bash
# Explicitly specify dev environment
docker-compose --env-file .env.dev up -d
```

### Staging

```bash
docker-compose --env-file .env.staging up -d
```

### Production

```bash
docker-compose --env-file .env.prod up -d
```

## Running Locally (without Docker)

### Local Development (Default - Recommended for developers)

```bash
# The application will automatically use 'local' profile
./gradlew bootRun

# Or using IntelliJ IDEA / Eclipse - just run the main class
# The 'local' profile will be activated automatically
```

### Development

```bash
# Set profile via environment variable
SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun

# Or via command line argument
./gradlew bootRun --args='--spring.profiles.active=dev'
```

### Staging

```bash
# Set profile via environment variable
SPRING_PROFILES_ACTIVE=staging ./gradlew bootRun

# Or via command line argument
./gradlew bootRun --args='--spring.profiles.active=staging'
```

### Production

```bash
SPRING_PROFILES_ACTIVE=prod ./gradlew bootRun
```

## Database Configuration per Environment

### Local (for developers)
- Database: `identity_server_local_db`
- User: `sa`
- Password: `123456`
- Host: `localhost` (when running locally) or `postgres` (in Docker)
- Port: `5432`
- DDL: `update` (auto-create/update tables)
- Logging: Verbose (DEBUG level with SQL queries)

### Development
- Database: `identity_server_db`
- User: `sa`
- Password: `123456`
- Port: `5432`
- DDL: `update` (auto-create/update tables)
- Logging: Verbose (DEBUG level)

### Staging
- Database: `identity_server_staging_db`
- User: `sa`
- Password: `123456`
- Port: `5432`
- DDL: `validate` (validate schema only, no changes)
- Logging: Normal (INFO level)

### Production
- Database: `identity_server_prod_db`
- User: `sa`
- Password: `123456`
- Port: `5432`
- DDL: `validate` (validate schema only, no changes)
- Logging: Minimal (WARN level)

## Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f postgres

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build

# Check service status
docker-compose ps

# Access PostgreSQL CLI (local environment)
docker exec -it identity-server-postgres-local psql -U sa -d identity_server_local_db

# Access PostgreSQL CLI (dev environment)
docker exec -it identity-server-postgres-dev psql -U sa -d identity_server_db
```

## Environment Variables

You can override any environment variable when running docker-compose:

```bash
# Override specific variables
ENV=dev POSTGRES_PASSWORD=newpassword docker-compose up -d

# Override backend port
BACKEND_PORT=9090 docker-compose up -d
```

## Security Notes

⚠️ **IMPORTANT**:
- The `.env*` files contain sensitive information (passwords)
- Make sure to add them to `.gitignore`
- In production, use secure password management (e.g., Docker secrets, environment variables from CI/CD)
- Change default passwords before deploying to production

## Troubleshooting

### Database connection issues
```bash
# Check if PostgreSQL is ready (local)
docker exec identity-server-postgres-local pg_isready -U sa

# Check if PostgreSQL is ready (dev)
docker exec identity-server-postgres-dev pg_isready -U sa

# View PostgreSQL logs
docker-compose logs postgres
```

### Backend startup issues
```bash
# View backend logs
docker-compose logs backend

# Check active profile
docker-compose logs backend | grep "The following profiles are active"
```
