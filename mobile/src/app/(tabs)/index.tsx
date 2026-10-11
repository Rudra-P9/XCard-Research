import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useXCard } from '@/store/xcard-store';
import { useResponsive } from '@/hooks/use-responsive';
import { ResponsiveContainer } from '@/components/responsive-container';

const QUICK_MERCHANTS = [
  { name: 'Starbucks', amount: '18.50', icon: '☕', category: 'Dining' },
  { name: 'Shell', amount: '45.00', icon: '⛽', category: 'Gas' },
  { name: 'Walmart', amount: '82.00', icon: '🛒', category: 'Groceries' },
  { name: 'Delta', amount: '320.00', icon: '✈️', category: 'Travel' },
  { name: 'Netflix', amount: '22.99', icon: '🍿', category: 'Streaming' },
  { name: 'Chipotle', amount: '16.75', icon: '🌯', category: 'Dining' },
];

export default function HomeScreen() {
  const { findBestCard, addTransaction, serverOnline, checkingServer, cards, theme } = useXCard();
  const { isDesktop, isTablet, isSmallMobile } = useResponsive();

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(false);

  const [result, setResult] = useState<{
    merchant: string;
    category: string;
    bestCard: string;
    issuer: string;
    rate: number;
    reward: number;
    fromServer: boolean;
    allComparisons: { card: string; rate: number; reward: number }[];
  } | null>(null);

  const handleRecommendation = async () => {
    const trimmedMerchant = merchant.trim();
    const numericAmount = Number.parseFloat(amount);

    if (!trimmedMerchant) {
      Alert.alert('Missing Merchant', 'Please enter a merchant name.');
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a purchase amount greater than $0.');
      return;
    }

    try {
      setLoading(true);
      setLogged(false);
      const res = await findBestCard(trimmedMerchant, numericAmount);
      setResult(res);
    } catch (error) {
      Alert.alert(
        'Recommendation Notice',
        error instanceof Error ? error.message : 'Unable to complete recommendation.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuickMerchant = (item: typeof QUICK_MERCHANTS[0]) => {
    setMerchant(item.name);
    setAmount(item.amount);
    setResult(null);
    setLogged(false);
  };

  const handleLogPurchase = () => {
    if (!result) return;
    const numericAmount = Number.parseFloat(amount) || 0;

    addTransaction({
      merchant: result.merchant,
      category: result.category,
      amount: numericAmount,
      date: 'Just now',
      cardUsed: result.bestCard,
      optimalCard: result.bestCard,
      rewardEarned: result.reward,
      optimalReward: result.reward,
      isOptimal: true,
    });

    setLogged(true);
    Alert.alert('Purchase Logged!', `Recorded $${numericAmount.toFixed(2)} on ${result.bestCard}. View details in Transactions.`);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: theme.background, paddingTop: isSmallMobile ? 40 : 56, paddingBottom: 60 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ResponsiveContainer>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <View style={styles.titleGroup}>
            <Text style={[styles.brandSubtitle, { color: theme.bronze }]}>STONE CAP RESEARCH</Text>
            <Text style={[styles.brandTitle, { color: theme.bronzeLight }, isSmallMobile && { fontSize: 24 }]}>
              XCard
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: serverOnline ? theme.statusOnlineBg : theme.surfaceSecondary,
                borderColor: serverOnline ? theme.statusOnlineBorder : theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: serverOnline ? theme.statusOnlineText : theme.bronze },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: serverOnline ? theme.statusOnlineText : theme.textPrimary },
              ]}
            >
              {checkingServer ? 'Checking...' : serverOnline ? 'PostgreSQL Live' : 'Local Engine'}
            </Text>
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroSection}>
          <Text
            style={[
              styles.heroHeading,
              { color: theme.textPrimary },
              isDesktop && styles.heroHeadingDesktop,
              isSmallMobile && { fontSize: 20 },
            ]}
          >
            Smart Reward Optimization
          </Text>
          <Text
            style={[
              styles.heroSubheading,
              { color: theme.textSecondary },
              isDesktop && styles.heroSubheadingDesktop,
            ]}
          >
            Evaluate real-time credit card reward rules to maximize cash back and points on every purchase.
          </Text>
        </View>

        {/* Responsive Content Grid */}
        <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
          {/* Left / Primary Column */}
          <View style={[styles.primaryColumn, isDesktop && styles.primaryColumnDesktop]}>
            {/* Quick Presets */}
            <View style={styles.chipSection}>
              <Text style={[styles.sectionTitle, { color: theme.bronze }]}>QUICK PURCHASE PRESETS</Text>
              <View style={[styles.chipGrid, !isDesktop && !isTablet && styles.chipGridMobile]}>
                {QUICK_MERCHANTS.map((item) => {
                  const isActive = merchant === item.name;
                  return (
                    <Pressable
                      key={item.name}
                      style={({ pressed }) => [
                        styles.chip,
                        {
                          backgroundColor: isActive ? theme.surfaceSelected : theme.surfaceSecondary,
                          borderColor: isActive ? theme.bronze : theme.borderLight,
                        },
                        pressed && styles.pressed,
                      ]}
                      onPress={() => handleSelectQuickMerchant(item)}
                    >
                      <Text style={styles.chipIcon}>{item.icon}</Text>
                      <Text
                        style={[
                          styles.chipText,
                          { color: isActive ? theme.bronze : theme.textPrimary },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={[styles.chipAmount, { color: theme.textSecondary }]}>
                        ${item.amount}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Input Form */}
            <View style={[styles.cardContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.cardHeaderTitle, { color: theme.textPrimary }]}>Purchase Details</Text>

              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Merchant / Store Name</Text>
              <TextInput
                value={merchant}
                onChangeText={(t) => {
                  setMerchant(t);
                  setLogged(false);
                }}
                placeholder="e.g. Starbucks, Shell, Delta Airlines"
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    color: theme.textPrimary,
                  },
                ]}
                autoCapitalize="words"
              />

              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Purchase Amount ($ USD)</Text>
              <TextInput
                value={amount}
                onChangeText={(t) => {
                  setAmount(t);
                  setLogged(false);
                }}
                placeholder="0.00"
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    color: theme.textPrimary,
                  },
                ]}
                keyboardType="decimal-pad"
              />

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: theme.bronze },
                  pressed && styles.primaryButtonPressed,
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleRecommendation}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Evaluating Rules...' : 'Find Best Card'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Right / Secondary Column */}
          <View style={[styles.secondaryColumn, isDesktop && styles.secondaryColumnDesktop]}>
            {result ? (
              <View style={[styles.resultCard, { backgroundColor: theme.surface, borderColor: theme.bronze }]}>
                <View style={styles.resultHeader}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={[styles.resultCategoryBadge, { color: theme.bronze }]}>{result.category.toUpperCase()}</Text>
                    <Text style={[styles.resultTitle, { color: theme.textPrimary }]}>Optimal Recommendation</Text>
                  </View>
                  <View style={[styles.ratePill, { backgroundColor: theme.surfaceSecondary, borderColor: theme.bronze }]}>
                    <Text style={[styles.ratePillText, { color: theme.bronze }]}>{(result.rate * 100).toFixed(0)}% Rate</Text>
                  </View>
                </View>

                <View style={[styles.bestCardBanner, { backgroundColor: theme.surfaceSecondary }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bestCardIssuer, { color: theme.textSecondary }]}>{result.issuer}</Text>
                    <Text style={[styles.bestCardName, { color: theme.textPrimary }]}>{result.bestCard}</Text>
                  </View>
                  <View style={styles.rewardStatBox}>
                    <Text style={[styles.rewardStatLabel, { color: theme.textSecondary }]}>Est. Reward</Text>
                    <Text style={styles.rewardStatAmount}>+${result.reward.toFixed(2)}</Text>
                  </View>
                </View>

                {/* Comparisons */}
                {result.allComparisons.length > 1 && (
                  <View style={[styles.comparisonsBox, { backgroundColor: theme.surfaceSecondary }]}>
                    <Text style={[styles.comparisonsTitle, { color: theme.bronze }]}>WALLET COMPARISON</Text>
                    {result.allComparisons.map((c, i) => (
                      <View key={c.card} style={[styles.compRow, { borderBottomColor: theme.borderLight }]}>
                        <Text style={[styles.compCardName, { color: theme.textPrimary }]}>
                          {i === 0 ? '👑 ' : '• '}
                          {c.card}
                        </Text>
                        <Text style={[styles.compRates, { color: theme.textSecondary }]}>
                          {(c.rate * 100).toFixed(0)}% (${c.reward.toFixed(2)})
                        </Text>
                        {i === 0 ? (
                          <Text style={styles.bestTag}>BEST</Text>
                        ) : (
                          <Text style={styles.diffTag}>
                            -{((result.reward - c.reward)).toFixed(2)}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                <Pressable
                  style={({ pressed }) => [
                    styles.logButton,
                    {
                      backgroundColor: logged ? theme.statusOnlineBg : theme.surfaceSecondary,
                      borderColor: logged ? theme.statusOnlineBorder : theme.border,
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={handleLogPurchase}
                  disabled={logged}
                >
                  <Text
                    style={[
                      styles.logButtonText,
                      { color: logged ? theme.statusOnlineText : theme.textPrimary },
                    ]}
                  >
                    {logged ? '✓ Purchase Logged' : 'Log This Purchase in Transactions'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={[styles.idleStateCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.idleIconBox, { backgroundColor: theme.surfaceSecondary }]}>
                  <Text style={styles.idleIcon}>💳</Text>
                </View>
                <Text style={[styles.idleTitle, { color: theme.textPrimary }]}>Active Card Portfolio</Text>
                <Text style={[styles.idleSub, { color: theme.textSecondary }]}>
                  {cards.length} cards connected in wallet. Choose a preset or enter a store to calculate the top reward multiplier.
                </Text>
                <View style={[styles.idleCardsList, { backgroundColor: theme.surfaceSecondary }]}>
                  {cards.map((c) => (
                    <View key={c.id} style={styles.idleCardRow}>
                      <View style={[styles.idleDot, { backgroundColor: c.accentColor }]} />
                      <Text style={[styles.idleCardName, { color: theme.textPrimary }]}>{c.name}</Text>
                      <Text style={[styles.idleCardIssuer, { color: theme.textSecondary }]}>({c.issuer})</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Architecture Footer Box */}
            <View style={[styles.footerBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.footerTitle, { color: theme.bronze }]}>Research Architecture</Text>
              <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                Connected to Express API + PostgreSQL Supabase. Evaluates multi-tier reward matrices dynamically.
              </Text>
            </View>
          </View>
        </View>
      </ResponsiveContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  titleGroup: {
    flexShrink: 1,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  heroSection: {
    marginBottom: 24,
    width: '100%',
  },
  heroHeading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroHeadingDesktop: {
    fontSize: 28,
  },
  heroSubheading: {
    fontSize: 14,
    lineHeight: 20,
  },
  heroSubheadingDesktop: {
    fontSize: 15,
    maxWidth: 700,
  },
  mainLayout: {
    width: '100%',
    flexDirection: 'column',
    gap: 20,
  },
  mainLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  primaryColumn: {
    width: '100%',
  },
  primaryColumnDesktop: {
    flex: 1.1,
  },
  secondaryColumn: {
    width: '100%',
  },
  secondaryColumnDesktop: {
    flex: 1,
  },
  chipSection: {
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipGridMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipIcon: {
    fontSize: 15,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipAmount: {
    fontSize: 11,
  },
  cardContainer: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    width: '100%',
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#0B0A08',
    fontSize: 15,
    fontWeight: '700',
  },
  resultCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  resultCategoryBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  ratePill: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bestCardBanner: {
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bestCardIssuer: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  bestCardName: {
    fontSize: 18,
    fontWeight: '800',
  },
  rewardStatBox: {
    alignItems: 'flex-end',
  },
  rewardStatLabel: {
    fontSize: 11,
  },
  rewardStatAmount: {
    color: '#4ECA77',
    fontSize: 22,
    fontWeight: '800',
  },
  comparisonsBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  comparisonsTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  compRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
  },
  compCardName: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  compRates: {
    fontSize: 13,
    marginRight: 10,
  },
  bestTag: {
    color: '#4ECA77',
    fontSize: 10,
    fontWeight: '800',
  },
  diffTag: {
    color: '#E57373',
    fontSize: 11,
    fontWeight: '600',
  },
  logButton: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  logButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  idleStateCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  idleIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  idleIcon: {
    fontSize: 24,
  },
  idleTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  idleSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  idleCardsList: {
    width: '100%',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  idleCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  idleCardName: {
    fontSize: 13,
    fontWeight: '600',
  },
  idleCardIssuer: {
    fontSize: 12,
  },
  footerBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    width: '100%',
  },
  footerTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.8,
  },
});