import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

/* ─── Scroll reveal hook ─── */
const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

export const Brand: React.FC = () => {
  const navigate = useNavigate();
  const hero = useReveal(0.1);
  const manifesto = useReveal(0.15);
  const pillars = useReveal(0.1);
  const process = useReveal(0.1);
  const cta = useReveal(0.15);

  return (
    <Page>
      {/* ══════ HERO ══════ */}
      <Hero ref={hero.ref} $visible={hero.visible}>
        <HeroOverlay />
        <HeroInner>
          <HeroEyebrow>SINCE 2024 — SEOUL</HeroEyebrow>
          <HeroTitle>
            <span>M</span><span>O</span><span>D</span><span>O</span><span>.</span>
          </HeroTitle>
          <HeroSub>
            향기를 통해 보이지 않는 감정의 지형을 조각하는 하우스.
          </HeroSub>
        </HeroInner>
        <ScrollCue>Scroll</ScrollCue>
      </Hero>

      {/* ══════ MANIFESTO ══════ */}
      <Manifesto ref={manifesto.ref} $visible={manifesto.visible}>
        <ManifestoInner>
          <ManifestoLabel>MANIFESTO</ManifestoLabel>
          <ManifestoQuote>
            "우리는 향수를 만들지 않습니다.<br />
            기억을 설계합니다."
          </ManifestoQuote>
          <ManifestoBody>
            MODO는 전통적인 향수의 경계를 넘어,<br />
            자연의 원초적 아름다움과 현대적 조형 예술이 충돌하는 지점에서 탄생한 프래그런스 하우스입니다.
            모든 병은 하나의 조각 작품이며, 모든 향조는 하나의 서사입니다.
            우리의 향기는 공간에 머물고, 피부에 스며들고, 기억 속에 영원히 각인됩니다.
          </ManifestoBody>
        </ManifestoInner>
      </Manifesto>

      {/* ══════ THREE PILLARS ══════ */}
      <Pillars ref={pillars.ref} $visible={pillars.visible}>
        <PillarsLabel>CORE VALUES</PillarsLabel>
        <PillarGrid>
          {[
            {
              num: '01',
              title: 'Raw Material',
              sub: '순수한 원료의 예술',
              body: '세계 곳곳의 청정 자연에서 채취한 희귀 천연 원료만을 고집합니다. 화학적 인위성을 최소화하고, 원료 본연의 거칠고 야생적인 매력과 깊이를 그대로 보존합니다.',
            },
            {
              num: '02',
              title: 'Sculpted Scent',
              sub: '조각적 조향',
              body: 'MODO의 조향사들은 트렌드를 따르지 않습니다. 문학, 건축, 자연의 침묵에서 영감을 받아 누구도 흉내 낼 수 없는 대담하고 독보적인 포뮬러를 탄생시킵니다.',
            },
            {
              num: '03',
              title: 'Eternal Craft',
              sub: '영속하는 장인 정신',
              body: '모든 향수는 숙련된 장인들의 손을 거쳐 소량씩 한정 제작됩니다. 재활용 가능한 친환경 소재와 조각적 보틀 디자인을 통해 환경과의 아름다운 공존을 실천합니다.',
            },
          ].map((p, i) => (
            <PillarCard key={i} style={{ transitionDelay: `${i * 0.2}s` }}>
              <PillarNum>{p.num}</PillarNum>
              <PillarTitle>{p.title}</PillarTitle>
              <PillarSub>{p.sub}</PillarSub>
              <PillarBody>{p.body}</PillarBody>
            </PillarCard>
          ))}
        </PillarGrid>
      </Pillars>

      {/* ══════ VISUAL PROCESS ══════ */}
      <Process ref={process.ref} $visible={process.visible}>
        <ProcessInner>
          <ProcessLeft>
            <ProcessLabel>THE PROCESS</ProcessLabel>
            <ProcessHeading>
              하나의 향수가<br />
              탄생하기까지.
            </ProcessHeading>
            <ProcessDesc>
              원료의 선별부터 최종 병입까지, MODO의 모든 과정은 예술적 직관과
              과학적 정밀함이 공존하는 긴 여정입니다. 수백 번의 블렌딩 테스트를 거쳐
              단 하나의 완벽한 비율이 탄생합니다.
            </ProcessDesc>
          </ProcessLeft>
          <ProcessRight>
            <ProcessStep>
              <StepNum>I</StepNum>
              <StepTitle>Sourcing</StepTitle>
              <StepDesc>전 세계 농장과 증류소에서 최상급 원료를 직접 선별합니다.</StepDesc>
            </ProcessStep>
            <ProcessStep>
              <StepNum>II</StepNum>
              <StepTitle>Composition</StepTitle>
              <StepDesc>수백 번의 실험을 거쳐 유일무이한 향조를 설계합니다.</StepDesc>
            </ProcessStep>
            <ProcessStep>
              <StepNum>III</StepNum>
              <StepTitle>Maturation</StepTitle>
              <StepDesc>최소 6개월간 숙성시켜 깊이와 복합성을 끌어냅니다.</StepDesc>
            </ProcessStep>
            <ProcessStep>
              <StepNum>IV</StepNum>
              <StepTitle>Sculpture</StepTitle>
              <StepDesc>장인이 수작업으로 병을 완성하고, 하나의 작품으로 세상에 내놓습니다.</StepDesc>
            </ProcessStep>
          </ProcessRight>
        </ProcessInner>
      </Process>

      {/* ══════ CTA ══════ */}
      <CTA ref={cta.ref} $visible={cta.visible}>
        <CTAInner>
          <CTAHeading>당신만의 시그니처를<br />발견하세요.</CTAHeading>
          <CTASub>
            MODO의 컬렉션을 탐험하고, 당신의 기억에 영원히 남을 향기를 찾아보세요.
          </CTASub>
          <CTABtn onClick={() => navigate('/perfumes')}>컬렉션 보러가기 →</CTABtn>
        </CTAInner>
      </CTA>
    </Page>
  );
};

/* ═══════════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════════ */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const letterReveal = keyframes`
  from { opacity: 0; transform: translateY(60px) rotateX(-40deg); }
  to   { opacity: 1; transform: translateY(0) rotateX(0); }
`;

const scrollPulse = keyframes`
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50%      { opacity: 1;   transform: translateY(6px); }
`;

/* ═══════════════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════════════ */
const Page = styled.div`
  width: 100%;
  background: #fff;
  color: #000;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  overflow-x: hidden;
`;

/* ─── HERO ─── */
const Hero = styled.section<{ $visible: boolean }>`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 40%, rgba(60, 55, 50, 0.3) 0%, transparent 70%);
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 24px;
`;

const HeroEyebrow = styled.div`
  font-size: 11px;
  letter-spacing: 0.35em;
  color: rgba(255,255,255,0.4);
  margin-bottom: 32px;
  animation: ${fadeUp} 1s ease 0.2s both;
`;

const HeroTitle = styled.h1`
  font-size: clamp(72px, 14vw, 180px);
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 0.04em;
  line-height: 1;
  perspective: 800px;

  & > span {
    display: inline-block;
    animation: ${letterReveal} 1s ease both;
    &:nth-child(1) { animation-delay: 0.3s; }
    &:nth-child(2) { animation-delay: 0.45s; }
    &:nth-child(3) { animation-delay: 0.6s; }
    &:nth-child(4) { animation-delay: 0.75s; }
    &:nth-child(5) { animation-delay: 0.9s; }
  }
`;

const HeroSub = styled.p`
  font-size: clamp(14px, 1.8vw, 18px);
  color: rgba(255,255,255,0.5);
  margin-top: 28px;
  font-weight: 300;
  letter-spacing: 0.05em;
  animation: ${fadeUp} 1s ease 1.1s both;
`;

const ScrollCue = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: 0.3em;
  color: rgba(255,255,255,0.3);
  animation: ${scrollPulse} 2.5s ease infinite;
  z-index: 2;
`;

/* ─── MANIFESTO ─── */
const Manifesto = styled.section<{ $visible: boolean }>`
  padding: 140px 40px;
  background: #fff;
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1.2s ease, transform 1.2s ease;
  ${p => p.$visible && css`
    opacity: 1;
    transform: translateY(0);
  `}

  @media (max-width: 768px) {
    padding: 80px 24px;
  }
`;

const ManifestoInner = styled.div`
  max-width: 800px;
  text-align: center;
`;

const ManifestoLabel = styled.div`
  font-size: 10px;
  letter-spacing: 0.4em;
  color: #aaa;
  margin-bottom: 40px;
`;

const ManifestoQuote = styled.blockquote`
  font-size: clamp(24px, 4vw, 38px);
  font-weight: 300;
  line-height: 1.5;
  color: #000;
  margin: 0 0 48px 0;
  letter-spacing: -0.01em;
  font-style: italic;
`;

const ManifestoBody = styled.p`
  font-size: 15px;
  line-height: 2;
  color: #666;
  margin: 0;
  word-break: keep-all;
`;

/* ─── PILLARS ─── */
const Pillars = styled.section<{ $visible: boolean }>`
  padding: 120px 40px;
  background: #f5f4f2;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1.2s ease, transform 1.2s ease;
  ${p => p.$visible && css`
    opacity: 1;
    transform: translateY(0);
  `}

  @media (max-width: 768px) {
    padding: 80px 24px;
  }
`;

const PillarsLabel = styled.div`
  font-size: 10px;
  letter-spacing: 0.4em;
  color: #aaa;
  text-align: center;
  margin-bottom: 64px;
`;

const PillarGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const PillarCard = styled.div`
  border-top: 1px solid #ccc;
  padding-top: 32px;
`;

const PillarNum = styled.div`
  font-size: 12px;
  color: #bbb;
  letter-spacing: 0.15em;
  margin-bottom: 20px;
`;

const PillarTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #000;
  letter-spacing: 0.02em;
`;

const PillarSub = styled.div`
  font-size: 13px;
  color: #999;
  margin-bottom: 20px;
`;

const PillarBody = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: #555;
  margin: 0;
  word-break: keep-all;
`;

/* ─── PROCESS ─── */
const Process = styled.section<{ $visible: boolean }>`
  padding: 120px 40px;
  background: #0a0a0a;
  color: #fff;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1.2s ease, transform 1.2s ease;
  ${p => p.$visible && css`
    opacity: 1;
    transform: translateY(0);
  `}

  @media (max-width: 768px) {
    padding: 80px 24px;
  }
`;

const ProcessInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const ProcessLeft = styled.div``;

const ProcessLabel = styled.div`
  font-size: 10px;
  letter-spacing: 0.4em;
  color: rgba(255,255,255,0.3);
  margin-bottom: 32px;
`;

const ProcessHeading = styled.h2`
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 300;
  line-height: 1.3;
  margin: 0 0 32px 0;
  color: #fff;
`;

const ProcessDesc = styled.p`
  font-size: 14px;
  line-height: 1.9;
  color: rgba(255,255,255,0.5);
  margin: 0;
  word-break: keep-all;
`;

const ProcessRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const ProcessStep = styled.div`
  border-left: 1px solid rgba(255,255,255,0.15);
  padding-left: 28px;
`;

const StepNum = styled.div`
  font-size: 11px;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.25);
  margin-bottom: 8px;
`;

const StepTitle = styled.h4`
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #fff;
`;

const StepDesc = styled.p`
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255,255,255,0.5);
  margin: 0;
  word-break: keep-all;
`;

/* ─── CTA ─── */
const CTA = styled.section<{ $visible: boolean }>`
  padding: 160px 40px;
  background: #fff;
  text-align: center;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1.2s ease, transform 1.2s ease;
  ${p => p.$visible && css`
    opacity: 1;
    transform: translateY(0);
  `}

  @media (max-width: 768px) {
    padding: 100px 24px;
  }
`;

const CTAInner = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CTAHeading = styled.h2`
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 300;
  line-height: 1.3;
  margin: 0 0 24px 0;
  color: #000;
`;

const CTASub = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #888;
  margin: 0 0 48px 0;
  word-break: keep-all;
`;

const CTABtn = styled.button`
  padding: 18px 48px;
  background: #000;
  color: #fff;
  border: 1px solid #000;
  font-size: 13px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.4s ease;

  &:hover {
    background: transparent;
    color: #000;
  }
`;
