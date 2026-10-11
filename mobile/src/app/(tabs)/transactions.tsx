import React, { useState } from 'react';
import {
  Alert,
  Modal,
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

const CATEGORY_ICONS: Record<string, string> = {
  Dining: '🍽️',
  Gas: '⛽',
  Groceries: '🛒',
  Travel: '✈️',
  Streaming: '🍿',
  Other: '🛍️',
};

export default function TransactionsScreen() {
  const { transactions, cards, addTransaction, findBestCard, theme } = useXCard();
  const { isDesktop, isTablet, isSmallMobile } = useResponsive();

  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newMerchant, setNewMerchant] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCardUsed, setNewCardUsed] = useState(cards[0]?.name || 'Freedom Flex');

  const categories = ['All', 'Dining', 'Gas', 'Groceries', 'Travel', 'Streaming', 'Suboptimal'];

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter =
      filter === 'All'
        ? true
        : filter === 'Suboptimal'
        ? !t.isOptimal
        : t.category === filter;

    const matchesSearch =
      search.trim() === '' ||
      t.merchant.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleCreateTransaction = async () => {
    const trimmed = newMerchant.trim();
    const num = Number.parseFloat(newAmount);

    if (!trimmed || !num || num <= 0) {
      Alert.alert('Invalid Details', 'Please enter a valid merchant and amount.');
      return;
    }

    const rec = await findBestCard(trimmed, num);

    const usedCardObj = cards.find((c) => c.name === newCardUsed) || cards[0];
    const usedRate = usedCardObj.rewards[rec.category] ?? usedCardObj.rewards['Other'] ?? 0.01;
    const earned = Number((num * usedRate).toFixed(2));
    const isOptimal = newCardUsed === rec.bestCard || earned >= rec.reward;

    addTransaction({
      merchant: trimmed,
      category: rec.category,
      amount: num,
      date: 'Just now',
      cardUsed: newCardUsed,
      optimalCard: rec.bestCard,
      rewardEarned: earned,
      optimalReward: rec.reward,
      isOptimal,
    });

    setModalVisible(false);
    setNewMerchant('');
    setNewAmount('');
  };

  return (
    <View style={[styles.screenWrapper, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: isSmallMobile ? 40 : 56, paddingBottom: 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ResponsiveContainer>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexShrink: 1 }}>
              <Text style={[styles.brandSubtitle, { color: theme.bronze }]}>ACTIVITY LOG</Text>
              <Text style={[styles.title, { color: theme.textPrimary }, isSmallMobile && { fontSize: 24 }]}>
                Transactions
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
                pressed && styles.pressed,
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.addButtonText, { color: theme.bronze }]}>+ Log Purchase</Text>
            </Pressable>
          </View>

          {/* Search & Filters Controls */}
          <View style={[styles.controlsRow, isDesktop && styles.controlsRowDesktop]}>
            <View style={[styles.searchContainer, isDesktop && styles.searchContainerDesktop]}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search merchant or category..."
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.searchInput,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    color: theme.textPrimary,
                  },
                ]}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {categories.map((cat) => {
                const isActive = filter === cat;
                return (
                  <Pressable
                    key={cat}
                    style={({ pressed }) => [
                      styles.filterChip,
                      {
                        backgroundColor: isActive ? theme.surfaceSelected : theme.surface,
                        borderColor: isActive ? theme.bronze : theme.borderLight,
                      },
                      pressed && styles.pressed,
                    ]}
                    onPress={() => setFilter(cat)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: isActive ? theme.bronze : theme.textSecondary },
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Transaction Count */}
          <Text style={[styles.listHeader, { color: theme.bronze }]}>
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'RECORD' : 'RECORDS'}
          </Text>

          {/* Transaction Grid / List */}
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No matching transactions</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>Try a different filter or search term</Text>
            </View>
          ) : (
            <View style={[styles.txGrid, isDesktop && styles.txGridDesktop]}>
              {filteredTransactions.map((tx) => {
                const icon = CATEGORY_ICONS[tx.category] || '🛍️';
                const missed = Number((tx.optimalReward - tx.rewardEarned).toFixed(2));

                return (
                  <View
                    key={tx.id}
                    style={[
                      styles.txCard,
                      { backgroundColor: theme.surface, borderColor: theme.border },
                      isDesktop && styles.txCardDesktop,
                    ]}
                  >
                    <View style={styles.txLeft}>
                      <View style={[styles.catIconBox, { backgroundColor: theme.surfaceSecondary }]}>
                        <Text style={styles.catIcon}>{icon}</Text>
                      </View>
                      <View style={styles.txDetails}>
                        <Text style={[styles.txMerchant, { color: theme.textPrimary }]} numberOfLines={1}>
                          {tx.merchant}
                        </Text>
                        <View style={styles.txMetaRow}>
                          <Text style={[styles.txCategory, { color: theme.textSecondary }]}>{tx.category}</Text>
                          <Text style={[styles.txDot, { color: theme.border }]}>•</Text>
                          <Text style={[styles.txDate, { color: theme.textSecondary }]}>{tx.date}</Text>
                        </View>
                        <Text style={[styles.txCardUsed, { color: theme.textSecondary }]}>
                          Paid with <Text style={[styles.boldText, { color: theme.textPrimary }]}>{tx.cardUsed}</Text>
                        </Text>
                      </View>
                    </View>

                    <View style={styles.txRight}>
                      <Text style={[styles.txAmount, { color: theme.textPrimary }]}>${tx.amount.toFixed(2)}</Text>
                      <Text style={styles.txRewardEarned}>+${tx.rewardEarned.toFixed(2)}</Text>
                      {tx.isOptimal ? (
                        <View style={[styles.optimalBadge, { backgroundColor: theme.statusOnlineBg, borderColor: theme.statusOnlineBorder }]}>
                          <Text style={[styles.optimalBadgeText, { color: theme.statusOnlineText }]}>BEST CARD</Text>
                        </View>
                      ) : (
                        <View style={styles.missedBadge}>
                          <Text style={styles.missedBadgeText}>-${missed.toFixed(2)} vs {tx.optimalCard}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ResponsiveContainer>
      </ScrollView>

      {/* Log Purchase Modal */}
      <Modal visible={modalVisible} transparent animationType={isDesktop ? 'fade' : 'slide'}>
        <View style={[styles.modalOverlay, isDesktop && styles.modalOverlayDesktop]}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.surface, borderColor: theme.border },
              isDesktop && styles.modalContentDesktop,
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Log Purchase</Text>
            <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
              Simulate spending and test recommendation accuracy against wallet rules.
            </Text>

            <Text style={[styles.modalLabel, { color: theme.textPrimary }]}>Merchant</Text>
            <TextInput
              value={newMerchant}
              onChangeText={setNewMerchant}
              placeholder="e.g. Starbucks"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.textPrimary,
                },
              ]}
            />

            <Text style={[styles.modalLabel, { color: theme.textPrimary }]}>Amount ($ USD)</Text>
            <TextInput
              value={newAmount}
              onChangeText={setNewAmount}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.textPrimary,
                },
              ]}
              keyboardType="decimal-pad"
            />

            <Text style={[styles.modalLabel, { color: theme.textPrimary }]}>Card Used</Text>
            <View style={styles.cardSelectRow}>
              {cards.map((c) => {
                const isSelected = newCardUsed === c.name;
                return (
                  <Pressable
                    key={c.id}
                    style={[
                      styles.cardChoiceChip,
                      {
                        backgroundColor: isSelected ? theme.surfaceSelected : theme.surfaceSecondary,
                        borderColor: isSelected ? theme.bronze : theme.borderLight,
                      },
                    ]}
                    onPress={() => setNewCardUsed(c.name)}
                  >
                    <Text
                      style={[
                        styles.cardChoiceText,
                        { color: isSelected ? theme.bronze : theme.textPrimary },
                      ]}
                    >
                      {c.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.surfaceSecondary }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalCancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.bronze }]}
                onPress={handleCreateTransaction}
              >
                <Text style={styles.modalConfirmText}>Save Purchase</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
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
  addButton: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  controlsRow: {
    width: '100%',
    marginBottom: 16,
    gap: 12,
  },
  controlsRowDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    width: '100%',
  },
  searchContainerDesktop: {
    flex: 1,
    maxWidth: 360,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    width: '100%',
  },
  filterRow: {
    gap: 8,
    paddingRight: 10,
  },
  filterChip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listHeader: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  txGrid: {
    gap: 12,
    width: '100%',
  },
  txGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  txCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  txCardDesktop: {
    width: '49%',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  catIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catIcon: {
    fontSize: 18,
  },
  txDetails: {
    flex: 1,
  },
  txMerchant: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  txCategory: {
    fontSize: 11,
    fontWeight: '600',
  },
  txDot: {
    fontSize: 10,
  },
  txDate: {
    fontSize: 11,
  },
  txCardUsed: {
    fontSize: 11,
  },
  boldText: {
    fontWeight: '600',
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  txRewardEarned: {
    color: '#4ECA77',
    fontSize: 12,
    fontWeight: '700',
  },
  optimalBadge: {
    borderWidth: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  optimalBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  missedBadge: {
    backgroundColor: '#2F1915',
    borderColor: '#602B21',
    borderWidth: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  missedBadgeText: {
    color: '#E57373',
    fontSize: 9,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalOverlayDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    width: '100%',
  },
  modalContentDesktop: {
    maxWidth: 480,
    borderRadius: 24,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  cardSelectRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  cardChoiceChip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cardChoiceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalConfirmText: {
    color: '#0B0A08',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
