# Environment Configuration Guide

This project uses environment-specific configuration files to manage different deployment environments.

## Available Environments

- **Local** (`.env.local`) - For local development on your machine
- **Development** (`.env.dev`) - For development server deployment
- **Staging** (`.env.staging`) - For staging/pre-production environment
- **Production** (`.env.prod`) - For production deployment

## Quick Start

### 1. Initial Setup

Copy the `.env.example` file to `.env.local` and fill in your actual values:

```bash
cp .env.example .env.local
```

### 2. Configure Auth0

Get your Auth0 credentials from the [Auth0 Dashboard](https://manage.auth0.com/):

1. Create or select your Application
2. Go to Settings tab
3. Copy the following values:
   - **Domain** → Use as `AUTH0_ISSUER` (format: `https://your-tenant.auth0.com`)
   - **Client ID** → Use as `AUTH0_CLIENT_ID`
   - **Client Secret** → Use as `AUTH0_CLIENT_SECRET`

### 3. Generate NEXTAUTH_SECRET

Generate a secure random secret:

```bash
openssl rand -base64 32
```

Use this value for `NEXTAUTH_SECRET` in your environment file.

## NPM Scripts Usage

### Development

```bash
# Run development server with default .env.local
npm run dev

# Run with specific environment
npm run dev:local          # Uses .env.local
npm run dev:dev            # Uses .env.dev
npm run dev:staging        # Uses .env.staging
npm run dev:prod           # Uses .env.prod
```

### Building

```bash
# Build with default .env.local
npm run build

# Build with specific environment
npm run build:local        # Uses .env.local
npm run build:dev          # Uses .env.dev
npm run build:staging      # Uses .env.staging
npm run build:prod         # Uses .env.prod
```

### Production Start

```bash
# Start with default .env.local
npm run start

# Start with specific environment
npm run start:local        # Uses .env.local
npm run start:dev          # Uses .env.dev
npm run start:staging      # Uses .env.staging
npm run start:prod         # Uses .env.prod
```

### Environment Check

Verify your environment variables are loaded correctly:

```bash
npm run env:check
```

## Environment Variables Reference

### Application Settings

- `NEXT_PUBLIC_APP_NAME` - Application name displayed in UI
- `NEXT_PUBLIC_APP_URL` - Public URL of your application

### Auth0 Configuration

- `AUTH0_CLIENT_ID` - Your Auth0 application client ID
- `AUTH0_CLIENT_SECRET` - Your Auth0 application client secret
- `AUTH0_ISSUER` - Your Auth0 tenant URL (e.g., `https://your-tenant.auth0.com`)

### NextAuth Configuration

- `NEXTAUTH_URL` - The canonical URL of your site
- `NEXTAUTH_SECRET` - Random string used to encrypt tokens (min 32 characters)

### API Configuration

- `NEXT_PUBLIC_API_URL` - Backend API base URL

## Environment File Structure

### .env.local (Local Development)
```env
NEXT_PUBLIC_APP_NAME="Identity Server - Local"
NEXT_PUBLIC_APP_URL=http://localhost:3000

AUTH0_CLIENT_ID=your-local-auth0-client-id
AUTH0_CLIENT_SECRET=your-local-auth0-client-secret
AUTH0_ISSUER=https://your-tenant.auth0.com

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars

NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### .env.dev (Development Server)
```env
NEXT_PUBLIC_APP_NAME="Identity Server - Dev"
NEXT_PUBLIC_APP_URL=https://dev.yourdomain.com

AUTH0_CLIENT_ID=your-dev-auth0-client-id
AUTH0_CLIENT_SECRET=your-dev-auth0-client-secret
AUTH0_ISSUER=https://your-tenant-dev.auth0.com

NEXTAUTH_URL=https://dev.yourdomain.com
NEXTAUTH_SECRET=your-dev-nextauth-secret-min-32-chars

NEXT_PUBLIC_API_URL=https://dev-api.yourdomain.com/api
```

### .env.staging (Staging Environment)
```env
NEXT_PUBLIC_APP_NAME="Identity Server - Staging"
NEXT_PUBLIC_APP_URL=https://staging.yourdomain.com

AUTH0_CLIENT_ID=your-staging-auth0-client-id
AUTH0_CLIENT_SECRET=your-staging-auth0-client-secret
AUTH0_ISSUER=https://your-tenant-staging.auth0.com

NEXTAUTH_URL=https://staging.yourdomain.com
NEXTAUTH_SECRET=your-staging-nextauth-secret-min-32-chars

NEXT_PUBLIC_API_URL=https://staging-api.yourdomain.com/api
```

### .env.prod (Production Environment)
```env
NEXT_PUBLIC_APP_NAME="Identity Server"
NEXT_PUBLIC_APP_URL=https://yourdomain.com

AUTH0_CLIENT_ID=your-production-auth0-client-id
AUTH0_CLIENT_SECRET=your-production-auth0-client-secret
AUTH0_ISSUER=https://your-tenant.auth0.com

NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-nextauth-secret-min-32-chars

NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Best Practices

1. **Never commit sensitive environment files** - Only `.env.example` should be in version control
2. **Use different Auth0 applications** for each environment (local, dev, staging, prod)
3. **Rotate secrets regularly** especially `NEXTAUTH_SECRET` in production
4. **Keep .env.example updated** when adding new variables
5. **Document all environment variables** and their purpose
6. **Use consistent naming** - Follow the pattern: `.env.{environment}`

## CI/CD Pipeline

For deployment pipelines, set environment variables through your CI/CD platform's secrets management:

- **GitHub Actions**: Repository Secrets
- **Vercel**: Environment Variables in Project Settings
- **AWS/Azure**: Parameter Store or Key Vault
- **Docker**: Use `--env-file` flag or secrets management
- **Kubernetes**: ConfigMaps and Secrets

### Example for Docker

Development:
```bash
docker run --env-file .env.dev your-image
```

Staging:
```bash
docker run --env-file .env.staging your-image
```

Production:
```bash
docker run --env-file .env.prod your-image
```

### Example for GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches:
      - main
      - develop
      - staging

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Deploy to Dev
      - name: Deploy to Dev
        if: github.ref == 'refs/heads/develop'
        run: npm run build:dev

      # Deploy to Staging
      - name: Deploy to Staging
        if: github.ref == 'refs/heads/staging'
        run: npm run build:staging

      # Deploy to Production
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: npm run build:prod
```

## Environment Workflow

```
┌─────────────┐
│ .env.local  │ → Local development (your machine)
└─────────────┘

┌─────────────┐
│  .env.dev   │ → Development server (team testing)
└─────────────┘

┌─────────────┐
│ .env.staging│ → Staging server (pre-production testing)
└─────────────┘

┌─────────────┐
│  .env.prod  │ → Production server (live users)
└─────────────┘
```

## Troubleshooting

### Environment variables not loading

1. Restart your development server
2. Check file naming (must be exactly `.env.local`, `.env.dev`, etc.)
3. Verify no syntax errors in the file (no spaces around `=`)
4. Run `npm run env:check` to verify variables are loaded
5. Check that `env-cmd` is installed: `npm install`

### Auth0 authentication failing

1. Verify `AUTH0_ISSUER` has correct format (must include `https://`)
2. Check `NEXTAUTH_URL` matches your current URL
3. Ensure callback URLs are configured in Auth0 dashboard:
   - `{NEXTAUTH_URL}/api/auth/callback/auth0`
4. Verify `NEXTAUTH_SECRET` is set and at least 32 characters
5. Check Auth0 application type is set to "Regular Web Application"

### Build failing in production

1. Ensure all required variables are set in `.env.prod`
2. Verify no references to `process.env` variables that don't exist
3. Use `NEXT_PUBLIC_` prefix for client-side variables
4. Check for typos in variable names
5. Ensure `env-cmd` package is installed

### Different behavior across environments

1. Check that each `.env.*` file has correct values
2. Verify you're running the correct npm script (`dev:dev`, `build:staging`, etc.)
3. Clear Next.js cache: `rm -rf .next`
4. Check for hardcoded values in your code

## Security Notes

### Protection
- Environment files contain sensitive information - **NEVER commit them to git**
- Use strong, unique secrets for each environment
- Implement secret rotation policies (every 90 days recommended)
- Monitor for exposed credentials in version control
- Use least privilege principle for API keys and secrets

### Git Protection
The `.gitignore` file is configured to exclude:
- `.env.local`
- `.env.dev`
- `.env.staging`
- `.env.prod`

Only `.env.example` should be committed to git.

### Secret Management
For production environments, consider using:
- AWS Secrets Manager
- Azure Key Vault
- Google Cloud Secret Manager
- HashiCorp Vault
- Vercel Environment Variables

## Development Tips

### Quick Environment Switching

Create aliases in your shell profile (`.bashrc`, `.zshrc`):

```bash
alias dev:local="npm run dev:local"
alias dev:dev="npm run dev:dev"
alias dev:staging="npm run dev:staging"
```

### Environment Variable Debugging

Add this to your code temporarily:

```javascript
console.log({
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID?.slice(0, 5) + '...',
  AUTH0_ISSUER: process.env.AUTH0_ISSUER,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  API_URL: process.env.NEXT_PUBLIC_API_URL
});
```

### Validate Environment Variables

You can add validation at runtime:

```javascript
const requiredEnvVars = [
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_ISSUER',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## Support

For issues or questions about environment configuration, please refer to:
- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Auth0 Next.js Quickstart](https://auth0.com/docs/quickstart/webapp/nextjs)
- [NextAuth.js Documentation](https://next-auth.js.org/configuration/options)
- [env-cmd Documentation](https://github.com/toddbluhm/env-cmd)

## FAQ

**Q: Why use `env-cmd` instead of Next.js built-in env support?**
A: `env-cmd` allows explicit environment file selection per command, making it easier to manage multiple environments and preventing accidental mixing of configurations.

**Q: Can I use `.env.development` and `.env.production`?**
A: Yes, but this project uses `.env.dev` and `.env.prod` for shorter naming. You can rename if preferred, just update the scripts in `package.json`.

**Q: What's the difference between `.env.local` and `.env.dev`?**
A: `.env.local` is for your local machine development. `.env.dev` is for a shared development server where the team can test features together.

**Q: Should I commit `.env.example`?**
A: Yes! `.env.example` serves as documentation and template for other developers. Never include real credentials in it.

**Q: How do I generate a secure NEXTAUTH_SECRET?**
A: Run: `openssl rand -base64 32` or use an online generator, but ensure it's cryptographically random and unique per environment.
