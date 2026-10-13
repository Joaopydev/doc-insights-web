import { createContext } from "react";

import type { SignInParams, SignUpParams } from "../../types/Auth";
import type { User } from "../../types/User";

interface IAuthContextValue {
    user: User | null
    isLoading: boolean
    isLoggedIn: boolean
    token?: string
    signIn: (params: SignInParams) => Promise<void>
    signUp: (params: SignUpParams) => Promise<void>
    signOut: () => Promise<void>
}

export const AuthContext = createContext({} as IAuthContextValue)