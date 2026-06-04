import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const collageImages = [
  'img/r1.jpg',
  'img/r2.jpg',
  'img/r5.jpg',
  'img/r6.jpg',
  'img/r7.jpg',
  'img/r8.jpg',
  'img/r9.jpg',
  'img/r10.jpg',
  'img/r11.jpg'
];

const wImages = [
  // Black/Dark ones first (so they appear on the left)
  'img/w10.jpg',
  'img/w11.jpg',
  'img/w12.jpg',
  'img/w13.jpg',
  'img/w14.jpg',
  'img/w15.jpg',
  'img/w16.jpg',
  // Yellow/Bright ones last (so they appear on the right)
  'img/w1.jpg',
  'img/w2.jpg',
  'img/w3.jpg',
  'img/w4.png',
  'img/w5.jpg',
  'img/w6.jpg',
  'img/w7.png',
  'img/w8.jpg'
];

const yImages = [
  'img/y1.jpg',
  'img/y2.jpg',
  'img/y3.jpg',
  'img/y4.jpg',
  'img/y5.jpg',
  'img/y6.jpg',
  'img/y7.jpg',
  'img/y8.jpg',
  'img/y9.jpg',
  'img/y10.jpg',
  'img/y11.jpg',
  'img/y12.jpg'
];

const gImages = [
  'img/g2.jpg',
  'img/g3.jpg',
  'img/g4.jpg',
  'img/g5.jpg',
  'img/g6.jpg',
  'img/g7.jpg',
  'img/g8.jpg',
  'img/g9.jpg',
  'img/g10.jpg',
  'img/g12.jpg',
  'img/g13.jpg',
  'img/g14.jpg'
];
const products = [
  {
    id: 'z1',
    name: 'Delulu',
    desc: 'Extrait de parfum',
    price: 'HKD 1720',
    img: 'img/z1.png',
    collage: collageImages,
    path: '/detail/p23'
  },
  {
    id: 'z2',
    name: 'Naked\nDance',
    desc: 'Extrait de parfum',
    price: 'HKD 1720',
    img: 'img/z2.png',
    collage: yImages,
    path: '/detail/p24'
  },
  {
    id: 'z3',
    name: 'Dead Air',
    desc: 'Extrait de parfum',
    price: 'HKD 1725',
    img: 'img/z3.png',
    collage: wImages,
    path: '/detail/p25'
  },
  {
    id: 'z4',
    name: 'Phantom',
    desc: 'Extrait de parfum',
    price: 'HKD 1850',
    img: 'img/z4.png',
    collage: gImages,
    path: '/detail/p26'
  }
];

const DynamicProductCell: React.FC<{ p: any; onClick: () => void }> = ({ p, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [collageTransforms, setCollageTransforms] = useState<any[]>([]);

  // For the z1, z2, z3, z4 perfumes, use the exact images without duplicating.
  // For other perfumes, double the images to maintain a dense wall.
  const activeCollage = (p.id === 'z1' || p.id === 'z2' || p.id === 'z3' || p.id === 'z4') ? p.collage : [...p.collage, ...p.collage]; 

  const handleMouseEnter = () => {
    const transforms = activeCollage.map((_, i) => {
      // Clump them near the center, preventing them from flying out too far
      const maxTx = window.innerWidth * 0.25; // -25vw to 25vw
      const maxTy = window.innerHeight * 0.25; // -25vh to 25vh
      
      // Distribute from left to right based on array index (so color sorting works!)
      const baseTx = -maxTx + (i / Math.max(1, activeCollage.length - 1)) * 2 * maxTx;
      const tx = baseTx + (Math.random() - 0.5) * (maxTx * 0.5); // Add organic jitter
      
      const ty = (Math.random() - 0.5) * 2 * maxTy;
      
      // Slight random scale for texture
      const scale = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
      
      // FORCED FRONT: Make almost all images cover the bottle completely
      // Bottle is zIndex 10. We put all these at 20+.
      const zIndex = 20 + i;
      
      return { tx, ty, scale, zIndex };
    });
    
    setCollageTransforms(transforms);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <ProductCell 
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CollageWrapper>
        {activeCollage.map((src: string, i: number) => {
          const t = collageTransforms[i] || { tx: '0vw', ty: '0vh', scale: 0.5, zIndex: 20 };
          return (
            <CollageImg 
              key={i}
              src={src}
              alt={`Collage ${i}`}
              $isHovered={isHovered}
              $idx={i}
              style={{
                '--tx': typeof t.tx === 'number' ? `${t.tx}px` : t.tx,
                '--ty': typeof t.ty === 'number' ? `${t.ty}px` : t.ty,
                '--rot': `0deg`,
                '--scale': t.scale,
                zIndex: t.zIndex
              } as React.CSSProperties}
            />
          );
        })}
      </CollageWrapper>
      <BottleImg src={p.img} alt={p.name} />
    </ProductCell>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      {products.map((p) => (
        <ProductRow key={p.id}>
          <LeftCol>
            <ProductName>{p.name}</ProductName>
            <ProductDesc>{p.desc}</ProductDesc>
          </LeftCol>

          <CenterCol>
            <DynamicProductCell p={p} onClick={() => navigate(p.path)} />
          </CenterCol>

          <RightCol>
            <Price>{p.price}</Price>
            <AddToCart onClick={(e) => { e.stopPropagation(); navigate(p.path); }}>Add to cart</AddToCart>
          </RightCol>

          <FooterLeft>
            Contact &nbsp;&nbsp;&nbsp; Customer care &nbsp;&nbsp;&nbsp; Subscribe for updates<br/>
            © MODO
          </FooterLeft>
          
          <FooterRight>
            Hong Kong
          </FooterRight>
        </ProductRow>
      ))}
    </Container>
  );
};

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════════════════════ */

const Container = styled.div`
  background-color: #FFFFFF;
  width: 100%;
  min-height: 100vh;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  color: #000;
  overflow-x: hidden;
`;

const ProductRow = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 45vw 1fr;
  align-items: center;
  margin-bottom: 20vh;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    padding: 20px 0;
    margin-bottom: 15vh;
  }
`;

const LeftCol = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 20px;
  }
`;

const RightCol = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 20px;
  }
`;

const CenterCol = styled.div`
  position: relative;
  width: 100%;
  height: 100vh; 
  background-color: #F1F1F1; 
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    height: 60vh;
  }
`;

const ProductName = styled.h2`
  font-size: 28px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0;
  white-space: pre-wrap;
`;

const ProductDesc = styled.span`
  font-size: 11px;
  color: #000;
`;

const Price = styled.div`
  font-size: 11px;
  color: #000;
`;

const AddToCart = styled.button`
  background: transparent;
  border: none;
  border-bottom: 1px solid #000;
  padding: 0 0 2px 0;
  font-size: 11px;
  color: #000;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.5;
  }
`;

const FooterLeft = styled.div`
  position: absolute;
  left: 40px;
  bottom: 24px;
  font-size: 10px;
  line-height: 1.6;
  color: #000;
  z-index: 10;

  @media (max-width: 900px) {
    display: none; 
  }
`;

const FooterRight = styled.div`
  position: absolute;
  right: 40px;
  bottom: 24px;
  font-size: 10px;
  color: #000;
  z-index: 10;

  @media (max-width: 900px) {
    display: none;
  }
`;

const CollageWrapper = styled.div`
  position: absolute;
  /* Make sure the wrapper doesn't crop the images that fly far away */
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999; /* Forces collage to render completely on top of all other rows and elements */
`;

const BottleImg = styled.img`
  position: relative;
  width: 90%; /* Make bottle massive, matching the second screenshot */
  height: auto;
  max-height: 85vh;
  object-fit: contain;
  z-index: 10; /* Bottle is z-index 10. Front collages will be 20+ */
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const ProductCell = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover ${BottleImg} {
    transform: scale(1.04);
  }
`;

const CollageImg = styled.img<{ $isHovered: boolean; $idx: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  /* Reduced image sizes for a more subtle and elegant layout */
  width: clamp(150px, 14vw, 350px); 
  height: auto;
  object-fit: cover;
  opacity: 0;
  visibility: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  
  transform: translate(-50%, -50%) scale(0.6) rotate(0deg);
  
  transition: opacity 0.8s ease, visibility 0.8s, transform 0.8s ease;

  ${p => p.$isHovered && css`
    opacity: 1;
    visibility: visible;
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(var(--scale)) rotate(var(--rot));
    
    transition: 
      opacity 1.2s ease calc(${p.$idx} * 0.2s),
      visibility 0s linear calc(${p.$idx} * 0.2s),
      transform 2.2s cubic-bezier(0.165, 0.84, 0.44, 1) calc(${p.$idx} * 0.2s);
  `}

  @media (max-width: 900px) {
    width: 200px;
  }
`;
