import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface ParticleData {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotate: number;
}

/* ─────────────────────────────────────────────
   KEYFRAMES
───────────────────────────────────────────── */
const floatAnim = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
  25%       { transform: translateY(-12px) rotate(0.5deg) scale(1.01); }
  50%       { transform: translateY(-7px) rotate(-0.3deg) scale(1.005); }
  75%       { transform: translateY(-15px) rotate(0.4deg) scale(1.01); }
`;

const particleRise = keyframes`
  0%   { opacity: 0; transform: translateY(0) translateX(0) scale(0.2) rotate(0deg); }
  10%  { opacity: 0.9; }
  80%  { opacity: 0.6; }
  100% { opacity: 0; transform: translateY(-320px) translateX(var(--drift, 0px)) scale(2.5) rotate(var(--rotate, 180deg)); }
`;

const charWaveKf = keyframes`
  0%, 100% { transform: translateY(0px); }
  40%       { transform: translateY(-8px); }
  70%       { transform: translateY(-4px); }
`;

const sprayScroll = keyframes`
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
`;

const shimmerSweep = keyframes`
  0%   { left: -100%; }
  100% { left: 140%; }
`;

const pulseDot = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.3); }
  50%       { box-shadow: 0 0 0 8px rgba(0,0,0,0); }
`;

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const revealClip = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0% 0 0); }
`;

const bgZoom = keyframes`
  from { background-size: 135%; }
  to   { background-size: 145%; }
`;

const pulseDotWhite = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
  50%       { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
`;

/* ─────────────────────────────────────────────
   KINETIC TEXT COMPONENT
───────────────────────────────────────────── */
const KineticText: React.FC<{ text: string }> = ({ text }) => {
  const [hovered, setHovered] = useState(false);
  const words = text.split(' ');
  let charIndex = 0;

  return (
    <KineticWrap
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'inline-flex', flexWrap: 'wrap', rowGap: '4px' }}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.28em' }}>
          {word.split('').map((char) => {
            const currentIdx = charIndex++;
            return (
              <KineticChar
                key={currentIdx}
                $hovered={hovered}
                style={{ '--i': currentIdx } as React.CSSProperties}
              >
                {char}
              </KineticChar>
            );
          })}
        </span>
      ))}
    </KineticWrap>
  );
};

/* ─────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────── */
const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

/* ─────────────────────────────────────────────
   3D TILT CELL COMPONENT
───────────────────────────────────────────── */
const TiltCell: React.FC<{
  src: string;
  alt: string;
  onClick: () => void;
  $delay?: number;
  $dur?: number;
}> = ({ src, alt, onClick, $delay = 0, $dur = 6 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const currentTilt = useRef({ rx: 0, ry: 0, scale: 1 });
  const targetTilt  = useRef({ rx: 0, ry: 0, scale: 1 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left)  / r.width  - 0.5;
    const y = (e.clientY - r.top)   / r.height - 0.5;
    targetTilt.current = { rx: -y * 20, ry: x * 20, scale: 1.06 };
  };

  const onLeave = () => {
    targetTilt.current = { rx: 0, ry: 0, scale: 1 };
  };

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      const c = currentTilt.current;
      const t = targetTilt.current;
      c.rx    = lerp(c.rx,    t.rx,    0.1);
      c.ry    = lerp(c.ry,    t.ry,    0.1);
      c.scale = lerp(c.scale, t.scale, 0.1);
      if (ref.current) {
        const sx = -c.ry * 0.8;
        const sy = -c.rx * 0.8;
        ref.current.style.transform = `perspective(900px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) scale3d(${c.scale},${c.scale},${c.scale})`;
        ref.current.style.boxShadow = `${sx}px ${sy}px 40px rgba(0,0,0,0.2), 0 2px 12px rgba(0,0,0,0.08)`;
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <CellWrap ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}>
      <FloatingImg src={src} alt={alt} $delay={$delay} $dur={$dur} />
      <CellShimmer />
      <CellOverlay>
        <CellViewHint>보기 →</CellViewHint>
      </CellOverlay>
    </CellWrap>
  );
};

/* ─────────────────────────────────────────────
   MARQUEE STRIP COMPONENT
───────────────────────────────────────────── */
const MarqueeStrip: React.FC = () => {
  const items = ['SANTAL 33', 'ROSE 31', 'ANOTHER 13', 'BERGAMOTE 22', 'IRIS 39', 'VETIVER 46'];
  const repeated = [...items, ...items, ...items];
  return (
    <MarqueeWrap>
      <MarqueeInner>
        {repeated.map((t, i) => (
          <MarqueeItem key={i}>{t} <MarqueeDot>✦</MarqueeDot></MarqueeItem>
        ))}
      </MarqueeInner>
    </MarqueeWrap>
  );
};

/* ─────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────── */
export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY]   = useState(0);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [sprayCount, setSprayCount] = useState(0);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const pidRef = useRef(0);

  const gridReveal = useScrollReveal(0.1);
  const sprayReveal = useScrollReveal(0.1);
  const quizReveal = useScrollReveal(0.15);
  const serviceReveal = useScrollReveal(0.12);

  useEffect(() => {
    const t = setTimeout(() => setHeroRevealed(true), 200);
    return () => clearTimeout(t);
  }, []);

  /* ── Scroll tracking ── */
  useEffect(() => {
    const handle = () => {
      const s   = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollY(s);
      setProgress(max > 0 ? s / max : 0);
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  /* ── Scent particle emitter ── */
  const spray = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const colors = [
      '#fbcfe8','#bae6fd','#fef08a','#c7d2fe',
      '#a5f3fc','#d8b4fe','#fca5a5','#bbf7d0',
      '#fed7aa','#e9d5ff',
    ];
    const fresh: ParticleData[] = Array.from({ length: 20 }, () => ({
      id: ++pidRef.current,
      x: rect.left + rect.width * 0.3  + (Math.random() - 0.5) * 80,
      y: rect.top  + rect.height * 0.4 + (Math.random() - 0.5) * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 18,
      duration: 1.8 + Math.random() * 2.8,
      delay: Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 280,
      rotate: (Math.random() - 0.5) * 360,
    }));
    setParticles(p => [...p, ...fresh]);
    setSprayCount(c => c + 1);
    const ids = fresh.map(p => p.id);
    setTimeout(() => setParticles(p => p.filter(q => !ids.includes(q.id))), 5500);
  }, []);

  /* ── Asymmetric parallax offsets ── */
  const c1 = scrollY * -0.06;
  const c2 = scrollY *  0.03;
  const c3 = scrollY * -0.10;

  return (
    <Page>

      {/* ── SCROLL PROGRESS BAR ── */}
      <ProgressBar style={{ transform: `scaleX(${progress})` }} />

      {/* ── FLOATING SCENT PARTICLES ── */}
      {particles.map(p => (
        <ScentParticle
          key={p.id}
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            '--duration': `${p.duration}s`,
            '--delay':    `${p.delay}s`,
            '--drift':    `${p.drift}px`,
            '--rotate':   `${p.rotate}deg`,
          } as React.CSSProperties}
        />
      ))}

      {/* ════════════════════════════════
           1. HERO BANNER
          ════════════════════════════════ */}
      <HeroBanner>
        <HeroLeft>
          <BlackBox $revealed={heroRevealed}>
            <BlackBoxTagline $revealed={heroRevealed}>
              — Crafted for Memory
            </BlackBoxTagline>
            <BlackBoxH1 $revealed={heroRevealed}>
              <KineticText text="Taste the Ingredients" />
            </BlackBoxH1>
            <BlackBoxCTA $revealed={heroRevealed} onClick={() => navigate('/brand')}>
              컬렉션 보기 <span>→</span>
            </BlackBoxCTA>
          </BlackBox>
        </HeroLeft>
        <HeroRight onClick={() => navigate('/detail/p2')}>
          <HeroImg src="/img/p2.png" alt="Featured Perfume" />
          <HeroGlow />
          <HeroBadge>NEW ARRIVAL</HeroBadge>
          <HeroRightOverlay />
        </HeroRight>
      </HeroBanner>

      {/* ════════════════════════════════
           MARQUEE STRIP
          ════════════════════════════════ */}
      <MarqueeStrip />

      {/* ════════════════════════════════
           2. ASYMMETRIC PARALLAX GRID
          ════════════════════════════════ */}
      <GridSection ref={gridReveal.ref} $visible={gridReveal.visible}>
        {/* ── Visual labels column ── */}
        <LabelsCol>
          <ColLabel>
            <ColNum>01</ColNum>
            <ColTitle><KineticText text="I Don't Know What" /></ColTitle>
            <ColDesc>처음엔 낯설고, 결국엔 중독되는 향</ColDesc>
          </ColLabel>
          <ColLabel>
            <ColNum>02</ColNum>
            <ColTitle><KineticText text="Cult Classics" /></ColTitle>
            <ColDesc>오래될수록 깊어지는 컬트 향수들</ColDesc>
          </ColLabel>
          <ColLabel>
            <ColNum>03</ColNum>
            <ColTitle><KineticText text="Gift Sets" /></ColTitle>
            <ColDesc>선물로 완벽한 럭셔리 향수 세트</ColDesc>
          </ColLabel>
        </LabelsCol>

        {/* ── Column 1: fast ↑ (−6% scroll speed) ── */}
        <PCol style={{ transform: `translateY(${c1}px)` }}>
          <TiltCell src="/img/p10.png" alt="I Don't Know What"  onClick={() => navigate('/detail/p2')} $delay={0}   $dur={5.5} />
          <TiltCell src="/img/p2.png"  alt="Cowboy Grass"       onClick={() => navigate('/detail/p3')} $delay={0.8} $dur={7.0} />
          <TiltCell src="/img/p7.png"  alt="Burning Barbershop" onClick={() => navigate('/detail/p7')} $delay={1.6} $dur={6.2} />
        </PCol>

        {/* ── Column 2: reverse drift ↓ (+3%) ── */}
        <PCol style={{ transform: `translateY(${c2}px)` }}>
          <TiltCell src="/img/p6.png" alt="Steamed Rainbow"     onClick={() => navigate('/detail/p6')} $delay={0.4} $dur={6.8} />
          <TiltCell src="/img/p1.png" alt="Debaser"             onClick={() => navigate('/detail/p1')} $delay={1.2} $dur={5.8} />
          <TiltCell src="/img/p8.png" alt="Mississippi Medicine" onClick={() => navigate('/detail/p8')} $delay={2.0} $dur={7.2} />
        </PCol>

        {/* ── Column 3: fastest ↑ (−10%) ── */}
        <PCol style={{ transform: `translateY(${c3}px)` }}>
          <TiltCell src="/img/p5.png" alt="Radio Bombay"    onClick={() => navigate('/detail/p5')} $delay={0.2} $dur={6.4} />
          <TiltCell src="/img/p4.png" alt="Bowmakers"       onClick={() => navigate('/detail/p4')} $delay={1.0} $dur={5.6} />
          <TiltCell src="/img/p9.png" alt="Jasmine Yucatan" onClick={() => navigate('/detail/p9')} $delay={1.8} $dur={7.4} />
        </PCol>
      </GridSection>

      {/* ════════════════════════════════
           3. SCENT NARRATIVE SPRAY BANNER
          ════════════════════════════════ */}
      <SpraySec ref={sprayReveal.ref} $visible={sprayReveal.visible}>
        <SprayCanvas>
          {/* Fan-shaped spray text lines */}
          {[-20,-16,-12,-8,-4,0,4,8,12,16,20].map((angle, i) => {
            const txt = Array(24).fill('SHOP PERFUME ✦').join('   ');
            return (
              <SprayLine key={i} style={{ '--angle': `${angle}deg` } as React.CSSProperties}>
                <SprayInner $speed={18 + i * 1.5}>{txt}&nbsp;&nbsp;&nbsp;</SprayInner>
                <SprayInner $speed={18 + i * 1.5}>{txt}&nbsp;&nbsp;&nbsp;</SprayInner>
              </SprayLine>
            );
          })}

          {/* Clickable nozzle */}
          <NozzleWrap onClick={spray}>
            <NozzleImg src="/img/nozzle.png" alt="Perfume Nozzle" />
            <NozzleRipple $key={sprayCount} />
          </NozzleWrap>
          <NozzleHintLabel>향을 뿌려보세요 ✦</NozzleHintLabel>
        </SprayCanvas>

        {/* Spray counter badge */}
        {sprayCount > 0 && (
          <SprayBadge key={sprayCount}>
            ✦ {sprayCount}번 뿌렸습니다
          </SprayBadge>
        )}
      </SpraySec>

      {/* ════════════════════════════════
           4. TYPOGRAPHIC QUIZ SECTION
          ════════════════════════════════ */}
      <QuizSec ref={quizReveal.ref} $visible={quizReveal.visible} onClick={() => navigate('/quiz')}>
        <QuizTitle>QUIZ</QuizTitle>
        <QuizMeta>
          <QuizDesc>{`5가지 질문으로\n당신에게 딱 맞는\n향수 4가지 추천.`}</QuizDesc>
          <QuizCTA>퀴즈 시작하기 →</QuizCTA>
        </QuizMeta>
      </QuizSec>

      {/* ════════════════════════════════
           5. AT YOUR SERVICE
          ════════════════════════════════ */}
      <ServiceSection ref={serviceReveal.ref} $visible={serviceReveal.visible}>
        <ServiceTitle>At your service</ServiceTitle>
        <ServiceGrid>
          <ServiceItem>
            <ServiceCard>
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M50 15L15 32L50 49L85 32L50 15Z" />
                <path d="M15 32V68L50 85V49" />
                <path d="M85 32V68L50 85" />
                <path d="M50 49V85" />
                <path d="M43 23L50 26L57 23" />
                <path d="M12 21L19 24" />
                <path d="M10 15L20 18" />
              </svg>
            </ServiceCard>
            <ServiceText>Free UPS Ground shipping on all U.S. and Canada orders.</ServiceText>
          </ServiceItem>

          <ServiceItem>
            <ServiceCard>
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="25" y="45" width="50" height="40" rx="3" />
                <rect x="20" y="35" width="60" height="10" rx="2" />
                <line x1="50" y1="35" x2="50" y2="85" />
                <line x1="25" y1="65" x2="75" y2="65" />
                <path d="M50 35C43 22 30 22 42 35C28 28 30 42 50 35Z" />
                <path d="M50 35C57 22 70 22 58 35C72 28 70 42 50 35Z" />
              </svg>
            </ServiceCard>
            <ServiceText>Free Diptyque Gift Boxes</ServiceText>
          </ServiceItem>

          <ServiceItem>
            <ServiceCard>
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="18" y="32" width="34" height="48" rx="8" />
                <rect x="27" y="22" width="16" height="10" />
                <circle cx="35" cy="15" r="4" />
                <rect x="24" y="44" width="22" height="22" rx="2" />
                <rect x="66" y="44" width="14" height="36" rx="2" />
                <rect x="70" y="39" width="6" height="5" />
                <circle cx="60" cy="34" r="1.5" fill="black" />
                <circle cx="53" cy="38" r="1.5" fill="black" />
                <circle cx="66" cy="26" r="1" fill="black" />
              </svg>
            </ServiceCard>
            <ServiceText>Fragrances - Try when you Buy</ServiceText>
          </ServiceItem>

          <ServiceItem>
            <ServiceCard>
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 25H48L42 75H28L22 25Z" />
                <line x1="22" y1="32" x2="48" y2="32" />
                <circle cx="35" cy="50" r="5" />
                <rect x="58" y="35" width="11" height="40" rx="1.5" />
                <rect x="73" y="35" width="11" height="40" rx="1.5" />
                <line x1="58" y1="45" x2="69" y2="45" />
                <line x1="73" y1="45" x2="84" y2="45" />
                <path d="M78 25L84 19" />
                <path d="M63 25L57 19" />
              </svg>
            </ServiceCard>
            <ServiceText>Two Free Samples with all orders</ServiceText>
          </ServiceItem>

          <ServiceItem>
            <ServiceCard>
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="30" y="42" width="40" height="34" rx="2" />
                <path d="M25 42H75" />
                <path d="M50 42V76" />
                <path d="M76 34C83 44 83 58 71 68" strokeDasharray="3 3" />
                <path d="M24 34C14 47 16 67 34 71" />
                <path d="M34 64V71H27" />
              </svg>
            </ServiceCard>
            <ServiceText>Free Returns</ServiceText>
          </ServiceItem>

          <ServiceItem>
            <ServiceCard>
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="42" y="16" width="20" height="36" rx="4" />
                <rect x="48" y="9" width="8" height="7" />
                <path d="M15 82C25 77 35 74 45 70C48 67 52 52 48 46" />
                <path d="M25 87C35 84 48 82 58 76C65 72 68 64 64 56" />
                <path d="M22 94C32 92 48 90 64 82C75 76 78 66 74 60" />
              </svg>
            </ServiceCard>
            <ServiceText>Welcome Gift: complimentary travel-size fragrance</ServiceText>
          </ServiceItem>
        </ServiceGrid>
      </ServiceSection>

      {/* ════════════════════════════════
           6. NEWSLETTER BAR
          ════════════════════════════════ */}
      <NewsBar>
        <NewsContent>
          <NewsEyebrow>SCENT ATELIER</NewsEyebrow>
          <NewsText>첫 주문 시, 무료 향수 샘플을 선물로 드립니다.</NewsText>
        </NewsContent>
        <NewsForm onSubmit={e => e.preventDefault()}>
          <NewsInput type="email" placeholder="이메일 주소 입력" required />
          <NewsSubmit type="submit">구독하기 →</NewsSubmit>
        </NewsForm>
      </NewsBar>
    </Page>
  );
};

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════════════════════ */

const Page = styled.div`
  width: 100%;
  background: #FAF8F5;
`;

/* ── Scroll Progress Bar ── */
const ProgressBar = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #000 0%, #555 50%, #000 100%);
  transform-origin: left center;
  z-index: 10000;
  pointer-events: none;
  will-change: transform;
`;

/* ── Scent Particles ── */
const ScentParticle = styled.div`
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9500;
  mix-blend-mode: multiply;
  animation: ${particleRise}
    var(--duration, 2s)
    var(--delay, 0s)
    cubic-bezier(0.25, 0.46, 0.45, 0.94)
    forwards;
  filter: blur(1.5px);
  will-change: transform, opacity;
`;

/* ── 1. Hero ── */
const HeroBanner = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 560px;
  border-bottom: 2px solid #000;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const HeroLeft = styled.div`
  background: url('/img/hero_left_bg.jpg') no-repeat;
  background-size: 108% 108%;
  background-position: -4% -4%;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  padding: 0;
  border-right: 2px solid #000;

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 2px solid #000;
    min-height: 420px;
  }
`;

const BlackBox = styled.div<{ $revealed: boolean }>`
  width: 100%;
  background: url('/img/m1.png') no-repeat;
  background-size: cover;
  background-position: center center;
  filter: grayscale(100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 36px;
  box-sizing: border-box;
  text-align: center;
  gap: 20px;
  transition: filter 0.5s ease, transform 0.5s cubic-bezier(.25,.46,.45,.94);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    transition: background 0.4s ease;
    z-index: 1;
  }

  &:hover {
    filter: grayscale(80%) contrast(1.05);
    &::before {
      background: rgba(0, 0, 0, 0.15);
    }
  }

  & > * {
    position: relative;
    z-index: 2;
  }
`;

const BlackBoxTagline = styled.span<{ $revealed: boolean }>`
  font-family: ${p => p.theme.fonts.display};
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  opacity: ${p => p.$revealed ? 1 : 0};
  transform: ${p => p.$revealed ? 'translateY(0)' : 'translateY(16px)'};
  transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
`;

const BlackBoxH1 = styled.h1<{ $revealed: boolean }>`
  color: #fff;
  font-family: ${p => p.theme.fonts.display};
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  line-height: 1.4;
  margin: 0;
  opacity: ${p => p.$revealed ? 1 : 0};
  transform: ${p => p.$revealed ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s;
`;

const BlackBoxCTA = styled.button<{ $revealed: boolean }>`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.55);
  color: rgba(255, 255, 255, 0.85);
  font-family: ${p => p.theme.fonts.display};
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 8px 20px;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
  opacity: ${p => p.$revealed ? 1 : 0};
  transform: ${p => p.$revealed ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity 0.9s ease 0.7s, transform 0.9s ease 0.7s,
              background 0.25s ease, border-color 0.25s ease, color 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.9);
    color: #fff;
  }

  & span {
    display: inline-block;
    transition: transform 0.25s ease;
  }
  &:hover span { transform: translateX(4px); }
`;

const HeroRight = styled.div`
  background: linear-gradient(135deg, #fbcfe8 0%, #bae6fd 35%, #fef08a 70%, #c7d2fe 100%);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) { min-height: 400px; }
`;

const HeroRightOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0);
  transition: background 0.4s ease;
  pointer-events: none;
  z-index: 2;

  ${HeroRight}:hover & {
    background: rgba(0,0,0,0.04);
  }
`;

const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(.25,.46,.45,.94);

  ${HeroRight}:hover & {
    transform: scale(1.06);
  }
`;

const HeroGlow = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
  pointer-events: none;
  mix-blend-mode: overlay;
  animation: ${floatAnim} 7s ease-in-out infinite;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`;

const HeroBadge = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  background: #000;
  color: #fff;
  font-family: ${p => p.theme.fonts.display};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.18em;
  padding: 6px 14px;
  z-index: 4;
  animation: ${pulseDot} 2.5s ease-in-out infinite;
`;

/* ── Marquee Strip ── */
const marqueeMove = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-33.333%); }
`;

const MarqueeWrap = styled.div`
  border-bottom: 2px solid #000;
  overflow: hidden;
  background: #000;
  padding: 14px 0;
`;

const MarqueeInner = styled.div`
  display: flex;
  white-space: nowrap;
  animation: ${marqueeMove} 18s linear infinite;
  will-change: transform;
`;

const MarqueeItem = styled.span`
  font-family: ${p => p.theme.fonts.display};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.22em;
  color: #fff;
  padding: 0 40px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

const MarqueeDot = styled.span`
  color: #888;
  font-size: 8px;
`;

/* ── Kinetic Text ── */
const KineticWrap = styled.span`
  display: inline-block;
`;

const KineticChar = styled.span<{ $hovered: boolean }>`
  display: inline-block;
  transition: color 0.2s ease;

  ${p =>
    p.$hovered &&
    css`
      animation: ${charWaveKf} 0.55s ease forwards;
      animation-delay: calc(var(--i, 0) * 0.045s);
    `}
`;

/* ── 2. Asymmetric Grid ── */
const GridSection = styled.section<{ $visible: boolean }>`
  display: grid;
  grid-template-columns: 240px 1fr 1fr 1fr;
  border-bottom: 2px solid #000;
  overflow: visible;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: ${p => p.$visible ? 'translateY(0)' : 'translateY(32px)'};
  transition: opacity 0.9s ease, transform 0.9s ease;

  @media (max-width: 1100px) { grid-template-columns: 180px 1fr 1fr 1fr; }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    overflow: hidden;
  }
`;

const LabelsCol = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 2px solid #000;

  @media (max-width: 900px) {
    flex-direction: row;
    border-right: none;
    border-bottom: 2px solid #000;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const ColLabel = styled.div`
  flex: 1;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 2px solid #000;
  transition: background 0.3s ease;
  cursor: default;

  &:last-child { border-bottom: none; }

  &:hover { background: #EDE7DC; }

  @media (max-width: 900px) {
    flex: 0 0 220px;
    border-bottom: none;
    border-right: 2px solid #000;
    &:last-child { border-right: none; }
  }
`;

const ColNum = styled.span`
  font-family: ${p => p.theme.fonts.display};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.22em;
  color: #000;
  border-left: 2px solid #000;
  padding-left: 8px;
`;

const ColTitle = styled.h2`
  font-family: ${p => p.theme.fonts.display};
  font-size: 20px;
  font-weight: 800;
  color: #000;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
`;

const ColDesc = styled.p`
  font-family: ${p => p.theme.fonts.body};
  font-size: 11px;
  color: #777;
  line-height: 1.6;
  margin: 0;
`;

/* Product Columns */
const PCol = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 2px solid #000;
  will-change: transform;

  &:last-child { border-right: none; }

  @media (max-width: 900px) {
    flex-direction: row;
    border-right: none;
    border-bottom: 2px solid #000;
    overflow-x: auto;
    scrollbar-width: none;
    will-change: auto;
    transform: none !important;
    &::-webkit-scrollbar { display: none; }
    &:last-child { border-bottom: none; }
  }
`;

/* Individual 3D Tilt Cell */
const CellWrap = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-bottom: 2px solid #000;
  aspect-ratio: 1 / 1;
  transform-style: preserve-3d;
  will-change: transform, box-shadow;

  &:last-child { border-bottom: none; }

  /* Shimmer sweep on hover */
  &:hover .cell-shimmer {
    animation: ${shimmerSweep} 0.7s ease forwards;
  }

  /* Overlay reveal on hover */
  &:hover .cell-overlay {
    opacity: 1;
  }

  @media (max-width: 900px) {
    flex: 0 0 240px;
    border-bottom: none;
    border-right: 2px solid #000;
    &:last-child { border-right: none; }
  }
`;

const FloatingImg = styled.img<{ $delay: number; $dur: number }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: ${floatAnim} ${p => p.$dur}s ${p => p.$delay}s ease-in-out infinite;
  will-change: transform;
`;

const CellShimmer = styled.div.attrs({ className: 'cell-shimmer' })`
  position: absolute;
  top: 0;
  left: -100%;
  width: 55%;
  height: 100%;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255,255,255,0.22) 50%,
    transparent 80%
  );
  pointer-events: none;
  z-index: 3;
`;

const CellOverlay = styled.div.attrs({ className: 'cell-overlay' })`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 4;
`;

const CellViewHint = styled.span`
  font-family: ${p => p.theme.fonts.display};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: #fff;
  background: #000;
  padding: 5px 10px;
`;

/* ── 3. Spray Section ── */
const SpraySec = styled.section<{ $visible: boolean }>`
  border-bottom: 2px solid #000;
  position: relative;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 1s ease;
`;

const SprayCanvas = styled.div`
  background: linear-gradient(135deg, #DCD6CD 0%, #B59BB3 100%);
  position: relative;
  height: 480px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const SprayLine = styled.div`
  position: absolute;
  right: 195px;
  top: 58%;
  transform-origin: right center;
  transform: translateY(-50%) rotate(var(--angle, 0deg));
  width: 3600px;
  height: 22px;
  overflow: hidden;
  display: flex;
  pointer-events: none;
  z-index: 5;
`;

const SprayInner = styled.div<{ $speed: number }>`
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #000;
  letter-spacing: 0.15em;
  white-space: nowrap;
  animation: ${sprayScroll} ${p => p.$speed}s linear infinite;
  display: inline-block;
  flex-shrink: 0;
`;

const NozzleWrap = styled.div`
  position: absolute;
  right: 0; bottom: 0;
  width: 320px;
  height: 100%;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  cursor: pointer;
  mix-blend-mode: multiply;
  filter: contrast(1.8) brightness(1.0);
  transition: filter 0.2s ease, transform 0.2s ease;

  &:hover {
    filter: contrast(1.8) brightness(1.1);
    transform: scale(1.02);
  }
  &:active {
    filter: contrast(1.8) brightness(0.9);
    transform: scale(0.98);
  }
`;

const NozzleImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom right;
  pointer-events: none;
`;

const NozzleRipple = styled.div<{ $key: number }>`
  position: absolute;
  bottom: 40%;
  right: 30%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.4);
  pointer-events: none;
  animation: ${pulseDot} 0.6s ease-out forwards;
`;

const NozzleHintLabel = styled.div`
  position: absolute;
  bottom: 28px;
  right: 340px;
  font-family: ${p => p.theme.fonts.display};
  font-size: 10px;
  font-weight: 900;
  color: #000;
  letter-spacing: 0.12em;
  z-index: 11;
  pointer-events: none;
  opacity: 0.7;
`;

const SprayBadge = styled.div`
  position: absolute;
  bottom: 16px;
  left: 24px;
  background: #000;
  color: #fff;
  font-family: ${p => p.theme.fonts.display};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.1em;
  padding: 6px 14px;
  z-index: 12;
  animation: ${fadeSlideIn} 0.4s ease forwards;
`;

/* ── 4. Quiz Section ── */
const QuizSec = styled.section<{ $visible: boolean }>`
  border-bottom: 2px solid #000;
  padding: 40px 60px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  cursor: pointer;
  background: #FAF8F5;
  gap: 40px;
  transition: background 0.3s ease;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: ${p => p.$visible ? 'translateY(0)' : 'translateY(24px)'};
  transition: background 0.3s ease, opacity 0.8s ease, transform 0.8s ease;

  &:hover { background: #EDE7DC; }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding: 40px 20px;
  }
`;

const QuizTitle = styled.div`
  font-family: ${p => p.theme.fonts.display};
  font-size: clamp(80px, 22vw, 360px);
  font-weight: 900;
  line-height: 0.75;
  letter-spacing: -0.06em;
  color: #000;
  margin-bottom: -10px;
  text-transform: uppercase;
  transition: letter-spacing 0.4s ease, transform 0.4s ease, -webkit-text-stroke 0.3s ease;
  -webkit-text-stroke: 0px transparent;

  ${QuizSec}:hover & {
    letter-spacing: -0.03em;
    transform: translateX(8px);
    -webkit-text-stroke: 2px #000;
    color: transparent;
  }
`;

const QuizMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 10px;
  max-width: 360px;
`;

const QuizDesc = styled.p`
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: 700;
  line-height: 1.6;
  color: #000;
  margin: 0;
  white-space: pre-line;
`;

const QuizCTA = styled.span`
  font-family: ${p => p.theme.fonts.display};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #000;
  text-transform: uppercase;
  border-bottom: 1.5px solid #000;
  width: fit-content;
  padding-bottom: 2px;
  transition: letter-spacing 0.3s ease, padding-right 0.3s ease;

  ${QuizSec}:hover & {
    letter-spacing: 0.16em;
    padding-right: 8px;
  }
`;

/* ── 5. Newsletter Bar ── */
const NewsBar = styled.div`
  border-bottom: 2px solid #000;
  padding: 48px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
  background: #000;

  @media (max-width: 768px) { padding: 36px 24px; }
`;

const NewsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NewsEyebrow = styled.span`
  font-family: ${p => p.theme.fonts.display};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.3em;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
`;

const NewsText = styled.div`
  font-family: ${p => p.theme.fonts.display};
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  max-width: 420px;
  line-height: 1.4;
`;

const NewsForm = styled.form`
  display: flex;
  border: 1.5px solid rgba(255,255,255,0.3);
  background: transparent;
  width: 360px;
  transition: border-color 0.25s ease;

  &:focus-within {
    border-color: rgba(255,255,255,0.8);
  }

  @media (max-width: 480px) { width: 100%; }
`;

const NewsInput = styled.input`
  flex: 1;
  border: none;
  padding: 14px 18px;
  font-family: ${p => p.theme.fonts.display};
  font-size: 11px;
  font-weight: 600;
  outline: none;
  background: transparent;
  color: #fff;

  &::placeholder { color: rgba(255,255,255,0.35); }
`;

const NewsSubmit = styled.button`
  border: none;
  border-left: 1.5px solid rgba(255,255,255,0.3);
  background: transparent;
  color: rgba(255,255,255,0.7);
  padding: 14px 22px;
  font-family: ${p => p.theme.fonts.display};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.1em;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }
`;

/* ── At Your Service Styles ── */
const ServiceSection = styled.section<{ $visible: boolean }>`
  border-bottom: 2px solid #000;
  padding: 80px 40px;
  background: #FAF8F5;
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: ${p => p.$visible ? 'translateY(0)' : 'translateY(30px)'};
  transition: opacity 0.8s ease, transform 0.8s ease;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const ServiceTitle = styled.h2`
  font-family: ${p => p.theme.fonts.display};
  font-size: 38px;
  font-weight: 700;
  color: #000;
  margin: 0 0 56px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 40px 20px;
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 12px;
  }
`;

const ServiceItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ServiceCard = styled.div`
  border: 2px solid #000;
  border-radius: 60px;
  width: 120px;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  margin-bottom: 18px;
  box-sizing: border-box;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  }

  svg {
    width: 100%;
    height: 100%;
    color: #000;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 140px;
    border-radius: 50px;
  }
`;

const ServiceText = styled.p`
  font-size: 11px;
  line-height: 1.5;
  color: #000;
  font-weight: 500;
  margin: 0;
  max-width: 140px;
  word-break: keep-all;
  text-align: center;
`;

