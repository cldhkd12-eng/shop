import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { login } = useShop();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleSocialMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (data && data.type === 'SOCIAL_LOGIN_SUCCESS') {
        login(data.name);
        navigate('/');
      }
    };
    window.addEventListener('message', handleSocialMessage);
    return () => window.removeEventListener('message', handleSocialMessage);
  }, [login, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    login(name);
    navigate('/');
  };

  const handleSocialClick = (platform: string) => {
    if (platform === 'naver') {
      const clientId = '5DBu8o1B7WyOCPa3uBYB';
      const redirectUri = encodeURIComponent(window.location.origin + '/#/login/social-popup?platform=naver');
      const state = Math.random().toString(36).substring(2);
      localStorage.setItem('naver_state', state);
      const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
      
      const width = 450;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      window.open(
        naverAuthUrl,
        'naverLoginPopup',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=no`
      );
      return;
    }

    if (platform === 'kakao') {
      const clientId = '3b01d1cfd2249b7fd70616bbdd18a98f';
      const redirectUri = encodeURIComponent(window.location.origin + '/#/login/social-popup?platform=kakao');
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

      const width = 450;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      window.open(
        kakaoAuthUrl,
        'kakaoLoginPopup',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=no`
      );
      return;
    }

    const width = 450;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      `/#/login/social-popup?platform=${platform}`,
      `${platform}LoginPopup`,
      `width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=no`
    );
  };

  return (
    <PageWrapper>
      <FormCard>
        <FormHeader>
          <WelcomeLabel>어서오세요</WelcomeLabel>
          <FormTitle>로그인</FormTitle>
          <FormSubtitle>센트아틀리에 멤버십으로 특별한 혜택을 누리세요</FormSubtitle>
        </FormHeader>

        <Form onSubmit={handleSubmit}>
          <FloatGroup>
            <FloatInput
              type="text"
              id="login-name"
              placeholder=" "
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <FloatLabel htmlFor="login-name">성함</FloatLabel>
          </FloatGroup>

          <FloatGroup>
            <FloatInput
              type="email"
              id="login-email"
              placeholder=" "
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <FloatLabel htmlFor="login-email">이메일 주소</FloatLabel>
          </FloatGroup>

          <FloatGroup>
            <FloatInput
              type="password"
              id="login-password"
              placeholder=" "
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <FloatLabel htmlFor="login-password">비밀번호</FloatLabel>
          </FloatGroup>

          <ForgotLink href="#">비밀번호를 잊으셨나요?</ForgotLink>

          <SubmitBtn type="submit">
            <span>로그인</span>
            <span>→</span>
          </SubmitBtn>
        </Form>

        <Divider><span>또는 간편 로그인</span></Divider>

        <SocialGroup>
          <NaverBtn type="button" onClick={() => handleSocialClick('naver')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
            </svg>
            <span>네이버로 시작하기</span>
          </NaverBtn>

          <KakaoBtn type="button" onClick={() => handleSocialClick('kakao')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919">
              <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.32 5.992l-.854 3.134c-.1.368.12.728.487.818.12.03.24.03.35.002l3.69-2.454c.33.046.666.07 1.007.07 4.97 0 9-3.186 9-7.117C21 6.185 16.97 3 12 3z"/>
            </svg>
            <span>카카오로 시작하기</span>
          </KakaoBtn>

          <GoogleBtn type="button" onClick={() => handleSocialClick('google')}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>구글로 시작하기</span>
          </GoogleBtn>
        </SocialGroup>

        <SignupRow>
          아직 회원이 아니신가요?&nbsp;
          <SignupLink href="#">무료로 가입하기</SignupLink>
        </SignupRow>
      </FormCard>
    </PageWrapper>
  );
};

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #faf8f5;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  box-sizing: border-box;
  animation: ${fadeUp} 0.5s ease both;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 360px;
`;

const FormHeader = styled.div`
  margin-bottom: 36px;
`;

const WelcomeLabel = styled.p`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #b8956a;
  margin: 0 0 8px;
`;

const FormTitle = styled.h1`
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0a0a0f;
  margin: 0 0 10px;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.6;
  word-break: keep-all;
`;

const FloatGroup = styled.div`
  position: relative;
  margin-bottom: 28px;

  input {
    width: 100%;
    box-sizing: border-box;
    padding: 22px 0 8px;
    background: transparent;
    border: none;
    border-bottom: 1.5px solid #e2e2e2;
    font-size: 15px;
    color: #0a0a0f;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
      border-bottom-color: #0a0a0f;
    }
    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 40px #faf8f5 inset;
    }
  }

  label {
    position: absolute;
    top: 22px;
    left: 0;
    font-size: 15px;
    color: #a0a0a0;
    pointer-events: none;
    transform-origin: left top;
    transition: transform 0.22s ease, color 0.22s ease;
  }

  input:focus ~ label,
  input:not(:placeholder-shown) ~ label {
    transform: translateY(-20px) scale(0.8);
    color: #0a0a0f;
    font-weight: 600;
  }
`;

const FloatInput = styled.input``;
const FloatLabel = styled.label``;

const ForgotLink = styled.a`
  display: block;
  text-align: right;
  font-size: 12px;
  color: #b0b0b0;
  text-decoration: none;
  margin: -12px 0 28px;
  transition: color 0.2s;
  &:hover { color: #0a0a0f; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px 24px;
  background: #0a0a0f;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: opacity 0.2s, transform 0.1s;

  &:hover {
    opacity: 0.9;
  }
  &:active {
    transform: scale(0.98);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0;
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e8e8e8;
  }
  span {
    font-size: 11px;
    font-weight: 500;
    color: #b0b0b0;
    white-space: nowrap;
  }
`;

const SocialGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SocialBtnBase = styled.button`
  width: 100%;
  padding: 13px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: opacity 0.2s, transform 0.1s;
  &:hover { opacity: 0.9; }
  &:active { transform: scale(0.98); }
`;

const NaverBtn = styled(SocialBtnBase)`
  background: #03C75A;
  color: #fff;
`;

const KakaoBtn = styled(SocialBtnBase)`
  background: #FEE500;
  color: #191919;
`;

const GoogleBtn = styled(SocialBtnBase)`
  background: #fff;
  color: #444;
  border: 1px solid #e0e0e0;
`;

const SignupRow = styled.p`
  margin-top: 28px;
  text-align: center;
  font-size: 13px;
  color: #8c8c8c;
`;

const SignupLink = styled.a`
  color: #0a0a0f;
  font-weight: 700;
  text-decoration: underline;
  &:hover { color: #b8956a; }
`;
