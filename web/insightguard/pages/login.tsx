import styled from "styled-components";
import {useAuth} from "../hooks/useAuth";
import {FormEvent, useRef, useState} from "react";
import {useRouter} from "next/router";
import {
    AiOutlineUser,
    FaHouseUser,
    FiLock,
    FiMail,
    RiLockLine,
    TbBuildingSkyscraper,
    FiShield
} from "react-icons/all";
import Navbar from "../components/navbar";

const LoginContainer = styled.div`

`;

const LoginCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
  position: relative;
  background-size: cover;
  background-color: rgb(20, 20, 20);
  font-family: "Rubik", sans-serif;
  color: #fefefe;

  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

const LoginCard = styled.div`
  width: 450px;
  background: rgba(28, 28, 28, .5);
  border: 1px solid rgba(255, 255, 255, .1);
  padding: 4rem;
  border-radius: 10px;
  position: relative;

  ::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, .15);
    transform: rotate(-6deg);
    border-radius: 10px;
    z-index: -1;
  }

  input[type="text"], input[type="password"], input[type="email"] {
    border: none;
    outline: none;
    background: rgba(7, 7, 7, .3);
    padding: 1rem 1.5rem 1rem calc(1rem * 3.5);
    border-radius: 100px;
    width: 100%;
    transition: background .5s;
    color: #fefefe;
  }

  input:focus {
    background: rgba(7, 7, 7, 0.75);
  }

  button {
    color: white;
    padding: 1rem;
    border-radius: 100px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: background .5s;
    border: none;
    background-color: rgb(5, 5, 5, 0.5);

    :hover {
      background-color: rgba(5, 5, 5);
      cursor: pointer;
    }
  }

  @media (max-width: 768px) {
    width: 280px;
    padding: 2rem;
  }
`;

const RegisterCard = styled(LoginCard)`
  width: 900px;
`;

const LoginCardLogo = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  .login-icon {
    font-size: 3rem;
    color: #fefefe;
  }

  a {
    text-decoration: none;
    color: #fff;

    :hover {
      text-decoration: underline;
    }
  }
`;

const LoginCardHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  & > h1 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: .5rem;
  }

  & > div {
    font-size: calc(1rem * .8);
    opacity: .8;
  }
`;

const LoginCardForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .form-item {
    position: relative;
  }

  & > .form-item-other {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: calc(1rem * .8);
    margin-bottom: .5rem;
  }
`;

const RegisterCardForm = styled.form`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;

  .form-item {
    position: relative;
  }

  & > .form-item-other {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: calc(1rem * .8);
    margin-bottom: .5rem;
  }
`;


const FormItem = styled.div`
`;

const FormItemIcon = styled.span`
  position: absolute;
  top: .82rem;
  left: 1.4rem;
  font-size: 1.3rem;
  opacity: .4;
`;

const FormItemOther = styled.div`
`;

const LoginCardFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: calc(1rem * .8);
  transition: text-decoration 500ms;

  p {
    color: rgb(240, 240, 240, 0.5);
  }

  a {
    text-decoration: none;
    color: #fff;
    cursor: pointer;

    :hover {
      text-decoration: underline;
    }
  }
`;

export default function Login() {
    const router = useRouter();
    const {registered, login_required} = router.query;

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const email = useRef<HTMLInputElement>(null);
    const company = useRef<HTMLInputElement>(null);
    const fullName = useRef<HTMLInputElement>(null);

    const errorRef = useRef<HTMLDivElement>(null);

    const auth = useAuth();

    const [register, setRegister] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const res = await auth.signin(usernameRef.current.value, passwordRef.current.value);
        if (res.status !== 200) {
            const data = await res.json()
            errorRef.current.innerText = data.detail;
        } else {
            router.push('/dashboard');
        }
    }

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        const res = await auth.signup(usernameRef.current.value, passwordRef.current.value, email.current.value, company.current.value, fullName.current.value);
        if (res.status !== 200) {
            const data = await res.json()
            errorRef.current.innerText = data.detail;
        } else {
            const res = await auth.signin(usernameRef.current.value, passwordRef.current.value);
            router.push('/dashboard');
        }
    }

    return (
        <>
            <Navbar landing={true}/>
            {/*{registered && <Popup>Successfully registered! You can login now</Popup>}*/}
            {/*{login_required && <Popup>You need to login to access this page</Popup>}*/}
            {register ? (
                <LoginContainer>
                    <LoginCardContainer>
                        <RegisterCard>
                            <LoginCardLogo>
                                <FiShield className="login-icon"/>
                            </LoginCardLogo>
                            <LoginCardHeader>
                                <h1>Sign up</h1>
                                <div>Sign up to your account</div>
                            </LoginCardHeader>
                            <RegisterCardForm onSubmit={handleRegister}>
                                <FormItem className="form-item">
                                    <FormItemIcon className="material-symbols-rounded">
                                        <AiOutlineUser/>
                                    </FormItemIcon>
                                    <input type="text" placeholder="Username*"
                                           ref={usernameRef} autoFocus required/>
                                </FormItem>
                                <FormItem className="form-item">
                                    <FormItemIcon className="material-symbols-rounded">
                                        <FiMail/>
                                    </FormItemIcon>
                                    <input type="text" placeholder="Email*"
                                           ref={email} autoFocus required/>
                                </FormItem>
                                <FormItem className="form-item">
                                    <FormItemIcon className="material-symbols-rounded">
                                        <FiLock/>
                                    </FormItemIcon>
                                    <input type="password" placeholder="Password*"
                                           ref={passwordRef} required/>
                                </FormItem>
                                <FormItem className="form-item">
                                    <FormItemIcon className="material-symbols-rounded">
                                        <FaHouseUser/>
                                    </FormItemIcon>
                                    <input type="text" placeholder="Full Name"
                                           ref={fullName} autoFocus/>
                                </FormItem>
                                <FormItem className="form-item">
                                    <FormItemIcon className="material-symbols-rounded">
                                        <FiLock/>
                                    </FormItemIcon>
                                    <input type="password"
                                           placeholder="Confirm Password*"
                                           ref={passwordRef} required/>
                                </FormItem>
                                <FormItem className="form-item">
                                    <FormItemIcon className="material-symbols-rounded">
                                        <TbBuildingSkyscraper/>
                                    </FormItemIcon>
                                    <input type="text" placeholder="Company"
                                           ref={company} autoFocus/>
                                </FormItem>
                                <FormItemOther className="form-item-other">
                                    <div ref={errorRef} style={{color: 'red'}}/>
                                </FormItemOther>
                                <button type="submit">Sign up</button>
                            </RegisterCardForm>
                            <LoginCardFooter>
                                <p>Already have an account? <a
                                    onClick={() => setRegister(false)}>Login</a></p>
                            </LoginCardFooter>

                        </RegisterCard>
                    </LoginCardContainer>
                </LoginContainer>
            ) : (
                <LoginContainer>
                    <LoginCardContainer>
                        <LoginCard>
                            <LoginCardLogo>
                                <FiShield className="login-icon"/>
                            </LoginCardLogo>
                            <LoginCardHeader>
                                <h1>Sign in</h1>
                                <div>Sign in to your account</div>
                            </LoginCardHeader>
                            <LoginCardForm onSubmit={handleSubmit}>
                                <FormItem className="form-item">
                                    <FormItemIcon className="material-symbols-rounded">
                                        <FiMail/>
                                    </FormItemIcon>
                                    <input type="text" placeholder="Username"
                                           ref={usernameRef} autoFocus required/>
                                </FormItem>
                                <FormItem className="form-item">
                                    <FormItemIcon className="material-symbols-rounded">
                                        <RiLockLine/>
                                    </FormItemIcon>
                                    <input type="password" placeholder="Password"
                                           ref={passwordRef} required/>
                                </FormItem>
                                <FormItemOther className="form-item-other">
                                    <div ref={errorRef} style={{color: 'red'}}/>
                                    <a href="#">Forgot password?</a>
                                </FormItemOther>
                                <button type="submit">Sign in</button>
                            </LoginCardForm>
                            <LoginCardFooter>
                                <p>Don't have an account? <a
                                    onClick={() => setRegister(true)}>Register</a>
                                </p>
                            </LoginCardFooter>
                        </LoginCard>
                    </LoginCardContainer>
                </LoginContainer>)}
        </>
    );
}
