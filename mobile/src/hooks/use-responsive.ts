import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'smallMobile' | 'mobile' | 'tablet' | 'desktop' | 'largeDesktop';

export interface ResponsiveInfo {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isSmallMobile: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  contentPadding: number;
  maxContentWidth: number;
}

export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const isSmallMobile = width < 360;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 900;
  const isDesktop = width >= 900;
  const isWide = width >= 600;

  let breakpoint: Breakpoint = 'mobile';
  if (isSmallMobile) breakpoint = 'smallMobile';
  else if (isMobile) breakpoint = 'mobile';
  else if (isTablet) breakpoint = 'tablet';
  else if (width >= 1200) breakpoint = 'largeDesktop';
  else breakpoint = 'desktop';

  const contentPadding = isSmallMobile ? 12 : isMobile ? 18 : isTablet ? 24 : 32;
  const maxContentWidth = isDesktop ? 1120 : isTablet ? 760 : width;

  return {
    width,
    height,
    breakpoint,
    isSmallMobile,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    contentPadding,
    maxContentWidth,
  };
}
