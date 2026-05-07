# serendpt-mobile

Standalone Expo (React Native + TypeScript + Expo Router) mobile app for Serendpt.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

3. Set API base URL:

```env
EXPO_PUBLIC_SERENDPT_API_BASE_URL=https://your-api-url.com
```

Optional for Google auth (if configured on backend/mobile):

- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`

## Run

```bash
npm run start
npm run android
npm run ios
```

## Implemented Screens

1. Onboarding (`app/index.tsx`)
2. Login (`app/auth/login.tsx`)
3. Signup (`app/auth/signup.tsx`)
4. OTP Verification (`app/auth/verify-otp.tsx`)
5. Home / Document Library (`app/home.tsx`)
6. Reader / Listening (`app/reader/[documentId].tsx`)

## Implemented APIs

Auth:

- `POST /signup`
- `POST /verify-signup-otp`
- `POST /resend-otp`
- `POST /login`
- `POST /verify-login-otp`
- `POST /auth/google/mobile`

User:

- `GET /users/me`

Documents:

- `POST /process_document/`
- `GET /documents/by_email`
- `GET /documents/{document_id}/batches_content`
- `PUT /documents/{document_id}/last_read_position`

Audio:

- `GET /audio/voices`
- `POST /audio/stream`
- `POST /audio/text`

## Upload + Reader Flow

1. Authenticate via login/signup (+ OTP if required).
2. Home fetches uploaded docs from `GET /documents/by_email`.
3. Upload accepts PDF/DOC/DOCX/TXT (<= 50MB) and sends multipart `file` to `POST /process_document/`.
4. Open a card to enter reader route `/reader/[documentId]`.
5. Reader fetches and sorts batches from `GET /documents/{document_id}/batches_content`.
6. Batch content is converted to readable text (sorted keys, non-empty values, double line breaks).
7. Previous/next/page-selector navigation updates visible page.
8. Last-read position is debounced and persisted with `PUT /documents/{document_id}/last_read_position`.

## AI Reading / Audio Behavior

- Voices are fetched from `GET /audio/voices`.
- Default voice preference: Charlotte -> Ryan -> first non-disabled.
- Floating yellow button behavior:
  - idle/error: generate + play
  - loading/buffering: disabled/spinner
  - playing: pause
  - paused: resume
- Audio generation uses:
  1. `POST /audio/stream` first
  2. fallback to `POST /audio/text` for mobile reliability
- Base64 WAV is cached locally per `documentId + batchOrder + speaker`.
- Audio stops on page change and screen unmount.

## Architecture

- `app/` route files only
- `src/api` typed API service modules
- `src/store` zustand stores (`auth`, `documents`, `reader`, `audio`)
- `src/hooks` screen-facing hooks
- `src/components` reusable UI + screen-specific components
- `src/utils` responsive scaling, storage, error, batch text, audio, formatting helpers

## Splash

Splash is configured as centered `logo.png` on white background via `app.json`.

## Backend Clarifications Needed

1. Should mobile use `/audio/stream` with SSE, or should `/audio/text` be the main mobile endpoint for page reading?
2. What is the exact ordering expectation for keys inside `batch_content`?
3. Should reading automatically continue to the next page after current page audio finishes?
4. What image assets should replace the placeholders in onboarding/login/signup?
5. Does `GET /documents/by_email` return enough data to calculate exact reading progress, or should progress be calculated after fetching batches?
6. Is Google mobile auth already configured, and what library/client ID should be used?
