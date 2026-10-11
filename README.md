# XCard Research Milestone

Individual research project for the XCard credit card rewards optimization application.

## Purpose

This project was created to learn and demonstrate the technologies selected by the StoneCap team for XCard.

The prototype allows a user to enter a merchant and purchase amount and receive a card recommendation based on reward rules stored in a PostgreSQL database.

## Technology Stack

- React Native
- Expo
- TypeScript
- Node.js
- Express
- PostgreSQL
- Supabase

## Project Structure

```text
XCard-Research/
├── mobile/
│   ├── src/
│   │   ├── app/
│   │   └── api.ts
│   ├── assets/
│   ├── package.json
│   └── tsconfig.json
│
├── server/
│   ├── src/
│   │   ├── __tests__/
│   │   ├── db.ts
│   │   └── index.ts
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Architecture

The project uses a React Native mobile client, an Express backend, and a PostgreSQL database hosted by Supabase.

```text
React Native + Expo
        |
        | HTTP request
        v
Express + TypeScript
        |
        | SQL query
        v
PostgreSQL
   (Supabase)
        |
        | database data
        v
Express response
        |
        v
React Native UI
```

## Features

### Best Card Recommendation

The user enters:

- Merchant
- Purchase amount

The mobile application sends the information to the Express API.

The backend:

1. Determines the spending category.
2. Retrieves reward rules from PostgreSQL.
3. Finds the highest reward rate.
4. Calculates the estimated reward.
5. Returns the recommendation to the mobile application.

Example:

```text
Merchant: Starbucks
Amount: $30

Category: Dining
Best Card: Freedom Flex
Reward Rate: 3%
Estimated Reward: $0.90
```

### Card Data

The mobile application can request saved card information from the backend.

The `/cards` endpoint retrieves card and reward-rule data from PostgreSQL.

The application currently uses three sample cards:

- Freedom Flex
- Savor
- Sapphire Preferred

Each card has reward rules for:

- Dining
- Gas
- Groceries
- Travel
- Streaming
- Other

## How Recommendations Work

The recommendation system uses the PostgreSQL database hosted by Supabase to retrieve card reward rules. The backend queries the `cards` and `reward_rules` tables instead of relying on hardcoded card data.

## API Endpoints

### `GET /`

Returns a simple status message confirming that the XCard API is running.

Example response:

```json
{
  "message": "XCard API is running"
}
```

### `POST /recommend`

Accepts a merchant and purchase amount and returns the recommended card.

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

Returns the cards and their reward rules stored in the PostgreSQL database.

Example response:

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

Supabase hosts the PostgreSQL database.

The prototype currently uses two related tables.

### `cards`

Stores:

- Card ID
- Card name
- Issuer

### `reward_rules`

Stores:

- Reward-rule ID
- Card ID
- Spending category
- Reward rate

The `reward_rules.card_id` column is a foreign key referencing the `cards` table.

Row Level Security is enabled on both tables.

## Sample Database Data

Example:

```text
Freedom Flex
Issuer: Chase

Dining      3%
Gas         5%
Groceries   3%
Travel      1%
Streaming   1%
Other       1%
```

Additional sample cards and reward rules are stored in the database for comparison.

## Error Handling

The recommendation API validates user input before processing the request.

Examples include:

- Missing merchant name
- Invalid purchase amount
- Non-positive purchase amount
- Missing reward rules
- Database request failures

The mobile application displays an error message when a backend request fails.

## Testing

Vitest is used for automated testing.

The current test suite verifies:

- Starbucks is categorized as Dining.
- Shell is categorized as Gas.
- Unknown merchants use the Other category.
- A 3% reward calculation is correct.
- A 5% reward calculation is correct.

Run the tests with:

```bash
cd server
npm test
```

Current test result:

```text
Test Files  1 passed
Tests       5 passed
```

## Environment Variables

Database credentials are stored in a local `.env` file and are not committed to GitHub.

Example:

```text
DATABASE_URL=your_postgresql_connection_string
```

Do not place database passwords, API keys, or other secrets directly in source code.

## Running the Backend

Open a terminal and run:

```bash
cd server
npm install
npm run dev
```

The Express API runs on:

```text
http://localhost:3000
```

## Running the Mobile Application

Open another terminal and run:

```bash
cd mobile
npm install
npx expo start
```

The application can then be opened using the Expo development environment.

## Development Process

The project was developed incrementally to learn and demonstrate each part of the selected technology stack.

The development process included:

1. Creating an Expo React Native application.
2. Adding TypeScript-based mobile functionality.
3. Creating an Express + TypeScript backend.
4. Creating a REST API for recommendations.
5. Creating PostgreSQL tables in Supabase.
6. Adding sample credit card reward data.
7. Connecting Express to PostgreSQL.
8. Replacing hardcoded card data with database queries.
9. Connecting the mobile application to the Express API.
10. Adding automated tests with Vitest.
11. Testing the complete mobile-to-database workflow.

## Research Results

This project demonstrated how the technologies selected by the StoneCap team work together.

The completed prototype supports the following flow:

```text
User enters purchase
        |
        v
React Native mobile app
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
Reward rules
        |
        v
Best card selected
        |
        v
JSON response
        |
        v
React Native displays result
```

The project provided hands-on experience with:

- React Native
- Expo
- TypeScript
- Node.js
- Express
- PostgreSQL
- Supabase
- npm package management
- Environment variables
- REST APIs
- SQL tables
- Foreign keys
- Row Level Security
- Database connections
- API error handling
- Automated testing
- Git and GitHub

## Conclusion

This research project provided practical experience with the same core technologies selected for the XCard team project.

The final prototype is more than a Hello World application because it accepts user input, communicates with a backend, queries a real PostgreSQL database hosted by Supabase, performs reward selection, returns the result through an API, and displays the result in a React Native application.