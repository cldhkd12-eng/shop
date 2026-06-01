import React, { useState } from 'react';
import styled from 'styled-components';
import { useShop } from '../context/ShopContext';
import type { ReportItem } from '../mockData';

export const SuperAdmin: React.FC = () => {
  const { reports, vendors, updateReportStatus, updateVendorStatus, showToast } = useShop();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editorContent, setEditorContent] = useState(
    '<strong>[공지] 포맨트 코튼 아틀리에 시그니처 론칭 기념 배송 및 정산 관련 안내</strong><br/>안녕하세요, FORMENT ATELIER 관리국입니다. 시그니처 코튼 향수 출시에 따른 파트너 주문 폭주로 배송 정산 주기가 일부 변경될 예정이오니 확인 부탁드립니다.'
  );

  const pendingReports = reports.filter(r => r.status === 'pending');
  const pendingVendors = vendors.filter(v => v.status === 'pending');

  const handleReportAction = (reportId: string, status: 'blinded' | 'resolved') => {
    updateReportStatus(reportId, status);
  };

  const handleVendorAction = (vendorId: string, status: 'approved' | 'rejected') => {
    updateVendorStatus(vendorId, status);
  };

  const handlePublishNotice = () => {
    showToast('공지사항이 포맨트 채널에 게시되었습니다 📢');
  };

  return (
    <PageContainer className="fade-in">
      <SaHeader>
        <SaHeaderInner>
          <SaLogo>
            FORMENT ATELIER <span>HQ ADMIN</span>
          </SaLogo>
          <SaNav>
            {['dashboard', 'members', 'products', 'orders', 'system'].map(tab => {
              const labels: { [key: string]: string } = {
                dashboard: '통합 대시보드',
                members: '회원 관리',
                products: '브랜드 상품 관리',
                orders: '전체 주문 조회',
                system: '시스템 정책',
              };
              return (
                <SaNavItem
                  key={tab}
                  className={activeTab === tab ? 'active' : ''}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab !== 'dashboard') {
                      showToast(`"${labels[tab]}" 서비스는 정책 기획 중입니다.`);
                    }
                  }}
                >
                  {labels[tab]}
                </SaNavItem>
              );
            })}
          </SaNav>
        </SaHeaderInner>
      </SaHeader>

      {/* SA BODY */}
      <SaBody>
        <SaStats>
          <SaStat>
            <div className="sa-stat-icon">👥</div>
            <SaStatNum>18,420</SaStatNum>
            <SaStatLabel>전체 가입자 수</SaStatLabel>
          </SaStat>
          <SaStat>
            <div className="sa-stat-icon">🏪</div>
            <SaStatNum>{vendors.length}</SaStatNum>
            <SaStatLabel>입점사 파트너 (대기: {pendingVendors.length})</SaStatLabel>
          </SaStat>
          <SaStat>
            <div className="sa-stat-icon">📦</div>
            <SaStatNum>5,840</SaStatNum>
            <SaStatLabel>누적 주문량</SaStatLabel>
          </SaStat>
          <SaStat>
            <div className="sa-stat-icon">🚨</div>
            <SaStatNum style={{ color: '#E11D48' }}>{pendingReports.length}</SaStatNum>
            <SaStatLabel>대기 중인 분쟁/신고</SaStatLabel>
          </SaStat>
        </SaStats>

        <SaGrid>
          <AdminCard>
            <AdminCardHead>
              <AdminCardTitle>🚨 실시간 신고 모니터링</AdminCardTitle>
              <span className="status-badge s-new" style={{ background: '#FFE4E6', color: '#E11D48', padding: '3px 8px', borderRadius: '0px', fontSize: '10px', fontWeight: 700 }}>
                {pendingReports.length} 건 대기
              </span>
            </AdminCardHead>
            <AdminCardBody>
              {pendingReports.length === 0 ? (
                <EmptyState>처리할 신고 내역이 존재하지 않습니다.</EmptyState>
              ) : (
                pendingReports.map(rep => (
                  <ReportItemRow key={rep.id}>
                    <ReportType type={rep.type}>
                      {rep.type === 'review' ? '💬' : rep.type === 'product' ? '🍾' : '📝'}
                    </ReportType>
                    <ReportContent>
                      <ReportTitle>{rep.title}</ReportTitle>
                      <ReportMeta>작성자: {rep.reporter} · {rep.time}</ReportMeta>
                    </ReportContent>
                    <ReportAction>
                      <BlindBtn onClick={() => handleReportAction(rep.id, 'blinded')}>
                        제한
                      </BlindBtn>
                      <PassBtn onClick={() => handleReportAction(rep.id, 'resolved')}>
                        정상처리
                      </PassBtn>
                    </ReportAction>
                  </ReportItemRow>
                ))
              )}
            </AdminCardBody>
          </AdminCard>

          <AdminCard>
            <AdminCardHead>
              <AdminCardTitle>🏪 입점 희망 브랜드 심사</AdminCardTitle>
              <span className="status-badge s-amber" style={{ background: '#F5F5F4', color: '#0A1128', padding: '3px 8px', borderRadius: '0px', fontSize: '10px', fontWeight: 700 }}>
                {pendingVendors.length} 검토
              </span>
            </AdminCardHead>
            <AdminCardBody>
              {pendingVendors.length === 0 ? (
                <EmptyState>승인 심사를 기다리는 파트너가 없습니다.</EmptyState>
              ) : (
                pendingVendors.map(vendor => (
                  <VendorRow key={vendor.id}>
                    <VendorAvatar>{vendor.name.charAt(0)}</VendorAvatar>
                    <VendorInfo>
                      <VendorBiz>{vendor.name}</VendorBiz>
                      <VendorEmail>{vendor.email} · {vendor.description}</VendorEmail>
                    </VendorInfo>
                    <div>
                      <ApproveBtn onClick={() => handleVendorAction(vendor.id, 'approved')}>
                        승인
                      </ApproveBtn>
                      <RejectBtn onClick={() => handleVendorAction(vendor.id, 'rejected')}>
                        반려
                      </RejectBtn>
                    </div>
                  </VendorRow>
                ))
              )}
            </AdminCardBody>
          </AdminCard>

          <AdminCard className="sa-grid-full">
            <AdminCardHead>
              <AdminCardTitle>📢 공지사항 및 정책 에디터</AdminCardTitle>
            </AdminCardHead>
            <EditorArea>
              <EditorToolbar>
                <TbBtn onClick={() => showToast('Bold')}><b>B</b></TbBtn>
                <TbBtn onClick={() => showToast('Italic')}><i>I</i></TbBtn>
                <TbBtn onClick={() => showToast('Underline')}><u>U</u></TbBtn>
                <TbBtn onClick={() => showToast('Link')}>🔗</TbBtn>
                <TbBtn onClick={() => showToast('Image')}>🖼</TbBtn>
              </EditorToolbar>
              <EditorContent
                contentEditable
                suppressContentEditableWarning
                onBlur={e => setEditorContent(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: editorContent }}
              />
              <PubBtn onClick={handlePublishNotice}>정식 공지 게시</PubBtn>
            </EditorArea>
          </AdminCard>
        </SaGrid>
      </SaBody>
    </PageContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const PageContainer = styled.div`
  width: 100%;
  min-height: 90vh;
  background: ${props => props.theme.colors.linen};
`;

const SaHeader = styled.div`
  background: ${props => props.theme.colors.navyDark};
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const SaHeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 30px;
  height: 70px;

  @media (max-width: 600px) {
    flex-direction: column;
    height: auto;
    padding: 16px 0;
    gap: 12px;
  }
`;

const SaLogo = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 16px;
  color: ${props => props.theme.colors.white};
  font-weight: 800;
  letter-spacing: 0.1em;

  span {
    color: ${props => props.theme.colors.amber};
    font-size: 10px;
    border: 1px solid ${props => props.theme.colors.amber};
    border-radius: 0px;
    padding: 2px 6px;
    font-family: ${props => props.theme.fonts.display};
    font-weight: 700;
    margin-left: 8px;
    letter-spacing: 0.05em;
  }
`;

const SaNav = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;

  @media (max-width: 600px) {
    margin-left: 0;
    overflow-x: auto;
    width: 100%;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const SaNavItem = styled.div`
  padding: 8px 16px;
  border-radius: 0px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: ${props => props.theme.transition};
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.colors.white};
  }

  &.active {
    color: ${props => props.theme.colors.amber};
    background: rgba(225, 29, 72, 0.08);
  }
`;

const SaBody = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 60px 24px;

  @media (max-width: 600px) {
    padding: 40px 16px;
  }
`;

const SaStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SaStat = styled.div`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray200};
  border-radius: 0px;
  padding: 24px;
`;

const SaStatNum = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.colors.navy};
`;

const SaStatLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.gray400};
  margin-top: 4px;
  font-weight: 700;
`;

const SaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  .sa-grid-full {
    grid-column: 1 / -1;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    .sa-grid-full {
      grid-column: span 1;
    }
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
  padding: 18px 24px;
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
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${props => props.theme.colors.gray400};
  font-size: 13px;
`;

const ReportItemRow = styled.div`
  display: flex;
  align-items: start;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.gray100};
  transition: ${props => props.theme.transition};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.linenWarm};
  }
`;

const ReportType = styled.div<{ type: ReportItem['type'] }>`
  width: 32px;
  height: 32px;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
  background: ${props => {
    if (props.type === 'review') return '#FFE4E6';
    if (props.type === 'product') return '#FEF3C7';
    return '#E0F2FE';
  }};
`;

const ReportContent = styled.div`
  flex: 1;
`;

const ReportTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 4px;
  color: ${props => props.theme.colors.navy};
`;

const ReportMeta = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.gray400};
`;

const ReportAction = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const BlindBtn = styled.button`
  padding: 6px 12px;
  border-radius: 0px;
  font-size: 11px;
  font-weight: 700;
  background: #FFE4E6;
  color: #E11D48;
  border: none;
  cursor: pointer;

  &:hover {
    background: #FECDD3;
  }
`;

const PassBtn = styled.button`
  padding: 6px 12px;
  border-radius: 0px;
  font-size: 11px;
  font-weight: 700;
  background: ${props => props.theme.colors.linen};
  color: ${props => props.theme.colors.navy};
  border: 1px solid ${props => props.theme.colors.gray200};
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.gray100};
  }
`;

const VendorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.gray100};
  transition: ${props => props.theme.transition};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.linenWarm};
  }
`;

const VendorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0px;
  background: ${props => props.theme.colors.navy};
  color: ${props => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.fonts.display};
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
`;

const VendorInfo = styled.div`
  flex: 1;
`;

const VendorBiz = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme.colors.navy};
`;

const VendorEmail = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.gray400};
  margin-top: 2px;
`;

const ApproveBtn = styled.button`
  padding: 6px 12px;
  border-radius: 0px;
  background: #ECFDF5;
  color: #065F46;
  border: none;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  margin-right: 6px;
  transition: ${props => props.theme.transition};

  &:hover {
    background: #10B981;
    color: ${props => props.theme.colors.white};
  }
`;

const RejectBtn = styled.button`
  padding: 6px 12px;
  border-radius: 0px;
  background: #FEF2F2;
  color: #991B1B;
  border: none;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: ${props => props.theme.transition};

  &:hover {
    background: #EF4444;
    color: ${props => props.theme.colors.white};
  }
`;

const EditorArea = styled.div`
  padding: 24px;
`;

const EditorToolbar = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.gray200};
  border-bottom: none;
  background: ${props => props.theme.colors.linen};
`;

const TbBtn = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.gray200};
  background: ${props => props.theme.colors.white};
  border-radius: 0px;
  font-size: 12px;
  cursor: pointer;
  transition: ${props => props.theme.transition};
  color: ${props => props.theme.colors.navy};

  &:hover {
    background: ${props => props.theme.colors.linen};
  }
`;

const EditorContent = styled.div`
  border: 1px solid ${props => props.theme.colors.gray200};
  min-height: 180px;
  padding: 16px;
  font-size: 13px;
  line-height: 1.8;
  color: ${props => props.theme.colors.gray800};
  outline: none;
  background: ${props => props.theme.colors.white};

  &:focus {
    border-color: ${props => props.theme.colors.navy};
  }
`;

const PubBtn = styled.button`
  display: inline-block;
  margin-top: 16px;
  padding: 14px 28px;
  background: ${props => props.theme.colors.navy};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 0px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: ${props => props.theme.transition};

  &:hover {
    background: #000000;
  }
`;
