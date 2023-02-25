import styled from 'styled-components';
import Navbar from "../components/navbar";
import {useRouter} from "next/router";

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  background: linear-gradient(to right, #444444, #222222);
  background-size: cover;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
`;

const Heading = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  text-shadow: 2px 2px 0 #666, 3px 3px 0 #555, 4px 4px 0 #444, 5px 5px 0 #333;
  letter-spacing: 2px;
`;

const SubHeading = styled.h2`
  font-size: 24px;
  font-weight: normal;
  margin-bottom: 32px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  text-shadow: 2px 2px 0 #666, 3px 3px 0 #555, 4px 4px 0 #444, 5px 5px 0 #333;
  letter-spacing: 1px;
`;

const Button = styled.button`
  padding: 16px 32px;
  font-size: 20px;
  font-weight: 700;
  background-color: #ffffff;
  color: #7c3aed;
  font-family: 'Inter', sans-serif;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  width: 200px;
  margin-top: 32px;
  margin-left: 32px;
  box-shadow: 2px 2px 0 #666, 3px 3px 0 #555, 4px 4px 0 #444, 5px 5px 0 #333;

  &:hover {
    background-color: #7c3aed;
    color: #ffffff;
  }
`;

const OppositeButton = styled.button`
  padding: 16px 32px;
  font-size: 20px;
  font-weight: 700;
  background-color: #7c3aed;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  width: 200px;
  margin-top: 32px;
  box-shadow: 2px 2px 0 #666, 3px 3px 0 #555, 4px 4px 0 #444, 5px 5px 0 #333;

  &:hover {
    background-color: #ffffff;
    color: #7c3aed;
  }
`;

const SemiTransparentBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.1);
`;

const FloatingLeftIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  z-index: 1;
  width: 10%;
  height: 10%;
  animation: floatingAnimation 4s ease-in-out infinite;

  @keyframes floatingAnimation {
    0% {
      transform: translateY(-50%) translateX(-10%);
    }
    50% {
      transform: translateY(-40%) translateX(-10%);
    }
    100% {
      transform: translateY(-50%) translateX(-10%);
    }
  }
`;

const FloatingRightIcon = styled.img`
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  z-index: 1;
  width: 10%;
  height: 10%;
  animation: floatingAnimation 4s ease-in-out infinite;

  @keyframes floatingAnimation {
    0% {
      transform: translateY(-50%) translateX(10%);
    }
    50% {
      transform: translateY(-40%) translateX(10%);
    }
    100% {
      transform: translateY(-50%) translateX(10%);
    }
  }
`;

export default function Home() {
    const router = useRouter();
    return (
        <>
            <LandingPageContainer>
                <SemiTransparentBackground/>
                <ContentWrapper>
                    <Heading>InsightGuard</Heading>
                    <SubHeading>AI-powered cyberbullying detection API</SubHeading>
                    <OppositeButton onClick={() => router.push('/login')}>Get
                        Started</OppositeButton>
                    <Button onClick={() => router.push('/about')}>Learn More</Button>
                </ContentWrapper>
                <FloatingLeftIcon src="/icon_security.svg"/>
                <FloatingRightIcon src="/icon_appreciation.svg"/>

            </LandingPageContainer>
        </>
    );
}
