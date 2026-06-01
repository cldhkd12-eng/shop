import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export const Brand: React.FC = () => {
  const navigate = useNavigate();

  return (
    <BrandContainer className="fade-in">
      {/* 1. HERO STORY */}
      <HeroSection>
        <HeroContent>
          <SubTitle>OUR STORY</SubTitle>
          <MainTitle>ScentAtelier</MainTitle>
          <Description>
            센트아틀리에는 전통적인 경계를 넘어, 보이지 않는 향기를 통해 당신의 가장 깊은 내면과 감정을 일깨우는 파인 프래그런스 하우스입니다.
            우리의 모든 향조는 단순한 장식을 넘어 예술적 영감과 자연의 위대한 원료들이 조화롭게 결합된 하나의 서사시입니다.
          </Description>
        </HeroContent>
      </HeroSection>

      {/* 2. PHILOSOPHY GRID */}
      <Section>
        <SectionTitle>BRAND PHILOSOPHY</SectionTitle>
        <PhilosophyGrid>
          <PhilosophyCard>
            <CardNum>01</CardNum>
            <CardTitle>순수한 원료의 예술</CardTitle>
            <CardText>
              우리는 세계 곳곳의 청정 자연에서 채취한 희귀하고 순수한 천연 원료만을 고집합니다. 화학적인 인위성을 최소화하고 원료 본연의 거칠고 야생적인 매력과 깊이를 그대로 보존합니다.
            </CardText>
          </PhilosophyCard>
          <PhilosophyCard>
            <CardNum>02</CardNum>
            <CardTitle>독창적인 조향 기법</CardTitle>
            <CardText>
              센트아틀리에의 하우스 조향사들은 트렌드를 따르지 않습니다. 우리는 문학, 예술, 계절의 변화에서 영감을 받아 누구도 흉내 낼 수 없는 대담하고 독보적인 포뮬러를 탄생시킵니다.
            </CardText>
          </PhilosophyCard>
          <PhilosophyCard>
            <CardNum>03</CardNum>
            <CardTitle>지속 가능한 장인 정신</CardTitle>
            <CardText>
              모든 향수는 숙련된 크래프트 장인들의 손을 거쳐 소량씩 한정 제작됩니다. 재활용 가능한 친환경 패키지와 보틀을 통해 환경과의 아름다운 공존을 실천합니다.
            </CardText>
          </PhilosophyCard>
        </PhilosophyGrid>
      </Section>

      {/* 3. VISUAL STORYTELLING BANNER */}
      <VisualBanner>
        <VisualContent>
          <VisualTag>THE ATELIER</VisualTag>
          <VisualHeading>보이지 않는 흔적,<br />영원히 기억될 시그니처</VisualHeading>
          <VisualText>
            향기는 누군가가 방을 떠난 후에도 가장 오래 남아있는 기억의 잔상입니다.
            센트아틀리에는 당신이 머무는 공간과 지나쳐간 모든 길목에서 가장 감각적인 흔적을 남깁니다.
          </VisualText>
          <ExploreBtn onClick={() => navigate('/')}>컬렉션 둘러보기 →</ExploreBtn>
        </VisualContent>
      </VisualBanner>
    </BrandContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const BrandContainer = styled.div`
  width: 100%;
  background: #FAF8F5;
  color: #000000;
`;

const HeroSection = styled.section`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), 
              url('/img/dontknow.png') no-repeat center center;
  background-size: cover;
  text-align: center;
  color: #FFFFFF;
`;

const HeroContent = styled.div`
  max-width: 800px;
  width: 100%;
`;

const SubTitle = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.3em;
  color: #FAF8F5;
  margin-bottom: 24px;
`;

const MainTitle = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: clamp(48px, 8vw, 84px);
  font-weight: 900;
  letter-spacing: -0.01em;
  margin: 0 0 32px 0;
  text-transform: uppercase;
`;

const Description = styled.p`
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.8;
  font-weight: 500;
  color: #E6E4E0;
  word-break: keep-all;
  margin: 0;
`;

const Section = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 100px 40px;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.25em;
  margin-bottom: 64px;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: #000000;
  }
`;

const PhilosophyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const PhilosophyCard = styled.div`
  border-top: 2px solid #000000;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
`;

const CardNum = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  font-weight: 900;
  color: #888888;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 16px 0;
  color: #000000;
`;

const CardText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: #555555;
  margin: 0;
  word-break: keep-all;
`;

const VisualBanner = styled.section`
  min-height: 60vh;
  background: linear-gradient(to right, #FAF8F5 30%, transparent 100%), 
              url('/img/gift.png') no-repeat center right;
  background-size: cover;
  display: flex;
  align-items: center;
  padding: 80px 80px;

  @media (max-width: 900px) {
    padding: 60px 20px;
    background: #FAF8F5;
  }
`;

const VisualContent = styled.div`
  max-width: 500px;
  width: 100%;
`;

const VisualTag = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: #888888;
  display: block;
  margin-bottom: 16px;
`;

const VisualHeading = styled.h3`
  font-family: ${props => props.theme.fonts.display};
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  line-height: 1.25;
  color: #000000;
  margin: 0 0 24px 0;
`;

const VisualText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: #555555;
  margin: 0 0 40px 0;
  word-break: keep-all;
`;

const ExploreBtn = styled.button`
  padding: 16px 32px;
  background: #000000;
  color: #FFFFFF;
  border: 2px solid #000000;
  font-family: ${props => props.theme.fonts.display};
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    background: transparent;
    color: #000000;
  }
`;
