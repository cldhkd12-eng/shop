import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { login } = useShop();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Listen to message from the social login popup window
  useEffect(() => {
    const handleSocialMessage = (event: MessageEvent) => {
      // Validate origin
      if (event.origin !== window.location.origin) return;

      const data = event.data;
      if (data && data.type === 'SOCIAL_LOGIN_SUCCESS') {
        login(data.name);
        navigate('/');
      }
    };

    window.addEventListener('message', handleSocialMessage);
    return () => {
      window.removeEventListener('message', handleSocialMessage);
    };
  }, [login, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    
    // Login with the actual user-inputted name
    login(name);
    navigate('/');
  };

  const handleSocialClick = (platform: string) => {
    const width = 450;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `/login/social-popup?platform=${platform}`,
      `${platform}LoginPopup`,
      `width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=no`
    );
  };

  return (
    <PageContainer className="fade-in">
      <LoginCard>
        <BrandLogo>ScentAtelier</BrandLogo>
        <Subtitle>센트아틀리에에 로그인하고 특별한 시그니처 혜택을 받아보세요.</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>이름 (성함)</label>
            <input
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>이메일 주소</label>
            <input
              type="email"
              placeholder="example@scent.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup style={{ marginBottom: '24px' }}>
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <SubmitBtn type="submit">이메일로 로그인</SubmitBtn>
        </Form>

        <Divider>
          <span>또는 SNS 간편 로그인</span>
        </Divider>

        <SocialGroup>
          {/* KAKAO LOGIN BUTTON WITH OFFICIAL LOGO */}
          <SocialBtn className="kakao" onClick={() => handleSocialClick('kakao')}>
            <KakaoIconSvg viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.32 5.992l-.854 3.134c-.1.368.12.728.487.818.12.03.24.03.35.002l3.69-2.454c.33.046.666.07 1.007.07 4.97 0 9-3.186 9-7.117C21 6.185 16.97 3 12 3z" />
            </KakaoIconSvg>
            카카오톡 로그인 연결
          </SocialBtn>

          {/* GOOGLE LOGIN BUTTON WITH OFFICIAL LOGO */}
          <SocialBtn className="google" onClick={() => handleSocialClick('google')}>
            <GoogleIconSvg viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </GoogleIconSvg>
            구글 로그인 연결
          </SocialBtn>
        </SocialGroup>
      </LoginCard>
    </PageContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const PageContainer = styled.div`
  width: 100%;
  min-height: 80vh;
  background: #FAF8F5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
`;

const LoginCard = styled.div`
  max-width: 440px;
  width: 100%;
  background: #FFFFFF;
  border: 2px solid #000000;
  padding: 50px 40px;
  text-align: center;

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const BrandLogo = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 0.1em;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  color: #000000;
`;

const Subtitle = styled.p`
  font-size: 12px;
  line-height: 1.6;
  color: #666666;
  margin-bottom: 36px;
  word-break: keep-all;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  text-align: left;

  label {
    display: block;
    font-size: 10px;
    font-weight: 800;
    color: #333333;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input {
    width: 100%;
    padding: 12px 14px;
    border: 2px solid #000000;
    font-size: 13px;
    outline: none;
    background: #FAF8F5;

    &:focus {
      background: #FFFFFF;
    }
  }
`;

const SubmitBtn = styled.button`
  padding: 16px;
  background: #000000;
  color: #FFFFFF;
  border: 2px solid #000000;
  font-family: ${props => props.theme.fonts.display};
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.05em;

  &:hover {
    background: #FFFFFF;
    color: #000000;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: #888888;
  font-size: 10px;
  font-weight: 700;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1.5px solid #EAEAEA;
  }

  span {
    padding: 0 10px;
  }
`;

const SocialGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SocialBtn = styled.button`
  width: 100%;
  padding: 14px;
  border: 2px solid #000000;
  font-family: ${props => props.theme.fonts.display};
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  background: #FFFFFF;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &.kakao {
    background: #FEE500;
    border-color: #FEE500;
    color: #191919;

    &:hover {
      background: #E6CE00;
    }
  }

  &.google {
    background: #FFFFFF;
    border-color: #000000;

    &:hover {
      background: #FAF8F5;
    }
  }
`;

const KakaoIconSvg = styled.svg`
  width: 18px;
  height: 18px;
  fill: #191919;
`;

const GoogleIconSvg = styled.svg`
  width: 18px;
  height: 18px;
`;
