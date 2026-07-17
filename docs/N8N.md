# n8n Integration - MK9 Analytics

## Overview
n8n is a workflow automation tool that enables connecting MK9 Analytics with external services like Google Drive, Google Sheets, WhatsApp, and others. It allows for automated data synchronization, notifications, and process orchestration without writing custom code.

## Current Status
As of Sprint 2 (Import Module in progress), the n8n directory exists (`n8n/`) but no workflows have been configured yet. The docker-compose.yml includes an n8n service for development.

## Planned Integrations

### 1. Google Drive Synchronization
- **Trigger**: New file added to a specific Google Drive folder
- **Actions**:
  - Validate file type (Excel/CSV)
  - Notify MK9 Analytics backend via webhook to process the file
  - Move processed file to an archive folder
  - Send success/failure notification to relevant stakeholders
- **Use Case**: Automatically import promotional plan spreadsheets dropped into a shared Drive folder

### 2. Google Sheets Bidirectional Sync
- **Directions**:
  - Push: Export MK9 Analytics data (visit summaries, compliance reports) to Google Sheets
  - Pull: Import updates from Google Sheets (e.g., manual corrections, additional notes)
- **Triggers**: 
  - Scheduled (daily/hourly)
  - Webhook from MK9 Analytics (on data update)
  - Google Sheets change event
- **Use Case**: Provide non-technical stakeholders with familiar spreadsheet views of operational data

### 3. WhatsApp Business Automation
- **Triggers**:
  - Visit status changes (e.g., marked as REALIZADA)
  - Upcoming visit reminders (24h before scheduled time)
  - No-show alerts (visit not marked as completed 2h after scheduled time)
  - Monthly operation summary
- **Actions**:
  - Send templated WhatsApp messages to promoters
  - Send broadcast messages to supervisor groups
  - Enable two-way communication for simple commands (e.g., "STATUS" to get today's schedule)
- **Use Case**: Improve field communication and reduce no-shows through automated reminders

### 4. Email Notifications
- **Triggers**:
  - Import failures
  - Weekly performance summaries
  - Monthly operation reports
  - System alerts (disk space, backup failures)
- **Use Case**: Keep management informed without requiring dashboard login

### 5. Data Backup and Maintenance
- **Scheduled Workflows**:
  - Daily database backups to cloud storage (AWS S3, Google Cloud Storage)
  - Weekly data quality checks (duplicate detection, referential integrity)
  - Monthly archive of old data to cold storage
  - Log rotation and cleanup
- **Use Case**: Ensure data safety and system health without manual intervention

### 6. External System Integration
- **CRM Systems** (Salesforce, HubSpot):
  - Sync customer/store master data
  - Push visit outcomes for lead scoring
- **ERP Systems** (SAP, Oracle):
  - Exchange product/inventory data
  - Reconcile promotional activity with sales data
- **BI Tools** (Tableau, Power BI):
  - Extract aggregated data for executive dashboards
- **Use Case**: Break down data silos and create a unified operational view

## Technical Implementation

### n8n Setup
- Runs as a Docker service (included in docker-compose.yml)
- Accessible at `http://localhost:5678` in development
- Uses SQLite for data storage by default (can be configured to use PostgreSQL)
- Secured via basic auth in development; should use proper authentication in production

### Communication with MK9 Analytics
- **Webhooks**: MK9 Analytics exposes webhook endpoints for n8n to trigger
- **API Calls**: n8n uses HTTP nodes to call MK9 Analytics API endpoints
- **Database Access**: For advanced workflows, n8n can connect directly to PostgreSQL (though API preferred)
- **Authentication**: 
  - Development: No auth or basic auth
  - Production: API keys, OAuth2, or JWT tokens

### Workflow Storage
- Workflows are stored in the `n8n/` directory
- Should be version-controlled in Git
- Use n8n's export/import feature for backup and migration

## Development Workflow
1. Start development environment: `docker-compose up`
2. Access n8n at http://localhost:5678
3. Create workflows using the visual editor
4. Test with sample data
5. Export workflows to `n8n/workflows/` for version control
6. Share workflows with team via Git

## Production Considerations
- Use proper authentication (API keys, OAuth)
- Set up HTTPS/TLS for n8n instance
- Configure persistent storage for workflow data
- Set up monitoring and alerts for workflow failures
- Implement retry mechanisms for failed steps
- Consider using n8n enterprise features for scalability and SSO

## Example Workflows

### 1. Google Drive to MK9 Analytics Import
```
Trigger: Google Drive - Watch Folder (New file in /MK9_Imports)
  ↓
Validate: Check file extension (.xlsx, .xls, .csv)
  ↓
Webhook Call: POST to /api/imports/webhook/google-drive
  ↓
Branch: Success/Failure
  ↓
Success: Move file to /MK9_Processed, send Slack notification
  ↓
Failure: Move file to /MK9_Failed, alert admin via email
```

### 2. Visit Reminder via WhatsApp
```
Trigger: Cron - Every hour at 00 minutes
  ↓
MK9 API: GET /api/visits/upcoming?window=1hour
  ↓
Filter: Visits with status = PLANEJADA
  ↓
For Each: 
  ↓
WhatsApp: Send template message to promoter's phone
  ↓
Log: Create audit entry in MK9 via API
```

### 3. Daily Performance Email
```
Trigger: Cron - Every day at 08:00
  ↓
MK9 API: GET /api/reports/daily-summary?yesterday=true
  ↓
Email: Send HTML report to management list
  ↓
Slack: Post summary to #marketing-ops channel
```

## Security Considerations
- Validate all webhook inputs in MK9 Analytics
- Use HTTPS for all external communications
- Store credentials securely (n8n's built-in credential management)
- Limit network exposure (firewall rules, VPC)
- Regularly audit workflow permissions and access logs

## Maintenance
- Regularly update n8n to latest stable version
- Backup workflow database periodically
- Monitor execution logs for failures
- Review and optimize workflows quarterly
- Document custom nodes or functions

## Resources
- n8n Documentation: https://docs.n8n.io/
- Community Nodes: https://n8n.io/integrations/
- Workflow Templates: https://n8n.io/workflows/