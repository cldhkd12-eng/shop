import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

interface Question {
  id: number;
  subtitle: string;
  options: string[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    subtitle: '하나를 선택해 주세요 (CHOOSE ONE)',
    options: ['르네상스 (Renaissance)', '바우하우스 (Bauhaus)'],
  },
  {
    id: 2,
    subtitle: '선호하는 기후 (YOUR PREFERRED CLIMATE)',
    options: ['습한 정글 (Humid Jungle)', '건조한 사막 (Dry Desert)'],
  },
  {
    id: 3,
    subtitle: '하루 중 좋아하는 시간 (TIME OF THE DAY)',
    options: ['새벽 안개 (Dawn Mist)', '자정의 장작불 (Midnight Woodfire)'],
  },
  {
    id: 4,
    subtitle: '당신의 내면적 성향 (YOUR INNER NATURE)',
    options: ['자유로운 인디 록 (Wild Indie Rock)', '클래식 마호가니 (Craftsman Mahogany)'],
  },
  {
    id: 5,
    subtitle: '원하는 분위기 (CHOOSE A VIBE)',
    options: ['미니멀한 깨끗함 (Minimalist Clean)', '신비로운 발삼 향 (Mysterious Balsamic)'],
  },
];

export const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useShop();
  const [currentStep, setCurrentStep] = useState(0); // 0 to 4 are questions, 5 is result
  const [answers, setAnswers] = useState<string[]>([]);

  const handleOptionClick = (option: string) => {
    const nextAnswers = [...answers, option];
    setAnswers(nextAnswers);

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(quizQuestions.length); // go to results
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
  };

  // Get 4 recommended products (semi-randomized but fixed per session for a cohesive list)
  const getRecommendations = () => {
    // Return 4 distinct products
    return products.slice(0, 4);
  };

  const currentQuestion = quizQuestions[currentStep];

  return (
    <QuizContainer className="fade-in">
      {/* QUIZ HEADER */}
      <QuizHeader>
        <HeaderLeft>
          <HeaderBrand>Sniff Quiz</HeaderBrand>
        </HeaderLeft>
        <HeaderCenter>
          MODO의 AI 조향사가 5가지 간단한 질문을 통해 당신이 사랑하게 될 4가지 향수를 제안합니다.
        </HeaderCenter>
        <HeaderRight onClick={() => navigate('/')}>
          ✕
        </HeaderRight>
      </QuizHeader>

      {/* QUIZ BODY */}
      <QuizBody>
        {currentStep < quizQuestions.length ? (
          <QuestionWrapper>
            <Subtitle>{currentQuestion.subtitle}</Subtitle>
            <OptionsList>
              {currentQuestion.options.map((opt, idx) => (
                <OptionButton key={idx} onClick={() => handleOptionClick(opt)}>
                  {opt}
                </OptionButton>
              ))}
            </OptionsList>
          </QuestionWrapper>
        ) : (
          <ResultsWrapper>
            <ResultsTitle>당신을 위한 4가지 향수 추천</ResultsTitle>
            <ResultsSubtitle>선택하신 취향을 기반으로 조향한 MODO의 추천 리스트입니다.</ResultsSubtitle>
            <ProductsGrid>
              {getRecommendations().map((prod) => (
                <ProductCard key={prod.id} onClick={() => navigate(`/detail/${prod.id}`)}>
                  <CardImgWrapper>
                    <CardImg src={prod.imageUrl} alt={prod.name} />
                  </CardImgWrapper>
                  <CardBrand>{prod.brand}</CardBrand>
                  <CardName>{prod.name}</CardName>
                  <CardPrice>₩{prod.price.toLocaleString()}</CardPrice>
                </ProductCard>
              ))}
            </ProductsGrid>
            <RestartBtn onClick={handleRestart}>퀴즈 다시 하기</RestartBtn>
          </ResultsWrapper>
        )}
      </QuizBody>
    </QuizContainer>
  );
};

/* ─── STYLED COMPONENTS ─── */
const QuizContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #FAF8F5;
  display: flex;
  flex-direction: column;
  color: #000000;
  box-sizing: border-box;
`;

const QuizHeader = styled.header`
  display: grid;
  grid-template-columns: 240px 1fr 80px;
  border-bottom: 2px solid #000000;
  background: #FAF8F5;

  @media (max-width: 768px) {
    grid-template-columns: 120px 1fr 50px;
  }
`;

const HeaderLeft = styled.div`
  padding: 30px 40px;
  border-right: 2px solid #000000;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HeaderBrand = styled.h1`
  font-family: ${props => props.theme.fonts.display};
  font-size: 32px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const HeaderCenter = styled.div`
  padding: 30px 40px;
  font-family: ${props => props.theme.fonts.display};
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  line-height: 1.4;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 16px;
    font-size: 11px;
  }
`;

const HeaderRight = styled.button`
  border: none;
  background: transparent;
  border-left: 2px solid #000000;
  font-size: 28px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #FFECEE;
  }
`;

const QuizBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
`;

const QuestionWrapper = styled.div`
  text-align: center;
  max-width: 800px;
  width: 100%;
`;

const Subtitle = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: #000000;
  margin-bottom: 40px;
  text-transform: uppercase;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const OptionButton = styled.button`
  background: transparent;
  border: none;
  font-family: ${props => props.theme.fonts.display};
  font-size: clamp(38px, 6vw, 76px);
  font-weight: 800;
  color: #000000;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s;
  outline: none;
  line-height: 1.2;

  &:hover {
    transform: scale(1.05);
    opacity: 0.7;
  }
`;

/* Results */
const ResultsWrapper = styled.div`
  text-align: center;
  max-width: 1200px;
  width: 100%;
`;

const ResultsTitle = styled.h2`
  font-family: ${props => props.theme.fonts.display};
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
`;

const ResultsSubtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin-bottom: 48px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const ProductCard = styled.div`
  border: 2px solid #000000;
  background: #FFFFFF;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  text-align: left;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardImgWrapper = styled.div`
  aspect-ratio: 1;
  background: #FAF8F5;
  border: 2px solid #000000;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardBrand = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 10px;
  font-weight: 800;
  color: #888888;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const CardName = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const CardPrice = styled.div`
  font-family: ${props => props.theme.fonts.display};
  font-size: 14px;
  font-weight: 700;
`;

const RestartBtn = styled.button`
  padding: 16px 40px;
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
