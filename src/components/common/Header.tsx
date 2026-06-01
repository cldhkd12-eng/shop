import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, user, login, logout } = useShop();

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (location.pathname.includes('/login/social-popup')) {
    return null;
  }

  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor');

  const navTabs = isAdmin
    ? [
        { label: '대시보드', path: '/admin?tab=dashboard' },
        { label: '상품등록', path: '/admin?tab=products' },
        { label: '정산관리', path: '/admin?tab=tax' },
        { label: '고객관리', path: '/admin?tab=customers' },
      ]
    : [
        { label: 'SHOP ALL', path: '/' },
        { label: 'PERFUMES', path: '/perfumes' },
        { label: 'CART BOX', path: '/cart' },
        { label: '브랜드', path: '/brand' },
        { label: '고객센터', path: '/support' },
      ];

  return (
    <Nav>
      <NavInner>
        <Logo onClick={() => navigate('/')}>
          ScentAtelier
        </Logo>
        <NavTabs>
          {navTabs.map(tab => {
            const currentFull = location.pathname + location.search;
            const isActive = tab.path.includes('?') 
              ? currentFull === tab.path || (currentFull === '/admin' && tab.path === '/admin?tab=dashboard')
              : location.pathname === tab.path;
            return (
              <NavTab
                key={tab.label}
                className={isActive ? 'active' : ''}
                $isActive={isActive}
                onClick={() => navigate(tab.path)}
              >
                {tab.label}
              </NavTab>
            );
          })}
        </NavTabs>
        <NavActions>
          <NavIcon onClick={() => navigate('/cart')}>
            장바구니({totalCartCount})
          </NavIcon>
          {user.isLoggedIn ? (
            <UserSection>
              <UserName onClick={() => navigate('/mypage')}>{user.name.toUpperCase()} (MY)</UserName>
              <LogoutBtn onClick={logout}>로그아웃</LogoutBtn>
            </UserSection>
          ) : (
            <LoginBtn onClick={() => navigate('/login')}>로그인</LoginBtn>
          )}
        </NavActions>
      </NavInner>
    </Nav>
  );
};

/* ─── STYLED COMPONENTS ─── */
const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: #FFFFFF;
  border-bottom: 2px solid #000000;
`;

const NavInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;

  @media (max-width: 900px) {
    padding: 0 20px;
    height: 60px;
  }
`;

const Logo = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 22px;
  font-weight: 900;
  color: #000000;
  letter-spacing: 0.1em;
  cursor: pointer;
  white-space: nowrap;
`;

const NavTabs = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;

  @media (max-width: 900px) {
    display: none; // Minimal architecture hides GNB in mobile
  }
`;

const NavTab = styled.button<{ $isActive: boolean }>`
  font-family: ${props => props.theme.fonts.display};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #000000;
  background: transparent;
  cursor: pointer;
  border: none;
  padding: 8px 0;
  position: relative;
  transition: opacity 0.15s ease;
  opacity: ${props => (props.$isActive ? 1 : 0.6)};

  &:hover {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: #000000;
    transform: ${props => (props.$isActive ? 'scaleX(1)' : 'scaleX(0)')};
    transition: transform 0.15s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const NavIcon = styled.button`
  background: transparent;
  border: none;
  font-family: ${props => props.theme.fonts.display};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  cursor: pointer;
  color: #000000;

  &:hover {
    text-decoration: underline;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserName = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #000000;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginBtn = styled.button`
  background: #000000;
  color: #FFFFFF;
  border: 2px solid #000000;
  padding: 10px 20px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  cursor: pointer;
  border-radius: 0px;

  &:hover {
    background: #FFFFFF;
    color: #000000;
  }
`;

const LogoutBtn = styled.button`
  background: transparent;
  color: #000000;
  border: 2px solid #000000;
  padding: 10px 20px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  cursor: pointer;
  border-radius: 0px;

  &:hover {
    background: #000000;
    color: #FFFFFF;
  }
`;
