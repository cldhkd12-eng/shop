export const theme = {
  colors: {
    navy: '#000000',        // D.S. & DURGA signature off-black
    navyLight: '#1C1C1C',
    navyDark: '#0D0D0D',
    amber: '#000000',       // Bold black accent
    amberLight: '#333333',
    amberPale: '#F5F5F5',
    linen: '#FAF8F5',       // Sophisticated warm cream/beige background
    linenWarm: '#F4F0EB',   // Muted dusty beige accent
    white: '#FAF8F5',
    gray100: '#F7F7F7',
    gray200: '#E1E1E1',
    gray400: '#7F7F7F',
    gray600: '#4A4A4A',
    gray800: '#1C1C1C',
  },
  fonts: {
    display: "'Inter', 'Circular', sans-serif", // Modern geometric architecture style
    body: "'Inter', 'Noto Sans KR', sans-serif",
  },
  radius: {
    sm: '0px',   // Strict architectural flat shapes
    md: '0px',
    lg: '0px',
  },
  shadows: {
    card: 'none', // No soft shadows - brutalist architecture
    float: 'none',
  },
  transition: 'all 0.15s ease-in-out',
};

export type ThemeType = typeof theme;
