import React, { useState } from 'react';
import styled from 'styled-components';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

type SubTab = 'orders' | 'wishlist' | 'inquiries' | 'points';

export const MyPage: React.FC = () => {
  const { user, orders, logout, products } = useShop();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('orders');

  // Redirect if logged out
  React.useEffect(() => {
    if (!user.isLoggedIn) {
      navigate('/login');
    }
  }, [user.isLoggedIn, navigate]);

  // Orders for this customer
  const userOrders = orders.filter(
    order => order.customerName === user.name
  );

  // Mock wishlist (first 2 products for aesthetic purposes)
  const wishlistItems = products.slice(1, 3);

  // Mock points history logs
  const pointsLogs = [
    { date: '2026-05-28', desc: '회원가입 기념 웰컴 적립금', amount: 5000, type: 'plus' },
    { date: '2026-05-28', desc: '시그니처 향수 구매 적립 (5%)', amount: 10500, type: 'plus' },
    { date: '2026-05-28', desc: '배송 동의 보너스 포인트', amount: 2000, type: 'plus' },
    { date: '2026-05-28', desc: '상품 리뷰 작성 보너스', amount: 5000, type: 'plus' },
  ];

  // Mock inquiries logs
  const supportInquiries = [
    { date: '2026-05-27', title: '향수 보틀 패키지 선물용 추가 문의', status: '답변완료', answer: '안녕하세요, 센트아틀리에입니다. 시그니처 크래프트 리본 포장이 동봉되어 배송되었습니다. 감사합니다.' },
    { date: '2026-05-28', title: 'Debaser 향수 100ml 재입고 문의', status: '답변대기', answer: null },
  ];

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const getStepIndex = (status: string) => {
    if (status === 'new') return 0;
    if (status === 'prep') return 1;
    if (status === 'ship') return 2;
    return 3;
  };

  if (!user.isLoggedIn) return null;

  return (
    <PageContainer className="fade-in">
      <HeaderSection>
        <Title>마이페이지</Title>
        <Subtitle>센트아틀리에 멤버십 회원을 위한 대시보드입니다.</Subtitle>
      </HeaderSection>

      <MyPageLayout>
        {/* LEFT COLUMN: PROFILE CARD */}
        <LeftCol>
          <ProfileCard>
            <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
            <ProfileDetails>
              <ProfileName>{user.name} 님</ProfileName>
              <ProfileBadge>PLATINUM MEMBERSHIP</ProfileBadge>
            </ProfileDetails>

            {/* VIP TIER PROGRESS BAR */}
            <TierProgressBox>
              <TierLabelRow>
                <span>현재 등급: 플래티넘</span>
                <span>다음 등급: VIP</span>
              </TierLabelRow>
              <ProgressBarTrack>
                <ProgressBarFill style={{ width: '75%' }} />
              </ProgressBarTrack>
              <TierTip>다음 등급까지 ₩120,000 추가 구매 필요</TierTip>
            </TierProgressBox>

            <PointsGrid>
              <PointItem onClick={() => setActiveSubTab('points')} style={{ cursor: 'pointer' }}>
                <PointLabel>보유 적립금</PointLabel>
                <PointVal>₩22,500</PointVal>
              </PointItem>
              <PointItem style={{ borderLeft: '1px dashed #EAEAEA' }}>
                <PointLabel>보유 쿠폰</PointLabel>
                <PointVal>2 장</PointVal>
              </PointItem>
            </PointsGrid>

            <LogoutBtn onClick={handleLogoutClick}>로그아웃</LogoutBtn>
          </ProfileCard>
        </LeftCol>

        {/* RIGHT COLUMN: DETAILED TABS */}
        <RightCol>
          <TabMenu>
            <TabBtn className={activeSubTab === 'orders' ? 'active' : ''} onClick={() => setActiveSubTab('orders')}>
              주문 배송 조회 ({userOrders.length})
            </TabBtn>
            <TabBtn className={activeSubTab === 'wishlist' ? 'active' : ''} onClick={() => setActiveSubTab('wishlist')}>
              위시리스트 ({wishlistItems.length})
            </TabBtn>
            <TabBtn className={activeSubTab === 'inquiries' ? 'active' : ''} onClick={() => setActiveSubTab('inquiries')}>
              나의 1:1 문의 ({supportInquiries.length})
            </TabBtn>
            <TabBtn className={activeSubTab === 'points' ? 'active' : ''} onClick={() => setActiveSubTab('points')}>
              적립금 내역
            </TabBtn>
          </TabMenu>

          {/* TAB CONTENT 1: ORDERS WITH STEPPER */}
          {activeSubTab === 'orders' && (
            <TabContent>
              {userOrders.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>🛍</EmptyIcon>
                  <EmptyText>최근 주문 내역이 없습니다.</EmptyText>
                  <ShopBtn onClick={() => navigate('/')}>향수 쇼핑하러 가기</ShopBtn>
                </EmptyState>
              ) : (
                <OrderList>
                  {userOrders.map(order => {
                    const stepIdx = getStepIndex(order.status);
                    return (
                      <OrderCard key={order.id}>
                        <OrderCardHead>
                          <div>
                            <OrderDate>{order.date}</OrderDate>
                            <OrderNo>주문번호: {order.orderNo}</OrderNo>
                          </div>
                          <OrderStatusBadge status={order.status}>
                            {order.statusLabel}
                          </OrderStatusBadge>
                        </OrderCardHead>

                        <OrderCardBody>
                          <ItemDetails>
                            <ItemName onClick={() => navigate('/')}>{order.productName}</ItemName>
                            <ItemPrice>₩{order.price.toLocaleString()}</ItemPrice>
                          </ItemDetails>
                        </OrderCardBody>

                        {/* STEPPER DELIVERY MAP */}
                        <DeliveryStepper>
                          <StepLine />
                          <Step className={stepIdx >= 0 ? 'active' : ''}>
                            <StepDot />
                            <StepLabel>결제 완료</StepLabel>
                          </Step>
                          <Step className={stepIdx >= 1 ? 'active' : ''}>
                            <StepDot />
                            <StepLabel>배송 준비</StepLabel>
                          </Step>
                          <Step className={stepIdx >= 2 ? 'active' : ''}>
                            <StepDot />
                            <StepLabel>배송 중</StepLabel>
                          </Step>
                          <Step className={stepIdx >= 3 ? 'active' : ''}>
                            <StepDot />
                            <StepLabel>배송 완료</StepLabel>
                          </Step>
                        </DeliveryStepper>
                      </OrderCard>
                    );
                  })}
                </OrderList>
              )}
            </TabContent>
          )}

          {/* TAB CONTENT 2: WISHLIST */}
          {activeSubTab === 'wishlist' && (
            <TabContent>
              <WishlistGrid>
                {wishlistItems.map(item => (
                  <WishCard key={item.id} onClick={() => navigate(`/detail/${item.id}`)}>
                    <WishImgWrapper>
                      <WishImg src={item.imageUrl} alt={item.name} />
                    </WishImgWrapper>
                    <WishBrand>{item.brand}</WishBrand>
                    <WishName>{item.name}</WishName>
                    <WishPrice>₩{item.price.toLocaleString()}</WishPrice>
                    <WishActionBtn>상세보기</WishActionBtn>
                  </WishCard>
                ))}
              </WishlistGrid>
            </TabContent>
          )}

          {/* TAB CONTENT 3: SUPPORT INQUIRIES */}
          {activeSubTab === 'inquiries' && (
            <TabContent>
              <InquiryList>
                {supportInquiries.map((inq, idx) => (
                  <InquiryCard key={idx}>
                    <InquiryHeader>
                      <InquiryDate>{inq.date}</InquiryDate>
                      <InquiryStatus className={inq.status === '답변완료' ? 'done' : 'pending'}>
                        {inq.status}
                      </InquiryStatus>
                    </InquiryHeader>
                    <InquiryTitle>Q. {inq.title}</InquiryTitle>
                    {inq.answer ? (
                      <InquiryAnswer>
                        <strong>A. 센트아틀리에 답변:</strong> {inq.answer}
                      </InquiryAnswer>
                    ) : (
                      <InquiryAnswerPending>
                        문의가 접수되었습니다. 담당 조향사가 확인 후 영업일 기준 24시간 내에 답변해 드리겠습니다.
                      </InquiryAnswerPending>
                    )}
                  </InquiryCard>
                ))}
              </InquiryList>
            </TabContent>
          )}

          {/* TAB CONTENT 4: POINTS LOGS */}
          {activeSubTab === 'points' && (
            <TabContent>
              <PointsTable>
                <thead>
                  <tr>
                    <th>발생 일자</th>
                    <th>적립/사용 내역</th>
                    <th>포인트 금액</th>
                  </tr>
                </thead>
                <tbody>
                  {pointsLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.date}</td>
                      <td style={{ fontWeight: '700' }}>{log.desc}</td>
                      <td style={{ color: '#10B981', fontWeight: '800' }}>
                        +{log.amount.toLocaleString()} P
                      </td>
                    </tr>
                  ))}
                </tbody>
              </PointsTable>
            </TabContent>
          )}
        </RightCol>
      </MyPageLayout>
    </PageContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const PageContainer = styled.div`
  width: 100%;
  background: #FAF8F5;
  color: #000000;
  padding-bottom: 80px;
`;

const HeaderSection = styled.section`
  text-align: center;
  padding: 60px 24px;
  border-bottom: 2px solid #000000;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const MyPageLayout = styled.div`
  max-width: 1280px;
  margin: 60px auto 0;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 48px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0 20px;
  }
`;

const LeftCol = styled.div``;

const RightCol = styled.div``;

const ProfileCard = styled.div`
  background: #FFFFFF;
  border: 2px solid #000000;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border: 2px solid #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.fonts.display};
  font-size: 32px;
  font-weight: 900;
  background: #FAF8F5;
  margin-bottom: 20px;
`;

const ProfileDetails = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const ProfileName = styled.h2`
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 8px 0;
`;

const ProfileBadge = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 9px;
  font-weight: 900;
  color: #FFFFFF;
  background: #000000;
  padding: 4px 10px;
  letter-spacing: 0.08em;
`;

const TierProgressBox = styled.div`
  width: 100%;
  background: #FAF8F5;
  border: 1px solid #EAEAEA;
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 24px;
`;

const TierLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: #555555;
  margin-bottom: 8px;
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 6px;
  background: #E0DCD5;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: #000000;
  position: absolute;
  top: 0;
  left: 0;
`;

const TierTip = styled.div`
  font-size: 10px;
  color: #888888;
  margin-top: 8px;
  text-align: left;
  font-weight: 600;
`;

const PointsGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 16px 0;
  border-top: 1px dashed #CCCCCC;
  border-bottom: 1px dashed #CCCCCC;
  margin-bottom: 24px;
`;

const PointItem = styled.div`
  text-align: center;
`;

const PointLabel = styled.div`
  font-size: 11px;
  color: #666666;
  font-weight: 700;
  margin-bottom: 4px;
`;

const PointVal = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 15px;
  font-weight: 900;
`;

const LogoutBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #000000;
  border: 2px solid #000000;
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #000000;
    color: #FFFFFF;
  }
`;

const TabMenu = styled.div`
  display: flex;
  border-bottom: 2px solid #000000;
  margin-bottom: 30px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabBtn = styled.button`
  padding: 16px 24px;
  background: transparent;
  border: none;
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  color: #777777;
  position: relative;
  white-space: nowrap;

  &.active {
    color: #000000;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 4px;
      background: #000000;
    }
  }
`;

const TabContent = styled.div`
  width: 100%;
`;

const EmptyState = styled.div`
  background: #FFFFFF;
  border: 2px solid #000000;
  padding: 60px 40px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 14px;
  font-weight: 800;
  color: #666666;
  margin-bottom: 24px;
`;

const ShopBtn = styled.button`
  padding: 14px 28px;
  background: #000000;
  color: #FFFFFF;
  border: 2px solid #000000;
  font-family: ${props => props.theme.fonts.display};
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: transparent;
    color: #000000;
  }
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const OrderCard = styled.div`
  background: #FFFFFF;
  border: 2px solid #000000;
  padding: 24px;
`;

const OrderCardHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  border-bottom: 1.5px solid #000000;
  padding-bottom: 14px;
  margin-bottom: 20px;
`;

const OrderDate = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 12px;
  font-weight: 900;
  color: #888888;
  margin-bottom: 4px;
`;

const OrderNo = styled.div`
  font-family: monospace;
  font-size: 12px;
  font-weight: 700;
`;

const OrderStatusBadge = styled.span<{ status: string }>`
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  color: #FFFFFF;
  background: ${props => {
    if (props.status === 'new') return '#000000';
    if (props.status === 'prep') return '#000000';
    if (props.status === 'ship') return '#10B981';
    return '#64748B';
  }};
`;

const OrderCardBody = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const ItemDetails = styled.div`
  text-align: left;
`;

const ItemName = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 6px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ItemPrice = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 15px;
  font-weight: 800;
`;

const DeliveryStepper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 10px;
`;

const StepLine = styled.div`
  position: absolute;
  top: 5px;
  left: 20px;
  right: 20px;
  height: 3px;
  background: #EAEAEA;
  z-index: 1;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  flex: 1;
  text-align: center;

  &.active {
    div {
      background: #000000;
      border-color: #000000;
    }
    span {
      color: #000000;
      font-weight: 800;
    }
  }
`;

const StepDot = styled.div`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 3px solid #EAEAEA;
  box-sizing: border-box;
  margin-bottom: 10px;
`;

const StepLabel = styled.span`
  font-size: 11px;
  color: #888888;
  font-weight: 600;
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const WishCard = styled.div`
  background: #FFFFFF;
  border: 2px solid #000000;
  padding: 16px;
  cursor: pointer;
`;

const WishImgWrapper = styled.div`
  aspect-ratio: 1;
  background: #FAF8F5;
  border: 1.5px solid #000000;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const WishImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const WishBrand = styled.div`
  font-size: 10px;
  color: #888888;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 2px;
`;

const WishName = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 6px;
`;

const WishPrice = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 12px;
`;

const WishActionBtn = styled.button`
  width: 100%;
  padding: 10px;
  background: #000000;
  color: #FFFFFF;
  border: 2px solid #000000;
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: transparent;
    color: #000000;
  }
`;

const InquiryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InquiryCard = styled.div`
  background: #FFFFFF;
  border: 2px solid #000000;
  padding: 20px;
`;

const InquiryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const InquiryDate = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 800;
  color: #888888;
`;

const InquiryStatus = styled.span`
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  
  &.done {
    background: #ECFDF5;
    color: #065F46;
  }
  &.pending {
    background: #FFFBEB;
    color: #92400E;
  }
`;

const InquiryTitle = styled.h3`
  font-size: 14px;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: #000000;
`;

const InquiryAnswer = styled.div`
  background: #FAF8F5;
  border: 1px solid #EAEAEA;
  padding: 16px;
  font-size: 13px;
  line-height: 1.5;
  color: #333333;
`;

const InquiryAnswerPending = styled.div`
  background: #FFFDF9;
  border: 1px dashed #D69E2E;
  padding: 16px;
  font-size: 12px;
  color: #B7791F;
  line-height: 1.5;
`;

const PointsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #FFFFFF;
  border: 2px solid #000000;

  th {
    background: #FAF8F5;
    padding: 14px;
    font-size: 12px;
    font-weight: 800;
    border-bottom: 2px solid #000000;
    text-align: left;
  }

  td {
    padding: 16px 14px;
    font-size: 13px;
    border-bottom: 1px solid #EAEAEA;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;
