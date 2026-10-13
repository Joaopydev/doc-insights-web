import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query"

import { AuthContext } from ".";
import { AuthTokensManager } from "../../lib/AuthTokenManager";
import { AuthService } from "../../services/AuthService";
import { Service } from "../../services/Service";
import { useUser } from "../../hooks/queries/useUser";
import { useUploads } from "../../store/uploads";


export function AuthProviderContext({ children }: { children: React.ReactNode }) {
    const { clearUploads } = useUploads()
    const [tokens, setTokens] = useState<AuthTokensManager.Tokens | null>(null)
    const { user, isLoadingUser } = useUser({ accessToken: tokens?.accessToken ?? null})

    useEffect(() => {
        async function load() {
            const tokens = await AuthTokensManager.load()
            setTokens(tokens)
        }
        load()
    }, [])

    useEffect(() => {
        async function run() {
            if (!tokens) {
                Service.removeAccessToken()
                return
            }

            await AuthTokensManager.save(tokens)
            Service.setAccessToken(tokens.accessToken)
        }
        run()
    }, [tokens])

    const { mutateAsync: signIn } = useMutation({
        mutationFn: async (payload: AuthService.SignInPayload) => {
            const data = await AuthService.signIn(payload)
            setTokens(data)
        }
    })

    const { mutateAsync: signUp } = useMutation({
        mutationFn: async (payload: AuthService.SignUpPayload) => {
            const data = await AuthService.signUp(payload)
            setTokens(data)
        }
    })

    const signOut = useCallback(async () => {
        setTokens(null)
        clearUploads()
        await AuthTokensManager.clear()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user: user || null,
                isLoading: isLoadingUser,
                isLoggedIn: !!tokens && !!user,
                token: tokens?.accessToken,
                signIn: signIn,
                signUp: signUp,
                signOut: signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}