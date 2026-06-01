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
          <FooterBrand>ScentAtelier</FooterBrand>
          <FooterDesc>남녀 모두가 쓸 수 있는 향기, ScentAtelier</FooterDesc>
          <FooterInfo>
            ScentAtelier | 서울특별시 강남구 도산대로 123<br />
            02-1234-5678 | cldhkd12@gmial.com
          </FooterInfo>
          <Copyright>© 2026 ScentAtelier. All rights reserved.</Copyright>
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
  background: #FFFFFF;
  color: #000000;
  padding: 80px 40px;
  font-size: 11px;
  line-height: 1.8;
  border-top: 2px solid #000000;
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
  font-family: ${props => props.theme.fonts.display};
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #000000;
  margin-bottom: 16px;
`;

const FooterDesc = styled.p`
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #000000;
  margin-bottom: 24px;
`;

const FooterInfo = styled.div`
  font-size: 11px;
  color: #555555;
  margin-bottom: 24px;
  line-height: 1.8;
`;

const Copyright = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 700;
  color: #888888;
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
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 900;
  color: #000000;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
`;

const FooterLink = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #555555;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: #000000;
    text-decoration: underline;
  }

  &.bold {
    font-weight: 800;
    color: #000000;
  }
`;

const NewsletterText = styled.p`
  color: #555555;
  font-size: 11px;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const NewsletterForm = styled.form`
  display: flex;
  border: 2px solid #000000;
  background: #FFFFFF;
`;

const NewsletterInput = styled.input`
  flex: 1;
  border: none;
  padding: 10px 12px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 700;
  outline: none;
  letter-spacing: 0.05em;
  background: transparent;
  color: #000000;

  &::placeholder {
    color: #888888;
  }
`;

const NewsletterBtn = styled.button`
  border: none;
  border-left: 2px solid #000000;
  background: #000000;
  color: #FFFFFF;
  padding: 10px 16px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: all 0.15s ease;

  &:hover {
    background: #FFFFFF;
    color: #000000;
  }
`;
