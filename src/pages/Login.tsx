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
          <LeftHeadline>향기로<br />기억되는<br />순간들</LeftHeadline>
          <LeftTagline>
            세상에서 가장 희귀한 원료로 만든<br />당신만의 시그니처 프래그런스
          </LeftTagline>
          <FloatingFragrances>
            {['SANTAL 33','ROSE 31','BERGAMOTE 22','VETIVER 46'].map((tag, i) => (
              <FragTag key={tag} style={{ animationDelay: `${i * 0.4}s` }}>{tag}</FragTag>
            ))}
          </FloatingFragrances>
        </LeftContent>
        <LeftFooter>© 2026 ScentAtelier. All rights reserved.</LeftFooter>
      </LeftPanel>

      {/* ── RIGHT PANEL ── */}
      <RightPanel>
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
      </RightPanel>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════
   KEYFRAMES
═══════════════════════════════════ */
const orbFloat = keyframes`
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(30px,-40px) scale(1.05); }
  66%      { transform: translate(-20px,20px) scale(0.97); }
`;

const tagPulse = keyframes`
  0%,100% { opacity:0.5; transform:translateY(0); }
  50%      { opacity:0.85; transform:translateY(-5px); }
`;

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: 0% center; }
  100% { background-position: 200% center; }
`;

/* ═══════════════════════════════════
   LAYOUT
═══════════════════════════════════ */
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  @media (max-width: 768px) { flex-direction: column; }
`;

/* ── LEFT ── */
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
  animation: ${fadeUp} 0.7s ease both;
  @media (max-width: 768px) { min-height: 240px; padding: 28px 24px; }
`;

const OrbBase = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: ${orbFloat} 12s ease-in-out infinite;
`;
const Orb1 = styled(OrbBase)`
  width:420px; height:420px;
  background: radial-gradient(circle, rgba(180,130,255,0.25) 0%, transparent 70%);
  top:-100px; left:-80px;
`;
const Orb2 = styled(OrbBase)`
  width:300px; height:300px;
  background: radial-gradient(circle, rgba(255,180,80,0.2) 0%, transparent 70%);
  bottom:40px; right:-60px;
  animation-duration:9s; animation-delay:-4s;
`;
const Orb3 = styled(OrbBase)`
  width:180px; height:180px;
  background: radial-gradient(circle, rgba(80,200,255,0.15) 0%, transparent 70%);
  top:50%; left:40%;
  animation-duration:14s; animation-delay:-7s;
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 2;
`;

const LeftBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 56px;
  @media (max-width: 768px) { margin-bottom: 20px; }
`;

const BrandMark = styled.div`
  width:40px; height:40px;
  background: linear-gradient(135deg, #c9986a, #e8c48a);
  display: flex; align-items: center; justify-content: center;
  font-size:13px; font-weight:900; color:#0a0a0f;
  border-radius:6px;
`;

const BrandName = styled.span`
  font-size:15px; font-weight:700;
  letter-spacing:0.12em; text-transform:uppercase;
  color:rgba(255,255,255,0.85);
`;

const LeftHeadline = styled.h2`
  margin: 0 0 20px;
  font-size: clamp(38px,5vw,68px);
  font-weight: 900;
  line-height: 1.06;
  letter-spacing: -0.02em;
  background: linear-gradient(120deg, #fff 0%, #c9986a 55%, #e8c48a 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
  @media (max-width:768px) { font-size:34px; }
`;

const LeftTagline = styled.p`
  font-size:13px; line-height:1.8;
  color:rgba(255,255,255,0.4);
  margin-bottom:36px;
  word-break:keep-all;
`;

const FloatingFragrances = styled.div`
  display:flex; flex-wrap:wrap; gap:8px;
`;

const FragTag = styled.span`
  padding:5px 13px;
  border:1px solid rgba(255,255,255,0.15);
  border-radius:100px;
  font-size:10px; font-weight:700; letter-spacing:0.1em;
  color:rgba(255,255,255,0.45);
  background:rgba(255,255,255,0.04);
  backdrop-filter:blur(4px);
  animation: ${tagPulse} 3s ease-in-out infinite;
`;

const LeftFooter = styled.p`
  position:relative; z-index:2;
  font-size:11px; color:rgba(255,255,255,0.18);
  letter-spacing:0.04em;
  @media (max-width:768px) { display:none; }
`;

/* ── RIGHT ── */
const RightPanel = styled.div`
  width: 460px;
  background: #faf8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 36px;
  animation: ${fadeUp} 0.7s 0.12s ease both;
  @media (max-width:900px) { width:400px; }
  @media (max-width:768px) { width:100%; padding:40px 24px; }
`;

const FormCard = styled.div`
  width:100%;
  max-width:360px;
`;

const FormHeader = styled.div`
  margin-bottom:36px;
`;

const WelcomeLabel = styled.p`
  font-size:11px; font-weight:800;
  letter-spacing:0.14em; text-transform:uppercase;
  color:#b8956a; margin:0 0 8px;
`;

const FormTitle = styled.h1`
  font-size:34px; font-weight:900;
  letter-spacing:-0.02em;
  color:#0a0a0f; margin:0 0 10px;
`;

const FormSubtitle = styled.p`
  font-size:13px; color:#999;
  line-height:1.6; word-break:keep-all;
`;

/* ── FLOATING LABEL INPUTS ── */
const FloatGroup = styled.div`
  position: relative;
  margin-bottom: 28px;

  /* Input base */
  input {
    width: 100%;
    box-sizing: border-box;
    padding: 22px 0 8px;
    background: transparent;
    border: none;
    border-bottom: 1.5px solid #ddd;
    font-size: 15px;
    color: #0a0a0f;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
      border-bottom-color: #b8956a;
    }
    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 40px #faf8f5 inset;
    }
  }

  /* Label base */
  label {
    position: absolute;
    top: 22px;
    left: 0;
    font-size: 14px;
    color: #aaa;
    pointer-events: none;
    transform-origin: left top;
    transition: transform 0.22s ease, color 0.22s ease;
  }

  /* Float label up when input focused OR has value */
  input:focus ~ label,
  input:not(:placeholder-shown) ~ label {
    transform: translateY(-18px) scale(0.76);
    color: #b8956a;
    font-weight: 700;
    letter-spacing: 0.06em;
  }

  /* Gold underline bar on focus */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background: linear-gradient(90deg, #b8956a, #e8c48a);
    transition: width 0.3s ease;
  }
  input:focus ~ &::after,
  &:focus-within::after {
    width: 100%;
  }
`;

const FloatInput = styled.input``;
const FloatLabel = styled.label``;

const ForgotLink = styled.a`
  display: block;
  text-align: right;
  font-size: 12px;
  color: #bbb;
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
  padding: 17px 24px;
  background: #0a0a0f;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.08em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.25s, transform 0.15s, box-shadow 0.25s;

  &:hover {
    background: linear-gradient(135deg, #b8956a, #c9986a);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  }
  &:active { transform: translateY(0); }
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
    font-size:11px; font-weight:700;
    color:#bbb; letter-spacing:0.06em; white-space:nowrap;
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
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.15s, filter 0.15s;
  &:hover { transform: translateY(-1px); filter: brightness(0.94); }
  &:active { transform: translateY(0); }
`;

const NaverBtn = styled(SocialBtnBase)`
  background: #03C75A;
  color: #fff;
  box-shadow: 0 2px 10px rgba(3,199,90,0.22);
`;

const KakaoBtn = styled(SocialBtnBase)`
  background: #FEE500;
  color: #191919;
  box-shadow: 0 2px 10px rgba(254,229,0,0.3);
`;

const GoogleBtn = styled(SocialBtnBase)`
  background: #fff;
  color: #444;
  border: 1.5px solid #e5e5e5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`;

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
