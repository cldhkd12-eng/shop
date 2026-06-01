import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import type { OrderItem } from '../mockData';

type PanelType = 'dashboard' | 'products' | 'tax' | 'customers';

export const VendorAdmin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab') as PanelType;

  const activePanel = tabParam || 'dashboard';

  const { orders, updateOrderStatus, addNewProduct, showToast } = useShop();

  const brand = 'FORMENT';
  const [name, setName] = useState('');
  const [scent, setScent] = useState('');
  const [category, setCategory] = useState('powdery');
  const [capacity, setCapacity] = useState('50ml');
  const [price, setPrice] = useState(39000);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(100);
  const [desc, setDesc] = useState('');

  const [customers, setCustomers] = useState([
    { id: 'C-2026-001', name: '김지현', email: 'cldhkd12@gmail.com', joinDate: '2026-01-10', totalAmt: 480000, status: '활동중' },
    { id: 'C-2026-002', name: '이민준', email: 'minjun.lee@gmail.com', joinDate: '2026-02-14', totalAmt: 320000, status: '활동중' },
    { id: 'C-2026-003', name: '박소연', email: 'soyeon.park@naver.com', joinDate: '2026-03-02', totalAmt: 224000, status: '활동중' },
    { id: 'C-2026-004', name: '최준혁', email: 'jun.choi@daum.net', joinDate: '2026-04-18', totalAmt: 198000, status: '정지됨' },
  ]);

  const toggleCustomerStatus = (id: string) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === id) {
          const newStatus = c.status === '활동중' ? '정지됨' : '활동중';
          showToast(`${c.name}님의 상태가 [${newStatus}]으로 변경되었습니다.`);
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const handleGivePoints = (customerName: string) => {
    showToast(`${customerName}님께 5,000포인트 적립금이 지급되었습니다. 💰`);
  };

  const newOrderCount = orders.filter(o => o.status === 'new').length;
  const prepOrderCount = orders.filter(o => o.status === 'prep').length;
  const doneOrderCount = orders.filter(o => o.status === 'done').length;

  const handleStatusUpdate = (order: OrderItem) => {
    if (order.status === 'new') {
      updateOrderStatus(order.id, 'prep', '배송준비');
    } else if (order.status === 'prep') {
      updateOrderStatus(order.id, 'ship', '배송중');
    } else if (order.status === 'ship') {
      updateOrderStatus(order.id, 'done', '완료');
    }
  };

  const getNextStatusLabel = (status: OrderItem['status']) => {
    if (status === 'new') return '배송준비';
    if (status === 'prep') return '배송중 처리';
    if (status === 'ship') return '배송완료';
    return '완료';
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !scent || !desc) {
      showToast('필수 정보를 모두 입력해 주세요.');
      return;
    }

    const categoryNames: { [key: string]: string } = {
      woody: '🌲 코튼 우디',
      floral: '🌸 코튼 로즈',
      citrus: '🍋 코튼 피치',
      aquatic: '🌊 코튼 아쿠아',
      oriental: '🍯 섹시 우디',
      powdery: '🫧 코튼 머스크',
      luxury: '🖤 럭셔리 우디',
    };

    addNewProduct({
      brand,
      name,
      scent,
      category,
      categoryName: categoryNames[category] || '🫧 코튼 머스크',
      price,
      originalPrice: originalPrice > 0 ? originalPrice : undefined,
      badge: originalPrice > price ? 'SALE' : undefined,
      imageType: 'generic',
      description: desc,
      capacity,
      stars: 5,
    });

    setName('');
    setScent('');
    setDesc('');
    setOriginalPrice(0);
    setActivePanel('dashboard');
  };

  return (
    <PageContainer className="fade-in">
      <AdminLayout>
        {/* SIDEBAR */}
        <AdminSidebar>
          <SidebarHead>
            <SidebarLogo>FORMENT PARTNER</SidebarLogo>
            <SidebarSub>공식 판매자 관리 센터</SidebarSub>
          </SidebarHead>
          <SidebarMenu>
            <SidebarItem
              className={activePanel === 'dashboard' ? 'active' : ''}
              onClick={() => navigate('/admin?tab=dashboard')}
            >
              📊 DASHBOARD
            </SidebarItem>
            <SidebarItem
              className={activePanel === 'products' ? 'active' : ''}
              onClick={() => navigate('/admin?tab=products')}
            >
              🍾 REGISTER PRODUCT
            </SidebarItem>
            <SidebarItem
              className={activePanel === 'tax' ? 'active' : ''}
              onClick={() => navigate('/admin?tab=tax')}
            >
              🧾 SETTLEMENT & TAX
            </SidebarItem>
            <SidebarItem
              className={activePanel === 'customers' ? 'active' : ''}
              onClick={() => navigate('/admin?tab=customers')}
            >
              👥 CUSTOMER MANAGEMENT
            </SidebarItem>
          </SidebarMenu>
        </AdminSidebar>

        {/* MAIN PANEL */}
        <AdminMain>
          {activePanel === 'dashboard' && (
            <div>
              <AdminCard>
                <AdminCardHead>
                  <AdminCardTitle>실시간 주요 관리 현황</AdminCardTitle>
                  <ActionBtn onClick={() => showToast('주문 현황이 동기화되었습니다')}>
                    새로고침
                  </ActionBtn>
                </AdminCardHead>
                <AdminCardBody>
                  <DataTable>
                    <thead>
                      <tr>
                        <th>주문번호</th>
                        <th>주문 상품명</th>
                        <th>고객명</th>
                        <th>결제금액</th>
                        <th>주문상태</th>
                        <th>작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.orderNo}</td>
                          <td>{order.productName}</td>
                          <td>{order.customerName}</td>
                          <td>₩{order.price.toLocaleString()}</td>
                          <td>
                            <StatusBadge status={order.status}>
                              {order.statusLabel}
                            </StatusBadge>
                          </td>
                          <td>
                            {order.status !== 'done' ? (
                              <ActionBtn onClick={() => handleStatusUpdate(order)}>
                                {getNextStatusLabel(order.status)}
                              </ActionBtn>
                            ) : (
                              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>정산 완료</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </DataTable>
                </AdminCardBody>
              </AdminCard>
            </div>
          )}

          {activePanel === 'products' && (
            <AdminCard>
              <AdminCardHead>
                <AdminCardTitle>신규 코튼 시그니처 향수 등록</AdminCardTitle>
              </AdminCardHead>
              <ProductForm onSubmit={handleProductSubmit}>
                <FormRow>
                  <FormGroup>
                    <label>브랜드명</label>
                    <input type="text" value={brand} readOnly />
                  </FormGroup>
                  <FormGroup>
                    <label>상품명 (필수)</label>
                    <input
                      type="text"
                      placeholder="예: Cotton Velvet"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <label>향 카테고리</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="powdery">코튼 머스크 (파우더리)</option>
                      <option value="floral">코튼 로즈 (플로럴)</option>
                      <option value="citrus">코튼 피치 (시트러스)</option>
                      <option value="aquatic">코튼 아쿠아 (아쿠아틱)</option>
                      <option value="oriental">섹시 우디 (오리엔탈)</option>
                      <option value="woody">코튼 우디 (우디)</option>
                      <option value="luxury">럭셔리 우디 (고급향)</option>
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <label>용량</label>
                    <select value={capacity} onChange={e => setCapacity(e.target.value)}>
                      <option value="30ml">30ml</option>
                      <option value="50ml">50ml</option>
                      <option value="100ml">100ml</option>
                    </select>
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <label>판매가격 (원)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={e => setPrice(Number(e.target.value))}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>권장 소비자 정상가 (할인율 적용 시 기입)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={e => setOriginalPrice(Number(e.target.value))}
                    />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <label>향 노트 정보 (예: 코튼 · 머스크 · 바닐라)</label>
                    <input
                      type="text"
                      placeholder="가운데 점(·)으로 구분"
                      value={scent}
                      onChange={e => setScent(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>최초 등록 재고 수량</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={e => setStock(Number(e.target.value))}
                    />
                  </FormGroup>
                </FormRow>
                <FormGroup style={{ marginBottom: '24px' }}>
                  <label>상품 상세 설명 (필수)</label>
                  <textarea
                    rows={4}
                    placeholder="향수가 가진 매력과 분위기를 섬세하게 기술해주세요."
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                  />
                </FormGroup>
                <BtnPrimary type="submit">새 상품 정식 등록</BtnPrimary>
              </ProductForm>
            </AdminCard>
          )}

          {activePanel === 'tax' && (
            <AdminCard>
              <AdminCardHead>
                <AdminCardTitle>정산 및 부가가치세 발행 내역</AdminCardTitle>
                <TaxBtn onClick={() => showToast('발행 요청이 파트너 관리국으로 신청되었습니다')}>발행 신청</TaxBtn>
              </AdminCardHead>
              <TaxTableWrapper>
                <TaxTableHeader>
                  <span>정산서 발행일</span>
                  <span>정산 대상 기간</span>
                  <span>정산 환급 총액</span>
                  <span>발행 상태</span>
                  <span>작업</span>
                </TaxTableHeader>
                <TaxRow>
                  <span>2026-05-01</span>
                  <span>4월 1일 ~ 4월 30일</span>
                  <span>₩12,400,000</span>
                  <span><span className="status-badge s-done" style={{ background: '#F1F5F9', color: '#475569', padding: '3px 10px', borderRadius: '0px', fontSize: '11px', fontWeight: '700' }}>발행완료</span></span>
                  <span><ActionBtn onClick={() => showToast('정산서 다운로드 진행')}>다운로드</ActionBtn></span>
                </TaxRow>
                <TaxRow>
                  <span>요청 처리중</span>
                  <span>5월 1일 ~ 5월 31일</span>
                  <span>₩18,200,000</span>
                  <span><span className="status-badge s-new" style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '3px 10px', borderRadius: '0px', fontSize: '11px', fontWeight: '700' }}>검토대기</span></span>
                  <span><span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>대기중</span></span>
                </TaxRow>
              </TaxTableWrapper>
            </AdminCard>
          )}

          {activePanel === 'customers' && (
            <AdminCard>
              <AdminCardHead>
                <AdminCardTitle>👥 입점사 등록 고객 관리</AdminCardTitle>
                <ActionBtn onClick={() => showToast('고객 데이터베이스 동기화 완료')}>전체 동기화</ActionBtn>
              </AdminCardHead>
              <AdminCardBody>
                <DataTable>
                  <thead>
                    <tr>
                      <th>회원번호</th>
                      <th>고객명</th>
                      <th>이메일 주소</th>
                      <th>가입일자</th>
                      <th>누적 구매금액</th>
                      <th>상태</th>
                      <th>관리 작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{c.id}</td>
                        <td style={{ fontWeight: '800' }}>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.joinDate}</td>
                        <td style={{ fontWeight: '700' }}>₩{c.totalAmt.toLocaleString()}</td>
                        <td>
                          <span
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              background: c.status === '활동중' ? '#ECFDF5' : '#FEF2F2',
                              color: c.status === '활동중' ? '#065F46' : '#991B1B',
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <ActionBtn onClick={() => toggleCustomerStatus(c.id)}>
                              {c.status === '활동중' ? '정지하기' : '활성화'}
                            </ActionBtn>
                            <ActionBtn onClick={() => handleGivePoints(c.name)}>
                              적립금 지급
                            </ActionBtn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              </AdminCardBody>
            </AdminCard>
          )}
        </AdminMain>
      </AdminLayout>
    </PageContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const PageContainer = styled.div`
  width: 100%;
  min-height: 80vh;
  background: ${props => props.theme.colors.linen};
`;

const AdminLayout = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 60px 24px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 40px 16px;
  }
`;

const AdminSidebar = styled.div`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray200};
  border-radius: 0px;
  overflow: hidden;
  height: fit-content;
  position: sticky;
  top: 100px;

  @media (max-width: 900px) {
    position: static;
  }
`;

const SidebarHead = styled.div`
  padding: 24px 20px;
  background: ${props => props.theme.colors.navyDark};
`;

const SidebarLogo = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 15px;
  font-weight: 800;
  color: ${props => props.theme.colors.white};
  letter-spacing: 0.1em;
`;

const SidebarSub = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 4px;
`;

const SidebarMenu = styled.div`
  padding: 16px 0;
`;

const SidebarItem = styled.div`
  padding: 12px 20px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: ${props => props.theme.transition};
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${props => props.theme.colors.gray600};

  &:hover {
    background: ${props => props.theme.colors.gray100};
    color: ${props => props.theme.colors.navy};
  }

  &.active {
    background: #FCE7EB;
    color: #000000;
    border-right: 3.5px solid #7C1A22;
  }
`;

const AdminMain = styled.div``;

const StatCards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray200};
  border-radius: 0px;
  padding: 24px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
  }

  &.s-blue::before {
    background: ${props => props.theme.colors.navy};
  }
  &.s-amber::before {
    background: ${props => props.theme.colors.amber};
  }
  &.s-green::before {
    background: #10B981;
  }
  &.s-red::before {
    background: #000000;
  }
`;

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme.colors.gray400};
  letter-spacing: 0.05em;
  margin-bottom: 8px;
`;

const StatNum = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 28px;
  font-weight: 800;
  color: ${props => props.theme.colors.navy};
`;

const StatChange = styled.div`
  font-size: 11px;
  margin-top: 6px;
  color: ${props => props.theme.colors.gray600};

  &.up {
    color: #10B981;
    font-weight: 700;
  }
`;

const AdminCard = styled.div`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray200};
  border-radius: 0px;
  margin-bottom: 28px;
  overflow: hidden;
`;

const AdminCardHead = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AdminCardTitle = styled.span`
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme.colors.navy};
  letter-spacing: 0.05em;
`;

const AdminCardBody = styled.div`
  padding: 0;
  overflow-x: auto;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;

  th {
    padding: 12px 24px;
    text-align: left;
    font-family: ${props => props.theme.fonts.display};
    font-size: 10px;
    color: ${props => props.theme.colors.gray400};
    letter-spacing: 0.08em;
    font-weight: 700;
    border-bottom: 1px solid ${props => props.theme.colors.gray200};
    background: ${props => props.theme.colors.linen};
  }

  td {
    padding: 16px 24px;
    font-size: 13px;
    border-bottom: 1px solid ${props => props.theme.colors.gray200};
    vertical-align: middle;
    color: ${props => props.theme.colors.navy};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: ${props => props.theme.colors.linenWarm};
  }
`;

const StatusBadge = styled.span<{ status: OrderItem['status'] }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 0px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme.colors.white};
  background: ${props => {
    if (props.status === 'new') return '#000000';
    if (props.status === 'prep') return '#000000';
    if (props.status === 'ship') return '#10B981';
    return '#64748B';
  }};
`;

const ActionBtn = styled.button`
  padding: 6px 14px;
  border-radius: 0px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 700;
  border: 1px solid ${props => props.theme.colors.gray200};
  background: ${props => props.theme.colors.white};
  cursor: pointer;
  transition: ${props => props.theme.transition};
  color: ${props => props.theme.colors.navy};

  &:hover {
    background: ${props => props.theme.colors.navy};
    color: ${props => props.theme.colors.white};
    border-color: ${props => props.theme.colors.navy};
  }
`;

const ProductForm = styled.form`
  padding: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    color: ${props => props.theme.colors.gray600};
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid ${props => props.theme.colors.gray200};
    border-radius: 0px;
    font-size: 13px;
    font-family: ${props => props.theme.fonts.body};
    outline: none;
    transition: ${props => props.theme.transition};
    background: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.navy};

    &:focus {
      border-color: ${props => props.theme.colors.navy};
    }
  }
`;

const BtnPrimary = styled.button`
  padding: 16px 36px;
  background: ${props => props.theme.colors.navy};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 0px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: ${props => props.theme.transition};

  &:hover {
    background: #000000;
  }
`;

const TaxTableWrapper = styled.div`
  padding: 0;
`;

const TaxTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1.2fr 1fr 100px;
  gap: 12px;
  padding: 14px 24px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme.colors.gray400};
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
  background: ${props => props.theme.colors.linen};
`;

const TaxRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1.2fr 1fr 100px;
  gap: 12px;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
  font-size: 13px;
  color: ${props => props.theme.colors.navy};

  &:last-child {
    border-bottom: none;
  }
`;

const TaxBtn = styled.button`
  padding: 8px 16px;
  border-radius: 0px;
  background: ${props => props.theme.colors.navy};
  color: ${props => props.theme.colors.white};
  border: none;
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #000000;
  }
`;
