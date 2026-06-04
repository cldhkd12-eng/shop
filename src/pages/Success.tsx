import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createOrder, clearCart } = useShop();
  
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  const [orderInfo, setOrderInfo] = useState<{
    recipient: string;
    phone: string;
    address: string;
    productName: string;
    price: number;
  } | null>(null);

  useEffect(() => {
    // Read pending order details from localStorage
    const pendingData = localStorage.getItem('pending_order');
    if (pendingData) {
      try {
        const parsed = JSON.parse(pendingData);
        setOrderInfo(parsed);

        // Commit order to ShopContext orders database
        const newOrder = {
          orderNo: orderId || `SA-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          productName: parsed.productName,
          customerName: parsed.recipient,
          price: Number(amount) || parsed.price,
          status: 'new' as const,
          statusLabel: '신규주문',
          date: new Date().toISOString().split('T')[0],
        };
        createOrder(newOrder);

        // Clear cart and pending order info
        clearCart();
        localStorage.removeItem('pending_order');
      } catch (err) {
        console.error('Error parsing pending order:', err);
      }
    }
  }, [orderId, amount, createOrder, clearCart]);

  return (
    <PageContainer className="fade-in">
      <SuccessCard>
        <CheckIcon>🎉</CheckIcon>
        <Heading>결제가 완료되었습니다</Heading>
        <SubHeading>MODO를 이용해 주셔서 대단히 감사합니다.</SubHeading>

        <ReceiptTable>
          <tbody>
            <tr>
              <td className="label">주문번호</td>
              <td className="val highlight">{orderId}</td>
            </tr>
            {orderInfo && (
              <>
                <tr>
                  <td className="label">상품명</td>
                  <td className="val">{orderInfo.productName}</td>
                </tr>
                <tr>
                  <td className="label">수령인</td>
                  <td className="val">{orderInfo.recipient}</td>
                </tr>
                <tr>
                  <td className="label">배송지</td>
                  <td className="val">{orderInfo.address}</td>
                </tr>
              </>
            )}
            <tr>
              <td className="label">결제금액</td>
              <td className="val price">₩{Number(amount).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="label">결제승인키</td>
              <td className="val key-text">{paymentKey}</td>
            </tr>
          </tbody>
        </ReceiptTable>

        <ActionGroup>
          <HomeBtn onClick={() => navigate('/')}>쇼핑 계속하기</HomeBtn>
          <SupportBtn onClick={() => navigate('/support')}>고객센터 문의</SupportBtn>
        </ActionGroup>
      </SuccessCard>
    </PageContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const PageContainer = styled.div`
  width: 100%;
  min-height: 80vh;
  background: #FAF8F5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
`;

const SuccessCard = styled.div`
  max-width: 600px;
  width: 100%;
  background: #FFFFFF;
  border: 2px solid #000000;
  padding: 50px 40px;
  text-align: center;

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const CheckIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const Heading = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: 28px;
  font-weight: 800;
  color: #000000;
  margin-bottom: 12px;
`;

const SubHeading = styled.p`
  font-size: 14px;
  color: #666666;
  margin-bottom: 40px;
`;

const ReceiptTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
  border-top: 2.5px solid #000000;
  border-bottom: 2.5px solid #000000;

  td {
    padding: 16px 12px;
    font-size: 13px;
    border-bottom: 1px solid #EAEAEA;
    text-align: left;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .label {
    font-weight: 700;
    color: #666666;
    width: 120px;
  }

  .val {
    font-weight: 500;
    color: #000000;
    word-break: break-all;
  }

  .val.highlight {
    font-family: monospace;
    font-weight: 800;
  }

  .val.price {
    font-family: ${props => props.theme.fonts.display};
    font-weight: 900;
    font-size: 18px;
  }

  .val.key-text {
    font-family: monospace;
    font-size: 11px;
    color: #888888;
  }
`;

const ActionGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const HomeBtn = styled.button`
  padding: 16px;
  background: #000000;
  color: #FFFFFF;
  border: 2px solid #000000;
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #FFFFFF;
    color: #000000;
  }
`;

const SupportBtn = styled.button`
  padding: 16px;
  background: transparent;
  color: #000000;
  border: 2px solid #000000;
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #000000;
    color: #FFFFFF;
  }
`;
