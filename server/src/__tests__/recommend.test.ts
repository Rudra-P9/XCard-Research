import { describe, expect, it } from 'vitest';

function calculateReward(amount: number, rate: number) {
    return Number((amount * rate).toFixed(2));
}

function getCategory(merchant: string): string {
    const categories: Record<string, string> = {
        starbucks: 'Dining',
        shell: 'Gas',
        walmart: 'Groceries',
        netflix: 'Streaming',
        delta: 'Travel',
    };

    const normalizedMerchant = merchant.trim().toLowerCase();

    for (const [name, category] of Object.entries(categories)) {
        if (normalizedMerchant.includes(name)) {
            return category;
        }
    }

    return 'Other';
}

describe('XCard recommendation helpers', () => {
    it('categorizes Starbucks as Dining', () => {
        expect(getCategory('Starbucks')).toBe('Dining');
    });

    it('categorizes Shell as Gas', () => {
        expect(getCategory('Shell')).toBe('Gas');
    });

    it('uses Other for an unknown merchant', () => {
        expect(getCategory('Best Buy')).toBe('Other');
    });

    it('calculates a 3% reward correctly', () => {
        expect(calculateReward(30, 0.03)).toBe(0.9);
    });

    it('calculates a 5% reward correctly', () => {
        expect(calculateReward(50, 0.05)).toBe(2.5);
    });
});