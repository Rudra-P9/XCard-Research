# XCard Research Milestone

## Overview

XCard Research is my individual Research Milestone prototype for the XCard capstone project.

The purpose of this project was to gain hands-on experience with the technology stack selected by the StoneCap/XCard team before continuing team implementation. The prototype is intentionally smaller than the production application, but it demonstrates the core technologies working together in a functional application.

The application allows users to enter a merchant and purchase amount and receive a recommendation for the credit card that provides the highest reward based on reward rules stored in a PostgreSQL database hosted by Supabase.

The prototype also includes multiple screens, responsive layouts, database-backed card data, transaction and insights views, automated tests, and application settings.

## Technology Stack

| Area | Technology |
|---|---|
| Mobile UI | React Native |
| Development Platform | Expo |
| Language | TypeScript |
| Navigation | Expo Router |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Database Hosting | Supabase |
| Testing | Vitest |
| Package Manager | npm |
| Version Control | Git + GitHub |

## Project Structure

```text
XCard-Research/
├── mobile/
│   ├── src/
│   │   ├── app/
│   │   │   ├── _layout.tsx
│   │   │   └── (tabs)/
│   │   │       ├── _layout.tsx
│   │   │       ├── index.tsx
│   │   │       ├── wallet.tsx
│   │   │       ├── insights.tsx
│   │   │       ├── transactions.tsx
│   │   │       └── settings.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── store/
│   ├── assets/
│   ├── package.json
│   └── tsconfig.json
│
├── server/
│   ├── src/
│   │   ├── __tests__/
│   │   │   └── recommend.test.ts
│   │   ├── db.ts
│   │   └── index.ts
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
└── README.md
```

## Architecture

The prototype is divided into a mobile client, backend API, and PostgreSQL database.

```text
┌───────────────────────────────┐
│      React Native + Expo      │
│        TypeScript UI          │
└───────────────┬───────────────┘
                │
                │ HTTP / JSON
                ▼
┌───────────────────────────────┐
│      Node.js + Express        │
│        TypeScript API         │
└───────────────┬───────────────┘
                │
                │ SQL
                ▼
┌───────────────────────────────┐
│      PostgreSQL Database      │
│          Supabase             │
└───────────────┬───────────────┘
                │
                │ Query results
                ▼
┌───────────────────────────────┐
│      Express API Response     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│      React Native UI          │
└───────────────────────────────┘
```

## Features

### Home

The Home screen acts as the main dashboard for the prototype.

It includes:

- Optimization score
- Reward summary
- Purchase recommendation flow
- Merchant and purchase amount input
- Backend/database connection status
- Recommended card
- Reward rate
- Estimated reward
- Comparison against other cards
- Purchase logging

The recommendation flow is one of the main interactive features of the prototype.

### Wallet

The Wallet screen demonstrates database-backed card information.

It includes:

- Card carousel
- Card name and issuer
- Reward categories
- Reward rates
- Maximum reward rate highlights
- Category reward breakdown
- Card enable/disable controls
- Database synchronization

Card information is retrieved through the backend rather than being stored as hardcoded reward data in the mobile interface.

### Insights

The Insights screen provides a financial dashboard-style view of the prototype's sample activity.

It includes:

- Optimization score
- Total spending
- Rewards earned
- Missed rewards
- Spending by category
- Reward opportunities
- Annual reward forecast
- Circular/donut chart for spending by category

The donut chart helps visualize the proportion of spending across categories such as:

- Dining
- Groceries
- Gas
- Travel
- Streaming
- Other

### Transactions

The Transactions screen provides a list of sample purchase activity.

It includes:

- Merchant search
- Category filters
- Transaction amounts
- Transaction categories
- Cards used
- Rewards earned
- Best-card indicators
- Suboptimal-purchase indicators
- Log Purchase modal

The prototype can identify when a different card could have earned a higher reward.

### Settings

The Settings screen contains application and prototype configuration options.

It includes:

- Appearance settings
- Dark/light mode
- Reward preferences
- Quarterly category preference
- Alert preferences
- Account-related options
- Connected-account options
- Privacy and security options
- Application information
- Server connection testing

The theme control is intentionally kept inside Settings. Changing the theme updates the rest of the application.

## Recommendation Flow

The primary workflow is:

```text
User enters merchant
        |
        v
User enters purchase amount
        |
        v
React Native mobile application
        |
        v
POST /recommend
        |
        v
Express + TypeScript
        |
        v
PostgreSQL / Supabase
        |
        v
Reward rules are retrieved
        |
        v
Best card is selected
        |
        v
Estimated reward is calculated
        |
        v
JSON response
        |
        v
React Native displays recommendation
```

Example:

```text
Merchant: Starbucks
Amount: $30

Category: Dining
Best Card: Freedom Flex
Reward Rate: 3%
Estimated Reward: $0.90
```

The recommendation is database-backed. The backend queries the `cards` and `reward_rules` tables rather than relying on a hardcoded card/reward array in the mobile application.

## API Endpoints

### `GET /`

Returns a simple health/status response.

Example:

```json
{
  "message": "XCard API is running"
}
```

### `POST /recommend`

Accepts a merchant and purchase amount and returns the best available reward.

Example request:

```json
{
  "merchant": "Starbucks",
  "amount": 30
}
```

Example response:

```json
{
  "merchant": "Starbucks",
  "category": "Dining",
  "bestCard": "Freedom Flex",
  "issuer": "Chase",
  "rate": 0.03,
  "reward": 0.9
}
```

### `GET /cards`

Returns stored cards and their reward rules.

Example:

```json
[
  {
    "id": 1,
    "name": "Freedom Flex",
    "issuer": "Chase",
    "category": "Dining",
    "reward_rate": "0.0300"
  }
]
```

## Database

Supabase hosts the PostgreSQL database used by the prototype.

The project currently uses two main tables.

### `cards`

Stores card information such as:

- Card ID
- Card name
- Issuer

### `reward_rules`

Stores:

- Reward-rule ID
- Card ID
- Spending category
- Reward rate

The relationship is:

```text
reward_rules.card_id → cards.id
```

The prototype contains sample cards including:

- Freedom Flex — Chase
- Savor — Capital One
- Sapphire Preferred — Chase

Reward categories include:

- Dining
- Gas
- Groceries
- Travel
- Streaming
- Other

Row Level Security (RLS) is enabled on the database tables. Production XCard would require policies scoped appropriately to authenticated users.

## Responsive Design

The application was designed to adapt to different screen sizes rather than using a fixed mobile-only layout.

### Desktop

- Uses available horizontal space
- Allows wider content layouts
- Supports side-by-side dashboard sections where appropriate

### Tablet

- Reduces spacing and column count
- Reflows content as needed
- Maintains readable controls and cards

### Mobile

- Uses stacked layouts when appropriate
- Keeps touch targets usable
- Keeps bottom navigation compact
- Wraps text naturally
- Prevents unnecessary horizontal overflow

The same application is designed to adapt across desktop, tablet, and mobile widths.

## Theme Support

The prototype includes both dark and light themes.

The theme can be changed from the Settings screen.

### Dark Theme

The dark theme uses:

- Near-black backgrounds
- Dark brown panels
- Bronze/gold accents
- Cream primary text
- Muted secondary text

### Light Theme

The light theme uses:

- Warm light backgrounds
- Light cards
- Dark readable text
- Bronze/gold accents
- Muted neutral secondary text

The theme is shared across the application so that changing the setting updates the other screens as well.

## Error Handling

The prototype includes input validation and network error handling.

Examples include:

- Missing merchant
- Invalid purchase amount
- Non-positive purchase amount
- Missing reward rules
- Failed API requests
- Failed database requests

The UI also displays loading states during network requests so the user is not left with a blank interface.

## Testing

Vitest is used for automated testing.

The current test suite verifies recommendation-related behavior including:

- Starbucks is categorized as Dining
- Shell is categorized as Gas
- Unknown merchants use the Other category
- A 3% reward calculation is correct
- A 5% reward calculation is correct

Run the tests with:

```bash
cd server
npm test
```

The current test suite contains 5 passing tests.

## Package Management

The project uses npm for dependency management.

The mobile and backend portions each maintain their own `package.json` and `package-lock.json` files.

Common npm commands used during development include:

```bash
npm install
npm install <package>
npm run dev
npm test
```

The `package.json` scripts are used to standardize development and testing commands.

`package-lock.json` is committed so dependencies can be installed consistently.

## Environment Variables

Database credentials are stored locally in a `.env` file.

Example:

```text
DATABASE_URL=your_postgresql_connection_string
```

The `.env` file is excluded from GitHub and should never contain credentials that are committed to the repository.

Do not commit:

- Database passwords
- Private keys
- API secrets
- Other sensitive credentials

## Running the Backend

From the repository root:

```bash
cd server
npm install
npm run dev
```

The Express API runs locally on:

```text
http://localhost:3000
```

## Running the Mobile Application

Open another terminal:

```bash
cd mobile
npm install
npx expo start
```

Expo can then be used to open the application in the development environment.

When testing the web preview, the browser can be resized to different viewport sizes to verify responsive behavior.

## Research and What I Learned

This project was built as an individual research prototype before continued team development. The goal was to learn the selected technologies through implementation rather than only reading documentation.

### React Native

I learned how React Native uses reusable components, state, event handlers, and styles to build cross-platform user interfaces.

I also learned how React Native layouts can be designed to adapt to different screen sizes.

### Expo

I used Expo to create and run the React Native application.

I learned how the Expo development server works and how Expo simplifies the development and iteration process.

### Expo Router

I learned how file-based routing works with Expo Router and how nested route groups can organize a tab-based application.

The final prototype uses:

```text
Home
Wallet
Insights
Transactions
Settings
```

### TypeScript

I used TypeScript throughout the mobile and backend portions of the project.

I learned how types can make application data and function interfaces clearer and can help catch errors during development.

### Node.js and Express

I learned how to create REST API endpoints using Node.js and Express.

This included:

- Request handling
- JSON requests and responses
- Middleware
- Input validation
- Error handling
- Backend routing

### PostgreSQL

I learned how to work with a relational database using PostgreSQL.

This included:

- Tables
- Primary keys
- Foreign keys
- Relationships
- SQL queries
- Joins
- Query filtering and ordering

### Supabase

I learned how Supabase can host a PostgreSQL database and provide a managed backend development environment.

I also worked with Row Level Security and learned how database permissions affect application architecture.

### npm

I learned how to use npm to manage JavaScript/TypeScript project dependencies.

This included:

- Installing dependencies
- Installing development dependencies
- Reading `package.json`
- Understanding npm scripts
- Running the development server
- Running automated tests

### Vitest

I learned how automated testing can be used to verify expected application behavior.

The prototype includes tests for merchant categorization and reward calculations.

### Full-Stack Integration

The most important part of the research was learning how the technologies work together.

The final flow is:

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

This gave me hands-on experience moving from an individual framework-level experiment to a complete application stack.

## Technology Decision

Based on the hands-on implementation, React Native + Expo + TypeScript is a strong fit for the XCard project.

React Native provides a cross-platform application approach, while TypeScript can be used across both the mobile and Node.js/Express portions of the project.

Expo simplified the development workflow and made it easier to iterate on the application.

Expo Router also provided a straightforward way to organize the multi-screen prototype.

For a student team developing a cross-platform financial application within a semester, this combination provides a practical balance between development speed, platform support, and code organization.

The research prototype helped validate that the selected stack can support the type of interface and backend integration needed by XCard.

## Development Process

The prototype was developed incrementally.

The major stages were:

1. Created an Expo React Native application.
2. Built an interactive merchant and purchase recommendation interface.
3. Created an Express + TypeScript backend.
4. Added a REST recommendation endpoint.
5. Created PostgreSQL tables in Supabase.
6. Added sample credit-card reward data.
7. Connected the Express backend to PostgreSQL.
8. Replaced hardcoded recommendation data with database queries.
9. Connected the React Native application to the backend API.
10. Added a `/cards` endpoint for database-backed card information.
11. Added automated tests with Vitest.
12. Added Expo Router navigation.
13. Expanded the prototype into Home, Wallet, Insights, Transactions, and Settings screens.
14. Added responsive layouts.
15. Added the Insights donut chart.
16. Added Settings and application-wide light/dark theme support.
17. Tested the complete mobile-to-backend-to-database workflow.

## Limitations and Future Work

This is an individual research prototype rather than the production XCard application.

Current limitations include:

- No production authentication system
- No real bank-account linking
- No production transaction synchronization
- Sample data is used for some analytics and transaction information
- The backend is intended for local development/research use
- Production deployment has not been implemented
- The prototype does not represent the complete final XCard feature set

These limitations are intentional because the goal of this milestone is to demonstrate hands-on learning of the selected technology stack and its integration.

Potential future work for the full XCard project could include:

- Production authentication
- Real bank/account integrations
- Persistent user data
- Real transaction synchronization
- Additional analytics
- Production deployment
- Expanded security and privacy controls

## Research Milestone Demo

A short demonstration video will show the working prototype, including:

- Five-screen navigation
- Home dashboard
- Best Card recommendation flow
- Database-backed card data
- Insights and donut chart
- Transactions
- Settings
- Light/dark mode
- Automated tests

**Demo Video:** [Add video link here]

## Repository

GitHub repository:

https://github.com/Rudra-P9/XCard-Research

## Conclusion

This research project provided practical experience with the same core technologies selected for the XCard team project.

The final prototype is more than a Hello World application because it accepts user input, communicates with a backend, queries a real PostgreSQL database hosted by Supabase, performs reward selection, returns the result through an API, displays the result in a React Native interface, provides multiple navigable screens, and includes automated testing.

The project helped me develop a practical understanding of how the selected technologies can be combined into a single application and gave me firsthand experience with the development tradeoffs involved in the XCard technology stack.