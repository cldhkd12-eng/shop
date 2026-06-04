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

  return (
    <Nav>
      <NavInner>
        <NavLeft>
          <MinimalTab onClick={() => navigate('/perfumes')}>Shop</MinimalTab>
          <MinimalTab onClick={() => navigate('/brand')}>Brand</MinimalTab>
          <MinimalTab onClick={() => navigate('/support')}>Support</MinimalTab>
        </NavLeft>
        
        <LogoContainer>
          <Logo onClick={() => navigate('/')}>MODO.</Logo>
        </LogoContainer>
        
        <NavActions>
          <MinimalAction onClick={() => navigate('/cart')}>
            Cart({totalCartCount})
          </MinimalAction>
          {user.isLoggedIn ? (
            <MinimalAction onClick={logout}>Logout</MinimalAction>
          ) : (
            <MinimalAction onClick={() => navigate('/login')}>Login</MinimalAction>
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
  /* Removed heavy bottom border for minimal aesthetic */
  padding: 10px 0;
`;

const NavInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 60px;

  @media (max-width: 900px) {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
  }
`;

const NavLeft = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  @media (max-width: 900px) {
    display: none;
  }
`;

const MinimalTab = styled.button`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #000;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    opacity: 0.6;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Logo = styled.div`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  /* Flipping the logo 180 degrees to match the image style */
  transform: rotate(180deg);
  display: inline-block;
  line-height: 1;
`;

const NavActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  align-items: center;
`;

const MinimalAction = styled.button`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #000;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    opacity: 0.6;
  }
`;

