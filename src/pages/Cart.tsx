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
                  <VendorNameTag>MODO OFFICIAL STORE</VendorNameTag>
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

const PageContainer = styled.div`
  width: 100%;
  min-height: 80vh;
  padding-bottom: 80px;
  background: #0a0a0f;
  color: #f0ede8;
`;

const PageHeader = styled.div`
  background: #0d0d14;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 40px 24px 0;
`;

const PageHeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const PageBreadcrumb = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 10px;
  letter-spacing: 0.15em;

  span {
    color: #c8a97e;
  }
`;

const PageH1 = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 300;
  letter-spacing: -0.02em;
  margin-bottom: 30px;
  color: #f0ede8;
`;

const EmptyCart = styled.div`
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
  padding: 60px 40px;
  background: #0d0d14;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 24px;
`;

const EmptyText = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 30px;
`;

const ShopBtn = styled.button`
  padding: 16px 36px;
  background: #c8a97e;
  color: #0a0a0f;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #dcb88f;
    transform: translateY(-2px);
  }
`;

const CartLayout = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 60px 24px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 48px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 16px;
  }
`;

const VendorGroup = styled.div`
  background: #0d0d14;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const VendorHead = styled.div`
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const VendorNameTag = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #c8a97e;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const VendorShip = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 4px;
`;

const CartItem = styled.div`
  padding: 28px 24px;
  display: flex;
  gap: 24px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const CartItemImg = styled.div`
  width: 100px;
  height: 100px;
  background: #15151f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
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
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  margin-bottom: 6px;
`;

const CartItemName = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 300;
  margin-bottom: 6px;
  color: #f0ede8;
`;

const CartItemOpt = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
`;

const CartItemRight = styled.div`
  text-align: right;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
`;

const CartItemPrice = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #c8a97e;
`;

const CartQty = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
`;

const Cqb = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f0ede8;
  }
`;

const Cqn = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  min-width: 32px;
  text-align: center;
  color: #f0ede8;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
`;

const CartDel = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.3);
  font-size: 10px;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: color 0.2s;
  border-bottom: 1px solid transparent;

  &:hover {
    color: #ff5a5a;
    border-color: #ff5a5a;
  }
`;

const SummaryBox = styled.div`
  background: #0d0d14;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  position: sticky;
  top: 100px;
  overflow: hidden;

  @media (max-width: 900px) {
    position: static;
  }
`;

const SummaryHead = styled.div`
  background: #111118;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const SummaryHeadTitle = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #f0ede8;
`;

const SummaryBody = styled.div`
  padding: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 13px;

  .label {
    color: rgba(255, 255, 255, 0.5);
  }

  .val {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    color: #f0ede8;
  }

  .val.discount {
    color: #ff5a5a;
  }
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0 12px;
  margin-top: 12px;
`;

const TotalLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #f0ede8;
`;

const TotalVal = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 26px;
  font-weight: 300;
  color: #c8a97e;
`;

const TossBtn = styled.button`
  display: block;
  width: 100%;
  padding: 18px;
  background: #c8a97e;
  color: #0a0a0f;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 24px;
  text-align: center;

  &:hover {
    background: #dcb88f;
    transform: translateY(-2px);
  }
`;

const TossLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #0a0a0f;

  .toss-badge {
    font-weight: 800;
  }
`;

const DeliveryForm = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.01);
`;

const DeliveryTitle = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  color: #c8a97e;
  text-transform: uppercase;
`;

const FormField = styled.div`
  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    font-size: 13px;
    outline: none;
    background: #15151f;
    color: #f0ede8;
    transition: border-color 0.2s;

    &:focus {
      border-color: #c8a97e;
    }
  }
`;
