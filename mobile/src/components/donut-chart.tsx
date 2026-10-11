import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useResponsive } from '@/hooks/use-responsive';
import { useXCard } from '@/store/xcard-store';

export interface CategorySpend {
  category: string;
  amount: number;
  earned: number;
  color: string;
  percentage: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Dining: '#A97B45',      // Bronze
  Gas: '#E5A93C',         // Amber Gold
  Groceries: '#4ECA77',   // Emerald
  Travel: '#4A90E2',      // Sapphire
  Streaming: '#E57373',   // Coral Red
  Other: '#9E988D',       // Muted Warm Gray
};

interface DonutChartProps {
  transactions: {
    category: string;
    amount: number;
    rewardEarned: number;
  }[];
}

export function DonutChart({ transactions }: DonutChartProps) {
  const { theme } = useXCard();
  const { isDesktop, isSmallMobile } = useResponsive();

  const totalSpend = transactions.reduce((acc, t) => acc + t.amount, 0);

  // Group by category
  const categories = ['Dining', 'Groceries', 'Gas', 'Travel', 'Streaming', 'Other'];
  const spendMap: Record<string, { amount: number; earned: number }> = {};
  for (const c of categories) {
    spendMap[c] = { amount: 0, earned: 0 };
  }

  for (const t of transactions) {
    const cat = categories.includes(t.category) ? t.category : 'Other';
    spendMap[cat].amount += t.amount;
    spendMap[cat].earned += t.rewardEarned;
  }

  const data: CategorySpend[] = categories
    .map((cat) => ({
      category: cat,
      amount: spendMap[cat].amount,
      earned: spendMap[cat].earned,
      color: CATEGORY_COLORS[cat] || '#8C887F',
      percentage: totalSpend > 0 ? (spendMap[cat].amount / totalSpend) * 100 : 0,
    }))
    .filter((d) => d.amount > 0);

  // Sort descending by amount
  data.sort((a, b) => b.amount - a.amount);

  // Donut geometry
  const size = isSmallMobile ? 180 : 210;
  const strokeWidth = isSmallMobile ? 24 : 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate SVG stroke segments
  let accumulatedPercent = 0;
  const segments = data.map((d) => {
    const strokeDash = (d.percentage / 100) * circumference;
    const strokeOffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += d.percentage;
    return {
      ...d,
      strokeDash,
      strokeOffset,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: theme.bronze }]}>SPENDING BREAKDOWN</Text>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Category Distribution</Text>
      </View>

      <View style={[styles.chartWrapper, isDesktop && styles.chartWrapperDesktop]}>
        {/* The Donut Ring */}
        <View style={[styles.donutArea, { width: size, height: size }]}>
          {Platform.OS === 'web' ? (
            React.createElement(
              'svg',
              {
                width: size,
                height: size,
                viewBox: `0 0 ${size} ${size}`,
                style: { transform: 'rotate(-90deg)' },
              },
              // Background track
              React.createElement('circle', {
                cx: size / 2,
                cy: size / 2,
                r: radius,
                fill: 'none',
                stroke: theme.borderLight,
                strokeWidth: strokeWidth,
              }),
              // Segments
              ...segments.map((seg, i) =>
                React.createElement('circle', {
                  key: seg.category,
                  cx: size / 2,
                  cy: size / 2,
                  r: radius,
                  fill: 'none',
                  stroke: seg.color,
                  strokeWidth: strokeWidth,
                  strokeDasharray: `${seg.strokeDash} ${circumference - seg.strokeDash}`,
                  strokeDashoffset: seg.strokeOffset,
                  strokeLinecap: 'butt',
                })
              )
            )
          ) : (
            // Native fallback: stylized ring
            <View
              style={[
                styles.nativeRing,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeWidth,
                  borderColor: theme.bronze,
                },
              ]}
            />
          )}

          {/* Center Hole Content */}
          <View
            style={[
              styles.centerHole,
              {
                width: size - strokeWidth * 2 - 4,
                height: size - strokeWidth * 2 - 4,
                borderRadius: (size - strokeWidth * 2 - 4) / 2,
                backgroundColor: theme.surface,
              },
            ]}
          >
            <Text style={[styles.centerSub, { color: theme.textSecondary }]}>TOTAL SPEND</Text>
            <Text style={[styles.centerAmount, { color: theme.textPrimary }]}>
              ${totalSpend.toFixed(2)}
            </Text>
            <Text style={[styles.centerTxCount, { color: theme.bronze }]}>
              {transactions.length} purchases
            </Text>
          </View>
        </View>

        {/* Legend Grid */}
        <View style={[styles.legendBox, isDesktop && styles.legendBoxDesktop]}>
          <View style={styles.legendGrid}>
            {data.map((item) => (
              <View
                key={item.category}
                style={[
                  styles.legendItem,
                  { backgroundColor: theme.surfaceSecondary, borderColor: theme.borderLight },
                ]}
              >
                <View style={styles.legendTop}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendName, { color: theme.textPrimary }]} numberOfLines={1}>
                    {item.category}
                  </Text>
                  <Text style={[styles.legendPct, { color: theme.bronze }]}>
                    {item.percentage.toFixed(0)}%
                  </Text>
                </View>
                <View style={styles.legendBottom}>
                  <Text style={[styles.legendSpend, { color: theme.textSecondary }]}>
                    ${item.amount.toFixed(2)}
                  </Text>
                  <Text style={styles.legendReward}>
                    +${item.earned.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  headerRow: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  chartWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  chartWrapperDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 28,
  },
  donutArea: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  nativeRing: {
    position: 'absolute',
  },
  centerHole: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  centerSub: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  centerAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  centerTxCount: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  legendBox: {
    width: '100%',
  },
  legendBoxDesktop: {
    flex: 1,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flex: 1,
    minWidth: 130,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
  },
  legendTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendName: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  legendPct: {
    fontSize: 12,
    fontWeight: '800',
  },
  legendBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendSpend: {
    fontSize: 11,
  },
  legendReward: {
    color: '#4ECA77',
    fontSize: 11,
    fontWeight: '700',
  },
});
