# Deploy Rules - MK9 Analytics

## Overview
This document outlines the deployment procedures, guidelines, and best practices for the MK9 Analytics project.

## Deployment Environments
- **Development**: Local Docker Compose setup
- **Staging**: Pre-production environment for testing
- **Production**: Live environment serving end users

## Prerequisites
- Docker and Docker Compose installed
- Node.js (v18 or higher) and npm
- PostgreSQL client (for manual database operations if needed)
- Access to container registry (if using custom images)
- Domain name and SSL certificates (for production)

## Deployment Process

### 1. Development Setup
```bash
# Clone repository
git clone <repository-url>
cd mk9-analytics

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with local development values

# Start services
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### 2. Staging Deployment
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci

# Set up environment variables (staging-specific)
# Use environment-specific .env file or platform secrets

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Start production server
npm start
```

### 3. Production Deployment
#### Using Docker (Recommended)
```bash
# Build Docker image
docker build -t mk9-analytics:latest .

# Push to container registry (if applicable)
docker push <registry>/mk9-analytics:latest

# Pull image on server
docker pull <registry>/mk9-analytics:latest

# Stop existing container
docker stop mk9-analytics || true
docker rm mk9-analytics || true

# Run new container
docker run -d \
  --name mk9-analytics \
  -p 80:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  <registry>/mk9-analytics:latest
```

#### Using Node.js Directly
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Set up environment variables
# Use production environment variables

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Start production server (using PM2 or similar)
pm2 start npm --name "mk9-analytics" -- start
```

## Environment Variables
### Required Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js (when implemented)
- `NEXTAUTH_URL`: Base URL of the application

### Optional Variables
- `NODE_ENV`: development, production, test
- `PORT`: Port to run the application on (default: 3000)
- `GOOGLE_DRIVE_CLIENT_ID`: Google Drive API client ID (for future integration)
- `GOOGLE_DRIVE_CLIENT_SECRET`: Google Drive API client secret
- `WHATSAPP_TOKEN`: WhatsApp Business API token (for future integration)
- `N8N_URL`: URL of n8n instance (for workflow integrations)

## Database Migrations
### Creating Migrations
```bash
# Make changes to prisma/schema.prisma
npx prisma migrate dev --name <migration-name>
```

### Applying Migrations
```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

### Resetting Database (Development Only)
```bash
npx migrate reset
```

## Backup and Recovery
### Database Backups
- **Automated**: Configure daily backups via cloud provider
- **Manual**: 
  ```bash
  pg_dump -U <user> -h <host> <database> > backup.sql
  ```

### Restoring from Backup
```bash
# Create new database
createdb <db-name>

# Restore
psql -U <user> -h <host> <db-name> < backup.sql
```

## Monitoring and Logging
### Health Checks
- Application endpoint: `/api/health`
- Database connectivity check
- Disk space and memory usage

### Logging
- Application logs: stdout/stderr (captured by Docker or process manager)
- Error tracking: Consider integrating with Sentry or similar
- Access logs: Enable in reverse proxy (NGINX, Apache)

### Metrics
- Prometheus endpoint (if implemented)
- Custom business metrics (to be added)

## Scaling
### Horizontal Scaling
- Use load balancer with multiple instances
- Ensure sticky sessions if not using JWT/shared session store
- Scale database read replicas for read-heavy workloads

### Vertical Scaling
- Increase container/resource limits
- Monitor performance bottlenecks

## Rollback Procedure
### Docker Rollback
```bash
# Stop current container
docker stop mk9-analytics

# Remove current container
docker rm mk9-analytics

# Start previous version
docker run -d \
  --name mk9-analytics \
  -p 80:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  <registry>/mk9-analytics:previous-tag
```

### Code Rollback
```bash
# Checkout previous commit
git checkout <previous-commit>

# Reinstall dependencies (if lock file changed)
npm ci

# Run migrations if needed
npx prisma migrate deploy

# Restart application
```

## Continuous Integration/Continuous Deployment (CI/CD)
### GitHub Actions Example
```yaml
name: CI/CD

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Staging
      if: github.ref == 'refs/heads/main'
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.STAGING_SERVER }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /path/to/app
          git pull
          npm ci
          npx prisma migrate deploy
          npm run build
          pm2 restart mk9-analytics
```

## Security Considerations
- **Environment Variables**: Never commit .env files; use secrets management
- **Container Security**: Scan images for vulnerabilities
- **Network Security**: Use firewalls to restrict access to ports
- **HTTPS**: Terminate SSL at load balancer or reverse proxy
- **Headers**: Implement security headers (Helmet-like)
- **Dependencies**: Regularly update dependencies (`npm audit`)

## Troubleshooting
### Common Issues
1. **Database Connection Failures**
   - Check DATABASE_URL format
   - Verify PostgreSQL service is running
   - Check network connectivity

2. **Application Fails to Start**
   - Check logs for error messages
   - Verify environment variables are set
   - Ensure port is not already in use

3. **Migration Errors**
   - Check migration SQL for syntax errors
   - Ensure database user has sufficient privileges
   - Consider manual migration if needed

4. **Performance Issues**
   - Monitor CPU and memory usage
   - Check database query performance
   - Consider caching or scaling

## Backup Validation
- Regularly test backup restoration
- Verify backup integrity
- Document recovery time objectives (RTO)

## Versioning
- Follow Semantic Versioning (MAJOR.MINOR.PATCH)
- Tag releases in Git
- Maintain changelog

## Roll-forward vs Rollback
- Prefer roll-forward (fixing forward) for minor issues
- Use rollback for critical failures

## Disaster Recovery
- Document recovery procedures
- Conduct regular drills
- Maintain off-site backups

-- 
*Last updated: July 16, 2026*