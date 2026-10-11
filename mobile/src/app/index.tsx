import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getCards, getRecommendation } from '../api';

type Result = {
  category: string;
  card: string;
  issuer: string;
  rate: number;
  reward: number;
};

type CardData = {
  id: number;
  name: string;
  issuer: string;
  category: string;
  reward_rate: string;
};

export default function HomeScreen() {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');

  const [result, setResult] = useState<Result | null>(null);

  const [cards, setCards] = useState<CardData[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);

  const [loadingRecommendation, setLoadingRecommendation] =
    useState(false);

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

    try {
      setLoadingRecommendation(true);

      const recommendation = await getRecommendation(
        trimmedMerchant,
        numericAmount
      );

      setResult({
        category: recommendation.category,
        card: recommendation.bestCard,
        issuer: recommendation.issuer,
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
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const handleLoadCards = async () => {
    try {
      setLoadingCards(true);

      const data = await getCards();

      setCards(data);
    } catch (error) {
      console.error('Card data request failed:', error);

      Alert.alert(
        'Card Data Error',
        error instanceof Error
          ? error.message
          : 'Unable to load card data.'
      );
    } finally {
      setLoadingCards(false);
    }
  };

  const uniqueCards = Array.from(
    new Map(cards.map((card) => [card.id, card])).values()
  );

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
          disabled={loadingRecommendation}
        >
          <Text style={styles.buttonText}>
            {loadingRecommendation
              ? 'Finding Best Card...'
              : 'Find Best Card'}
          </Text>
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
            <Text style={styles.resultLabel}>Issuer</Text>

            <Text style={styles.resultValue}>{result.issuer}</Text>
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

      <View style={styles.cardDataSection}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLoadCards}
          disabled={loadingCards}
        >
          <Text style={styles.secondaryButtonText}>
            {loadingCards ? 'Loading Cards...' : 'Load My Card Data'}
          </Text>
        </Pressable>

        {uniqueCards.length > 0 && (
          <View style={styles.cardList}>
            <Text style={styles.cardListTitle}>
              Cards from Database
            </Text>

            {uniqueCards.map((card) => (
              <View key={card.id} style={styles.cardItem}>
                <Text style={styles.cardName}>{card.name}</Text>

                <Text style={styles.cardIssuer}>{card.issuer}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Research Prototype</Text>

        <Text style={styles.infoText}>
          This prototype uses a React Native and Expo mobile client,
          an Express TypeScript backend, and PostgreSQL hosted by
          Supabase. Recommendations and card reward data are retrieved
          through the backend.
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

  cardDataSection: {
    marginBottom: 20,
  },

  secondaryButton: {
    backgroundColor: '#2A241E',
    borderWidth: 1,
    borderColor: '#A97B45',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#F1EEE4',
    fontSize: 16,
    fontWeight: '700',
  },

  cardList: {
    backgroundColor: '#1C1916',
    borderRadius: 14,
    padding: 18,
    marginTop: 14,
  },

  cardListTitle: {
    color: '#A97B45',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  cardItem: {
    borderTopWidth: 1,
    borderTopColor: '#4A3A28',
    paddingVertical: 12,
  },

  cardName: {
    color: '#F1EEE4',
    fontSize: 16,
    fontWeight: '700',
  },

  cardIssuer: {
    color: '#AAA49A',
    fontSize: 14,
    marginTop: 3,
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