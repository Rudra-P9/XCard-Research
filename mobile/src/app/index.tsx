import { useState } from 'react';
import { getRecommendation } from '../api';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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
    reward: amount * bestRate,
  };
}

export default function HomeScreen() {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<{
    category: string;
    card: string;
    rate: number;
    reward: number;
  } | null>(null);

  const handleRecommendation = async () => {
    const trimmedMerchant = merchant.trim();
    const numericAmount = Number.parseFloat(amount);

    if (!trimmedMerchant) {
      Alert.alert('Missing merchant', 'Please enter a merchant name.');
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert(
        'Invalid amount',
        'Please enter a purchase amount greater than $0.'
      );
      return;
    }

    console.log('Sending recommendation request...');
    console.log('Merchant:', trimmedMerchant, 'Amount:', numericAmount);

    try {
      const recommendation = await getRecommendation(
        trimmedMerchant,
        numericAmount
      );

      setResult({
        category: recommendation.category,
        card: recommendation.bestCard,
        rate: recommendation.rate,
        reward: recommendation.reward,
      });
    } catch (error) {
      console.error('Recommendation request failed:', error);

      Alert.alert(
        'Recommendation Error',
        error instanceof Error
          ? error.message
          : 'Unable to get a recommendation.'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>XCard</Text>
        <Text style={styles.title}>Find Your Best Card</Text>
        <Text style={styles.subtitle}>
          Enter a purchase and see which card earns the most rewards.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Merchant</Text>

        <TextInput
          value={merchant}
          onChangeText={setMerchant}
          placeholder="e.g. Starbucks"
          placeholderTextColor="#8c887f"
          style={styles.input}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Purchase Amount</Text>

        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="e.g. 30.00"
          placeholderTextColor="#8c887f"
          style={styles.input}
          keyboardType="decimal-pad"
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleRecommendation}
        >
          <Text style={styles.buttonText}>Find Best Card</Text>
        </Pressable>
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Recommendation</Text>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Merchant</Text>
            <Text style={styles.resultValue}>{merchant}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Category</Text>
            <Text style={styles.resultValue}>{result.category}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Best Card</Text>
            <Text style={styles.resultValue}>{result.card}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Reward Rate</Text>
            <Text style={styles.rewardValue}>
              {(result.rate * 100).toFixed(0)}%
            </Text>
          </View>

          <View style={styles.rewardBox}>
            <Text style={styles.rewardLabel}>Estimated Reward</Text>
            <Text style={styles.rewardAmount}>
              ${result.reward.toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Research Prototype</Text>
        <Text style={styles.infoText}>
          This prototype currently performs merchant categorization and reward
          calculations locally. The next step is connecting this screen to an
          Express backend and PostgreSQL database.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 70,
    backgroundColor: '#0B0A08',
  },
  header: {
    marginBottom: 32,
  },
  logo: {
    color: '#A97B45',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
  },
  title: {
    color: '#F1EEE4',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    color: '#B8B2A8',
    fontSize: 16,
    lineHeight: 23,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    color: '#F1EEE4',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#1C1916',
    borderWidth: 1,
    borderColor: '#4A3A28',
    borderRadius: 12,
    color: '#F1EEE4',
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  button: {
    backgroundColor: '#A97B45',
    borderRadius: 12,
    marginTop: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#0B0A08',
    fontSize: 17,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#1C1916',
    borderWidth: 1,
    borderColor: '#A97B45',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  resultTitle: {
    color: '#A97B45',
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 18,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 14,
  },
  resultLabel: {
    color: '#AAA49A',
    fontSize: 15,
  },
  resultValue: {
    color: '#F1EEE4',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
  },
  rewardValue: {
    color: '#A97B45',
    fontSize: 16,
    fontWeight: '700',
  },
  rewardBox: {
    backgroundColor: '#2A241E',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  rewardLabel: {
    color: '#AAA49A',
    fontSize: 14,
    marginBottom: 4,
  },
  rewardAmount: {
    color: '#F1EEE4',
    fontSize: 28,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#151310',
    borderRadius: 14,
    padding: 18,
    marginTop: 'auto',
  },
  infoTitle: {
    color: '#F1EEE4',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    color: '#AAA49A',
    fontSize: 13,
    lineHeight: 19,
  },
});