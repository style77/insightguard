import styled from 'styled-components';
import Profile from "./profile";
import {FiShield} from "react-icons/fi";

const NavbarContainer = styled.nav`
  position: relative;
  top: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(20, 20, 20);
  padding: 0 64px;
  width: 100%;
  border-bottom: 2px solid rgb(255, 255, 255, 0.5);
  transition: border-bottom 250ms;

  &:hover {
    border-bottom: 2px solid rgb(255, 255, 255, .7);
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: "Rubik", sans-serif;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
  color: rgb(240, 240, 240, 0.8);
  transition: color 250ms;
  cursor: default;

  &:hover {
    color: rgb(240, 240, 240, 1);
  }
`;

const LogoIcon = styled.div`
  display: flex;
  font-size: 24px;
  animation: spin 1s linear;

  @keyframes spin {
    to {
      transform: rotate(360deg);
      transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }
`;

const LogoLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

type NavbarProps = {
    landing?: boolean;
    openKeysModal?: () => void;
    openProfileModal?: () => void;
    openSettingsModal?: () => void;
}

const Navbar = ({
                    landing = false,
                    openKeysModal,
                    openProfileModal,
                    openSettingsModal
                }: NavbarProps) => {
    return (
        <NavbarContainer>
            <Logo>
                <LogoLink href="/">
                    <LogoIcon>
                        <FiShield/>
                    </LogoIcon>
                    InsightGuard
                </LogoLink>
            </Logo>
            <Profile landing={landing} openKeysModal={openKeysModal}
                     openProfileModal={openProfileModal}
                     openSettingsModal={openSettingsModal}/>
        </NavbarContainer>
    );
};

export default Navbar;
