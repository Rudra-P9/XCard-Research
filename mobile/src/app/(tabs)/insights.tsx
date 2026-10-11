import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useXCard } from '@/store/xcard-store';
import { useResponsive } from '@/hooks/use-responsive';
import { ResponsiveContainer } from '@/components/responsive-container';
import { DonutChart } from '@/components/donut-chart';

export default function InsightsScreen() {
  const { transactions, theme } = useXCard();
  const { isDesktop, isSmallMobile } = useResponsive();

  // Metrics calculations
  const totalSpend = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalEarned = transactions.reduce((acc, t) => acc + t.rewardEarned, 0);
  const totalOptimal = transactions.reduce((acc, t) => acc + t.optimalReward, 0);
  const missedRewards = Math.max(0, totalOptimal - totalEarned);
  const optimalCount = transactions.filter((t) => t.isOptimal).length;
  const efficiencyRate = transactions.length > 0 ? (optimalCount / transactions.length) * 100 : 100;

  // Category aggregates
  const categoryMap: Record<string, { spend: number; earned: number; count: number }> = {};
  for (const t of transactions) {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = { spend: 0, earned: 0, count: 0 };
    }
    categoryMap[t.category].spend += t.amount;
    categoryMap[t.category].earned += t.rewardEarned;
    categoryMap[t.category].count += 1;
  }

  const worstMiss = transactions.find((t) => !t.isOptimal);

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
          <Text style={[styles.brandSubtitle, { color: theme.bronze }]}>REWARD ANALYTICS</Text>
          <Text style={[styles.title, { color: theme.textPrimary }, isSmallMobile && { fontSize: 24 }]}>
            Spending Insights
          </Text>
        </View>

        {/* Responsive Grid */}
        <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
          {/* Left / Primary Column */}
          <View style={[styles.column, isDesktop && styles.columnLeft]}>
            {/* Main Scorecard */}
            <View style={[styles.scorecard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.scoreTopRow}>
                <View>
                  <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>OPTIMIZATION EFFICIENCY</Text>
                  <Text style={[styles.scoreValue, { color: theme.bronzeLight }, isSmallMobile && { fontSize: 28 }]}>
                    {efficiencyRate.toFixed(0)}%
                  </Text>
                </View>
                <View style={[styles.efficiencyBadge, { backgroundColor: theme.statusOnlineBg, borderColor: theme.statusOnlineBorder }]}>
                  <Text style={[styles.efficiencyBadgeText, { color: theme.statusOnlineText }]}>
                    {efficiencyRate >= 85 ? 'OPTIMIZED' : 'NEEDS ACTION'}
                  </Text>
                </View>
              </View>

              <View style={[styles.scoreDivider, { backgroundColor: theme.borderLight }]} />

              <View style={[styles.metricsRow, isSmallMobile && styles.metricsRowSmall]}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Total Spend</Text>
                  <Text style={[styles.metricNumber, { color: theme.textPrimary }, isSmallMobile && { fontSize: 15 }]}>
                    ${totalSpend.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Earned</Text>
                  <Text style={[styles.metricNumber, { color: '#4ECA77' }, isSmallMobile && { fontSize: 15 }]}>
                    +${totalEarned.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Missed</Text>
                  <Text
                    style={[
                      styles.metricNumber,
                      { color: missedRewards > 0 ? '#E57373' : theme.textMuted },
                      isSmallMobile && { fontSize: 15 },
                    ]}
                  >
                    -${missedRewards.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Circular Donut Graph */}
            <DonutChart transactions={transactions} />

            {/* Actionable Research Insight */}
            {worstMiss && (
              <View
                style={[
                  styles.alertCard,
                  {
                    backgroundColor: theme.isDark ? '#231812' : '#FFF5EB',
                    borderColor: theme.isDark ? '#54301D' : '#E8B67B',
                  },
                ]}
              >
                <View style={styles.alertHeader}>
                  <Text style={styles.alertIcon}>⚠️</Text>
                  <Text style={[styles.alertTitle, { color: theme.bronze }]}>Optimization Opportunity</Text>
                </View>
                <Text style={[styles.alertText, { color: theme.textSecondary }]}>
                  On {worstMiss.merchant}, you paid with <Text style={[styles.boldText, { color: theme.textPrimary }]}>{worstMiss.cardUsed}</Text> and earned <Text style={styles.boldGreen}>${worstMiss.rewardEarned.toFixed(2)}</Text>.
                  Using <Text style={[styles.boldGold, { color: theme.bronze }]}>{worstMiss.optimalCard}</Text> would have generated <Text style={styles.boldGreen}>${worstMiss.optimalReward.toFixed(2)}</Text> (+${(worstMiss.optimalReward - worstMiss.rewardEarned).toFixed(2)} extra).
                </Text>
              </View>
            )}
          </View>

          {/* Right / Secondary Column */}
          <View style={[styles.column, isDesktop && styles.columnRight]}>
            {/* Category Breakdown Progress Bars */}
            <View style={[styles.categoryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.bronze }]}>SPENDING BY CATEGORY</Text>
              {Object.entries(categoryMap).map(([category, data]) => {
                const spendPct = totalSpend > 0 ? (data.spend / totalSpend) * 100 : 0;
                return (
                  <View key={category} style={styles.catItem}>
                    <View style={styles.catHeader}>
                      <View style={styles.catTitleGroup}>
                        <Text style={[styles.catName, { color: theme.textPrimary }]}>{category}</Text>
                        <Text style={[styles.catTxCount, { color: theme.textSecondary }]}>({data.count} purchases)</Text>
                      </View>
                      <View style={styles.catFigures}>
                        <Text style={[styles.catSpend, { color: theme.textSecondary }]}>${data.spend.toFixed(2)}</Text>
                        <Text style={styles.catRewardEarned}>+${data.earned.toFixed(2)}</Text>
                      </View>
                    </View>
                    <View style={[styles.catTrack, { backgroundColor: theme.borderLight }]}>
                      <View style={[styles.catFill, { width: `${Math.max(spendPct, 8)}%`, backgroundColor: theme.bronze }]} />
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Annual Savings Forecast */}
            <View style={[styles.projectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.projectionTitle, { color: theme.bronze }]}>ANNUAL SAVINGS FORECAST</Text>
              <Text style={[styles.projectionSub, { color: theme.textSecondary }]}>
                Based on StoneCap recommendation rules across Dining, Gas, Travel, and Groceries.
              </Text>
              <View style={styles.projectionFigures}>
                <View style={[styles.projBox, { backgroundColor: theme.surfaceSecondary }]}>
                  <Text style={[styles.projBoxLabel, { color: theme.textSecondary }]}>Standard 1% Card</Text>
                  <Text style={[styles.projBoxValue, { color: theme.textPrimary }]}>${((totalSpend * 12) * 0.01).toFixed(0)}/yr</Text>
                </View>
                <View style={styles.projArrow}>
                  <Text style={[styles.projArrowText, { color: theme.textSecondary }]}>→</Text>
                </View>
                <View style={[styles.projBox, { backgroundColor: theme.surfaceSecondary, borderColor: theme.bronze, borderWidth: 1 }]}>
                  <Text style={[styles.projBoxLabel, { color: theme.bronze }]}>With XCard Rules</Text>
                  <Text style={[styles.projBoxValue, { color: '#4ECA77' }]}>
                    ${((totalSpend * 12) * 0.035).toFixed(0)}/yr
                  </Text>
                </View>
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
  column: {
    width: '100%',
  },
  columnLeft: {
    flex: 1.1,
  },
  columnRight: {
    flex: 1,
  },
  scorecard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  scoreTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '800',
  },
  efficiencyBadge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  efficiencyBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scoreDivider: {
    height: 1,
    marginVertical: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricsRowSmall: {
    flexWrap: 'wrap',
  },
  metricItem: {
    flex: 1,
    minWidth: 80,
  },
  metricLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  alertCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertIcon: {
    fontSize: 16,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  alertText: {
    fontSize: 13,
    lineHeight: 19,
  },
  boldText: {
    fontWeight: '700',
  },
  boldGreen: {
    color: '#4ECA77',
    fontWeight: '700',
  },
  boldGold: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  categoryCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    width: '100%',
    marginBottom: 20,
  },
  catItem: {
    gap: 6,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
  },
  catTxCount: {
    fontSize: 11,
  },
  catFigures: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catSpend: {
    fontSize: 13,
  },
  catRewardEarned: {
    color: '#4ECA77',
    fontSize: 13,
    fontWeight: '700',
  },
  catTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  catFill: {
    height: '100%',
    borderRadius: 3,
  },
  projectionCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  projectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  projectionSub: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 16,
  },
  projectionFigures: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  projBoxLabel: {
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'center',
  },
  projBoxValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  projArrow: {
    paddingHorizontal: 8,
  },
  projArrowText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
