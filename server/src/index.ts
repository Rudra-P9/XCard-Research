import { pool, testDatabaseConnection } from './db.js';
import cors from 'cors';
import express from 'express';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const MERCHANT_CATEGORIES: Record<string, string> = {
    starbucks: 'Dining',
    mcdonalds: 'Dining',
    chipotle: 'Dining',
    shell: 'Gas',
    chevron: 'Gas',
    walmart: 'Groceries',
    target: 'Groceries',
    netflix: 'Streaming',
    spotify: 'Streaming',
    delta: 'Travel',
    united: 'Travel',
};

function getCategory(merchant: string): string {
    const normalizedMerchant = merchant.trim().toLowerCase();

    for (const [name, category] of Object.entries(MERCHANT_CATEGORIES)) {
        if (normalizedMerchant.includes(name)) {
            return category;
        }
    }

    return 'Other';
}

async function getBestCard(category: string, amount: number) {
    const result = await pool.query(
        `
        SELECT
            cards.name,
            cards.issuer,
            reward_rules.reward_rate
        FROM cards
        JOIN reward_rules
            ON cards.id = reward_rules.card_id
        WHERE reward_rules.category = $1
        ORDER BY reward_rules.reward_rate DESC
        LIMIT 1
        `,
        [category]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const bestCard = result.rows[0];

    return {
        card: {
            name: bestCard.name,
            issuer: bestCard.issuer,
        },
        rate: Number(bestCard.reward_rate),
        reward: Number(
            (amount * Number(bestCard.reward_rate)).toFixed(2)
        ),
    };
}

app.get('/', (_req, res) => {
    res.json({
        message: 'XCard API is running',
    });
});

app.post('/recommend', async (req, res) => {
    const { merchant, amount } = req.body;

    if (typeof merchant !== 'string' || merchant.trim() === '') {
        return res.status(400).json({
            error: 'Merchant is required.',
        });
    }

    if (
        typeof amount !== 'number' ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return res.status(400).json({
            error: 'Amount must be a positive number.',
        });
    }

    const category = getCategory(merchant);
    const recommendation = await getBestCard(category, amount);

    if (!recommendation) {
        return res.status(404).json({
            error: `No reward rules found for category: ${category}`,
        });
    }

    res.json({
        merchant: merchant.trim(),
        category,
        bestCard: recommendation.card.name,
        issuer: recommendation.card.issuer,
        rate: recommendation.rate,
        reward: recommendation.reward,
    });
});

async function startServer() {
    await testDatabaseConnection();

    app.listen(PORT, () => {
        console.log(`XCard API running on http://localhost:${PORT}`);
    });
}

startServer();