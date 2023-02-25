import styled from 'styled-components';

const NavbarContainer = styled.nav`
  position: absolute;
  top: 0;
  margin-top: 15px;
  justify-content: center;
  align-items: center;
  height: 80px;
  background-color: transparent;
`;

const NavItem = styled.a`
  margin: 0 32px;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 2px 2px 0 #666, 3px 3px 0 #555, 4px 4px 0 #444, 5px 5px 0 #333;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #7c3aed;
    transform: scale(1.1);
  }
`;

const Navbar = () => {
    return (
        <NavbarContainer>
            <NavItem href="/">Home</NavItem>
            <NavItem href="/about">About</NavItem>
            <NavItem href="/contact">Contact</NavItem>
        </NavbarContainer>
    );
};

export default Navbar;
