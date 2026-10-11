# XCard Research Milestone

> **Individual CSCE 490/492 Research Milestone**

## Demo & Repository

**🎥 Demo Video:** [Download the Research Milestone Demo](./demo/XCard-Research-Demo.mp4)

**💻 GitHub Repository:** [XCard-Research](https://github.com/Rudra-P9/XCard-Research)

## Overview

This is my individual Research Milestone prototype for the XCard capstone project.

The goal was to gain hands-on experience with the technology stack selected by the StoneCap team by building a working application rather than only researching the technologies.

The prototype allows users to enter a merchant and purchase amount, then recommends the credit card with the best reward.

## Technology Stack

- React Native
- Expo
- Expo Router
- TypeScript
- Node.js
- Express
- PostgreSQL
- Supabase
- Vitest
- npm

## Features

- Responsive XCard-style interface
- Home dashboard
- Best Card recommendation
- Wallet with database-backed card data
- Insights dashboard with spending donut chart
- Transactions screen with search/filtering
- Settings screen
- Light/dark mode
- Loading and error states
- Automated tests

Example:

```text
Starbucks
$30

Category: Dining
Best Card: Freedom Flex
Reward Rate: 3%
Estimated Reward: $0.90
```

## Architecture

```text
React Native + Expo
        ↓
Express + TypeScript
        ↓
PostgreSQL / Supabase
        ↓
Express response
        ↓
React Native UI
```

The recommendation system queries the `cards` and `reward_rules` PostgreSQL tables rather than relying on hardcoded card reward data.

## Database

Supabase hosts the PostgreSQL database.

Main tables:

### `cards`

- `id`
- `name`
- `issuer`

### `reward_rules`

- `id`
- `card_id`
- `category`
- `reward_rate`

`reward_rules.card_id` references `cards.id`.

## API

### `GET /`

Backend health check.

### `POST /recommend`

Accepts a merchant and purchase amount and returns the recommended card.

Example request:

```json
{
  "merchant": "Starbucks",
  "amount": 30
}
```

### `GET /cards`

Returns card and reward-rule data from PostgreSQL.

## Testing

Vitest is used for automated testing.

Run:

```bash
cd server
npm test
```

The current test suite verifies merchant categorization and reward calculations.

## Running the Project

### Backend

```bash
cd server
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

Database credentials are stored in a local `.env` file and are not committed to GitHub.

## Research and What I Learned

This project gave me hands-on experience with:

- Building cross-platform interfaces with React Native and Expo
- Organizing screens and navigation with Expo Router
- Using TypeScript across the application
- Building REST APIs with Node.js and Express
- Creating relational PostgreSQL tables and foreign keys
- Connecting an application to PostgreSQL through Supabase
- Managing dependencies and scripts with npm
- Writing automated tests with Vitest
- Designing responsive interfaces for desktop, tablet, and mobile

Based on this implementation, React Native + Expo + TypeScript is a strong fit for XCard because it provides a cross-platform development workflow while working well with the Node.js/TypeScript backend.

## Limitations

This is an individual research prototype rather than the production XCard application.

Current limitations include:

- No production authentication
- No real bank-account integration
- No production transaction synchronization
- Some analytics and transaction data are sample data
- Backend deployment is not part of this milestone

## Conclusion

This prototype demonstrates a complete application flow from the React Native interface through the Express backend to a real PostgreSQL database hosted by Supabase.

It is more than a Hello World application because it accepts user input, processes the data, retrieves database-backed reward rules, calculates a recommendation, and displays the result in a multi-screen responsive application.
