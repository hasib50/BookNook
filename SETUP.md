# BookNook setup checklist

## Before running
1. Install Node.js LTS and Git.
2. Create a MongoDB Atlas database user and allow your current IP address.
3. Copy `server/.env.example` to `server/.env`.
4. Copy `client/.env.example` to `client/.env.local`.
5. Use the same long random `JWT_SECRET` in both env files.
6. Add the same MongoDB connection string to both env files. Use the database name `booknook`.
7. Add an ImgBB API key to `NEXT_PUBLIC_IMGBB_API_KEY` in `client/.env.local`.
8. Configure Google OAuth after starting Better Auth; use its exact callback URL.

## Run in two terminals
Terminal 1:
```bash
cd server
npm install
npm run dev
```
Terminal 2:
```bash
cd client
npm install
npm run dev
```
Open http://localhost:3000.

## Notes
- Never paste secrets into chat or commit env files.
- Better Auth stores its authentication records in MongoDB; Express stores `books` and `borrows` in the same MongoDB database.
- The frontend asks the Next.js `/api/token` route for a short-lived JWT. The Express API verifies that JWT using the shared `JWT_SECRET`.
- Book details are a private route as specified in the assignment.
- Return dates are set to 7 days after borrowing.
