# Game App

Game App is a multi-game party app built with React Native and a Rust-based backend. It bundles multiple classic and custom game modes, supports curated prompt decks, and provides a scalable API layer for serving game content and collecting feedback.

This repository contains two main components:
- `Trinkspiel_RN`: the React Native client (Expo) used to run the app on iOS/Android.
- `Backend`: the server-side components (Rust Rocket + legacy Node.js).

## Functional Overview
- Multi-game hub with themed game modes and a modern UI flow.
- Curated prompt pools and datasets for conversational and party-style games.
- Local data handling and caching for fast gameplay.
- Server API support for fetching game content and submitting feedback.

## Tech Tree
```
Game App
|-- Trinkspiel_RN (React Native / Expo)
|   |-- Games (UI + logic)
|   |-- Data (prompt pools, datasets)
|   `-- i18n (multi-language copy)
`-- Backend
    |-- rocket (Rust / Rocket / SQLx)
    `-- js (Node.js / Express / MySQL) [legacy]
```

## Architecture
The client renders all game flows, manages player state, and loads prompts from curated datasets. For dynamic content and feedback, the app can call the backend API. The Rust Rocket server exposes game routes and integrates with a MySQL database. A legacy Node.js backend exists for historical reference.

## Development Setup
### Prerequisites
- Node.js + npm
- Expo CLI
- (Optional) Rust toolchain for backend work

### Client (React Native)
1. `cd Trinkspiel_RN`
2. `npm install`
3. `npm start`

### Backend (Rocket)
Follow instructions in `Backend/rocket/rocket_server/README.md` for Rust + SQLx setup.

## Project Structure Highlights
- `Trinkspiel_RN/src/games`: game screens and interaction logic.
- `Trinkspiel_RN/src/data`: prompt pools and datasets.
- `Trinkspiel_RN/src/i18n`: localization strings.
- `Backend/rocket/rocket_server/src`: API routes and database access.

## Build & Release
For Expo build steps, see `Trinkspiel_RN/README.md`. For server deployment, see `Backend/rocket/rocket_server/README.md`.

## Contribution Notes
This is a personal project with a strong focus on UX and gameplay flow. If you plan to extend it, keep changes incremental and avoid breaking existing game logic.
