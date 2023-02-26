import styled from "styled-components";
import useOnClickOutside from "../hooks/useOnClickOutside";
import {ReactNode, useRef, useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {HiOutlineClipboardCopy} from "react-icons/all";

const ModalBase = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContainer = styled.div`
  position: relative;
  background-color: rgb(20, 20, 20);
  color: #fefefe;
  font-family: "Rubik", sans-serif;
  border: 1px solid rgb(240, 240, 240, 0.3);
  border-radius: 20px;
  padding: 16px;
  width: 90%;
  max-width: 500px;
  height: 90%;
  max-height: 500px;
  overflow: auto;
`;

const ModalTitle = styled.div`
  font-size: 24px;
  margin-bottom: 16px;
  font-family: "Rubik", sans-serif;

  & > h3 {
    font-size: 24px;
    line-height: 0;
    font-weight: 400;
  }

  & > h4 {
    font-weight: 300;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
  }

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background-color: rgb(240, 240, 240, 0.3);
    margin-top: 8px;
  }
`;

const ModalClose = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  font-size: 24px;
  font-weight: 500;
  color: rgb(240, 240, 240, 0.3);
  transition: color 250ms;

  &:hover {
    color: #fff;
  }
`;

const ModalContent = styled.div`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 16px;

  & > * {
    margin-bottom: 16px;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  & > *:first-child {
    margin-top: 0;
  }

  & > *:only-child {
    margin-top: 0;
  }
`;

export const ModalForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 8px;
  font-family: "Rubik", sans-serif;

  & > * {
    margin-bottom: 8px;
  }

  & > input {
    flex: 1;
    border: 1px solid rgb(240, 240, 240, 0.3);
    border-radius: 10px;
    padding: 8px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 16px;
    font-weight: 400;
    transition: background-color 250ms;

    &:focus {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &:-ms-input-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &::-ms-input-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &:-moz-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  font-family: "Rubik", sans-serif;
`;

export const ModalButton = styled.button`
  border: 1px solid rgb(240, 240, 240, 0.3);
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  background-color: ${({color}) => color || "rgba(255, 255, 255, 0.05)"};
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  transition: background-color 250ms;

  &:hover {
    background-color: ${({hoverColor}) => hoverColor || "rgba(255, 255, 255, 0.1)"};
  }
`;

export const ModalFooter = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 32px;
  text-align: center;
`;

export const ModalFooterLink = styled.a`
  color: #fff;
  cursor: pointer;
  transition: color 250ms;

  &:hover {
    color: #fff;
  }
`;

export const ModalFooterCode = styled.code`
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0 4px;
  border-radius: 4px;
  cursor: pointer;
`;

export const ModalFooterCodeBlock = styled.code`
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0 4px;
  border-radius: 4px;
  display: block;
  margin-top: 8px;
`;


type ModalProps = {
    children: ReactNode;
    onClose: () => void;
    title: string;
    description?: string;
}

const Modal = ({children, onClose, title, description}: ModalProps) => {
    const modalRef = useRef(null);

    useOnClickOutside(modalRef, onClose)

    return (
        <ModalBase>
            <ModalContainer ref={modalRef}>
                <ModalClose onClick={onClose}>X</ModalClose>
                <ModalTitle>
                    <h3>{title}</h3>
                    {description && <h4>{description}</h4>}
                </ModalTitle>
                <ModalContent>{children}</ModalContent>
            </ModalContainer>
        </ModalBase>
    )
}

const CopiedText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  border-radius: 10px;
  pointer-events: none;
  z-index: 101;
  animation: fadeOut 750ms ease-in-out forwards;

  @keyframes fadeOut {
  0%, 100% {
    opacity: 0;
  }
  25%, 75% {
    opacity: 1;
  }
}
`;

export const NewApiKeyModal = ({setModal}) => {
    const auth = useAuth();
    const [newKey, setNewKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [copied, setCopied] = useState(false);

    const createNewApiKey = async () => {
        const res = await fetch(process.env.API_URL + "/api/key", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + auth.user.accessToken
            },
        });

        if (res.status === 200) {
            const data = await res.json();
            setNewKey(data.key)
        } else {
            const data = await res.json();
            setError(data.detail)
        }
    }

    const CopyToClipboard = () => {
        navigator.clipboard.writeText(newKey);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 750)
    }

    return (
        <Modal onClose={() => setModal(null)} title="New API key"
               description="Create new API key to use InsightGuard in your next awesome app! (P.S. for now writing name and description doesn't work sorry)">
            <ModalForm>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Name"/>
            </ModalForm>
            <ModalForm>
                <label htmlFor="description">Description</label>
                <input type="text" id="description" placeholder="Description"/>
            </ModalForm>
            <ModalButtons>
                <ModalButton onClick={() => setModal(null)}>Cancel</ModalButton>
                <ModalButton onClick={() => createNewApiKey()}
                             color="rgb(30, 130, 100, 1)"
                             hoverColor="rgb(30, 160, 100, 1)">Create</ModalButton>
            </ModalButtons>
            {newKey && (
                <>
                    {copied && <CopiedText><HiOutlineClipboardCopy/>Copied to clipboard!</CopiedText>}
                    <ModalFooter>
                        <p>Your new API key: <ModalFooterCode
                            onClick={CopyToClipboard}>{newKey}</ModalFooterCode></p>
                        <p>To learn how to use it please check <ModalFooterLink
                            href="/documentation">documentation</ModalFooterLink></p>
                    </ModalFooter>
                </>
            )}
            {error && (
                <ModalFooter>
                    <p>Something went
                        wrong: <ModalFooterCodeBlock>{error}</ModalFooterCodeBlock></p>
                </ModalFooter>
            )}
        </Modal>
    )
}

export default Modal;
