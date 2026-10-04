# Charmingale Auth Review Notes

This file focuses on the current authentication setup in the app and server so the next review can target the real remaining work.

## Current State

### App side
- The Expo app has Google client environment values configured in the mobile env file.
- The server is configured with `GOOGLE_WEB_CLIENT_ID`.
- The app root layout triggers push registration on startup.
- There is no clear Google Sign-In implementation found in the mobile app codebase yet.
- There is no obvious app-side JWT storage or auth guard flow currently wired into the screen navigation.

### Server side
- `User` model exists with fields like `email`, `password`, `googleId`, `name`, and timestamps.
- Google auth route exists at `/auth/google`.
- Google ID token is verified using `google-auth-library`.
- User is created or updated with `upsert` by email.
- JWT is issued using `jsonwebtoken` after successful Google verification.
- Auth middleware exists to read the bearer token and set `req.userId`.

## Current Auth Flow

### What is implemented
- Google token validation on the backend
- User creation/update on successful Google login
- JWT generation for the user
- protected route middleware using Bearer tokens

### What is still incomplete or risky
- The app does not appear to actually call the Google auth endpoint yet.
- The app does not appear to persist the JWT after login.
- Many server-side data queries still seem to use fixed values instead of the authenticated user (`req.userId`).
- The database is structured for per-user progress, but some flows may still be effectively global or user-1 scoped.
- This means the app is not yet fully multi-user safe.

## Important Concern

The biggest issue is not the Google verification itself. The bigger issue is that the app still needs consistent user-scoping across the whole project.

Right now, the backend has the right auth architecture, but the project likely still needs:
- real login flow from app to server
- JWT storage in the mobile app
- authenticated API requests for protected routes
- replacing hardcoded user logic with `req.userId`
- ensuring progress, files, notifications, streaks, and device tokens belong to the logged-in user

## What the User Table Should Be Used For

The `User` table is the correct place to store:
- email
- Google account identity (`googleId`)
- display name
- auth identity for each user

It should be used as the source of truth for login identity and user-specific data.

## What Should Happen Next

The next phase should be:
1. wire Google login on the mobile app
2. send Google ID token to `/auth/google`
3. receive JWT from server
4. store token securely on the client
5. attach token to all protected requests
6. use `req.userId` in every relevant server query
7. ensure user-specific data is isolated per account

## Final Review Note

The auth foundation exists, but it is not fully complete. The project is at the stage where auth infrastructure is present, but the actual end-to-end user identity flow still needs to be finished and verified.

This is the part Claude should analyze next: whether the current auth architecture is complete, whether the app is actually using it, and what must be changed to make the project production-ready and multi-user safe.
