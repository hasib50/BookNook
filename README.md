# BookNook – A Small Online Library

A full-stack online library 

# Live Website
https://book-nook-gold.vercel.app/

## Features
- Browse the latest and all books with search/category filtering.
- Register and sign in with email/password or Google using Better Auth.
- Add, edit and delete your own books.
- Upload book cover images through ImgBB.
- Borrow and return books with available-copy tracking.
- Prevent borrowing the same book more than once at a time.
- Express API protected with JWT verification.
- Responsive layout, loading states, toast feedback and custom not-found page.

## Tech stack
Next.js App Router, TypeScript, Tailwind CSS, DaisyUI, Better Auth, MongoDB, Express.js, JWT, ImgBB, Swiper, Framer Motion, React Hot Toast.

## Folder structure
- `client/` – Next.js frontend and Better Auth
- `server/` – Express API and MongoDB collections

## Local setup

### 1. Server
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Fill in `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, and `CLIENT_ORIGIN` in `.env`.

### 2. Client
```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```
Fill in `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`, `MONGODB_DB_NAME`, `NEXT_PUBLIC_API_URL`, and `NEXT_PUBLIC_IMGBB_API_KEY` (ImgBB upload keys are used in the browser in this starter; use a server-side upload proxy if you need to keep the key private).

Open http://localhost:3000.

## Google OAuth
Create a Google OAuth Web Client in Google Cloud Console. Add the exact callback URL shown by Better Auth for your configured auth base URL. Add the Google client ID and secret to `client/.env.local`.

## ImgBB
Create an API key at https://api.imgbb.com/ and add it as `IMGBB_API_KEY` in `client/.env.local`.

## Deployment
- Deploy `server/` to Render (Root Directory: `server`, Build: `npm install`, Start: `npm start`).
- Deploy `client/` to Vercel (Root Directory: `client`).
- Set all environment variables from the example files in the corresponding hosting dashboards.
- Set `CLIENT_ORIGIN` on the server to the deployed client URL and `NEXT_PUBLIC_API_URL` on the client to the deployed server URL.
- Configure Google OAuth authorized origins and redirect URI for the production domain.

## Important
Never commit `.env` or `.env.local`. Do not share database passwords, Better Auth secrets, OAuth client secrets, or ImgBB keys publicly.
