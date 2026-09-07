# AI Platform

A full-stack AI/search platform starter with:
- React client
- React admin dashboard
- Node.js + Express backend
- PostgreSQL database
- JWT email/password authentication
- Guest sessions
- Google OAuth
- OpenAI Responses API with optional web search
- Web search provider abstraction (Tavily)
- File upload
- Razorpay payment/order verification
- Premium subscriptions
- Admin/owner dashboard

Owner:
- Rajesh
- rgangula79@gmail.com
- 9515242059

## Requirements
- Node.js 22+
- PostgreSQL 14+
- npm

## 1. Database
Create a PostgreSQL database named `ai_platform`, then run:
```bash
psql -U postgres -d ai_platform -f database/schema.sql
psql -U postgres -d ai_platform -f database/seed.sql
```

## 2. Server
```bash
cd server
copy .env.example .env
npm install
npm run dev
```

## 3. Client
```bash
cd client
copy .env.example .env
npm install
npm run dev
```

## 4. Admin
```bash
cd admin
copy .env.example .env
npm install
npm run dev
```

Default URLs:
- Client: http://localhost:5173
- Server: http://localhost:5000
- Admin: http://localhost:5174

## Important
The client never contains secret API keys. OpenAI, Google client secrets, Razorpay secret, SMTP password, and database credentials belong in `server/.env`.

The application runs in a useful development mode even when optional AI/search/payment credentials are not configured:
- AI falls back to a clear local response.
- Search falls back to a safe message.
- Payment routes return a configuration error until Razorpay is configured.

Before production:
- change JWT_SECRET
- configure HTTPS
- configure PostgreSQL securely
- configure Google OAuth redirect URI
- configure OpenAI
- configure search provider
- configure Razorpay and webhook
- configure SMTP
- add production CORS origins
- add backups, monitoring, logging and rate limits
