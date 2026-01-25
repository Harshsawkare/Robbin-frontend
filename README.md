# Robbin Frontend - Incident Management System

A Next.js application for tracking and managing incidents with a clean, modern UI.

## Features

- ✅ **Next.js 16** with App Router
- ✅ **Tailwind CSS** for styling
- ✅ **TypeScript** for type safety
- ✅ **Server-side rendering** for optimal performance
- ✅ **Incidents page** with table display
- ✅ **Automatic sorting** (newest first)
- ✅ **Mock API** for testing

## Getting Started

### Configure Backend URL

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your backend URL:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### View Incidents

Navigate to [http://localhost:3000/incidents](http://localhost:3000/incidents) to see the incidents list.

## Project Structure

```
robbin-frontend/
├── app/
│   ├── incidents/
│   │   └── page.tsx              # Incidents page with table UI
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── config/
│   └── api.ts                    # API configuration & base URL
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment variables (not committed)
├── package.json
└── README.md
```

## API Configuration

### Backend URL Setup

The backend URL is configured using environment variables:

**Location:** `config/api.ts`

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
```

### Environment Variables

1. **Development:** Set in `.env.local`
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

2. **Production:** Set in your deployment platform
   - Vercel: Project Settings → Environment Variables
   - Other platforms: Add `NEXT_PUBLIC_API_BASE_URL` environment variable

### Incident Data Structure

```typescript
interface Incident {
  id: string;                           // UUID
  service: string;                      // Service name
  environment: string;                  // production, staging, development
  severity: string;                     // error, warning, info, etc.
  message: string;                      // Error message
  stacktrace: string;                   // Full stacktrace
  incident_metadata: Record<string, any>; // Additional metadata
  created_at: string;                   // ISO timestamp
}
```

### API Endpoints

The app uses the following endpoints:

1. **GET /api/ingest/incidents** - List all incidents
   - Query parameters:
     - `skip` - Number to skip for pagination (default: 0)
     - `limit` - Max results to return (default: 100, max: 1000)
     - `service` - Filter by service name (optional)
     - `environment` - Filter by environment (optional)
     - `severity` - Filter by severity level (optional)
   - Returns incidents sorted by `created_at` descending (newest first)

2. **GET /api/ingest/incidents/{incident_id}** - Get specific incident
   - Retrieves a single incident by its UUID
   - Returns 404 if incident not found

## Features

### Incidents Page

- **Table view** with responsive design
- **Color-coded status badges**:
  - 🟢 Resolved (green)
  - 🟡 Investigating (yellow)
  - 🔴 Active/Open (red)
- **Severity indicators**:
  - 🔴 Critical/High
  - 🟠 Medium
  - 🔵 Low
- **Automatic sorting** by creation date (newest first)
- **Empty state** when no incidents found
- **Hover effects** for better UX

## Building for Production

```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
