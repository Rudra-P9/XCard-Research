import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useXCard } from '@/store/xcard-store';
import { useResponsive } from '@/hooks/use-responsive';
import { ResponsiveContainer } from '@/components/responsive-container';

export default function WalletScreen() {
  const { cards, toggleCardActive, fetchCardsFromBackend, theme } = useXCard();
  const { isDesktop, isSmallMobile } = useResponsive();
  const [selectedCardId, setSelectedCardId] = useState<number>(cards[0]?.id || 1);
  const [syncing, setSyncing] = useState(false);

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleSyncDatabase = async () => {
    try {
      setSyncing(true);
      await fetchCardsFromBackend();
      Alert.alert('Database Synced', 'Successfully refreshed cards and reward rules from PostgreSQL.');
    } catch {
      Alert.alert('Sync Notice', 'Backend server unreachable. Using local cards database.');
    } finally {
      setSyncing(false);
    }
  };

  const maxDining = Math.max(...cards.map((c) => (c.isActive ? c.rewards['Dining'] || 0 : 0)));
  const maxGas = Math.max(...cards.map((c) => (c.isActive ? c.rewards['Gas'] || 0 : 0)));
  const maxTravel = Math.max(...cards.map((c) => (c.isActive ? c.rewards['Travel'] || 0 : 0)));

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: theme.background, paddingTop: isSmallMobile ? 40 : 56, paddingBottom: 60 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ResponsiveContainer>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexShrink: 1 }}>
            <Text style={[styles.brandSubtitle, { color: theme.bronze }]}>YOUR PORTFOLIO</Text>
            <Text style={[styles.title, { color: theme.textPrimary }, isSmallMobile && { fontSize: 24 }]}>
              Card Wallet
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.syncButton,
              { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
              pressed && styles.pressed,
            ]}
            onPress={handleSyncDatabase}
            disabled={syncing}
          >
            <Text style={[styles.syncButtonText, { color: theme.bronze }]}>
              {syncing ? 'Syncing...' : '↻ Sync DB'}
            </Text>
          </Pressable>
        </View>

        {/* Wallet Highlights Row */}
        <View style={[styles.statsRow, isSmallMobile && styles.statsRowSmall]}>
          <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Max Gas</Text>
            <Text style={[styles.statValue, { color: theme.bronzeLight }]}>{(maxGas * 100).toFixed(0)}%</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Max Dining</Text>
            <Text style={[styles.statValue, { color: theme.bronzeLight }]}>{(maxDining * 100).toFixed(0)}%</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Max Travel</Text>
            <Text style={[styles.statValue, { color: theme.bronzeLight }]}>{(maxTravel * 100).toFixed(0)}%</Text>
          </View>
        </View>

        {/* Responsive Layout for Cards & Details */}
        <View style={[styles.walletLayout, isDesktop && styles.walletLayoutDesktop]}>
          {/* Cards Column */}
          <View style={[styles.cardsColumn, isDesktop && styles.cardsColumnDesktop]}>
            <Text style={[styles.sectionTitle, { color: theme.bronze }]}>SELECT CARD TO INSPECT</Text>
            <ScrollView
              horizontal={!isDesktop}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.cardListContainer,
                isDesktop && styles.cardListDesktop,
              ]}
            >
              {cards.map((card) => {
                const isSelected = card.id === selectedCard.id;
                return (
                  <Pressable
                    key={card.id}
                    style={({ pressed }) => [
                      styles.creditCard,
                      {
                        backgroundColor: card.colorGradient[0],
                        borderColor: isSelected ? theme.bronze : theme.borderLight,
                      },
                      isDesktop && styles.creditCardDesktop,
                      isSelected && styles.creditCardSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => setSelectedCardId(card.id)}
                  >
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardIssuerText}>{card.issuer.toUpperCase()}</Text>
                      <View style={[styles.activePill, !card.isActive && styles.inactivePill]}>
                        <Text style={styles.activePillText}>{card.isActive ? 'ACTIVE' : 'MUTED'}</Text>
                      </View>
                    </View>

                    <View style={styles.chipGraphic}>
                      <View style={styles.chipInner} />
                    </View>

                    <Text style={styles.cardNameText}>{card.name}</Text>
                    <Text style={styles.cardNumberText}>•••• •••• •••• {card.lastFour}</Text>

                    <View style={styles.cardBottomRow}>
                      <Text style={styles.cardHolderText}>RESEARCH WALLET</Text>
                      <Text style={styles.networkText}>{card.network}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Card Details Column */}
          <View style={[styles.detailColumn, isDesktop && styles.detailColumnDesktop]}>
            <View style={[styles.detailContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.detailHeader}>
                <View style={{ flexShrink: 1, paddingRight: 8 }}>
                  <Text style={[styles.detailIssuer, { color: theme.textSecondary }]}>{selectedCard.issuer}</Text>
                  <Text style={[styles.detailCardName, { color: theme.textPrimary }]}>{selectedCard.name}</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.toggleButton,
                    selectedCard.isActive
                      ? { backgroundColor: theme.statusOnlineBg, borderColor: theme.statusOnlineBorder }
                      : { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => toggleCardActive(selectedCard.id)}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      { color: selectedCard.isActive ? theme.statusOnlineText : theme.textSecondary },
                    ]}
                  >
                    {selectedCard.isActive ? 'Active in Engine' : 'Excluded from Rules'}
                  </Text>
                </Pressable>
              </View>

              {/* Specs Row */}
              <View style={[styles.cardSpecsRow, { backgroundColor: theme.surfaceSecondary }]}>
                <View style={styles.specItem}>
                  <Text style={[styles.specLabel, { color: theme.textSecondary }]}>Annual Fee</Text>
                  <Text style={[styles.specValue, { color: theme.textPrimary }]}>${selectedCard.annualFee}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={[styles.specLabel, { color: theme.textSecondary }]}>Network</Text>
                  <Text style={[styles.specValue, { color: theme.textPrimary }]}>{selectedCard.network}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={[styles.specLabel, { color: theme.textSecondary }]}>Status</Text>
                  <Text style={[styles.specValue, { color: selectedCard.isActive ? '#4ECA77' : '#E57373' }]}>
                    {selectedCard.isActive ? 'Enabled' : 'Paused'}
                  </Text>
                </View>
              </View>

              {/* Reward Multipliers */}
              <Text style={[styles.rewardMatrixTitle, { color: theme.bronze }]}>REWARD MULTIPLIERS (FROM POSTGRESQL)</Text>
              <View style={styles.rewardList}>
                {Object.entries(selectedCard.rewards).map(([cat, rate]) => {
                  const pct = (rate * 100).toFixed(0);
                  const isTop = rate >= 0.04;
                  return (
                    <View key={cat} style={styles.rewardRow}>
                      <View style={styles.rewardRowHeader}>
                        <Text style={[styles.catName, { color: theme.textPrimary }]}>{cat}</Text>
                        <Text style={[styles.catRate, { color: isTop ? theme.bronze : theme.textSecondary }]}>
                          {pct}% Cash Back
                        </Text>
                      </View>
                      <View style={[styles.progressBarTrack, { backgroundColor: theme.borderLight }]}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${Math.min(rate * 2000, 100)}%`,
                              backgroundColor: isTop ? theme.bronze : theme.border,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  syncButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  syncButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  statsRowSmall: {
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  walletLayout: {
    width: '100%',
    flexDirection: 'column',
    gap: 20,
  },
  walletLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  cardsColumn: {
    width: '100%',
  },
  cardsColumnDesktop: {
    flex: 1,
  },
  detailColumn: {
    width: '100%',
  },
  detailColumnDesktop: {
    flex: 1.2,
  },
  cardListContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  cardListDesktop: {
    flexDirection: 'column',
    paddingBottom: 0,
  },
  creditCard: {
    width: 260,
    height: 160,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    justifyContent: 'space-between',
  },
  creditCardDesktop: {
    width: '100%',
    height: 150,
  },
  creditCardSelected: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIssuerText: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  activePill: {
    backgroundColor: '#1A3320',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  inactivePill: {
    backgroundColor: '#3B1818',
  },
  activePillText: {
    color: '#4ECA77',
    fontSize: 9,
    fontWeight: '700',
  },
  chipGraphic: {
    width: 32,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#D4AF37',
    padding: 3,
    opacity: 0.9,
  },
  chipInner: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#9E8020',
    borderRadius: 3,
  },
  cardNameText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cardNumberText: {
    color: '#D1CDC7',
    fontSize: 12,
    letterSpacing: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolderText: {
    color: '#8C887F',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
  },
  networkText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  detailContainer: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIssuer: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailCardName: {
    fontSize: 22,
    fontWeight: '800',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  toggleButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardSpecsRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  rewardMatrixTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  rewardList: {
    gap: 12,
  },
  rewardRow: {
    gap: 6,
  },
  rewardRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catName: {
    fontSize: 13,
    fontWeight: '600',
  },
  catRate: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  pressed: {
    opacity: 0.8,
  },
});
