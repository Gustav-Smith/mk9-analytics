# Deployment Guide - MK9 Analytics

## Overview
This document explains how to deploy MK9 Analytics to various environments. The application is designed to be deployed using Docker Compose for development and staging, and can be adapted for production Kubernetes or cloud provider deployments.

## Prerequisites
- Docker Engine (version 20.10+)
- Docker Compose (version 2.0+)
- Git
- Node.js 18+ (for local development without Docker)
- PostgreSQL client (for manual database operations)

## Deployment Options

### 1. Local Development (Docker Compose)
Recommended for development and testing.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mk9-analytics.git
   cd mk9-analytics
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` to set your configuration:
   - `DATABASE_URL`: Will be overridden by docker-compose, but set for Prisma CLI
   - Other optional services (Google APIs, WhatsApp, etc.)

4. Build and start services:
   ```bash
   docker-compose up --build
   ```

5. Initialize the database (first time only):
   ```bash
   docker-compose exec db npx prisma migrate deploy
   docker-compose exec db npx prisma db seed
   ```

6. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api
   - n8n Dashboard: http://localhost:5678 (default credentials: admin/admin)

### 2. Production Deployment (Docker Compose)
For production, use a similar setup but with proper environment variables and reverse proxy.

1. Prepare production environment file (`.env.production`):
   ```env
   # Database (example using managed PostgreSQL)
   DATABASE_URL=postgresql://user:password@host:port/database?schema=public
   
   # Next.js
   NODE_ENV=production
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Optional services
   GOOGLE_DRIVE_CREDENTIALS=...
   WHATSAPP_TOKEN=...
   ```

2. Update `docker-compose.yml` for production:
   - Use specific image tags instead of building
   - Restart policies
   - Resource limits
   - Remove development-only ports if not needed

3. Deploy:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

4. Initialize database:
   ```bash
   docker-compose exec db npx prisma migrate deploy
   # Seed only if needed (be cautious in production)
   # docker-compose exec db npx prisma db seed
   ```

5. Set up reverse proxy (NGINX, Traefik, etc.) to:
   - Forward port 80/443 to the Next.js container (port 3000)
   - Optionally expose n8n on a subdomain or path

### 3. Vercel Deployment (Alternative)
For serverless deployment (note: requires adapting for serverless PostgreSQL):

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Set environment variables:
   - `DATABASE_URL`: Connection string to PostgreSQL (use Vercel PostgreSQL integration or external)
   - `NEXTAUTH_URL`: Your Vercel domain
   - `NEXTAUTH_SECRET`: Random string
4. Vercel will automatically build and deploy

### 4. Kubernetes Deployment
For orchestrated deployments:

1. Create Kubernetes manifests for:
   - Next.js app (Deployment + Service)
   - PostgreSQL (StatefulSet or use managed service)
   - n8n (Deployment + Service)
   - Ingress for routing

2. Use Helm charts or Kustomize for templating

3. Configure persistence for PostgreSQL data

4. Set up secrets for environment variables

## Database Migrations in Production
Always run migrations before deploying new code:
```bash
# Using Docker Compose
docker-compose exec db npx prisma migrate deploy

# Using Kubernetes
kubectl exec -it <postgres-pod> -- npx prisma migrate deploy
```

## Backup and Recovery
1. **Database Backups**: Use PostgreSQL dump or managed service backups
   ```bash
   # Example using pg_dump inside container
   docker-compose exec db pg_dump -U postgres -d database > backup.sql
   ```

2. **Volume Backups**: If using named volumes, backup the volume data

## Monitoring and Logging
- Application logs: View via `docker-compose logs -f`
- Consider integrating with ELK stack, Prometheus/Grafana, or cloud logging
- Health checks: Implement liveness/readiness probes in Kubernetes

## Security Considerations
- Change default passwords in production
- Use HTTPS/TLS in production
- Regularly update dependencies
- Review and adjust container permissions
- Use minimal base images in production

## Troubleshooting
- **Container fails to start**: Check logs with `docker-compose logs <service>`
- **Database connection errors**: Verify `DATABASE_URL` and network connectivity
- **Port conflicts**: Ensure ports 3000 (app), 5432 (db), 5678 (n8n) are free
- **Permission issues**: Check volume mounts and user IDs in containers