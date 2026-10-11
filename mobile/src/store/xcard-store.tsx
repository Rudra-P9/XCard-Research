import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getRecommendation as apiGetRecommendation, getCards as apiGetCards, CardReward, Recommendation } from '@/api';

export interface XCardTheme {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceSelected: string;
  border: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  bronze: string;
  bronzeLight: string;
  cardBg: string;
  inputBg: string;
  inputBorder: string;
  statusOnlineBg: string;
  statusOnlineBorder: string;
  statusOnlineText: string;
}

export const darkTheme: XCardTheme = {
  isDark: true,
  background: '#0B0A08',
  surface: '#1C1916',
  surfaceSecondary: '#151310',
  surfaceSelected: '#262017',
  border: '#4A3A28',
  borderLight: '#2E2A24',
  textPrimary: '#F1EEE4',
  textSecondary: '#AAA49A',
  textMuted: '#B8B2A8',
  bronze: '#A97B45',
  bronzeLight: '#D4AF37',
  cardBg: '#1C1916',
  inputBg: '#151310',
  inputBorder: '#38332B',
  statusOnlineBg: '#122617',
  statusOnlineBorder: '#225B30',
  statusOnlineText: '#4ECA77',
};

export const lightTheme: XCardTheme = {
  isDark: false,
  background: '#F8F6F0',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1ECE1',
  surfaceSelected: '#EFE8DA',
  border: '#DDD6C8',
  borderLight: '#E8E2D7',
  textPrimary: '#1C1916',
  textSecondary: '#6E6759',
  textMuted: '#8C8373',
  bronze: '#A97B45',
  bronzeLight: '#94662F',
  cardBg: '#FFFFFF',
  inputBg: '#FFFFFF',
  inputBorder: '#DDD6C8',
  statusOnlineBg: '#EAF7EE',
  statusOnlineBorder: '#B2E2C0',
  statusOnlineText: '#1E7E34',
};

export interface CardDetail {
  id: number;
  name: string;
  issuer: string;
  colorGradient: [string, string];
  accentColor: string;
  lastFour: string;
  network: string;
  annualFee: number;
  isActive: boolean;
  rewards: Record<string, number>;
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  cardUsed: string;
  optimalCard: string;
  rewardEarned: number;
  optimalReward: number;
  isOptimal: boolean;
}

const DEFAULT_CARDS: CardDetail[] = [
  {
    id: 1,
    name: 'Freedom Flex',
    issuer: 'Chase',
    colorGradient: ['#0A1D37', '#1E3C72'],
    accentColor: '#4A90E2',
    lastFour: '8821',
    network: 'Mastercard',
    annualFee: 0,
    isActive: true,
    rewards: {
      Gas: 0.05,
      Dining: 0.03,
      Groceries: 0.03,
      Travel: 0.01,
      Streaming: 0.01,
      Other: 0.01,
    },
  },
  {
    id: 2,
    name: 'Savor',
    issuer: 'Capital One',
    colorGradient: ['#3A1220', '#631B32'],
    accentColor: '#D97706',
    lastFour: '4092',
    network: 'Mastercard',
    annualFee: 95,
    isActive: true,
    rewards: {
      Dining: 0.03,
      Streaming: 0.01,
      Groceries: 0.03,
      Gas: 0.01,
      Travel: 0.01,
      Other: 0.01,
    },
  },
  {
    id: 3,
    name: 'Sapphire Preferred',
    issuer: 'Chase',
    colorGradient: ['#0F2027', '#203A43'],
    accentColor: '#C5A059',
    lastFour: '1109',
    network: 'Visa Signature',
    annualFee: 95,
    isActive: true,
    rewards: {
      Travel: 0.05,
      Dining: 0.03,
      Streaming: 0.03,
      Gas: 0.01,
      Groceries: 0.01,
      Other: 0.01,
    },
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    merchant: 'Starbucks',
    category: 'Dining',
    amount: 18.50,
    date: 'Today, 8:42 AM',
    cardUsed: 'Savor',
    optimalCard: 'Savor',
    rewardEarned: 0.74,
    optimalReward: 0.74,
    isOptimal: true,
  },
  {
    id: 'tx-2',
    merchant: 'Shell',
    category: 'Gas',
    amount: 45.00,
    date: 'Yesterday, 5:15 PM',
    cardUsed: 'Freedom Flex',
    optimalCard: 'Freedom Flex',
    rewardEarned: 2.25,
    optimalReward: 2.25,
    isOptimal: true,
  },
  {
    id: 'tx-3',
    merchant: 'Delta Airlines',
    category: 'Travel',
    amount: 320.00,
    date: 'Oct 9, 2:10 PM',
    cardUsed: 'Freedom Flex',
    optimalCard: 'Sapphire Preferred',
    rewardEarned: 3.20,
    optimalReward: 16.00,
    isOptimal: false,
  },
  {
    id: 'tx-4',
    merchant: 'Whole Foods',
    category: 'Groceries',
    amount: 86.40,
    date: 'Oct 8, 11:30 AM',
    cardUsed: 'Savor',
    optimalCard: 'Freedom Flex',
    rewardEarned: 2.59,
    optimalReward: 2.59,
    isOptimal: true,
  },
  {
    id: 'tx-5',
    merchant: 'Netflix',
    category: 'Streaming',
    amount: 22.99,
    date: 'Oct 5, 9:00 AM',
    cardUsed: 'Savor',
    optimalCard: 'Savor',
    rewardEarned: 0.92,
    optimalReward: 0.92,
    isOptimal: true,
  },
];

export const MERCHANT_CATEGORIES: Record<string, string> = {
  starbucks: 'Dining',
  mcdonalds: 'Dining',
  chipotle: 'Dining',
  subway: 'Dining',
  dunkin: 'Dining',
  shell: 'Gas',
  chevron: 'Gas',
  exxon: 'Gas',
  bp: 'Gas',
  walmart: 'Groceries',
  target: 'Groceries',
  kroger: 'Groceries',
  'whole foods': 'Groceries',
  'trader joe': 'Groceries',
  netflix: 'Streaming',
  spotify: 'Streaming',
  hulu: 'Streaming',
  'apple tv': 'Streaming',
  delta: 'Travel',
  united: 'Travel',
  american: 'Travel',
  uber: 'Travel',
  lyft: 'Travel',
  airbnb: 'Travel',
};

export function resolveCategory(merchant: string): string {
  const norm = merchant.trim().toLowerCase();
  for (const [key, cat] of Object.entries(MERCHANT_CATEGORIES)) {
    if (norm.includes(key)) return cat;
  }
  return 'Other';
}

interface XCardContextType {
  cards: CardDetail[];
  transactions: Transaction[];
  serverOnline: boolean;
  checkingServer: boolean;
  apiUrl: string;
  isDarkMode: boolean;
  theme: XCardTheme;
  setDarkMode: (val: boolean) => void;
  setApiUrl: (url: string) => void;
  checkServerHealth: () => Promise<boolean>;
  toggleCardActive: (id: number) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  fetchCardsFromBackend: () => Promise<void>;
  findBestCard: (merchant: string, amount: number) => Promise<{
    merchant: string;
    category: string;
    bestCard: string;
    issuer: string;
    rate: number;
    reward: number;
    fromServer: boolean;
    allComparisons: { card: string; rate: number; reward: number }[];
  }>;
}

const XCardContext = createContext<XCardContextType | undefined>(undefined);

export function XCardProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CardDetail[]>(DEFAULT_CARDS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [serverOnline, setServerOnline] = useState<boolean>(false);
  const [checkingServer, setCheckingServer] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:3000');
  const [isDarkMode, setDarkMode] = useState<boolean>(true);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const checkServerHealth = async (): Promise<boolean> => {
    setCheckingServer(true);
    try {
      const res = await fetch(`${apiUrl}/`, { signal: AbortSignal.timeout(2000) });
      const data = await res.json();
      const isOnline = data && data.message === 'XCard API is running';
      setServerOnline(isOnline);
      return isOnline;
    } catch {
      setServerOnline(false);
      return false;
    } finally {
      setCheckingServer(false);
    }
  };

  useEffect(() => {
    checkServerHealth();
  }, [apiUrl]);

  const fetchCardsFromBackend = async (): Promise<CardDetail[]> => {
    try {
      const dbCards = await apiGetCards();
      if (Array.isArray(dbCards) && dbCards.length > 0) {
        const grouped = new Map<number, { name: string; issuer: string; rewards: Record<string, number> }>();
        for (const row of dbCards) {
          if (!grouped.has(row.id)) {
            grouped.set(row.id, { name: row.name, issuer: row.issuer, rewards: {} });
          }
          const item = grouped.get(row.id)!;
          item.rewards[row.category] = Number(row.reward_rate);
        }
        const merged = prev.map((c) => {
          const dbCard = grouped.get(c.id);
          if (dbCard) {
            return {
              ...c,
              name: dbCard.name,
              issuer: dbCard.issuer,
              rewards: { ...c.rewards, ...dbCard.rewards },
            };
          }
          return c;
        });
        setCards(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Using local card data due to network:', err);
    }
    return cards;
  };

  const toggleCardActive = (id: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const findBestCard = async (merchant: string, amount: number) => {
    const category = resolveCategory(merchant);
    // Ensure we have the latest reward rates from the backend before computing comparisons
    try {
      await fetchCardsFromBackend();
    } catch (e) {
      console.warn('Failed to sync cards from backend before recommendation:', e);
    }
    const activeCards = cards.filter((c) => c.isActive);
    const comparisons = activeCards.map((c) => {
      const rate = c.rewards[category] ?? c.rewards['Other'] ?? 0.01;
      const reward = Number((amount * rate).toFixed(2));
      return { card: c.name, rate, reward };
    });
    comparisons.sort((a, b) => b.rate - a.rate);

    try {
      const recommendation: Recommendation = await apiGetRecommendation(merchant, amount);
      return {
        merchant: recommendation.merchant,
        category: recommendation.category,
        bestCard: recommendation.bestCard,
        issuer: recommendation.issuer,
        rate: recommendation.rate,
        reward: recommendation.reward,
        fromServer: true,
        allComparisons: comparisons,
      };
    } catch {
      const best = comparisons[0] || { card: 'Freedom Flex', rate: 0.01, reward: Number((amount * 0.01).toFixed(2)) };
      const matchingCard = cards.find((c) => c.name === best.card) || cards[0];

      return {
        merchant: merchant.trim(),
        category,
        bestCard: best.card,
        issuer: matchingCard.issuer,
        rate: best.rate,
        reward: best.reward,
        fromServer: false,
        allComparisons: comparisons,
      };
    }
  };

  return (
    <XCardContext.Provider
      value={{
        cards,
        transactions,
        serverOnline,
        checkingServer,
        apiUrl,
        isDarkMode,
        theme,
        setDarkMode,
        setApiUrl,
        checkServerHealth,
        toggleCardActive,
        addTransaction,
        fetchCardsFromBackend,
        findBestCard,
      }}
    >
      {children}
    </XCardContext.Provider>
  );
}

export function useXCard() {
  const context = useContext(XCardContext);
  if (!context) {
    throw new Error('useXCard must be used within an XCardProvider');
  }
  return context;
}
