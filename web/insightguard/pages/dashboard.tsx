import {useAuth, useRequireAuth} from "../hooks/useAuth";
import styled from "styled-components";

import {ReactNode, useEffect, useRef, useState} from "react";
import {
    AiFillInfoCircle,
    AiOutlineUser,
    IoAnalyticsOutline,
    IoKeySharp, IoSettingsSharp, GiHouseKeys
} from "react-icons/all";
import Navbar from "../components/navbar";
import {
    ApiKeysModal, NewApiKeyModal, UserProfileModal
} from "../components/modal";
import {useRouter} from "next/navigation";

const Container = styled.div`
  align-items: center;
  background-color: rgb(20, 20, 20);
  display: flex;
  height: calc(100vh - 64px);
  justify-content: center;
  margin: 0;
  overflow: hidden;
  padding: 0;

  h1, h2, h3, h4, span {
    color: rgb(240, 240, 240);
    font-family: "Rubik", sans-serif;
    font-weight: 400;
    margin: 0;
  }

  .icon {
    color: rgb(240, 240, 240);
  }

  @media (max-width: 1000px) {
    align-items: flex-start;
    overflow: auto;
  }
`;

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 916px;
  width: calc(100% - 20px);

  &:hover::after {
    opacity: 1;
  }

  @media (max-width: 1000px) {
    max-width: 1000px;
    padding: 10px 0;
  }
`;

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  height: 260px;
  flex-direction: column;
  position: relative;
  width: 300px;

  &:hover::before {
    opacity: 1;
  }

  &::before, &::after {
    border-radius: inherit;
    content: "";
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transition: opacity 500ms;
    width: 100%;
  }

  &::before {
    background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.06),
    transparent 40%);
    z-index: 3;
  }

  &::after {
    background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.4),
    transparent 40%);
    z-index: 1;
  }

  & > .card-content {
    background-color: rgb(23, 23, 23);
    border-radius: inherit;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    inset: 1px;
    padding: 10px;
    position: absolute;
    z-index: 2;
  }

  @media (max-width: 1000px) {
    flex-shrink: 1;
    width: calc(50% - 4px);
  }
`;

const CardContent = styled.div`
`;

const CardImage = styled.div`
  align-items: center;
  display: flex;
  height: 140px;
  justify-content: center;
  overflow: hidden;

  & > .icon {
    font-size: 6em;
    opacity: 0.25;
  }
`;

const CardInfoWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  padding: 0 20px;
`;

const CardInfo = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 10px;

  & > i {
    font-size: 1em;
    height: 20px;
    line-height: 20px;
  }
`;

const CardInfoTitle = styled.div`
  & > h3 {
    font-size: 1.1em;
    line-height: 20px;
  }

  & > h4 {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85em;
    margin-top: 8px;
  }
`;

export default function Dashboard() {
    useRequireAuth();

    const auth = useAuth();
    const router = useRouter();

    const cardsRef = useRef<HTMLDivElement>(null);

    const [modal, setModal] = useState<ReactNode>(null);

    useEffect(() => {
        document.getElementById("cards").onmousemove = e => {
            for (const card of document.getElementsByClassName("card") as HTMLCollectionOf<HTMLElement>) {
                const rect = card.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            }
        }
    })

    const newApiKey = async () => {
        setModal(<NewApiKeyModal setModal={setModal}/>)
    }

    const apiKeys = async () => {
        setModal(<ApiKeysModal setModal={setModal}/>)
    }

    const analyticKeys = async () => {
        setModal(<ApiKeysModal setModal={setModal} analytics={true}/>)
    }

    const userProfile = async () => {
        setModal(<UserProfileModal setModal={setModal}/>)
    }

    return (
        <>
            <Navbar openKeysModal={apiKeys}/>
            {modal}
            <Container>
                <Cards id="cards" ref={cardsRef}>
                    <Card className="card" onClick={newApiKey}>
                        <CardContent className="card-content">
                            <CardImage>
                                <IoKeySharp className="icon"/>
                            </CardImage>
                            <CardInfoWrapper>
                                <CardInfo>
                                    <IoKeySharp className="icon"/>
                                    <CardInfoTitle>
                                        <h3>New API key</h3>
                                        <h4>Create new API key</h4>
                                    </CardInfoTitle>
                                </CardInfo>
                            </CardInfoWrapper>
                        </CardContent>
                    </Card>
                    <Card className="card" onClick={apiKeys}>
                        <CardContent className="card-content">
                            <CardImage>
                                <GiHouseKeys className="icon"/>
                            </CardImage>
                            <CardInfoWrapper>
                                <CardInfo>
                                    <GiHouseKeys className="icon"/>
                                    <CardInfoTitle>
                                        <h3>API keys</h3>
                                        <h4>Check your all API keys</h4>
                                    </CardInfoTitle>
                                </CardInfo>
                            </CardInfoWrapper>
                        </CardContent>
                    </Card>
                    <Card className="card" onClick={userProfile}>
                        <CardContent className="card-content">
                            <CardImage>
                                <AiOutlineUser className="icon"/>
                            </CardImage>
                            <CardInfoWrapper>
                                <CardInfo>
                                    <AiOutlineUser className="icon"/>
                                    <CardInfoTitle>
                                        <h3>User profile</h3>
                                        <h4>View and update your profile</h4>
                                    </CardInfoTitle>
                                </CardInfo>
                            </CardInfoWrapper>
                        </CardContent>
                    </Card>
                    {/*<Card className="card" onClick={analyticKeys}>*/}
                    {/*    <CardContent className="card-content">*/}
                    {/*        <CardImage>*/}
                    {/*            <IoAnalyticsOutline className="icon"/>*/}
                    {/*        </CardImage>*/}
                    {/*        <CardInfoWrapper>*/}
                    {/*            <CardInfo>*/}
                    {/*                <IoAnalyticsOutline className="icon"/>*/}
                    {/*                <CardInfoTitle>*/}
                    {/*                    <h3>Analytics</h3>*/}
                    {/*                    <h4>Monitor you API usage</h4>*/}
                    {/*                </CardInfoTitle>*/}
                    {/*            </CardInfo>*/}
                    {/*        </CardInfoWrapper>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                    {/*<Card className="card" onClick={() => router.push('about')}>*/}
                    {/*    <CardContent className="card-content">*/}
                    {/*        <CardImage>*/}
                    {/*            <AiFillInfoCircle className="icon"/>*/}
                    {/*        </CardImage>*/}
                    {/*        <CardInfoWrapper>*/}
                    {/*            <CardInfo>*/}
                    {/*                <AiFillInfoCircle className="icon"/>*/}
                    {/*                <CardInfoTitle>*/}
                    {/*                    <h3>About</h3>*/}
                    {/*                    <h4>Learn more about Insight Guard!</h4>*/}
                    {/*                </CardInfoTitle>*/}
                    {/*            </CardInfo>*/}
                    {/*        </CardInfoWrapper>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                </Cards>
            </Container>
        </>
    );
}
