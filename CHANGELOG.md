# Changelog

## 2.0.1 (2025-08-24)

### Features

- Add pagination to the “My Posts” table

### Improvements

- Integrate Sentry for error tracking and performance monitoring

### Developer Experience

- Enforce strict ESLint and Prettier rules for consistent formatting

## 2.0.0 (2025-08-19)

### Breaking Changes

- Migrate authentication from Firebase Auth to a NestJS-based system using Passport with Google OAuth support. (Password hashes cannot be exported from Firebase Auth, all users will need to reset their passwords to sign in with the new auth system.)
- Remove public post creation feature

### Improvements

- Migrate from Firebase Functions/Firestore to a dedicated NestJS API with MongoDB

- Upgrade Next.js from v12 → v13 → v14
- Begin partial migration to TypeScript

## 1.0.1 (2022-09-04)

### Bug Fixes

- Fix responsive CSS for post items and `<ul>/<ol>` tags

## 1.0.0 (2022-09-03)

### Features

- Display the 20 latest public posts on the Home page, revalidating every hour
- Show property details with Google Maps & Street View on the Property detail page (public)
- Provide Login & Signup pages with email/password authentication (public)
- Allow users to update their data and avatar on the Profile page (private)
- List all properties of a specific user on the Dashboard page (private)
- Enable agents and regular users to create new posts on the Add Post page (private)
