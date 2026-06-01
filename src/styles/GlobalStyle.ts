import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${props => props.theme.fonts.body};
    background: ${props => props.theme.colors.linen};
    color: ${props => props.theme.colors.navy};
    min-height: 100vh;
    font-size: 14px;
    letter-spacing: -0.01em;
    -webkit-font-smoothing: antialiased;
  }

  /* ─── SCROLLBAR ─── */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.linen};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray400};
    border-radius: 0px;
  }

  /* ─── FADE IN ANIMATION ─── */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in {
    animation: fadeUp 0.4s ease;
  }
`;
