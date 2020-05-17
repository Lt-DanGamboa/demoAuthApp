export interface ApiUserToken{
    token: string;
    userDetails: UserDetails;
    success: boolean;
}

interface UserDetails{
    userName: string;
    fullName: string;
    password: string;
    userRole: string;
}

export interface Credentials{
    username: string;
    password: string;
}