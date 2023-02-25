export type User = {
    id: string;
    email: string;
    username: string;
    fullName: string | null;
    company: string | null;
    accessToken: string;
    refreshToken: string;
}
