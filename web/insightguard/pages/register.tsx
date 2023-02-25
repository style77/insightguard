import {useAuth} from "../hooks/useAuth";
import {FormEvent, useRef} from "react";
import styled from "styled-components";
import {useRouter} from "next/router";

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative;
  background-size: cover;
`;

const RegisterForm = styled.form`
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

const RegisterInput = styled.input`
`;

const RegisterButton = styled.button`
`;

const RegisterError = styled.div`
  color: red;
`;

export default function Register() {
    const auth = useAuth();
    const router = useRouter();

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const companyRef = useRef<HTMLInputElement>(null);
    const fullNameRef = useRef<HTMLInputElement>(null);
    const registerErrorRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await auth.signup(usernameRef.current.value, passwordRef.current.value, emailRef.current.value, companyRef.current.value, fullNameRef.current.value);
        if (res.status !== 200) {
            const data = await res.json()
            registerErrorRef.current.innerText = data.detail;
        } else {
            registerErrorRef.current.innerText = "Successfully registered!";
            router.push("/login?registered=true");
        }
    }

    return (
        <RegisterContainer>
            <RegisterForm onSubmit={handleSubmit}>
                <RegisterInput ref={usernameRef} placeholder="Username"/>
                <RegisterInput ref={passwordRef} placeholder="Password" type="password"/>
                <RegisterInput ref={emailRef} placeholder="Email" type="email"/>
                <RegisterInput ref={companyRef} placeholder="Company"/>
                <RegisterInput ref={fullNameRef} placeholder="Full Name"/>
                <RegisterError ref={registerErrorRef}></RegisterError>
                <RegisterButton>Register</RegisterButton>
            </RegisterForm>
        </RegisterContainer>
    );
}
