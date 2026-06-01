import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../mockData';
import { BottleSvg } from './BottleSvg';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [isFav, setIsFav] = React.useState(false);

  const formatPrice = (value: number) => {
    return value.toLocaleString();
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
  };

  const discountRate = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card onClick={() => navigate(`/detail/${product.id}`)}>
      <ImgArea>
        <ImgInner className="product-img-inner">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <BottleSvg type={product.imageType} width={90} height={150} />
          )}
        </ImgInner>
        {product.badge && <Badge>{product.badge}</Badge>}
        <FavBtn onClick={handleFavClick} isFav={isFav}>
          {isFav ? '✦' : '✧'}
        </FavBtn>
      </ImgArea>
      <InfoArea>
        <CategoryLabel>{product.categoryName}</CategoryLabel>
        <Name>{product.name}</Name>
        <ScentNotes>{product.scent}</ScentNotes>
        <Bottom>
          <Price>
            {discountRate > 0 && <Discount>{discountRate}% OFF</Discount>}
            ₩{formatPrice(product.price)}
            {product.originalPrice && <Original>₩{formatPrice(product.originalPrice)}</Original>}
          </Price>
        </Bottom>
      </InfoArea>
    </Card>
  );
};

/* ─── STYLED COMPONENTS ─── */
const Card = styled.div`
  background: #FFFFFF;
  border: 2px solid #000000;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    .product-img-inner {
      transform: scale(1.02);
    }
  }
`;

const ImgArea = styled.div`
  background: #F7F7F7;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  border-bottom: 2px solid #000000;
`;

const ImgInner = styled.div`
  transition: transform 0.3s ease;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 4px 8px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #FFFFFF;
  background: #000000;
  border: 1px solid #FFFFFF;
`;

const FavBtn = styled.span<{ isFav: boolean }>`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: 1px solid #000000;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #000000;
  transition: all 0.15s ease;

  &:hover {
    background: #000000;
    color: #FFFFFF;
  }
`;

const InfoArea = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CategoryLabel = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #666666;
  margin-bottom: 6px;
  text-transform: uppercase;
`;

const Name = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.01em;
  color: #000000;
  margin-bottom: 8px;
  line-height: 1.2;
`;

const ScentNotes = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #444444;
  margin-bottom: 20px;
  line-height: 1.4;
`;

const Bottom = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #E1E1E1;
`;

const Price = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  font-weight: 900;
  color: #000000;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.05em;
`;

const Discount = styled.span`
  color: #FF0000;
  font-weight: 900;
`;

const Original = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #888888;
  text-decoration: line-through;
`;
