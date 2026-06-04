import React, { useState } from 'react';
import styled from 'styled-components';
import { useShop } from '../context/ShopContext';

export const Support: React.FC = () => {
  const { showToast } = useShop();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      q: '배송 기간은 얼마나 소요되나요?',
      a: 'MODO의 모든 향수는 결제 완료 후 영업일 기준 2~4일 이내에 안전하게 배송됩니다. 제주 및 도서산간 지역은 1~2일 추가 소요될 수 있습니다.',
    },
    {
      q: '교환 및 반품 규정이 어떻게 되나요?',
      a: '단순 변심으로 인한 교환/반품은 상품 수령 후 7일 이내에 가능합니다. 단, 향수 본품의 비닐 패키지가 개봉되었거나 펌핑을 진행하신 경우에는 상품 가치 훼손으로 간주되어 교환 및 환불이 불가능합니다.',
    },
    {
      q: '선물 포장 서비스가 제공되나요?',
      a: '모든 상품은 MODO의 시그니처 크래프트 박스에 기본적으로 정성스레 포장되어 배송됩니다. 추가 쇼핑백이 필요하신 경우 결제 단계에서 요청사항에 작성해 주세요.',
    },
    {
      q: '나에게 맞는 향을 추천받고 싶어요.',
      a: 'MODO 홈 화면 하단에 있는 [QUIZ]를 통해 당신의 성향과 선호도를 기반으로 5가지 간단한 질문을 통해 AI 조향사가 가장 잘 어울리는 4가지 향수를 즉시 매칭해 드립니다.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('모든 양식을 작성해 주세요.');
      return;
    }
    showToast('문의사항이 고객센터로 접수되었습니다. 빠른 시일 내에 답변해 드리겠습니다. 😊');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <SupportContainer className="fade-in">
      <HeaderSection>
        <Title>고객센터</Title>
        <Subtitle>MODO 고객센터입니다. 무엇을 도와드릴까요?</Subtitle>
      </HeaderSection>

      <SupportLayout>
        {/* FAQS */}
        <FaqSection>
          <SectionTitle>자주 묻는 질문 (FAQ)</SectionTitle>
          <FaqList>
            {faqs.map((faq, idx) => (
              <FaqItem key={idx}>
                <FaqQ>Q. {faq.q}</FaqQ>
                <FaqA>{faq.a}</FaqA>
              </FaqItem>
            ))}
          </FaqList>
        </FaqSection>

        {/* INQUIRY FORM & INFO */}
        <ContactSection>
          <SectionTitle>1:1 이메일 문의</SectionTitle>
          <ContactCard>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label>이름</label>
                <input
                  type="text"
                  placeholder="성함을 입력해 주세요"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>이메일</label>
                <input
                  type="email"
                  placeholder="답변받으실 이메일 주소"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>문의 내용</label>
                <textarea
                  rows={5}
                  placeholder="문의하실 내용을 입력해 주세요"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </FormGroup>
              <SubmitBtn type="submit">문의 제출하기</SubmitBtn>
            </Form>
          </ContactCard>

          <InfoCard>
            <InfoTitle>Direct Support</InfoTitle>
            <InfoText>
              전화 문의: 02-1234-5678<br />
              이메일: cldhkd12@gmial.com<br />
              운영 시간: 평일 오전 10시 ~ 오후 6시 (주말/공휴일 휴무)
            </InfoText>
          </InfoCard>
        </ContactSection>
      </SupportLayout>
    </SupportContainer>
  );
};

const SupportContainer = styled.div`
  width: 100%;
  background: #0a0a0f;
  color: #f0ede8;
  padding-bottom: 80px;
`;

const HeaderSection = styled.section`
  text-align: center;
  padding: 60px 24px;
  background: #0d0d14;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 36px;
  font-weight: 300;
  margin-bottom: 12px;
  color: #f0ede8;
  letter-spacing: -0.01em;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
`;

const SupportLayout = styled.div`
  max-width: 1280px;
  margin: 60px auto 0;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
    padding: 0 20px;
  }
`;

const FaqSection = styled.div``;

const SectionTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 30px;
  color: #c8a97e;
  letter-spacing: 0.05em;
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FaqItem = styled.div`
  background: #0d0d14;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 24px;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(200, 169, 126, 0.3);
  }
`;

const FaqQ = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #f0ede8;
`;

const FaqA = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  word-break: keep-all;
`;

const ContactSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ContactCard = styled.div`
  background: #0d0d14;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input,
  textarea {
    width: 100%;
    padding: 12px 14px;
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

const SubmitBtn = styled.button`
  padding: 16px 36px;
  background: #c8a97e;
  color: #0a0a0f;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #dcb88f;
    transform: translateY(-2px);
  }
`;

const InfoCard = styled.div`
  background: #111118;
  color: #f0ede8;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
`;

const InfoTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.15em;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  color: #c8a97e;
`;

const InfoText = styled.p`
  font-size: 12px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;
