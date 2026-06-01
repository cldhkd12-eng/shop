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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    <PageWrapper>
      {/* ── LEFT PANEL ── */}
      <LeftPanel>
        <Orb1 /><Orb2 /><Orb3 />
        <LeftContent>
          <LeftBrand>
            <BrandMark>SA</BrandMark>
            <BrandName>ScentAtelier</BrandName>
          </LeftBrand>
          <LeftHeadline>
            향기로<br />기억되는<br />순간들
          </LeftHeadline>
          <LeftTagline>
            세상에서 가장 희귀한 원료로 만든<br />
            당신만의 시그니처 프래그런스
          </LeftTagline>
          <FloatingFragrances>
            <FragTag style={{ animationDelay: '0s' }}>SANTAL 33</FragTag>
            <FragTag style={{ animationDelay: '0.4s' }}>ROSE 31</FragTag>
            <FragTag style={{ animationDelay: '0.8s' }}>BERGAMOTE 22</FragTag>
            <FragTag style={{ animationDelay: '1.2s' }}>VETIVER 46</FragTag>
          </FloatingFragrances>
        </LeftContent>
        <LeftFooter>© 2026 ScentAtelier. All rights reserved.</LeftFooter>
      </LeftPanel>

      {/* ── RIGHT PANEL ── */}
      <RightPanel>
        <FormCard>
          <FormHeader>
            <WelcomeText>어서오세요</WelcomeText>
            <FormTitle>로그인</FormTitle>
            <FormSubtitle>센트아틀리에 멤버십으로 특별한 혜택을 누리세요</FormSubtitle>
          </FormHeader>

          <Form onSubmit={handleSubmit}>
            <FloatGroup focused={focusedField === 'name' || !!name}>
              <FloatInput
                type="text"
                id="name"
                placeholder=" "
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <FloatLabel htmlFor="name">성함</FloatLabel>
              <FieldLine focused={focusedField === 'name'} />
            </FloatGroup>

            <FloatGroup focused={focusedField === 'email' || !!email}>
              <FloatInput
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <FloatLabel htmlFor="email">이메일 주소</FloatLabel>
              <FieldLine focused={focusedField === 'email'} />
            </FloatGroup>

            <FloatGroup focused={focusedField === 'password' || !!password}>
              <FloatInput
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <FloatLabel htmlFor="password">비밀번호</FloatLabel>
              <FieldLine focused={focusedField === 'password'} />
            </FloatGroup>

            <ForgotLink href="#">비밀번호를 잊으셨나요?</ForgotLink>
            <SubmitBtn type="submit">
              <span>로그인</span>
              <ArrowIcon>→</ArrowIcon>
            </SubmitBtn>
          </Form>

          <Divider><span>또는 간편 로그인</span></Divider>

          <SocialGroup>
            {/* NAVER */}
            <NaverBtn onClick={() => handleSocialClick('naver')}>
              <NaverIcon viewBox="0 0 24 24">
                <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="#fff"/>
              </NaverIcon>
              <span>네이버로 시작하기</span>
            </NaverBtn>

            {/* KAKAO */}
            <KakaoBtn onClick={() => handleSocialClick('kakao')}>
              <KakaoIcon viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.32 5.992l-.854 3.134c-.1.368.12.728.487.818.12.03.24.03.35.002l3.69-2.454c.33.046.666.07 1.007.07 4.97 0 9-3.186 9-7.117C21 6.185 16.97 3 12 3z" fill="#191919"/>
              </KakaoIcon>
              <span>카카오로 시작하기</span>
            </KakaoBtn>

            {/* GOOGLE */}
            <GoogleBtn onClick={() => handleSocialClick('google')}>
              <GoogleIcon viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </GoogleIcon>
              <span>구글로 시작하기</span>
            </GoogleBtn>
          </SocialGroup>

          <SignupRow>
            아직 회원이 아니신가요?&nbsp;<SignupLink href="#">무료로 가입하기</SignupLink>
          </SignupRow>
        </FormCard>
      </RightPanel>
    </PageWrapper>
  );
};

/* ─────────── ANIMATIONS ─────────── */
const orbFloat = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.97); }
`;

const tagFloat = keyframes`
  0%, 100% { opacity: 0.5; transform: translateY(0px); }
  50% { opacity: 0.9; transform: translateY(-6px); }
`;

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

/* ─────────── LAYOUT ─────────── */
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

/* ─── LEFT ─── */
const LeftPanel = styled.div`
  flex: 1;
  background: #0a0a0f;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  min-height: 500px;

  @media (max-width: 768px) {
    min-height: 260px;
    padding: 32px 24px;
  }
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: ${orbFloat} 10s ease-in-out infinite;
`;

const Orb1 = styled(Orb)`
  width: 420px; height: 420px;
  background: radial-gradient(circle, rgba(180,130,255,0.25) 0%, transparent 70%);
  top: -100px; left: -80px;
  animation-duration: 12s;
`;

const Orb2 = styled(Orb)`
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(255,180,100,0.18) 0%, transparent 70%);
  bottom: 40px; right: -60px;
  animation-duration: 9s;
  animation-delay: -4s;
`;

const Orb3 = styled(Orb)`
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(100,200,255,0.15) 0%, transparent 70%);
  top: 50%; left: 40%;
  animation-duration: 15s;
  animation-delay: -7s;
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 2;
  animation: ${fadeSlideUp} 0.8s ease both;
`;

const LeftBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 64px;

  @media (max-width: 768px) { margin-bottom: 24px; }
`;

const BrandMark = styled.div`
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #d4af8a, #f0d4aa);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 900;
  letter-spacing: 0.05em;
  color: #0a0a0f;
  border-radius: 8px;
`;

const BrandName = styled.span`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.9);
  text-transform: uppercase;
`;

const LeftHeadline = styled.h2`
  font-size: clamp(42px, 5vw, 72px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, #d4af8a 50%, #f0d4aa 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
  margin: 0 0 24px 0;

  @media (max-width: 768px) { font-size: 36px; }
`;

const LeftTagline = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255,255,255,0.45);
  margin-bottom: 40px;
  word-break: keep-all;
`;

const FloatingFragrances = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FragTag = styled.span`
  padding: 6px 14px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.5);
  animation: ${tagFloat} 3s ease-in-out infinite;
  backdrop-filter: blur(4px);
  background: rgba(255,255,255,0.04);
`;

const LeftFooter = styled.p`
  position: relative;
  z-index: 2;
  font-size: 11px;
  color: rgba(255,255,255,0.2);
  letter-spacing: 0.05em;

  @media (max-width: 768px) { display: none; }
`;

/* ─── RIGHT ─── */
const RightPanel = styled.div`
  width: 480px;
  background: #faf8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  animation: ${fadeSlideUp} 0.8s 0.15s ease both;

  @media (max-width: 900px) { width: 420px; }
  @media (max-width: 768px) { width: 100%; padding: 40px 24px; }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 380px;
`;

const FormHeader = styled.div`
  margin-bottom: 40px;
`;

const WelcomeText = styled.p`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b8956a;
  margin: 0 0 8px 0;
`;

const FormTitle = styled.h1`
  font-size: 36px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #0a0a0f;
  margin: 0 0 12px 0;
`;

const FormSubtitle = styled.p`
  font-size: 13px;
  color: #888;
  line-height: 1.6;
  word-break: keep-all;
`;

/* ─── FLOAT INPUTS ─── */
const FloatGroup = styled.div<{ focused: boolean }>`
  position: relative;
  margin-bottom: 28px;
`;

const FloatInput = styled.input`
  width: 100%;
  padding: 20px 0 8px 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid #ddd;
  font-size: 15px;
  color: #0a0a0f;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;

  &:focus { border-color: #0a0a0f; }
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #faf8f5 inset;
  }
`;

const FloatLabel = styled.label`
  position: absolute;
  top: 20px;
  left: 0;
  font-size: 14px;
  color: #aaa;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  transform-origin: left top;

  /* When sibling input is focused OR has value */
  ${FloatGroup}.focused &,
  ${FloatInput}:focus ~ &,
  ${FloatInput}:not(:placeholder-shown) ~ & {
    transform: translateY(-16px) scale(0.78);
    color: #b8956a;
    font-weight: 700;
    letter-spacing: 0.06em;
  }
`;

const FieldLine = styled.div<{ focused: boolean }>`
  position: absolute;
  bottom: 0; left: 0;
  height: 2px;
  width: ${p => p.focused ? '100%' : '0%'};
  background: linear-gradient(90deg, #b8956a, #d4af8a);
  transition: width 0.3s ease;
`;

const ForgotLink = styled.a`
  display: block;
  text-align: right;
  font-size: 12px;
  color: #aaa;
  text-decoration: none;
  margin: -12px 0 28px 0;
  transition: color 0.2s;

  &:hover { color: #0a0a0f; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 18px 24px;
  background: #0a0a0f;
  color: #ffffff;
  border: none;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.08em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 4px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #b8956a, #d4af8a);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before { opacity: 1; }
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
  &:active { transform: translateY(0); }

  span, svg { position: relative; z-index: 1; }
`;

const ArrowIcon = styled.span`
  font-size: 18px;
  transition: transform 0.2s;
  ${SubmitBtn}:hover & { transform: translateX(4px); }
`;

/* ─── DIVIDER ─── */
const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 28px 0;
  gap: 12px;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e5e5;
  }

  span {
    font-size: 11px;
    font-weight: 700;
    color: #bbb;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
`;

/* ─── SOCIAL BUTTONS ─── */
const SocialGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BaseSocialBtn = styled.button`
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
  letter-spacing: 0.03em;

  &:hover { transform: translateY(-1px); filter: brightness(0.95); }
  &:active { transform: translateY(0); }
`;

const NaverBtn = styled(BaseSocialBtn)`
  background: #03C75A;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(3,199,90,0.25);
`;

const NaverIcon = styled.svg`
  width: 16px; height: 16px;
`;

const KakaoBtn = styled(BaseSocialBtn)`
  background: #FEE500;
  color: #191919;
  box-shadow: 0 2px 8px rgba(254,229,0,0.35);
`;

const KakaoIcon = styled.svg`
  width: 18px; height: 18px;
`;

const GoogleBtn = styled(BaseSocialBtn)`
  background: #ffffff;
  color: #333;
  border: 1.5px solid #e5e5e5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`;

const GoogleIcon = styled.svg`
  width: 18px; height: 18px;
`;

/* ─── SIGNUP ─── */
const SignupRow = styled.p`
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
`;

const SignupLink = styled.a`
  color: #0a0a0f;
  font-weight: 800;
  text-decoration: none;
  border-bottom: 1.5px solid #0a0a0f;
  padding-bottom: 1px;
  transition: color 0.2s, border-color 0.2s;

  &:hover { color: #b8956a; border-color: #b8956a; }
`;
