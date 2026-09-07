# API

Base: `http://localhost:5000/api`

## Auth
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/guest`
- GET `/auth/me`
- GET `/auth/google`

## AI
- POST `/chat`
  - body: `{ "message": "...", "conversationId": null, "useWeb": true }`

## Search
- GET `/search?q=...`
- POST `/search` body `{ "q": "..." }`

## Files
- GET `/files`
- POST `/files` multipart field `file`
- DELETE `/files/:id`

## Payment
- POST `/payment/create-order`
- POST `/payment/verify`

## User
- PUT `/user/profile`
- GET `/user/history`
- GET `/user/history/:id`

## Admin
- GET `/admin/dashboard`
- GET `/admin/users`
- GET `/admin/payments`
- GET `/admin/usage`
- GET `/admin/owner`

All protected endpoints use:
`Authorization: Bearer <JWT>`
