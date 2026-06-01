import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { BottleSvg } from '../components/shared/BottleSvg';

export const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, reports } = useShop();

  const productId = id || 'p1';
  const product = products.find(p => p.id === productId) || products[0];

  const [selectedOption, setSelectedOption] = useState('50ml');
  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);

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
      if (window.scrollY > 400) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQtyChange = (d: number) => {
    setQty(prev => Math.max(1, prev + d));
  };

  const handleAddToCart = () => {
    const customProduct = {
      ...product,
      price,
      originalPrice,
    };
    addToCart(customProduct, qty, selectedOption);
  };

  const handleBuyNow = () => {
    const customProduct = {
      ...product,
      price,
      originalPrice,
    };
    addToCart(customProduct, qty, selectedOption);
    navigate('/cart');
  };

  const formatPrice = (value: number) => {
    return value.toLocaleString();
  };

  const isSantal33Blinded = reports.some(r => r.id === 'r3' && r.status === 'blinded');

  return (
    <PageContainer className="fade-in">
      <DetailLayout>
        {/* GALLERY */}
        <DetailGallery>
          <DetailMainImg>
            <BottleImg src={product.imageUrl} alt={product.name} />
          </DetailMainImg>
        </DetailGallery>

        {/* INFO */}
        <div>
          <DetailBrand>{product.brand}</DetailBrand>
          <DetailName>{product.name}</DetailName>
          <DetailSub>{product.scent}</DetailSub>
          <DetailRating>
            <StarsLg>★</StarsLg>
            <RatingScore>{product.rating}</RatingScore>
            <ReviewCount>리뷰 {product.reviewCount.toLocaleString()}개</ReviewCount>
          </DetailRating>
          <DetailPrice>
            ₩{formatPrice(price)}
            <DetailPriceOrig>₩{formatPrice(originalPrice)}</DetailPriceOrig>
            <DetailPriceTag>10% OFF</DetailPriceTag>
          </DetailPrice>

          <OptionLabel>용량 선택</OptionLabel>
          <OptionChips>
            {['30ml', '50ml', '100ml'].map(opt => (
              <OptChip
                key={opt}
                className={selectedOption === opt ? 'active' : ''}
                onClick={() => setSelectedOption(opt)}
              >
                {opt}
              </OptChip>
            ))}
          </OptionChips>

          <OptionLabel>수량</OptionLabel>
          <QtyRow>
            <QtyBtn onClick={() => handleQtyChange(-1)}>−</QtyBtn>
            <QtyNum>{qty}</QtyNum>
            <QtyBtn onClick={() => handleQtyChange(1)}>+</QtyBtn>
            <StockText>당일 발송 가능</StockText>
          </QtyRow>

          <ActionRow>
            <BtnCartLarge onClick={handleAddToCart}>장바구니 담기</BtnCartLarge>
            <BtnBuyLarge onClick={handleBuyNow}>바로 구매하기</BtnBuyLarge>
          </ActionRow>

          {/* SCENT NOTE CHART */}
          <ScentNoteContainer>
            <ScentNoteTitle>SCENT NOTE DETAILS</ScentNoteTitle>
            <NoteRow>
              <NoteLabel><NoteName>TOP NOTE</NoteName><NoteIngredients>베르가못 · 핑크 페퍼 (70%)</NoteIngredients></NoteLabel>
              <NoteBar><NoteFill style={{ width: '70%', background: '#E11D48' }} /></NoteBar>
            </NoteRow>
            <NoteRow>
              <NoteLabel><NoteName>MIDDLE NOTE</NoteName><NoteIngredients>코튼 · 자스민 (85%)</NoteIngredients></NoteLabel>
              <NoteBar><NoteFill style={{ width: '85%', background: '#1E293B' }} /></NoteBar>
            </NoteRow>
            <NoteRow style={{ marginBottom: 0 }}>
              <NoteLabel><NoteName>BASE NOTE</NoteName><NoteIngredients>시그니처 머스크 · 시더우드 (95%)</NoteIngredients></NoteLabel>
              <NoteBar><NoteFill style={{ width: '95%', background: '#0A1128' }} /></NoteBar>
            </NoteRow>
          </ScentNoteContainer>

          {/* REVIEW SECTION */}
          <ReviewSection>
            <ReviewTitle>고객 리뷰 ({product.reviewCount.toLocaleString()})</ReviewTitle>
            <ReviewSummary>
              <div>
                <ReviewBigNum>{product.rating}</ReviewBigNum>
                <ReviewBigStars>★ ★ ★ ★ ★</ReviewBigStars>
                <ReviewTotal>구매 고객 평균 만족도</ReviewTotal>
              </div>
              <ReviewBars>
                <ReviewBarRow><ReviewBarLabel>5★</ReviewBarLabel><ReviewBarTrack><ReviewBarFill style={{ width: '92%' }} /></ReviewBarTrack></ReviewBarRow>
                <ReviewBarRow><ReviewBarLabel>4★</ReviewBarLabel><ReviewBarTrack><ReviewBarFill style={{ width: '6%' }} /></ReviewBarTrack></ReviewBarRow>
                <ReviewBarRow><ReviewBarLabel>3★</ReviewBarLabel><ReviewBarTrack><ReviewBarFill style={{ width: '2%' }} /></ReviewBarTrack></ReviewBarRow>
                <ReviewBarRow><ReviewBarLabel>2★</ReviewBarLabel><ReviewBarTrack><ReviewBarFill style={{ width: '0%' }} /></ReviewBarTrack></ReviewBarRow>
                <ReviewBarRow><ReviewBarLabel>1★</ReviewBarLabel><ReviewBarTrack><ReviewBarFill style={{ width: '0%' }} /></ReviewBarTrack></ReviewBarRow>
              </ReviewBars>
            </ReviewSummary>
            {/* 리뷰 리스트 */}
            <ReviewCard>
              <ReviewTop>
                <ReviewerAvatar>김</ReviewerAvatar>
                <div>
                  <ReviewerName>김지현</ReviewerName>
                  <ReviewerDate>★★★★★ · 2026.05.20</ReviewerDate>
                </div>
              </ReviewTop>
              <ReviewText>정말 독보적인 코튼 향이에요. 처음엔 은은하게 비누 향이 나다가 갈수록 체취랑 섞여서 매력적인 잔향이 납니다. 지속력도 굉장히 깁니다.</ReviewText>
            </ReviewCard>

            {/* Santal 33 리뷰이고, 슈퍼어드민에 의해 블라인드 처리된 경우는 미노출 */}
            {!(product.id === 'p1' && isSantal33Blinded) && (
              <ReviewCard>
                <ReviewTop>
                  <ReviewerAvatar style={{ background: '#0F172A' }}>박</ReviewerAvatar>
                  <div>
                    <ReviewerName>박민준</ReviewerName>
                    <ReviewerDate>★★★★★ · 2026.05.18</ReviewerDate>
                  </div>
                </ReviewTop>
                <ReviewText>포맨트 시그니처 향이라 믿고 샀는데 기대 이상입니다. 주변 반응도 엄청 좋고 아늑하고 따뜻한 느낌을 줘서 너무 만족스럽네요.</ReviewText>
              </ReviewCard>
            )}
          </ReviewSection>
        </div>
      </DetailLayout>

      {/* STICKY BOTTOM BAR */}
      <StickyBar className={showSticky ? 'show' : ''}>
        <StickyInfo>
          <StickyName>{product.name} · {selectedOption}</StickyName>
          <StickyPrice>₩{formatPrice(price * qty)}</StickyPrice>
        </StickyInfo>
        <BtnCart onClick={handleAddToCart}>장바구니</BtnCart>
        <BtnBuy onClick={handleBuyNow}>바로 구매</BtnBuy>
      </StickyBar>
    </PageContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const PageContainer = styled.div`
  width: 100%;
  padding-bottom: 100px;
`;

const DetailLayout = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 24px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 16px;
  }
`;

const DetailGallery = styled.div`
  position: sticky;
  top: 100px;

  @media (max-width: 900px) {
    position: static;
  }
`;

const DetailMainImg = styled.div`
  background: ${props => props.theme.colors.linenWarm};
  border: 2px solid #000000;
  border-radius: 0px;
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const BigEmoji = styled.div`
  font-size: 100px;
`;

const DetailThumbs = styled.div`
  display: flex;
  gap: 12px;
`;

const DetailThumb = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.theme.colors.white};
  border: 2px solid #000000;
  border-radius: 0px;
  cursor: pointer;
  transition: ${props => props.theme.transition};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;

  &.active {
    border-color: ${props => props.theme.colors.navy};
    border-width: 3px;
  }
`;

const DetailBrand = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: ${props => props.theme.colors.gray400};
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const DetailName = styled.h2`
  font-family: ${props => props.theme.fonts.display};
  font-size: 38px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.navy};
  letter-spacing: -0.02em;
`;

const DetailSub = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.gray600};
  margin-bottom: 24px;
`;

const DetailRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
  padding-bottom: 16px;
`;

const StarsLg = styled.span`
  color: ${props => props.theme.colors.navy};
  font-size: 14px;
`;

const RatingScore = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.navy};
`;

const ReviewCount = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.gray400};
`;

const DetailPrice = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 32px;
  color: ${props => props.theme.colors.navy};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DetailPriceOrig = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.colors.gray400};
  text-decoration: line-through;
`;

const DetailPriceTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  background: ${props => props.theme.colors.amberPale};
  color: ${props => props.theme.colors.amber};
  padding: 3px 8px;
  border-radius: 0px;
`;

const OptionLabel = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: ${props => props.theme.colors.navy};
  margin-bottom: 12px;
  text-transform: uppercase;
`;

const OptionChips = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const OptChip = styled.div`
  padding: 12px 24px;
  border: 2px solid #000000;
  border-radius: 0px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: ${props => props.theme.transition};
  color: ${props => props.theme.colors.navy};

  &:hover {
    background: #000000;
    color: #FFFFFF;
  }

  &.active {
    background: #000000;
    color: #FFFFFF;
  }
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
`;

const QtyBtn = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #000000;
  border-radius: 0px;
  background: ${props => props.theme.colors.white};
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${props => props.theme.transition};
  color: ${props => props.theme.colors.navy};
  font-weight: 800;

  &:hover {
    background: #000000;
    color: #FFFFFF;
  }
`;

const QtyNum = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 16px;
  font-weight: 700;
  min-width: 32px;
  text-align: center;
  color: ${props => props.theme.colors.navy};
`;

const StockText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #10B981;
  margin-left: 8px;
`;

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 40px;
`;

const BtnCartLarge = styled.button`
  padding: 18px;
  border: 2px solid #000000;
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.navy};
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: ${props => props.theme.transition};
  border-radius: 0px;
  text-transform: uppercase;

  &:hover {
    background: ${props => props.theme.colors.navy};
    color: ${props => props.theme.colors.white};
  }
`;

const BtnBuyLarge = styled.button`
  padding: 18px;
  background: #000000;
  border: 2px solid #000000;
  color: #FFFFFF;
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: ${props => props.theme.transition};
  border-radius: 0px;
  text-transform: uppercase;

  &:hover {
    background: #FFFFFF;
    color: #000000;
  }
`;

const ScentNoteContainer = styled.div`
  background: ${props => props.theme.colors.linen};
  border: 2px solid #000000;
  border-radius: 0px;
  padding: 24px;
  margin-bottom: 40px;
`;

const ScentNoteTitle = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: ${props => props.theme.colors.navy};
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const NoteRow = styled.div`
  margin-bottom: 16px;
`;

const NoteLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const NoteName = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.colors.navy};
`;

const NoteIngredients = styled.span`
  font-size: 11px;
  color: ${props => props.theme.colors.gray600};
`;

const NoteBar = styled.div`
  height: 6px;
  background: #EAEAEA;
  border: 2px solid #000000;
  border-radius: 0px;
  overflow: hidden;
`;

const NoteFill = styled.div`
  height: 100%;
  border-radius: 0px;
`;

const ReviewSection = styled.div`
  border-top: 2px solid #000000;
  padding-top: 40px;
`;

const ReviewTitle = styled.h3`
  font-family: ${props => props.theme.fonts.display};
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.navy};
`;

const ReviewSummary = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const ReviewBigNum = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 56px;
  font-weight: 800;
  color: ${props => props.theme.colors.navy};
  line-height: 1;
  margin-bottom: 4px;
`;

const ReviewBigStars = styled.div`
  color: #000000;
  font-size: 14px;
  margin-bottom: 6px;
`;

const ReviewTotal = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.gray400};
`;

const ReviewBars = styled.div`
  flex: 1;
  min-width: 180px;
`;

const ReviewBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const ReviewBarLabel = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.colors.navy};
  min-width: 24px;
`;

const ReviewBarTrack = styled.div`
  flex: 1;
  height: 6px;
  background: #EAEAEA;
  border: 2px solid #000000;
  border-radius: 0px;
  overflow: hidden;
`;

const ReviewBarFill = styled.div`
  height: 100%;
  background: #000000;
  border-radius: 0px;
`;

const PhotoReviews = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 32px;
`;

const PhotoSlot = styled.div`
  aspect-ratio: 1;
  background: ${props => props.theme.colors.linenWarm};
  border: 2px solid #000000;
  border-radius: 0px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: ${props => props.theme.transition};

  &:hover {
    background: #000000;
    color: #FFFFFF;
  }
`;

const ReviewCard = styled.div`
  border: 2px solid #000000;
  border-radius: 0px;
  padding: 24px;
  margin-bottom: 12px;
`;

const ReviewTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const ReviewerAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 0px;
  background: ${props => props.theme.colors.navy};
  color: ${props => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
`;

const ReviewerName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme.colors.navy};
`;

const ReviewerDate = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.gray400};
  margin-top: 2px;
`;

const ReviewText = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.gray800};
  line-height: 1.7;
`;

const StickyBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.white};
  border-top: 2.5px solid #000000;
  padding: 16px 24px;
  display: flex;
  gap: 12px;
  align-items: center;
  z-index: 90;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.show {
    transform: translateY(0);
  }
`;

const StickyInfo = styled.div`
  flex: 1;
`;

const StickyName = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${props => props.theme.colors.navy};
`;

const StickyPrice = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  color: #000000;
  font-weight: 800;
  margin-top: 2px;
`;

const BtnCart = styled.button`
  flex: 1;
  padding: 14px;
  border: 2px solid #000000;
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.navy};
  border-radius: 0px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: ${props => props.theme.transition};
  text-transform: uppercase;

  &:hover {
    background: ${props => props.theme.colors.navy};
    color: ${props => props.theme.colors.white};
  }
`;

const BtnBuy = styled.button`
  flex: 2;
  padding: 14px;
  background: #000000;
  color: #FFFFFF;
  border: 2px solid #000000;
  border-radius: 0px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: ${props => props.theme.transition};
  text-transform: uppercase;

  &:hover {
    background: #FFFFFF;
    color: #000000;
  }
`;

const BottleImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BottleImgSide = styled.img`
  width: 70%;
  height: 70%;
  object-fit: contain;
  transform: rotateY(55deg) scale(0.95);
  filter: drop-shadow(10px 10px 10px rgba(0,0,0,0.15));
  transition: all 0.3s ease;
`;

const NozzleImg = styled.img`
  width: 60%;
  height: 60%;
  object-fit: contain;
  mix-blend-mode: multiply;
  filter: contrast(1.2);
`;

const ThumbPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
`;

const ThumbPreviewSide = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
  transform: rotateY(45deg);
`;
