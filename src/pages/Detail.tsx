import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

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

export const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, reports } = useShop();

  const productId = id || 'p1';
  const product = products.find(p => p.id === productId) || products[0];

  const [selectedOption, setSelectedOption] = useState('50ml');
  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'details' | 'reviews'>('notes');

  const notesRef = useReveal(0.2);
  const reviewRef = useReveal(0.2);

  const getPriceAndOrig = (size: string) => {
    switch (size) {
      case '30ml':
        return { price: 120000, originalPrice: 133300 };
      case '100ml':
        return { price: 320000, originalPrice: 355500 };
      case '50ml':
      default:
        return { price: 210000, originalPrice: 233300 };
    }
  };

  const { price, originalPrice } = getPriceAndOrig(selectedOption);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset state on product change
  useEffect(() => {
    setImgLoaded(false);
    setSelectedOption('50ml');
    setQty(1);
    window.scrollTo(0, 0);
  }, [productId]);

  const handleQtyChange = (d: number) => {
    setQty(prev => Math.max(1, prev + d));
  };

  const handleAddToCart = () => {
    addToCart({ ...product, price, originalPrice }, qty, selectedOption);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, price, originalPrice }, qty, selectedOption);
    navigate('/cart');
  };

  const formatPrice = (value: number) => value.toLocaleString();

  const isSantal33Blinded = reports.some(r => r.id === 'r3' && r.status === 'blinded');

  // Scent note data per product
  const scentNotes = {
    top: { name: 'TOP NOTE', ingredients: '베르가못 · 핑크 페퍼', pct: 70 },
    middle: { name: 'MIDDLE NOTE', ingredients: '코튼 · 자스민', pct: 85 },
    base: { name: 'BASE NOTE', ingredients: '시그니처 머스크 · 시더우드', pct: 95 },
  };

  return (
    <PageContainer>
      {/* ═══ CINEMATIC HERO ═══ */}
      <HeroSection>
        <HeroImageWrap>
          <HeroImage
            src={product.imageUrl}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            $loaded={imgLoaded}
          />
          <HeroImageOverlay />
        </HeroImageWrap>

        <HeroInfo>
          <HeroInfoInner>
            <BrandLabel>MODO</BrandLabel>
            <ProductName>{product.name}</ProductName>
            <ProductScent>{product.scent}</ProductScent>
            {product.description && (
              <ProductDesc>{product.description}</ProductDesc>
            )}
            <RatingRow>
              <RatingStar>★</RatingStar>
              <RatingVal>{product.rating}</RatingVal>
              <RatingDot>·</RatingDot>
              <RatingReviews>{product.reviewCount.toLocaleString()} Reviews</RatingReviews>
            </RatingRow>
          </HeroInfoInner>
        </HeroInfo>
      </HeroSection>

      {/* ═══ PURCHASE SECTION ═══ */}
      <PurchaseSection>
        <PurchaseInner>
          <PurchaseLeft>
            <PricingBlock>
              <CurrentPrice>₩{formatPrice(price)}</CurrentPrice>
              <PriceRow>
                <OrigPrice>₩{formatPrice(originalPrice)}</OrigPrice>
                <DiscountBadge>10% OFF</DiscountBadge>
              </PriceRow>
            </PricingBlock>

            <Divider />

            <OptionBlock>
              <OptionTitle>SIZE</OptionTitle>
              <SizeOptions>
                {['30ml', '50ml', '100ml'].map(opt => (
                  <SizeChip
                    key={opt}
                    $active={selectedOption === opt}
                    onClick={() => setSelectedOption(opt)}
                  >
                    <SizeVal>{opt.replace('ml', '')}</SizeVal>
                    <SizeUnit>ml</SizeUnit>
                  </SizeChip>
                ))}
              </SizeOptions>
            </OptionBlock>

            <OptionBlock>
              <OptionTitle>QUANTITY</OptionTitle>
              <QtySelector>
                <QtyBtn onClick={() => handleQtyChange(-1)}>−</QtyBtn>
                <QtyValue>{qty}</QtyValue>
                <QtyBtn onClick={() => handleQtyChange(1)}>+</QtyBtn>
              </QtySelector>
              <StockBadge>
                <StockDot />
                당일 발송 가능
              </StockBadge>
            </OptionBlock>

            <Divider />

            <TotalRow>
              <TotalLabel>합계</TotalLabel>
              <TotalPrice>₩{formatPrice(price * qty)}</TotalPrice>
            </TotalRow>

            <ActionButtons>
              <CartBtn onClick={handleAddToCart}>
                <CartIcon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                </CartIcon>
                장바구니
              </CartBtn>
              <BuyBtn onClick={handleBuyNow}>
                바로 구매
                <BuyArrow>→</BuyArrow>
              </BuyBtn>
            </ActionButtons>
          </PurchaseLeft>

          <PurchaseRight>
            <ProductImageFloat>
              <FloatImg src={product.imageUrl} alt={product.name} />
            </ProductImageFloat>
          </PurchaseRight>
        </PurchaseInner>
      </PurchaseSection>

      {/* ═══ TABS SECTION ═══ */}
      <TabsSection>
        <TabsInner>
          <TabBar>
            <Tab $active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>
              Scent Notes
            </Tab>
            <Tab $active={activeTab === 'details'} onClick={() => setActiveTab('details')}>
              Details
            </Tab>
            <Tab $active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
              Reviews ({product.reviewCount.toLocaleString()})
            </Tab>
          </TabBar>

          {/* ─── SCENT NOTES TAB ─── */}
          {activeTab === 'notes' && (
            <TabContent ref={notesRef.ref}>
              <ScentPyramid $visible={notesRef.visible}>
                <PyramidTitle>SCENT PYRAMID</PyramidTitle>
                <PyramidDesc>시간의 흐름에 따라 변화하는 향의 여정</PyramidDesc>

                <NoteLayer $delay={0} $visible={notesRef.visible}>
                  <NoteIcon>△</NoteIcon>
                  <NoteInfo>
                    <NoteNameStyled>Top Note</NoteNameStyled>
                    <NoteIngr>{scentNotes.top.ingredients}</NoteIngr>
                  </NoteInfo>
                  <NoteBarWrap>
                    <NoteBarBg />
                    <NoteBarFill $width={scentNotes.top.pct} $visible={notesRef.visible} $delay={0.3} $color="rgba(255,255,255,0.3)" />
                  </NoteBarWrap>
                  <NotePct>{scentNotes.top.pct}%</NotePct>
                </NoteLayer>

                <NoteLayer $delay={0.15} $visible={notesRef.visible}>
                  <NoteIcon>◇</NoteIcon>
                  <NoteInfo>
                    <NoteNameStyled>Middle Note</NoteNameStyled>
                    <NoteIngr>{scentNotes.middle.ingredients}</NoteIngr>
                  </NoteInfo>
                  <NoteBarWrap>
                    <NoteBarBg />
                    <NoteBarFill $width={scentNotes.middle.pct} $visible={notesRef.visible} $delay={0.5} $color="rgba(255,255,255,0.5)" />
                  </NoteBarWrap>
                  <NotePct>{scentNotes.middle.pct}%</NotePct>
                </NoteLayer>

                <NoteLayer $delay={0.3} $visible={notesRef.visible}>
                  <NoteIcon>○</NoteIcon>
                  <NoteInfo>
                    <NoteNameStyled>Base Note</NoteNameStyled>
                    <NoteIngr>{scentNotes.base.ingredients}</NoteIngr>
                  </NoteInfo>
                  <NoteBarWrap>
                    <NoteBarBg />
                    <NoteBarFill $width={scentNotes.base.pct} $visible={notesRef.visible} $delay={0.7} $color="rgba(255,255,255,0.8)" />
                  </NoteBarWrap>
                  <NotePct>{scentNotes.base.pct}%</NotePct>
                </NoteLayer>
              </ScentPyramid>

              <ScentStory>
                <StoryLabel>THE STORY</StoryLabel>
                <StoryText>
                  {product.description || '이 향수는 MODO의 조향 철학을 담아 원료 본연의 아름다움을 극대화한 작품입니다.'}
                  {' '}시간이 지남에 따라 피부 위에서 천천히 변화하며, 착용자만의 고유한 잔향을 남깁니다.
                  MODO의 시그니처 포뮬러로 완성된 이 향기는 기억 속에 깊이 각인됩니다.
                </StoryText>
              </ScentStory>
            </TabContent>
          )}

          {/* ─── DETAILS TAB ─── */}
          {activeTab === 'details' && (
            <TabContent>
              <DetailsGrid>
                <DetailItem>
                  <DetailIcon>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </DetailIcon>
                  <DetailLabel>CONCENTRATION</DetailLabel>
                  <DetailValue>Extrait de Parfum</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  </DetailIcon>
                  <DetailLabel>LONGEVITY</DetailLabel>
                  <DetailValue>8 – 12 Hours</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
                    </svg>
                  </DetailIcon>
                  <DetailLabel>SILLAGE</DetailLabel>
                  <DetailValue>Moderate to Strong</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                  </DetailIcon>
                  <DetailLabel>OCCASION</DetailLabel>
                  <DetailValue>Evening · Special</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                  </DetailIcon>
                  <DetailLabel>SEASON</DetailLabel>
                  <DetailValue>Autumn · Winter</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    </svg>
                  </DetailIcon>
                  <DetailLabel>PACKAGING</DetailLabel>
                  <DetailValue>Craft Box · Hand-wrapped</DetailValue>
                </DetailItem>
              </DetailsGrid>

              <ShippingInfo>
                <ShipRow>
                  <ShipIcon>📦</ShipIcon>
                  <ShipText>
                    <strong>무료 배송</strong> — 전 상품 무료 배송 (영업일 기준 2~4일)
                  </ShipText>
                </ShipRow>
                <ShipRow>
                  <ShipIcon>🔄</ShipIcon>
                  <ShipText>
                    <strong>교환/반품</strong> — 미개봉 상품에 한해 수령 후 7일 이내 가능
                  </ShipText>
                </ShipRow>
                <ShipRow>
                  <ShipIcon>🎁</ShipIcon>
                  <ShipText>
                    <strong>선물 포장</strong> — MODO 시그니처 크래프트 박스 기본 제공
                  </ShipText>
                </ShipRow>
              </ShippingInfo>
            </TabContent>
          )}

          {/* ─── REVIEWS TAB ─── */}
          {activeTab === 'reviews' && (
            <TabContent ref={reviewRef.ref}>
              <ReviewHeader $visible={reviewRef.visible}>
                <ReviewScoreBlock>
                  <ReviewBigScore>{product.rating}</ReviewBigScore>
                  <ReviewStarRow>
                    {'★★★★★'.split('').map((s, i) => (
                      <ReviewStar key={i} $filled={i < Math.round(Number(product.rating))}>
                        {s}
                      </ReviewStar>
                    ))}
                  </ReviewStarRow>
                  <ReviewCountText>{product.reviewCount.toLocaleString()}개의 리뷰</ReviewCountText>
                </ReviewScoreBlock>
                <ReviewBarsBlock>
                  {[
                    { star: 5, pct: 92 },
                    { star: 4, pct: 6 },
                    { star: 3, pct: 2 },
                    { star: 2, pct: 0 },
                    { star: 1, pct: 0 },
                  ].map(b => (
                    <BarRow key={b.star}>
                      <BarLabel>{b.star}</BarLabel>
                      <BarTrack>
                        <BarFill $width={b.pct} $visible={reviewRef.visible} />
                      </BarTrack>
                    </BarRow>
                  ))}
                </ReviewBarsBlock>
              </ReviewHeader>

              <ReviewList>
                <ReviewCardStyled>
                  <ReviewCardHeader>
                    <ReviewAvatar $bg="#1a1a2e">김</ReviewAvatar>
                    <ReviewMeta>
                      <ReviewName>김지현</ReviewName>
                      <ReviewDate>
                        <span>★★★★★</span>
                        <span>2026.05.20</span>
                      </ReviewDate>
                    </ReviewMeta>
                    <VerifiedBadge>✓ 구매 인증</VerifiedBadge>
                  </ReviewCardHeader>
                  <ReviewBody>
                    정말 독보적인 향이에요. 처음엔 은은한 {product.scent} 느낌이 나다가 갈수록 피부 체취와 부드럽게 어우러져서 매력적인 잔향이 남습니다. MODO 특유의 깊이감 있고 세련된 무드가 느껴져서 마음에 듭니다.
                  </ReviewBody>
                </ReviewCardStyled>

                {!(product.id === 'p1' && isSantal33Blinded) && (
                  <ReviewCardStyled>
                    <ReviewCardHeader>
                      <ReviewAvatar $bg="#16213e">박</ReviewAvatar>
                      <ReviewMeta>
                        <ReviewName>박민준</ReviewName>
                        <ReviewDate>
                          <span>★★★★★</span>
                          <span>2026.05.18</span>
                        </ReviewDate>
                      </ReviewMeta>
                      <VerifiedBadge>✓ 구매 인증</VerifiedBadge>
                    </ReviewCardHeader>
                    <ReviewBody>
                      MODO의 {product.name} 향수라 기대하며 구매했는데 기대 이상입니다! 흔하지 않으면서 고급스러운 잔향을 선사해 주어서 주변 반응도 엄청 좋네요. 데일리로 뿌리기에 완벽합니다.
                    </ReviewBody>
                  </ReviewCardStyled>
                )}
              </ReviewList>
            </TabContent>
          )}
        </TabsInner>
      </TabsSection>

      {/* ═══ STICKY BOTTOM BAR ═══ */}
      <StickyBar $show={showSticky}>
        <StickyInner>
          <StickyLeft>
            <StickyProductName>{product.name}</StickyProductName>
            <StickyProductMeta>{selectedOption} · 수량 {qty}개</StickyProductMeta>
          </StickyLeft>
          <StickyRight>
            <StickyPrice>₩{formatPrice(price * qty)}</StickyPrice>
            <StickyCartBtn onClick={handleAddToCart}>장바구니</StickyCartBtn>
            <StickyBuyBtn onClick={handleBuyNow}>바로 구매</StickyBuyBtn>
          </StickyRight>
        </StickyInner>
      </StickyBar>
    </PageContainer>
  );
};

/* ═══════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(1.08); }
  to   { opacity: 1; transform: scale(1); }
`;

const barGrow = keyframes`
  from { width: 0; }
`;

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
const PageContainer = styled.div`
  width: 100%;
  background: #0a0a0f;
  color: #f0ede8;
  padding-bottom: 100px;
`;

/* ═══════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════ */
const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 85vh;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const HeroImageWrap = styled.div`
  position: relative;
  overflow: hidden;
  background: #111118;
  height: 100%;

  @media (max-width: 900px) {
    aspect-ratio: 1;
    height: auto;
  }
`;

const HeroImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s ease, opacity 0.5s ease;
  opacity: 1;
  transform: ${p => (p.$loaded ? 'scale(1)' : 'scale(1.05)')};
`;

const HeroImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 50%,
    rgba(10, 10, 15, 0.3) 100%
  );
  pointer-events: none;
`;

const HeroInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 60px;
  background: #0a0a0f;

  @media (max-width: 900px) {
    padding: 48px 24px;
  }
`;

const HeroInfoInner = styled.div`
  max-width: 480px;
  animation: ${fadeUp} 0.8s ease 0.3s both;
`;

const BrandLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: rgba(255,255,255,0.35);
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const ProductName = styled.h1`
  font-family: 'Inter', serif;
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 20px;
  color: #f0ede8;
`;

const ProductScent = styled.div`
  font-size: 14px;
  color: rgba(255,255,255,0.45);
  letter-spacing: 0.05em;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const ProductDesc = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: rgba(255,255,255,0.55);
  margin: 0 0 32px;
  word-break: keep-all;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RatingStar = styled.span`
  color: #c8a97e;
  font-size: 14px;
`;

const RatingVal = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #f0ede8;
`;

const RatingDot = styled.span`
  color: rgba(255,255,255,0.2);
`;

const RatingReviews = styled.span`
  font-size: 13px;
  color: rgba(255,255,255,0.35);
`;

/* ═══════════════════════════════════════════════════════════
   PURCHASE SECTION
   ═══════════════════════════════════════════════════════════ */
const PurchaseSection = styled.section`
  border-top: 1px solid rgba(255,255,255,0.06);
  background: #0d0d14;
`;

const PurchaseInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 48px 24px;
  }
`;

const PurchaseLeft = styled.div`
  animation: ${fadeUp} 0.6s ease both;
`;

const PurchaseRight = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 900px) {
    display: none;
  }
`;

const ProductImageFloat = styled.div`
  width: 320px;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: #15151f;
  box-shadow: 0 40px 80px rgba(0,0,0,0.5);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.06);
    pointer-events: none;
  }
`;

const FloatImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PricingBlock = styled.div`
  margin-bottom: 32px;
`;

const CurrentPrice = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 36px;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #f0ede8;
  margin-bottom: 8px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const OrigPrice = styled.span`
  font-size: 14px;
  color: rgba(255,255,255,0.3);
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #c8a97e;
  background: rgba(200,169,126,0.1);
  padding: 4px 10px;
  border-radius: 4px;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 28px 0;
`;

const OptionBlock = styled.div`
  margin-bottom: 28px;
`;

const OptionTitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.35);
  margin-bottom: 14px;
  text-transform: uppercase;
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 10px;
`;

const SizeChip = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 16px 20px;
  border: 1px solid ${p => p.$active ? 'rgba(200,169,126,0.6)' : 'rgba(255,255,255,0.1)'};
  background: ${p => p.$active ? 'rgba(200,169,126,0.08)' : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(200,169,126,0.4);
    background: rgba(200,169,126,0.05);
  }
`;

const SizeVal = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: #f0ede8;
`;

const SizeUnit = styled.span`
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
`;

const QtySelector = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const QtyBtn = styled.button`
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.05);
    color: #f0ede8;
  }
`;

const QtyValue = styled.span`
  min-width: 48px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #f0ede8;
  border-left: 1px solid rgba(255,255,255,0.06);
  border-right: 1px solid rgba(255,255,255,0.06);
  padding: 10px 0;
`;

const StockBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255,255,255,0.4);
`;

const StockDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px rgba(52,211,153,0.4);
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

const TotalLabel = styled.span`
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.05em;
`;

const TotalPrice = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: #f0ede8;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
`;

const CartBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: #f0ede8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.03);
  }
`;

const CartIcon = styled.span`
  display: flex;
  opacity: 0.6;
`;

const BuyBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px;
  background: linear-gradient(135deg, #c8a97e, #a68b5b);
  border: none;
  border-radius: 10px;
  color: #0a0a0f;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.03em;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(200,169,126,0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BuyArrow = styled.span`
  font-size: 16px;
  transition: transform 0.3s;
  ${BuyBtn}:hover & {
    transform: translateX(4px);
  }
`;

/* ═══════════════════════════════════════════════════════════
   TABS SECTION
   ═══════════════════════════════════════════════════════════ */
const TabsSection = styled.section`
  border-top: 1px solid rgba(255,255,255,0.06);
  background: #0a0a0f;
`;

const TabsInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 40px 80px;

  @media (max-width: 900px) {
    padding: 0 20px 60px;
  }
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 48px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 24px 16px;
  background: none;
  border: none;
  color: ${p => p.$active ? '#f0ede8' : 'rgba(255,255,255,0.3)'};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${p => p.$active ? '#c8a97e' : 'transparent'};
    transition: background 0.3s;
  }

  &:hover {
    color: rgba(255,255,255,0.6);
  }
`;

const TabContent = styled.div`
  animation: ${fadeIn} 0.4s ease both;
`;

/* ─── SCENT PYRAMID ─── */
const ScentPyramid = styled.div<{ $visible: boolean }>`
  background: linear-gradient(145deg, #14141e, #1a1a28);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 48px 40px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    padding: 32px 20px;
  }
`;

const PyramidTitle = styled.h3`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #c8a97e;
  margin: 0 0 8px;
`;

const PyramidDesc = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.35);
  margin: 0 0 36px;
`;

const NoteLayer = styled.div<{ $delay: number; $visible: boolean }>`
  display: grid;
  grid-template-columns: 28px 160px 1fr 40px;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
  opacity: 0;
  transform: translateX(-20px);

  ${p => p.$visible && css`
    animation: ${fadeUp} 0.5s ease ${p.$delay}s both;
  `}

  @media (max-width: 600px) {
    grid-template-columns: 24px 100px 1fr 36px;
    gap: 8px;
  }
`;

const NoteIcon = styled.div`
  font-size: 16px;
  color: rgba(255,255,255,0.2);
  text-align: center;
`;

const NoteInfo = styled.div``;

const NoteNameStyled = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #f0ede8;
  margin-bottom: 2px;
`;

const NoteIngr = styled.div`
  font-size: 11px;
  color: rgba(255,255,255,0.35);
`;

const NoteBarWrap = styled.div`
  position: relative;
  height: 4px;
  border-radius: 4px;
  overflow: hidden;
`;

const NoteBarBg = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.06);
  border-radius: 4px;
`;

const NoteBarFill = styled.div<{ $width: number; $visible: boolean; $delay: number; $color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${p => p.$visible ? `${p.$width}%` : '0%'};
  background: ${p => p.$color};
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1) ${p => p.$delay}s;
`;

const NotePct = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.4);
  text-align: right;
`;

/* ─── SCENT STORY ─── */
const ScentStory = styled.div`
  padding: 40px;
  background: linear-gradient(145deg, #14141e, #1a1a28);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;

  @media (max-width: 900px) {
    padding: 28px 20px;
  }
`;

const StoryLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #c8a97e;
  margin-bottom: 16px;
`;

const StoryText = styled.p`
  font-size: 14px;
  line-height: 2;
  color: rgba(255,255,255,0.5);
  margin: 0;
  word-break: keep-all;
`;

/* ─── DETAILS TAB ─── */
const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailItem = styled.div`
  background: linear-gradient(145deg, #14141e, #18182a);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 28px 20px;
  text-align: center;
  transition: border-color 0.3s, transform 0.3s;

  &:hover {
    border-color: rgba(200,169,126,0.2);
    transform: translateY(-2px);
  }
`;

const DetailIcon = styled.div`
  color: #c8a97e;
  margin-bottom: 14px;
  opacity: 0.7;
`;

const DetailLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.3);
  margin-bottom: 8px;
`;

const DetailValue = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #f0ede8;
`;

const ShippingInfo = styled.div`
  background: linear-gradient(145deg, #14141e, #18182a);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ShipRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const ShipIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
`;

const ShipText = styled.div`
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255,255,255,0.5);
  strong {
    color: #f0ede8;
  }
`;

/* ─── REVIEWS TAB ─── */
const ReviewHeader = styled.div<{ $visible: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 48px;
  align-items: center;
  margin-bottom: 40px;
  padding: 40px;
  background: linear-gradient(145deg, #14141e, #1a1a28);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 28px 20px;
  }
`;

const ReviewScoreBlock = styled.div`
  text-align: center;
  min-width: 120px;
`;

const ReviewBigScore = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 56px;
  font-weight: 200;
  color: #f0ede8;
  line-height: 1;
  margin-bottom: 8px;
`;

const ReviewStarRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 8px;
`;

const ReviewStar = styled.span<{ $filled: boolean }>`
  color: ${p => p.$filled ? '#c8a97e' : 'rgba(255,255,255,0.1)'};
  font-size: 14px;
`;

const ReviewCountText = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.35);
`;

const ReviewBarsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BarLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
  min-width: 16px;
  text-align: right;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number; $visible: boolean }>`
  height: 100%;
  width: ${p => p.$visible ? `${p.$width}%` : '0%'};
  background: linear-gradient(90deg, #c8a97e, #a68b5b);
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReviewCardStyled = styled.div`
  background: linear-gradient(145deg, #14141e, #18182a);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 28px;
  transition: border-color 0.3s;

  &:hover {
    border-color: rgba(255,255,255,0.12);
  }
`;

const ReviewCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const ReviewAvatar = styled.div<{ $bg: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${p => p.$bg};
  color: #f0ede8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
`;

const ReviewMeta = styled.div`
  flex: 1;
`;

const ReviewName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #f0ede8;
`;

const ReviewDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  margin-top: 2px;
  span:first-child {
    color: #c8a97e;
  }
`;

const VerifiedBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #34d399;
  background: rgba(52,211,153,0.08);
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;

  @media (max-width: 600px) {
    display: none;
  }
`;

const ReviewBody = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255,255,255,0.5);
  margin: 0;
  word-break: keep-all;
`;

/* ═══════════════════════════════════════════════════════════
   STICKY BAR
   ═══════════════════════════════════════════════════════════ */
const StickyBar = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  background: rgba(14,14,20,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.06);
  transform: translateY(${p => p.$show ? '0' : '100%'});
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
`;

const StickyInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 600px) {
    padding: 12px 16px;
    gap: 12px;
  }
`;

const StickyLeft = styled.div``;

const StickyProductName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #f0ede8;
`;

const StickyProductMeta = styled.div`
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  margin-top: 2px;
`;

const StickyRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StickyPrice = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #f0ede8;
  margin-right: 8px;

  @media (max-width: 600px) {
    display: none;
  }
`;

const StickyCartBtn = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #f0ede8;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255,255,255,0.3);
  }

  @media (max-width: 600px) {
    padding: 10px 14px;
    font-size: 12px;
  }
`;

const StickyBuyBtn = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #c8a97e, #a68b5b);
  border: none;
  border-radius: 8px;
  color: #0a0a0f;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(200,169,126,0.3);
  }

  @media (max-width: 600px) {
    padding: 10px 18px;
    font-size: 12px;
  }
`;
