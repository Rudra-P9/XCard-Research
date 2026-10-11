export type Recommendation = {
    merchant: string;
    category: string;
    bestCard: string;
    issuer: string;
    rate: number;
    reward: number;
};

export async function getRecommendation(
    merchant: string,
    amount: number
): Promise<Recommendation> {
    const response = await fetch('http://localhost:3000/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            merchant,
            amount,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Recommendation request failed.');
    }

    return response.json();
}

export type CardReward = {
    id: number;
    name: string;
    issuer: string;
    category: string;
    reward_rate: string;
};

export async function getCards(): Promise<CardReward[]> {
    const response = await fetch('http://localhost:3000/cards');

    if (!response.ok) {
        throw new Error('Unable to load card data.');
    }

    return response.json();
}