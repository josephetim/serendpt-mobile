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

