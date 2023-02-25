import styled from "styled-components";
import {useAuth} from "../hooks/useAuth";
import {FormEvent, useRef} from "react";
import {useRouter} from "next/router";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  background-size: cover;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  border-radius: 4px;
  position: relative;
  background-size: cover;
  border: 1px solid #000;
`;

const LoginInput = styled.input`

`;

const LoginButton = styled.button`
`;

const LoginError = styled.div`
  bottom: -16px;
  left: 0;
  right: 0;
  text-align: center;
  color: red;
`;

const RegisterLink = styled.a`
`;

const Popup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 10vh;
  width: 20vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Login() {
    const router = useRouter();
    const {registered} = router.query;

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const errorRef = useRef<HTMLDivElement>(null);

    const auth = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const res = await auth.signin(usernameRef.current.value, passwordRef.current.value);
        if (res.status !== 200) {
            const data = await res.json()
            errorRef.current.innerText = data.detail;
        }
    }

    return (
        <>
            {registered && <Popup>Successfully registered! You can login now</Popup>}
            <LoginContainer>
                <LoginForm onSubmit={handleSubmit}>

                    <LoginError ref={errorRef}></LoginError>
                    <LoginInput type="text" placeholder="Username" ref={usernameRef}/>
                    <LoginInput type="password" placeholder="Password"
                                ref={passwordRef}/>

                    <LoginButton type="submit">Login</LoginButton>
                    <RegisterLink href="/register">Register</RegisterLink>
                </LoginForm>
            </LoginContainer>
        </>
    );
}
