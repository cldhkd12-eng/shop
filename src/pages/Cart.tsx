import React, { useState } from 'react';
import styled from 'styled-components';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateCartQty,
    removeFromCart,
    showToast,
    clearCart,
    createOrder,
  } = useShop();

  const [recipient, setRecipient] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const groupedItems: { [brand: string]: typeof cartItems } = {};
  cartItems.forEach(item => {
    const brand = item.product.brand;
    if (!groupedItems[brand]) {
      groupedItems[brand] = [];
    }
    groupedItems[brand].push(item);
  });

  const getShippingFee = (_brand: string) => {
    return 0; // 모두 무료 배송 처리
  };

  let totalProductAmt = 0;
  let totalDiscountAmt = 0;
  let totalShippingFee = 0;

  Object.keys(groupedItems).forEach(brand => {
    let brandHasItems = false;
    groupedItems[brand].forEach(item => {
      brandHasItems = true;
      totalProductAmt += (item.product.originalPrice || item.product.price) * item.quantity;
      if (item.product.originalPrice) {
        totalDiscountAmt += (item.product.originalPrice - item.product.price) * item.quantity;
      }
    });
    if (brandHasItems) {
      totalShippingFee += getShippingFee(brand);
    }
  });

  const finalPaymentAmt = totalProductAmt - totalDiscountAmt + totalShippingFee;

  const handleQtyChange = (productId: string, option: string, change: number) => {
    updateCartQty(productId, option, change);
  };

  const handleRemove = (productId: string, option: string) => {
    removeFromCart(productId, option);
  };

  const handleTossPayment = async () => {
    if (cartItems.length === 0) {
      showToast('장바구니가 비어 있습니다.');
      return;
    }
    if (!recipient || !phone || !address) {
      showToast('배송지 정보를 모두 입력해 주세요.');
      return;
    }

    const orderId = `SA-${Date.now()}`;
    const summaryName =
      cartItems.length > 1
        ? `${cartItems[0].product.name} 외 ${cartItems.length - 1}건`
        : `${cartItems[0].product.name} · ${cartItems[0].option}`;

    // Store pending order details in localStorage for retrieval in success page
    localStorage.setItem(
      'pending_order',
      JSON.stringify({
        recipient,
        phone,
        address,
        productName: summaryName,
        price: finalPaymentAmt,
      })
    );

    try {
      showToast('토스페이 결제 모듈을 불러오는 중...');
      const tossPayments = await loadTossPayments('test_ck_AQ92ymxN349opkWE5LRjVajRKXvd');
      await tossPayments.requestPayment('카드', {
        amount: finalPaymentAmt,
        orderId: orderId,
        orderName: summaryName,
        customerName: recipient,
        successUrl: window.location.origin + '/success',
        failUrl: window.location.origin + '/fail',
      });
    } catch (err) {
      console.error('Toss Payments error:', err);
      showToast('결제 창을 여는 중 에러가 발생했습니다.');
    }
  };

  return (
    <PageContainer className="fade-in">
      <PageHeader>
        <PageHeaderInner>
          <PageBreadcrumb>SHOP &gt; <span>SHOPPING BAG</span></PageBreadcrumb>
          <PageH1>장바구니 ({cartItems.length})</PageH1>
        </PageHeaderInner>
      </PageHeader>

      {cartItems.length === 0 ? (
        <EmptyCart>
          <EmptyIcon>🛒</EmptyIcon>
          <EmptyText>장바구니에 담긴 상품이 없습니다.</EmptyText>
          <ShopBtn onClick={() => navigate('/')}>시그니처 향수 탐색하기</ShopBtn>
        </EmptyCart>
      ) : (
        <CartLayout>
          <div>
            {Object.keys(groupedItems).map(brand => (
              <VendorGroup key={brand}>
                <VendorHead>
                  <VendorNameTag>FORMENT OFFICIAL STORE</VendorNameTag>
                  <VendorShip>
                    무료배송
                  </VendorShip>
                </VendorHead>
                {groupedItems[brand].map(item => (
                  <CartItem key={`${item.product.id}-${item.option}`}>
                    <CartItemImg>
                      <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </CartItemImg>
                    <CartItemInfo>
                      <CartItemBrand>{item.product.brand}</CartItemBrand>
                      <CartItemName>{item.product.name}</CartItemName>
                      <CartItemOpt>{item.option} · EAU DE PARFUM</CartItemOpt>
                    </CartItemInfo>
                    <CartItemRight>
                      <CartItemPrice>₩{(item.product.price * item.quantity).toLocaleString()}</CartItemPrice>
                      <CartQty>
                        <Cqb onClick={() => handleQtyChange(item.product.id, item.option, -1)}>−</Cqb>
                        <Cqn>{item.quantity}</Cqn>
                        <Cqb onClick={() => handleQtyChange(item.product.id, item.option, 1)}>+</Cqb>
                      </CartQty>
                      <CartDel onClick={() => handleRemove(item.product.id, item.option)}>REMOVE</CartDel>
                    </CartItemRight>
                  </CartItem>
                ))}
              </VendorGroup>
            ))}
          </div>

          {/* SUMMARY BOX */}
          <SummaryBox>
            <SummaryHead>
              <SummaryHeadTitle>PAYMENT DETAILS</SummaryHeadTitle>
            </SummaryHead>
            <SummaryBody>
              <DeliveryForm>
                <DeliveryTitle>📦 SHIPPING INFORMATION</DeliveryTitle>
                <FormField>
                  <label>수령인</label>
                  <input
                    type="text"
                    placeholder="수령인 성함"
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                  />
                </FormField>
                <FormField>
                  <label>연락처</label>
                  <input
                    type="text"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </FormField>
                <FormField>
                  <label>배송지 주소</label>
                  <input
                    type="text"
                    placeholder="도로명 주소 및 상세 주소"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </FormField>
              </DeliveryForm>
              <SummaryRow>
                <span className="label">총 상품 금액</span>
                <span className="val">₩{totalProductAmt.toLocaleString()}</span>
              </SummaryRow>
              <SummaryRow>
                <span className="label">배송비</span>
                <span className="val">무료</span>
              </SummaryRow>
              <SummaryRow>
                <span className="label">할인 금액</span>
                <span className="val discount">−₩{totalDiscountAmt.toLocaleString()}</span>
              </SummaryRow>
              <SummaryTotal>
                <TotalLabel>최종 결제 금액</TotalLabel>
                <TotalVal>₩{finalPaymentAmt.toLocaleString()}</TotalVal>
              </SummaryTotal>
              <TossBtn onClick={handleTossPayment}>
                <TossLogo>
                  💙 <span className="toss-badge">toss</span> pay 결제하기
                </TossLogo>
              </TossBtn>
            </SummaryBody>
          </SummaryBox>
        </CartLayout>
      )}
    </PageContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const PageContainer = styled.div`
  width: 100%;
  min-height: 80vh;
  padding-bottom: 80px;
`;

const PageHeader = styled.div`
  background: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
  padding: 40px 24px 0;
`;

const PageHeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const PageBreadcrumb = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme.colors.gray400};
  margin-bottom: 10px;
  letter-spacing: 0.1em;

  span {
    color: ${props => props.theme.colors.navy};
  }
`;

const PageH1 = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 30px;
  color: ${props => props.theme.colors.navy};
`;

const EmptyCart = styled.div`
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
  padding: 60px 40px;
  background: ${props => props.theme.colors.white};
  border: 2px solid #000000;
  border-radius: 0px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 24px;
`;

const EmptyText = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: ${props => props.theme.colors.navy};
  margin-bottom: 30px;
`;

const ShopBtn = styled.button`
  padding: 16px 36px;
  background: #000000;
  color: #FFFFFF;
  border: 2px solid #000000;
  border-radius: 0px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: ${props => props.theme.transition};

  &:hover {
    background: #FFFFFF;
    color: #000000;
  }
`;

const CartLayout = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 60px 24px;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 48px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 16px;
  }
`;

const VendorGroup = styled.div`
  background: ${props => props.theme.colors.white};
  border: 2px solid #000000;
  border-radius: 0px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const VendorHead = styled.div`
  padding: 16px 24px;
  background: #FFFFFF;
  border-bottom: 2px solid #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const VendorNameTag = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 900;
  color: #000000;
  letter-spacing: 0.1em;
`;

const VendorShip = styled.span`
  font-size: 11px;
  font-weight: 900;
  color: #000000;
  letter-spacing: 0.05em;
`;

const CartItem = styled.div`
  padding: 24px;
  display: flex;
  gap: 20px;
  align-items: start;
  border-bottom: 1px solid ${props => props.theme.colors.gray100};

  &:last-child {
    border-bottom: none;
  }
`;

const CartItemImg = styled.div`
  width: 90px;
  height: 90px;
  background: ${props => props.theme.colors.linenWarm};
  border: 2px solid #000000;
  border-radius: 0px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const CartItemInfo = styled.div`
  flex: 1;
`;

const CartItemBrand = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: ${props => props.theme.colors.gray400};
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const CartItemName = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 4px;
  color: ${props => props.theme.colors.navy};
`;

const CartItemOpt = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.gray600};
`;

const CartItemRight = styled.div`
  text-align: right;
  min-width: 120px;
`;

const CartItemPrice = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.navy};
`;

const CartQty = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
`;

const Cqb = styled.button`
  width: 32px;
  height: 32px;
  border: 2px solid #000000;
  border-radius: 0px;
  background: ${props => props.theme.colors.white};
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.navy};
  transition: ${props => props.theme.transition};
  font-weight: 800;

  &:hover {
    background: #000000;
    color: #FFFFFF;
  }
`;

const Cqn = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 800;
  min-width: 24px;
  text-align: center;
  color: ${props => props.theme.colors.navy};
`;

const CartDel = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-weight: 800;
  color: ${props => props.theme.colors.gray400};
  font-size: 10px;
  letter-spacing: 0.05em;
  cursor: pointer;
  margin-top: 12px;
  display: inline-block;
  border-bottom: 1px solid transparent;
  transition: ${props => props.theme.transition};

  &:hover {
    color: #000000;
    border-color: #000000;
  }
`;

const SummaryBox = styled.div`
  background: ${props => props.theme.colors.white};
  border: 2px solid #000000;
  border-radius: 0px;
  position: sticky;
  top: 100px;
  overflow: hidden;

  @media (max-width: 900px) {
    position: static;
  }
`;

const SummaryHead = styled.div`
  background: #000000;
  padding: 20px 24px;
  color: #FFFFFF;
`;

const SummaryHeadTitle = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.1em;
`;

const SummaryBody = styled.div`
  padding: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 2px solid #EAEAEA;
  font-size: 13px;

  .label {
    color: ${props => props.theme.colors.gray600};
    font-weight: 600;
  }

  .val {
    font-family: ${props => props.theme.fonts.display};
    font-weight: 800;
    color: ${props => props.theme.colors.navy};
  }

  .val.discount {
    color: #FF0000;
  }
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-top: 2.5px solid #000000;
  margin-top: 12px;
`;

const TotalLabel = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: ${props => props.theme.colors.navy};
`;

const TotalVal = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 24px;
  font-weight: 900;
  color: ${props => props.theme.colors.navy};
`;

const TossBtn = styled.button`
  display: block;
  width: 100%;
  padding: 18px;
  background: #000000;
  color: #FFFFFF;
  border: 2px solid #000000;
  border-radius: 0px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: ${props => props.theme.transition};
  margin-top: 20px;
  text-align: center;

  &:hover {
    background: #FFFFFF;
    color: #000000;
  }
`;

const TossLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .toss-badge {
    color: #3182F6;
    font-weight: 950;
  }
`;

const DeliveryForm = styled.div`
  border: 2px solid #000000;
  border-radius: 0px;
  padding: 16px;
  margin-bottom: 20px;
  background: ${props => props.theme.colors.linen};
`;

const DeliveryTitle = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-bottom: 14px;
  color: ${props => props.theme.colors.navy};
  text-transform: uppercase;
`;

const FormField = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    font-size: 10px;
    font-weight: 800;
    color: ${props => props.theme.colors.gray600};
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input {
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #000000;
    border-radius: 0px;
    font-size: 13px;
    font-family: ${props => props.theme.fonts.body};
    outline: none;
    background: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.navy};
    transition: ${props => props.theme.transition};

    &:focus {
      background: #FFFFFF;
    }
  }
`;
