# Deployment

Deploy the three applications separately or behind one reverse proxy.

Recommended:
1. PostgreSQL managed database.
2. Node server on a service supporting Node 22+.
3. Client and admin as static Vite builds.
4. HTTPS everywhere.
5. Production CORS allowlist.
6. Secrets only on the server.
7. Configure Google OAuth redirect URI to `/api/auth/google/callback`.
8. Configure Razorpay live keys only after test payments pass.
9. Configure Razorpay webhooks and verify signatures.
10. Configure SMTP and password reset emails.

Build commands:
- `npm run build` in client
- `npm run build` in admin
- `npm start` in server
