import React from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const Fail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <PageContainer className="fade-in">
      <FailCard>
        <ErrorIcon>⚠️</ErrorIcon>
        <Heading>결제에 실패하였습니다</Heading>
        <SubHeading>결제 진행 과정에서 오류가 발생했습니다. 아래 내용을 확인해 주세요.</SubHeading>

        <ErrorDetailsTable>
          <tbody>
            <tr>
              <td className="label">에러코드</td>
              <td className="val highlight">{code}</td>
            </tr>
            <tr>
              <td className="label">실패 사유</td>
              <td className="val error-msg">{message || '알 수 없는 오류가 발생했습니다.'}</td>
            </tr>
          </tbody>
        </ErrorDetailsTable>

        <ActionGroup>
          <RetryBtn onClick={() => navigate('/cart')}>다시 결제하기</RetryBtn>
          <HomeBtn onClick={() => navigate('/')}>메인으로 이동</HomeBtn>
        </ActionGroup>
      </FailCard>
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

const FailCard = styled.div`
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

const ErrorIcon = styled.div`
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

const ErrorDetailsTable = styled.table`
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
  }

  .val.highlight {
    font-family: monospace;
    font-weight: 800;
    color: #FF0000;
  }

  .val.error-msg {
    line-height: 1.5;
    word-break: keep-all;
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

const RetryBtn = styled.button`
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

const HomeBtn = styled.button`
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
