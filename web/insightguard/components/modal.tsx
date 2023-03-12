import styled from "styled-components";
import useOnClickOutside from "../hooks/useOnClickOutside";
import {ReactNode, useEffect, useRef, useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {
    BsKeyFill,
    FaEye,
    FiLock, FiUnlock,
    HiOutlineClipboardCopy,
    IoAnalyticsOutline
} from "react-icons/all";
import {Key} from "../types/Key";
import {pulse} from "./profile";
import {useRouter} from "next/router";

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
    color: rgb(255, 255, 255, 0.8);
    font-size: 16px;
    font-weight: 400;
    transition: background-color 250ms;

    &:focus {
      background-color: rgba(255, 255, 255, 0.2);
      color: #fefefe;
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

    &:disabled {
      background-color: rgba(255, 255, 255, 0.05);
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
    background-color: rgba(255, 255, 255, 0.1);
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
  color: rgb(255, 255, 255, 0.8);;
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

const Popup = styled.div`
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
  animation: fadeOut 1000ms ease-in-out forwards;

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
        const res = await fetch(process.env.API_URL + "/api/key/", {
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

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(newKey);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000)
    }

    return (
        <Modal onClose={() => setModal(null)} title="New API key"
               description="Create API key to use InsightGuard in your next awesome app! (P.S. for now writing name and description doesn't work, but we had to fill blank space. Sorry)">
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
                <ModalButton onClick={() => createNewApiKey()}>Create</ModalButton>
            </ModalButtons>
            {newKey && (
                <>
                    {copied && <Popup><HiOutlineClipboardCopy/>Copied to clipboard!</Popup>}
                    <ModalFooter>
                        <p>Your new API key: <ModalFooterCode
                            onClick={copyToClipboard}>{newKey}</ModalFooterCode></p>
                        <p>To learn how to use it please check <ModalFooterLink
                            href={`${process.env.API_URL}/api/docs`}>documentation</ModalFooterLink></p>
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

const ModalKeys = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-y: auto;

  & > p {
    color: rgb(255, 255, 255, 0.5);
  }
`;

const KeyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: center;
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const KeyHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  min-width: 85%;
  margin-right: 16px;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const KeyHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  width: 100%;
`;

const KeyContainerSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;

  animation: ${pulse} 2s ease-in-out infinite;
`;

const KeyIcon = styled.div`
  display: flex;
  justify-content: center;

  ::after {
    content: "";
    display: block;
    width: 1px;
    height: 20px;
    background-color: rgba(255, 255, 255);
    margin-inline: 10px;
  }
`;

const KeyContainerUtils = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: auto;
  cursor: pointer;
  gap: 12px;
  color: rgba(255, 255, 255, 0.5);
  transition: color 500ms ease-in-out;

  & > .icon:hover {
    color: rgba(255, 255, 255, 1);
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 8px;
  }
`;

const ModalDate = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 2px 0 0;
`;

const ConfirmModal = styled.div`
  position: absolute;
  background-color: rgba(20, 20, 20, 1);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;

  & > p {
    color: rgb(255, 255, 255, 0.5);
  }
`;

type ApiKeyCardProps = {
    keyData: Key;
    analytics: boolean;
}

export const ApiKeyCard = ({
                               keyData,
                               analytics = false,
                           }: ApiKeyCardProps) => {
    const auth = useAuth();
    const router = useRouter();
    const [showDetails, setShowDetails] = useState(false);
    const [copied, setCopied] = useState(false);

    const [data, setData] = useState<Key | null>(keyData);

    const [showLockConfirmation, setShowLockConfirmation] = useState(false);
    const [showUnlockConfirmation, setShowUnlockConfirmation] = useState(false);
    const confirmModalRef = useRef<HTMLDivElement>(null);

    // used for animation purposes
    const [locked, setLocked] = useState(false);
    const [unlocked, setUnlocked] = useState(false);

    useOnClickOutside(confirmModalRef, () => {
        showLockConfirmation && setShowLockConfirmation(false);
        showUnlockConfirmation && setShowUnlockConfirmation(false);
    });

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(data.key);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000)
    }

    const lockApiKey = async () => {
        const res = await fetch(process.env.API_URL + '/api/key/disable?key=' + data.key,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.user.accessToken
                }
            })
        if (res.status === 200) {
            setData(await res.json())
            setLocked(true);
            setInterval(() => {
                setLocked(false);
                setShowLockConfirmation(false)
            }, 1000)

        }
    }

    const unlockApiKey = async () => {
        const res = await fetch(process.env.API_URL + '/api/key/enable?key=' + data.key,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.user.accessToken
                }
            })
        if (res.status === 200) {
            setData(await res.json())
            setUnlocked(true);
            setInterval(() => {
                setUnlocked(false);
                setShowUnlockConfirmation(false)
            }, 1000)

        }
    }

    return (
        <>
            {copied &&
                <Popup><HiOutlineClipboardCopy/>Copied to clipboard!</Popup>
            }
            {
                showUnlockConfirmation && (
                    <ModalBase>
                        {unlocked &&
                            <Popup>Unlocked key!</Popup>
                        }
                        <ConfirmModal ref={confirmModalRef}>
                            <ModalTitle>
                                <h3>Are you sure?</h3>
                                <h4>
                                    <p>Are you sure you want to unlock this API key?</p>
                                    <p>Unlocked API keys can be used to access the API.</p>
                                    <p>Unlocked API keys can be locked at any time.</p>
                                </h4>
                            </ModalTitle>
                            <ModalButtons>
                                <ModalButton
                                    onClick={() => setShowUnlockConfirmation(false)}>Cancel</ModalButton>
                                <ModalButton
                                    onClick={() => unlockApiKey()}>Unlock</ModalButton>
                            </ModalButtons>
                        </ConfirmModal>
                    </ModalBase>
                )
            }
            {
                showLockConfirmation && (
                    <ModalBase>
                        {locked &&
                            <Popup>Locked key!</Popup>
                        }
                        <ConfirmModal ref={confirmModalRef}>
                            <ModalTitle>
                                <h3>Are you sure?</h3>
                                <h4>
                                    <p>Are you sure you want to lock this API key?</p>
                                    <p>Locked API keys cannot be used to access the API.</p>
                                    <p>Locked API keys can be unlocked at any time.</p>
                                </h4>
                            </ModalTitle>
                            <ModalButtons>
                                <ModalButton
                                    onClick={() => setShowLockConfirmation(false)}>Cancel</ModalButton>
                                <ModalButton
                                    onClick={() => lockApiKey()}>Lock</ModalButton>
                            </ModalButtons>
                        </ConfirmModal>
                    </ModalBase>
                )
            }

            <KeyContainer>
                <KeyHeaderContainer>
                    <KeyHeader>
                        <KeyIcon>
                            <BsKeyFill/>
                        </KeyIcon>
                        <ModalFooterCode onClick={copyToClipboard}>{showDetails ? (
                            <>
                                {data.key}
                            </>
                        ) : (
                            <>
                                {data.key.substring(0, 10)}...{data.key.substring(data.key.length - 10, data.key.length)}
                            </>
                        )}</ModalFooterCode>
                    </KeyHeader>
                    <ModalDate>
                        Created
                        at {new Date(data.created_at).toLocaleString()} {analytics && `• Total usage: ${data.usage}`} {data.disabled && `• Disabled`}
                    </ModalDate>
                </KeyHeaderContainer>
                <KeyContainerUtils>
                    <FaEye onClick={() => setShowDetails(!showDetails)}
                           className="icon"/>
                    {analytics ? <IoAnalyticsOutline className="icon"
                                                     onClick={() => router.push('/analytics/' + data.id)}/> :
                        (<>
                            {data.disabled ?
                                <FiUnlock className="icon"
                                          onClick={() => setShowUnlockConfirmation(true)}/> :
                                <FiLock className="icon"
                                        onClick={() => setShowLockConfirmation(true)}/>
                            }
                        </>)
                    }

                </KeyContainerUtils>
            </KeyContainer>
        </>
    )
}

export const ApiKeysModal = ({setModal, analytics = false}) => {
    const auth = useAuth();

    // We don't have to secure keys in state, because Next.js handles it for us
    const [apiKeys, setApiKeys] = useState<Key[]>([]);

    const errorRef = useRef(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApiKeys = async () => {
            setLoading(true)
            const res = await fetch(process.env.API_URL + "/api/user/keys", {
                headers: {
                    'Authorization': 'Bearer ' + auth.user.accessToken
                }
            });

            if (res.status === 200) {
                const data = await res.json();

                setApiKeys(data);
            } else {
                const data = await res.json();
                errorRef.current.innerText = data.detail;
            }
            setLoading(false)
        }

        fetchApiKeys();
    }, [auth.user.accessToken])

    return (
        <Modal onClose={() => setModal(null)}
               title={analytics ? "API keys analytics" : "API keys"}
               description={analytics ? "Choose API key to analyze" : "Manage your API keys"}>
            {loading ? (
                <ModalKeys>
                    {Array.from(Array(3).keys()).map(key => (
                        <KeyContainerSkeleton key={key}/>
                    ))}
                </ModalKeys>
            ) : (
                <>
                    {apiKeys.length > 0 ? (
                        <ModalKeys>
                            {apiKeys.map(key => (
                                <ApiKeyCard key={key.id} keyData={key}
                                            analytics={analytics}/>
                            ))}
                        </ModalKeys>
                    ) : (
                        <ModalKeys>
                            <p>You don&apos;t have any API keys yet. <ModalFooterLink
                                onClick={() => setModal(<NewApiKeyModal
                                    setModal={setModal}/>)}
                                href="#">Create one</ModalFooterLink></p>
                        </ModalKeys>
                    )}</>
            )}
        </Modal>
    )
}

const ModalError = styled.p`
  color: #ff0000;
  font-size: 14px;
  margin-top: 10px;
`

export const UserProfileModal = ({setModal}) => {
    const auth = useAuth();

    const fullNameRef = useRef(null);
    const companyRef = useRef(null);
    const usernameRef = useRef(null);
    const emailRef = useRef(null);

    const errorRef = useRef(null);
    const [updated, setUpdated] = useState(false);

    const updateProfile = async () => {
        let data = {}
        fullNameRef.current.value != auth.user.fullName ? data["full_name"] = fullNameRef.current.value : null
        companyRef.current.value != auth.user.company ? data["company"] = companyRef.current.value : null
        usernameRef.current.value != auth.user.username ? data["username"] = usernameRef.current.value : null
        emailRef.current.value != auth.user.email ? data["email"] = emailRef.current.value : null
        const res = await fetch(process.env.API_URL + "/api/user/", {
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + auth.user.accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        if (res.status === 200) {
            const data = await res.json();

            let newUser = auth.user;
            newUser.fullName = fullNameRef.current.value;
            newUser.company = companyRef.current.value;
            newUser.username = usernameRef.current.value;
            newUser.email = emailRef.current.value;

            auth.setUser(newUser);
            setUpdated(true)
            setInterval(() => {
                setUpdated(false)
            }, 1000)
        } else {
            const data = await res.json();
            console.log(data)
            errorRef.current.innerText = data.detail;
        }
    }

    return (
        <>
            {updated &&
                <Popup>Updated account!</Popup>
            }
            <Modal onClose={() => setModal(null)} title="User profile"
                   description="Manage your account">
                <ModalForm>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" placeholder="Username"
                           value={auth.user.username} ref={usernameRef} required
                           disabled/>
                </ModalForm>
                <ModalForm>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" placeholder="E-mail"
                           value={auth.user.email} ref={emailRef} required disabled/>
                </ModalForm>
                <ModalForm>
                    <label htmlFor="fullname">Full name</label>
                    <input type="text" id="fullname" placeholder="Full Name"
                           value={auth.user.fullName} ref={fullNameRef}/>
                </ModalForm>
                <ModalForm>
                    <label htmlFor="company">Company</label>
                    <input type="email" id="company" placeholder="Company"
                           value={auth.user.company} ref={companyRef}/>
                </ModalForm>
                <ModalButtons>
                    <ModalButton onClick={() => setModal(null)}>Cancel</ModalButton>
                    <ModalButton onClick={() => updateProfile()}>Update</ModalButton>
                </ModalButtons>

                <ModalError ref={errorRef}/>
            </Modal>
        </>
    )
}

export default Modal;
