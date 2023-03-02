import styled from 'styled-components';
import Navbar from "../components/navbar";
import {useRouter} from "next/router";
import {Shield} from "../components/shieldmodel";
import {Canvas} from "@react-three/fiber";
import {FiShield} from "react-icons/all";

import {
    EffectComposer,
    DepthOfField,
    Bloom,
    Noise,
    Vignette
} from '@react-three/postprocessing'

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
  position: relative;
  background: url('/background.jpg');
  background-size: cover;
  overflow: hidden;
`;

const BackgroundFade = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 1) 100%);
`;

const Heading = styled.div`
  position: relative;
  font-family: 'Rubik', sans-serif;
  font-size: 4rem;
  font-weight: 600;
  color: rgb(255, 255, 255, 1);
  text-align: center;
  z-index: 1;
  margin: 0 0 1rem;
  padding: 10rem;
`;

const SubHeading = styled.h2`
  font-family: 'Rubik', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: rgb(240, 240, 240, 0.8);
  padding: 0;
  text-align: center;
  margin: 0 0 1rem;
  z-index: 1;
`;

const Button = styled.button`
  background: rgb(240, 240, 240, 0.8);
  border: none;
  border-radius: 0.5rem;
  color: rgb(23, 23, 23, 0.95);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
  margin: 0 0.5rem;
  z-index: 1;

  &:hover {
    background: rgb(240, 240, 240, 1);
    color: rgb(23, 23, 23, 1);
  }
`;

const CanvasContainer = styled(Canvas)`
  position: relative;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  @media (max-width: 1000px) {
    display: none;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;


export default function Home() {
    const router = useRouter();
    return (
        <>
            <Navbar landing={true}/>
            <LandingPageContainer>
                <BackgroundFade/>
                <Heading>
                    <FiShield style={{marginRight: '1rem'}}/>
                    InsightGuard
                    <SubHeading>
                        AI-powered cyberbullying detection API
                    </SubHeading>
                    <Buttons>
                        <Button onClick={() => router.push('/about')}>Learn
                            more</Button>
                        <Button onClick={() => router.push('/login')}>Get
                            Started</Button>
                    </Buttons>
                </Heading>

                <CanvasContainer>
                    <Shield/>
                    <EffectComposer>
                        <Bloom luminanceThreshold={0} luminanceSmoothing={0.8}
                               height={300}/>
                    </EffectComposer>
                </CanvasContainer>
            </LandingPageContainer>
        </>
    );
}
