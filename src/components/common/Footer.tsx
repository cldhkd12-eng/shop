import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.includes('/login/social-popup')) {
    return null;
  }

  return (
    <FooterContainer>
      <FooterInner>
        <FooterLeft>
          <FooterBrand>MODO</FooterBrand>
          <FooterDesc>MODO : Your silent definition.</FooterDesc>
          <FooterInfo>
            MODO | 서울특별시 강남구 도산대로 123<br />
            02-1234-5678 | cldhkd12@gmail.com
          </FooterInfo>
          <Copyright>© 2026 MODO. All rights reserved.</Copyright>
        </FooterLeft>
        <FooterRight>
          <FooterLinksGroup>
            <FooterGroupTitle>SHOP</FooterGroupTitle>
            <FooterLink onClick={() => navigate('/detail/p1')}>PERFUMES</FooterLink>
            <FooterLink onClick={() => navigate('/')}>CANDLES</FooterLink>
            <FooterLink onClick={() => navigate('/')}>POCKET PERFUMES</FooterLink>
            <FooterLink onClick={() => navigate('/')}>BODY CARE</FooterLink>
          </FooterLinksGroup>
          <FooterLinksGroup>
            <FooterGroupTitle>INFO</FooterGroupTitle>
            <FooterLink onClick={() => navigate('/')}>TERMS OF USE</FooterLink>
            <FooterLink className="bold" onClick={() => navigate('/')}>PRIVACY POLICY</FooterLink>
            <FooterLink onClick={() => navigate('/support')}>CONTACT US</FooterLink>
            <FooterLink onClick={() => navigate('/admin')}>PARTNERSHIP</FooterLink>
          </FooterLinksGroup>
          <FooterLinksGroup style={{ minWidth: '220px' }}>
            <FooterGroupTitle>NEWSLETTER</FooterGroupTitle>
            <NewsletterText>Sign up for first access to new scents, secret releases, and live music alerts.</NewsletterText>
            <NewsletterForm onSubmit={(e) => e.preventDefault()}>
              <NewsletterInput type="email" placeholder="EMAIL ADDRESS" required />
              <NewsletterBtn type="submit">JOIN</NewsletterBtn>
            </NewsletterForm>
          </FooterLinksGroup>
        </FooterRight>
      </FooterInner>
    </FooterContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const FooterContainer = styled.footer`
  background: #0d0d14;
  color: #f0ede8;
  padding: 80px 40px;
  font-size: 11px;
  line-height: 1.8;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: 80px;
`;

const FooterInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 60px;
  flex-wrap: wrap;
`;

const FooterLeft = styled.div`
  flex: 1 1 400px;
`;

const FooterBrand = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #f0ede8;
  margin-bottom: 16px;
`;

const FooterDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #f0ede8;
  margin-bottom: 24px;

  .sub-desc {
    font-size: 11px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.45);
    display: inline-block;
    margin-top: 4px;
  }
`;

const FooterInfo = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 24px;
  line-height: 1.8;
`;

const Copyright = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.05em;
`;

const FooterRight = styled.div`
  display: flex;
  gap: 80px;
  flex-wrap: wrap;
`;

const FooterLinksGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 120px;
`;

const FooterGroupTitle = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #c8a97e;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
`;

const FooterLink = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: #c8a97e;
  }

  &.bold {
    font-weight: 700;
    color: #f0ede8;
  }
`;

const NewsletterText = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const NewsletterForm = styled.form`
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: #15151f;
  overflow: hidden;
`;

const NewsletterInput = styled.input`
  flex: 1;
  border: none;
  padding: 10px 12px;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  outline: none;
  letter-spacing: 0.05em;
  background: transparent;
  color: #f0ede8;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const NewsletterBtn = styled.button`
  border: none;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  background: #c8a97e;
  color: #0a0a0f;
  padding: 10px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: all 0.25s ease;

  &:hover {
    background: #dcb88f;
  }
`;
