import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export function useBreakpoint(breakpoint) {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint] || breakpoint})`);
}

export function useIsMobile() {
  return !useMediaQuery(`(min-width: ${breakpoints.md})`);
}

export function useIsTablet() {
  const isMinMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const isMaxLg = !useMediaQuery(`(min-width: ${breakpoints.lg})`);
  return isMinMd && isMaxLg;
}

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${breakpoints.lg})`);
}