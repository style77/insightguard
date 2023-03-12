import Navbar from "../components/navbar";
import styled from "styled-components";
import {
    AiFillCloud,
    AiFillGithub,
    FiCheck, FiStar,
    MdOutlineDeveloperMode
} from "react-icons/all";

const AboutPageContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  font-size: 3rem;
  font-weight: 500;
  color: rgb(240, 240, 240, 1);
  padding: 0;
  text-align: center;
  z-index: 1;
  margin: 2rem 0 1rem;
`;

const SubHeading = styled.h2`
  font-family: 'Rubik', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: rgb(240, 240, 240, 0.9);
  padding: 0;
  text-align: center;
  margin: 0 0 1rem;
  z-index: 1;
`;

const FeatureContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  flex-basis: 33.33%;
  gap: 2rem;
  padding: 0 1rem;
  z-index: 1;
`;

const Feature = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 2rem 1rem;
  z-index: 1;
  background: rgb(0, 0, 0, 0.5);
  border-radius: 1rem;
  box-shadow: 0 0 1rem 0 rgb(0, 0, 0, 0.5);
  backdrop-filter: blur(1rem);
  -webkit-backdrop-filter: blur(1rem);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const FeatureIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background: rgb(240, 240, 240, 0.1);
  margin: 0 0 1rem;
`;

const FeatureHeading = styled.h3`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-family: 'Rubik', sans-serif;
  font-size: 1.5rem;
  font-weight: 500;
  color: rgb(240, 240, 240, 1);
  padding: 0;
  text-align: center;
  margin: 0 0 1rem;
  z-index: 1;
`;

const FeatureDescription = styled.p`
  font-family: 'Rubik', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: rgb(240, 240, 240, 0.9);
  padding: 0;
  text-align: center;
  margin: 0 0 1rem;
  z-index: 1;
`;

const FeatureList = styled.ul`
  font-family: 'Rubik', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: rgb(240, 240, 240, 0.9);
  padding: 0;
  text-align: center;
  margin: 0 0 1rem;
  z-index: 1;
  display: flex;
  flex-direction: column;

  width: 100%;
  justify-content: start;
  gap: 0.5rem;
`;

const FeatureListItem = styled.li`
  display: flex;
  flex-direction: row;
  font-family: 'Rubik', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: rgb(240, 240, 240, 0.9);
  padding: 0;
  text-align: center;
  z-index: 1;
`;

const FeatureListIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: rgb(240, 240, 240, 0.1);
  margin: 0 1rem 0;
`;

const GitLink = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    font-family: 'Rubik', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: rgb(240, 240, 240, 0.9);
    padding: 0;
    text-align: center;
    margin: 0 0 1rem;
    z-index: 1;
    text-decoration: none;
    transition: 0.2s ease-in-out;
    &:hover {
        color: rgb(240, 240, 240, 1);
    }
`;

export default function About() {
    return (
        <>
            <Navbar landing={true}/>
            <AboutPageContainer>
                <BackgroundFade/>
                <Heading>
                    InsightGuard
                    <SubHeading>
                        The best way to protect your users
                    </SubHeading>
                </Heading>

                <FeatureContainer>
                    <Feature>
                        <FeatureHeading>
                            <AiFillCloud/>
                            General
                        </FeatureHeading>
                        <FeatureDescription>
                            Insight Guard is cybersecurity REST API that provides a wide range of features to protect your users security.
                        </FeatureDescription>
                        <FeatureList>
                            <FeatureListItem>
                                <FeatureListIcon>
                                    <FiCheck/>
                                </FeatureListIcon>
                                FREE to use
                            </FeatureListItem>
                            <FeatureListItem>
                                <FeatureListIcon>
                                    <FiCheck/>
                                </FeatureListIcon>
                                Powered by AI
                            </FeatureListItem>
                            <FeatureListItem>
                                <FeatureListIcon>
                                    <FiCheck/>
                                </FeatureListIcon>
                                Open Source
                            </FeatureListItem>
                        </FeatureList>
                    </Feature>
                    <Feature>
                        <FeatureHeading>
                            <FiStar/>
                            Features
                        </FeatureHeading>
                        <FeatureDescription>
                            Simple and easy to use API that can be integrated into any application.
                        </FeatureDescription>
                        <FeatureList>
                            <FeatureListItem>
                                <FeatureListIcon>
                                    <FiCheck/>
                                </FeatureListIcon>
                                Phishing URLs and E-mail Detection
                            </FeatureListItem>
                            <FeatureListItem>
                                <FeatureListIcon>
                                    <FiCheck/>
                                </FeatureListIcon>
                                Bullying Detection
                            </FeatureListItem>
                            <FeatureListItem>
                                <FeatureListIcon>
                                    <FiCheck/>
                                </FeatureListIcon>
                                Password Strength Detection and Generation
                            </FeatureListItem>
                            <FeatureListItem>
                                <FeatureListIcon>
                                    <FiCheck/>
                                </FeatureListIcon>
                                And more coming soon...
                            </FeatureListItem>
                        </FeatureList>
                    </Feature>
                    <Feature>
                        <FeatureHeading>
                            <MdOutlineDeveloperMode/>
                            More
                        </FeatureHeading>
                        <FeatureDescription>
                            Developed and maintained by one person.
                        </FeatureDescription>
                        <FeatureList>
                            <FeatureListItem>
                                <FeatureListIcon>
                                    <FiCheck/>
                                </FeatureListIcon>
                                Open source
                            </FeatureListItem>
                            <FeatureListItem>
                                <FeatureListIcon>
                                    <FiCheck/>
                                </FeatureListIcon>
                                Open to contributions
                            </FeatureListItem>
                            <FeatureListItem>
                                <FeatureListIcon>
                                    <AiFillGithub/>
                                </FeatureListIcon>
                                <GitLink href="https://github.com/style77/insightguard" target="_blank">
                                    Github
                                </GitLink>
                            </FeatureListItem>
                        </FeatureList>
                    </Feature>
                </FeatureContainer>

            </AboutPageContainer>
        </>
    )
}
