import {createContext, useContext, useEffect, useState} from "react";
import {User} from "../types/User";
import {useRouter} from "next/router";

const authContext = createContext(null);

export function ProvideAuth({children}) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
}

function useProvideAuth() {
    const [user, setUser] = useState<User | null>(null);

    const signin = async (username: string, password: string) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        params.append('client_secret', password)
        let res = await fetch(`${process.env.API_URL}/api/user/authorize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });
        if (res.status === 200) {
            let tokens = await res.json();

            res = await fetch(`${process.env.API_URL}/api/user/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tokens.access_token,
                }
            })
            if (res.status === 200) {
                let user = await res.json();
                user.accessToken = tokens.access_token;
                user.refreshToken = tokens.refresh_token;
                localStorage.setItem('accessToken', tokens.access_token)
                localStorage.setItem('refreshToken', tokens.refresh_token)
                setUser(user);
            }
        }
        return res;
    }

    const signinWithToken = async (accessToken: string, refreshToken: string) => {
        const res = await fetch(`${process.env.API_URL}/api/user/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        })
        if (res.status === 200) {
            let user = await res.json();
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            setUser(user);
        } else {
            const res = await fetch(`${process.env.API_URL}/api/user/refresh?refresh_token=${refreshToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (res.status === 200) {
                let tokens = await res.json();
                localStorage.setItem('accessToken', tokens.access_token)
                localStorage.setItem('refreshToken', tokens.refresh_token)
                await signinWithToken(tokens.access_token, tokens.refresh_token);
            } else {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
            }
        }
    }

    const signup = async (username: string, password: string, email: string, company: string, fullName: string) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password)
        params.append('email', email);
        if (company) params.append('company', company);
        if (fullName) params.append('full_name', fullName);

        return await fetch(`${process.env.API_URL}/api/user/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                company: company,
                full_name: fullName,
            }),
        });
    }

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }


    return {
        user,
        signin,
        signinWithToken,
        signup,
        logout,
    }
}

export function useRequireAuth(redirectUrl = "/login?login_required=true") {
  const auth = useAuth();
  const router = useRouter();

  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (!auth.user) {

        if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
            auth.signinWithToken(localStorage.getItem('accessToken'), localStorage.getItem('refreshToken'));
        } else {
            router.push(redirectUrl);
        }
    }
  }, [auth, router]);

  return auth;
}
