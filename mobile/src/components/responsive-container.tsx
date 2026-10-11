import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useResponsive } from '@/hooks/use-responsive';

interface ResponsiveContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  maxWidth?: number;
}

export function ResponsiveContainer({ children, style, maxWidth }: ResponsiveContainerProps) {
  const { contentPadding, isDesktop, isTablet } = useResponsive();
  const targetMaxWidth = maxWidth ?? (isDesktop ? 1120 : isTablet ? 780 : 600);

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.inner,
          {
            maxWidth: targetMaxWidth,
            paddingHorizontal: contentPadding,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
});
