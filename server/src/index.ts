import cors from 'cors';
import express from 'express';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

type Card = {
    name: string;
    issuer: string;
    rewards: Record<string, number>;
};

const CARDS: Card[] = [
    {
        name: 'Freedom Flex',
        issuer: 'Chase',
        rewards: {
            Dining: 0.03,
            Groceries: 0.03,
            Gas: 0.05,
            Travel: 0.01,
            Streaming: 0.01,
            Other: 0.01,
        },
    },
    {
        name: 'Savor',
        issuer: 'Capital One',
        rewards: {
            Dining: 0.03,
            Groceries: 0.03,
            Gas: 0.01,
            Travel: 0.01,
            Streaming: 0.03,
            Other: 0.01,
        },
    },
    {
        name: 'Sapphire Preferred',
        issuer: 'Chase',
        rewards: {
            Dining: 0.03,
            Groceries: 0.01,
            Gas: 0.01,
            Travel: 0.02,
            Streaming: 0.01,
            Other: 0.01,
        },
    },
];

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

function getBestCard(category: string, amount: number) {
    let bestCard = CARDS[0];
    let bestRate = bestCard.rewards[category] ?? bestCard.rewards.Other;

    for (const card of CARDS) {
        const rate = card.rewards[category] ?? card.rewards.Other;

        if (rate > bestRate) {
            bestCard = card;
            bestRate = rate;
        }
    }

    return {
        card: bestCard,
        rate: bestRate,
        reward: Number((amount * bestRate).toFixed(2)),
    };
};

app.get('/', (_req, res) => {
    res.json({
        message: 'XCard API is running',
    });
});

app.post('/recommend', (req, res) => {
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
    const recommendation = getBestCard(category, amount);

    res.json({
        merchant: merchant.trim(),
        category,
        bestCard: recommendation.card.name,
        issuer: recommendation.card.issuer,
        rate: recommendation.rate,
        reward: recommendation.reward,
    });
});

app.listen(PORT, () => {
    console.log(`XCard API running on http://localhost:${PORT}`);
});