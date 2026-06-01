import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

type ScentType = 'ALL' | 'FRESH' | 'FLOWER' | 'WOOD' | 'AMBER' | 'DRESSING FUMES' | 'GOLD LABEL' | 'SUMMER EXCLUSIVES';

/* ─────────────────────────────────────────────
   KEYFRAMES
───────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { left: -100%; }
  100% { left: 140%; }
`;

const revealWidth = keyframes`
  from { width: 0; }
  to   { width: 40px; }
`;

/* ─────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────── */
const useScrollReveal = (threshold = 0.08) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

export const Perfumes: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useShop();
  const [activeCategory, setActiveCategory] = useState<ScentType>('ALL');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const headerReveal = useScrollReveal(0);
  const gridReveal = useScrollReveal(0.05);

  const categories: ScentType[] = [
    'ALL', 'FRESH', 'FLOWER', 'WOOD', 'AMBER',
    'DRESSING FUMES', 'GOLD LABEL', 'SUMMER EXCLUSIVES',
  ];

  const filteredProducts = products.filter(prod => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'WOOD') return prod.category === 'woody';
    if (activeCategory === 'FLOWER') return prod.category === 'floral';
    if (activeCategory === 'FRESH') return prod.category === 'citrus' || prod.category === 'aquatic';
    if (activeCategory === 'AMBER') return prod.category === 'oriental';
    if (activeCategory === 'GOLD LABEL') return prod.badge === 'BEST';
    if (activeCategory === 'SUMMER EXCLUSIVES') return prod.badge === 'NEW' || prod.badge === 'SALE';
    return true;
  });

  return (
    <PageContainer>

      {/* ══ HERO HEADER ══ */}
      <HeroHeader ref={headerReveal.ref} $visible={headerReveal.visible}>
        <HeroEyebrow>SCENT ATELIER COLLECTION</HeroEyebrow>
        <HeroTitle>PERFUMES</HeroTitle>
        <HeroMeta>
          <HeroCount>{filteredProducts.length} SCENTS</HeroCount>
          <HeroDivider />
          <HeroDesc>Seoul · Paris · New York</HeroDesc>
        </HeroMeta>
      </HeroHeader>

      {/* ══ FILTER BAR ══ */}
      <FilterBar>
        <FilterLabel>SCENT TYPE</FilterLabel>
        <FilterTabs>
          {categories.map(cat => (
            <TabBtn
              key={cat}
              $active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {activeCategory === cat && <ActiveUnderline />}
            </TabBtn>
          ))}
        </FilterTabs>
      </FilterBar>

      {/* ══ CATALOG GRID ══ */}
      <CatalogGrid ref={gridReveal.ref} $visible={gridReveal.visible}>
        {filteredProducts.map((prod, idx) => {
          let customBadge = '';
          if (idx === 1 || prod.id === 'p6') customBadge = 'NYC EXCLUSIVE';
          if (idx === 2 || prod.id === 'p1') customBadge = 'LA EXCLUSIVE';

          return (
            <ProductCard
              key={prod.id}
              $delay={idx * 0.06}
              $visible={gridReveal.visible}
              onMouseEnter={() => setHoveredId(prod.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(`/detail/${prod.id}`)}
            >
              {customBadge && <ExclusiveBadge>{customBadge}</ExclusiveBadge>}
              {prod.badge && !customBadge && (
                <DefaultBadge $type={prod.badge}>{prod.badge}</DefaultBadge>
              )}

              <ImgWrapper>
                <ProductImg src={prod.imageUrl} alt={prod.name} $hovered={hoveredId === prod.id} />
              </ImgWrapper>

              <CardShimmer $hovered={hoveredId === prod.id} />

              <InfoOverlay>
                <BrandName>{prod.brand}</BrandName>
                <ProductName>{prod.name}</ProductName>
                <ScentDescription>{prod.scent}</ScentDescription>
                <PriceRow>
                  <ProductPrice>₩{prod.price.toLocaleString()}</ProductPrice>
                  <QuickViewHint $hovered={hoveredId === prod.id}>상세보기 →</QuickViewHint>
                </PriceRow>
              </InfoOverlay>
            </ProductCard>
          );
        })}
      </CatalogGrid>

      {/* ══ BOTTOM STRIP ══ */}
      <BottomStrip>
        <BottomLeft>
          <BottomCount>{filteredProducts.length}개의 향수</BottomCount>
          <BottomLine>모든 향수는 천연 원료로 소량 한정 제작됩니다.</BottomLine>
        </BottomLeft>
        <BottomRight>
          <QuizFloatingBtn onClick={() => navigate('/quiz')}>
            향수 추천 퀴즈 <Arrow>→</Arrow>
          </QuizFloatingBtn>
        </BottomRight>
      </BottomStrip>

    </PageContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const PageContainer = styled.div`
  width: 100%;
  background: #FAF8F5;
  color: #000;
  min-height: 100vh;
`;

/* ── Hero Header ── */
const HeroHeader = styled.div<{ $visible: boolean }>`
  padding: 64px 60px 40px;
  border-bottom: 2px solid #000;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: ${p => p.$visible ? 'translateY(0)' : 'translateY(24px)'};
  transition: opacity 0.8s ease, transform 0.8s ease;

  @media (max-width: 768px) { padding: 48px 24px 32px; }
`;

const HeroEyebrow = styled.div`
  font-family: ${p => p.theme.fonts.display};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.3em;
  color: #999;
  margin-bottom: 16px;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  font-family: ${p => p.theme.fonts.display};
  font-size: clamp(56px, 10vw, 120px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.9;
  color: #000;
  margin: 0 0 28px 0;
  text-transform: uppercase;
`;

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeroCount = styled.span`
  font-family: ${p => p.theme.fonts.display};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: #000;
`;

const HeroDivider = styled.span`
  width: 24px;
  height: 1px;
  background: #999;
`;

const HeroDesc = styled.span`
  font-family: ${p => p.theme.fonts.display};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #999;
`;

/* ── Filter Bar ── */
const FilterBar = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  border-bottom: 2px solid #000;
  background: #FAF8F5;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const FilterLabel = styled.div`
  padding: 18px 32px;
  font-family: ${p => p.theme.fonts.display};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.2em;
  border-right: 2px solid #000;
  display: flex;
  align-items: center;
  color: #000;

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 2px solid #000;
    padding: 14px 20px;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ActiveUnderline = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #000;
  animation: ${revealWidth} 0.25s ease forwards;
  width: 100%;
`;

const TabBtn = styled.button<{ $active: boolean }>`
  position: relative;
  flex: 1;
  padding: 18px 16px;
  background: ${p => p.$active ? '#000' : 'transparent'};
  border: none;
  border-right: 2px solid #000;
  font-family: ${p => p.theme.fonts.display};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: ${p => p.$active ? '#fff' : '#000'};
  cursor: pointer;
  white-space: nowrap;
  text-transform: uppercase;
  transition: background 0.2s ease, color 0.2s ease;
  overflow: hidden;

  &:last-child { border-right: none; }

  &:hover {
    background: ${p => p.$active ? '#000' : '#EDE7DC'};
  }

  @media (max-width: 900px) { padding: 14px 12px; }
`;

/* ── Product Grid ── */
const CatalogGrid = styled.div<{ $visible: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 2px solid #000;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.7s ease;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const ProductCard = styled.div<{ $delay: number; $visible: boolean; }>`
  border-right: 2px solid #000;
  border-bottom: 2px solid #000;
  position: relative;
  aspect-ratio: 0.8;
  background: #FAF8F5;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: ${p => p.$visible ? 'translateY(0)' : 'translateY(24px)'};
  transition: opacity 0.7s ease ${p => p.$delay}s, transform 0.7s ease ${p => p.$delay}s,
              background 0.3s ease;

  &:hover {
    background: #F0EAE0;
  }

  &:nth-child(3n) { border-right: none; }

  @media (max-width: 1100px) {
    &:nth-child(3n) { border-right: 2px solid #000; }
    &:nth-child(2n) { border-right: none; }
  }
  @media (max-width: 640px) {
    aspect-ratio: 1;
    border-right: none;
    &:nth-child(n) { border-right: none; }
  }
`;

const ExclusiveBadge = styled.span`
  position: absolute;
  top: 20px;
  left: 0;
  background: #0F5CA8;
  color: #fff;
  font-family: ${p => p.theme.fonts.display};
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.1em;
  padding: 6px 14px;
  z-index: 10;
  text-transform: uppercase;
`;

const DefaultBadge = styled.span<{ $type: string }>`
  position: absolute;
  top: 20px;
  right: 0;
  background: ${p => p.$type === 'NEW' ? '#000' : p.$type === 'SALE' ? '#C0392B' : '#5E4B8B'};
  color: #fff;
  font-family: ${p => p.theme.fonts.display};
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.12em;
  padding: 5px 12px;
  z-index: 10;
  text-transform: uppercase;
`;

const ImgWrapper = styled.div`
  width: 70%;
  height: 68%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  ${ProductCard}:hover & {
    transform: scale(1.07) translateY(-6px);
  }
`;

const ProductImg = styled.img<{ $hovered: boolean }>`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: ${p => p.$hovered ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.18))' : 'drop-shadow(0 8px 16px rgba(0,0,0,0.06))'};
  transition: filter 0.4s ease;
`;

const CardShimmer = styled.div<{ $hovered: boolean }>`
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255,255,255,0.35) 50%,
    transparent 80%
  );
  pointer-events: none;
  z-index: 3;
  ${p => p.$hovered && css`animation: ${shimmer} 0.65s ease forwards;`}
`;

const InfoOverlay = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  pointer-events: none;
`;

const BrandName = styled.div`
  font-family: ${p => p.theme.fonts.display};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.18em;
  color: #aaa;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const ProductName = styled.h3`
  font-family: ${p => p.theme.fonts.display};
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 900;
  line-height: 1.1;
  color: #000;
  margin: 0 0 6px 0;
`;

const ScentDescription = styled.div`
  font-size: 10px;
  color: #888;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 10px;
  word-break: keep-all;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProductPrice = styled.div`
  font-family: ${p => p.theme.fonts.display};
  font-size: 13px;
  font-weight: 800;
  color: #000;
`;

const QuickViewHint = styled.span<{ $hovered: boolean }>`
  font-family: ${p => p.theme.fonts.display};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #000;
  opacity: ${p => p.$hovered ? 1 : 0};
  transform: ${p => p.$hovered ? 'translateX(0)' : 'translateX(-8px)'};
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
`;

/* ── Bottom Strip ── */
const BottomStrip = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 60px;
  border-bottom: 2px solid #000;
  gap: 24px;
  flex-wrap: wrap;
  background: #000;

  @media (max-width: 768px) { padding: 32px 24px; }
`;

const BottomLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BottomCount = styled.span`
  font-family: ${p => p.theme.fonts.display};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
`;

const BottomLine = styled.span`
  font-family: ${p => p.theme.fonts.display};
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
`;

const BottomRight = styled.div``;

const Arrow = styled.span`
  display: inline-block;
  transition: transform 0.25s ease;
`;

const QuizFloatingBtn = styled.button`
  background: transparent;
  border: 1.5px solid rgba(255,255,255,0.4);
  color: rgba(255,255,255,0.85);
  padding: 14px 28px;
  font-family: ${p => p.theme.fonts.display};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.8);
    color: #fff;
    ${Arrow} { transform: translateX(4px); }
  }
`;
