import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSearchParams } from 'react-router-dom';

export const SocialPopup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const platform = searchParams.get('platform') || 'kakao';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Parse token from hash (Naver redirects token in the hash fragment)
    const hash = window.location.hash;
    const tokenMatch = hash.match(/access_token=([^&]*)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (token) {
      setLoading(true);
      // Call Naver Profile API via Vercel rewrite proxy
      fetch('/api/naver/v1/nid/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.resultcode === '00' && data.response) {
          const { name: naverName, email: naverEmail } = data.response;
          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'SOCIAL_LOGIN_SUCCESS',
                name: naverName || '네이버 사용자',
                email: naverEmail || '',
                platform: 'naver',
              },
              window.location.origin
            );
            window.close();
          }
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Naver profile fetch error:', err);
        setLoading(false);
      });
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'SOCIAL_LOGIN_SUCCESS',
          name,
          email: email || `${name}@social.com`,
          platform,
        },
        window.location.origin
      );
      window.close();
    }
  };

  const isKakao = platform === 'kakao';
  const isNaver = platform === 'naver';

  if (loading) {
    return (
      <PopupContainer isKakao={false} isNaver={true}>
        <LoadingCard>
          <Spinner />
          <LoadingText>네이버 로그인 처리 중입니다...</LoadingText>
        </LoadingCard>
      </PopupContainer>
    );
  }

  return (
    <PopupContainer isKakao={isKakao} isNaver={isNaver}>
      {isKakao ? (
        <Card>
          <KakaoHeader>
            <KakaoYellowLogo>talk</KakaoYellowLogo>
            <HeaderTitle>Kakao</HeaderTitle>
          </KakaoHeader>
          
          <Body>
            <AppInfo>
              <AppIcon>SA</AppIcon>
              <AppText>
                <strong>ScentAtelier</strong>에서<br />
                아래 권한을 요청합니다.
              </AppText>
            </AppInfo>

            <PermissionBox>
              <PermissionItem>✓ 필수: 카카오 계정 이름 (닉네임)</PermissionItem>
              <PermissionItem>✓ 필수: 카카오 계정 이메일 주소</PermissionItem>
            </PermissionBox>

            <Form onSubmit={handleLoginSubmit}>
              <InputGroup>
                <label>이름 입력 (닉네임)</label>
                <input
                  type="text"
                  placeholder="카카오톡 프로필 이름"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>이메일 주소 (선택)</label>
                <input
                  type="email"
                  placeholder="example@kakao.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </InputGroup>
              <KakaoSubmitBtn type="submit">동의하고 계속하기</KakaoSubmitBtn>
            </Form>
          </Body>
        </Card>
      ) : isNaver ? (
        <Card>
          <NaverHeader>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
            </svg>
            <HeaderTitle style={{ color: 'white' }}>NAVER</HeaderTitle>
          </NaverHeader>

          <Body>
            <AppInfo>
              <AppIcon>SA</AppIcon>
              <AppText>
                <strong>ScentAtelier</strong>에서<br />
                아래 권한을 요청합니다.
              </AppText>
            </AppInfo>

            <PermissionBox>
              <PermissionItem>✓ 필수: 네이버 프로필 이름</PermissionItem>
              <PermissionItem>✓ 필수: 네이버 계정 이메일 주소</PermissionItem>
            </PermissionBox>

            <Form onSubmit={handleLoginSubmit}>
              <InputGroup>
                <label>이름 입력</label>
                <input
                  type="text"
                  placeholder="네이버 이름"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>이메일 주소</label>
                <input
                  type="email"
                  placeholder="username@naver.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
              <NaverSubmitBtn type="submit">동의하고 로그인</NaverSubmitBtn>
            </Form>
          </Body>
        </Card>
      ) : (
        <Card>
          <GoogleHeader>
            <GoogleLogoSvg viewBox="0 0 24 24">
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
            </GoogleLogoSvg>
            <HeaderTitle style={{ marginTop: '8px' }}>Google 계정으로 로그인</HeaderTitle>
            <HeaderSub>ScentAtelier으로 이동</HeaderSub>
          </GoogleHeader>

          <Body>
            <Form onSubmit={handleLoginSubmit}>
              <InputGroup>
                <label>구글 사용자 이름 (실명)</label>
                <input
                  type="text"
                  placeholder="구글 계정 이름"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <label>구글 이메일 주소</label>
                <input
                  type="email"
                  placeholder="username@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
              <GoogleSubmitBtn type="submit">다음</GoogleSubmitBtn>
            </Form>
          </Body>
        </Card>
      )}
    </PopupContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(3, 199, 90, 0.1);
  border-top-color: #03C75A;
  border-radius: 50%;
  animation: ${rotate} 1s infinite linear;
  margin: 0 auto 16px;
`;

const LoadingCard = styled.div`
  background: white;
  padding: 40px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #EAEAEA;
  text-align: center;
  width: 100%;
  max-width: 320px;
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
  font-weight: 500;
`;

const PopupContainer = styled.div<{ isKakao: boolean; isNaver: boolean }>`
  width: 100%;
  min-height: 100vh;
  background: ${props => (props.isKakao ? '#F7F7F7' : props.isNaver ? '#F9FBF9' : '#F0F4F9')};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', Roboto, sans-serif;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #EAEAEA;
`;

const KakaoHeader = styled.div`
  background: #FEE500;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NaverHeader = styled.div`
  background: #03C75A;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const KakaoYellowLogo = styled.div`
  width: 36px;
  height: 36px;
  background: #3C1E1E;
  color: #FEE500;
  font-weight: 900;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const HeaderSub = styled.div`
  font-size: 13px;
  color: #5F6368;
  margin-top: 4px;
`;

const GoogleHeader = styled.div`
  padding: 36px 24px 20px;
  text-align: center;
  border-bottom: 1px solid #F1F3F4;
`;

const GoogleLogoSvg = styled.svg`
  width: 40px;
  height: 40px;
`;

const Body = styled.div`
  padding: 24px;
`;

const AppInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const AppIcon = styled.div`
  width: 44px;
  height: 44px;
  background: #000000;
  color: #FFFFFF;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 16px;
  letter-spacing: 0.05em;
`;

const AppText = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #333333;
`;

const PermissionBox = styled.div`
  background: #F9F9F9;
  border: 1px solid #EAEAEA;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
`;

const PermissionItem = styled.div`
  font-size: 13px;
  color: #555555;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #555555;
    margin-bottom: 6px;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #CCCCCC;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    outline: none;

    &:focus {
      border-color: #000000;
    }
  }
`;

const KakaoSubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #FEE500;
  color: #191919;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background: #E6CE00;
  }
`;

const NaverSubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #03C75A;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background: #02b34f;
  }
`;

const GoogleSubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #1A73E8;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background: #1557B0;
  }
`;
