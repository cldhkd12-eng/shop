import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useShop } from '../../context/ShopContext';

export const Toast: React.FC = () => {
  const { toastMessage, hideToast } = useShop();

  useEffect(() => {
    // Esc 키를 누르면 토스트가 닫히도록 바인딩 (보너스 접근성 지원)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideToast();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hideToast]);

  if (!toastMessage) return null;

  return (
    <ToastWrapper onClick={hideToast}>
      <ToastIcon>✓</ToastIcon>
      <ToastMsg>{toastMessage}</ToastMsg>
    </ToastWrapper>
  );
};

/* ─── STYLED COMPONENTS ─── */
const toastIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${props => props.theme.colors.navy};
  color: ${props => props.theme.colors.white};
  padding: 14px 20px;
  border-radius: ${props => props.theme.radius.md};
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 999;
  box-shadow: ${props => props.theme.shadows.float};
  animation: ${toastIn} 0.3s ease;
  cursor: pointer;
`;

const ToastIcon = styled.span`
  font-size: 16px;
  color: ${props => props.theme.colors.amber};
`;

const ToastMsg = styled.span`
  font-family: ${props => props.theme.fonts.body};
`;
