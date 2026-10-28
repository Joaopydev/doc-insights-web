import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { AuthContext } from ".";
import { AuthTokensManager } from "../../lib/AuthTokenManager";
import { AuthService } from "../../services/AuthService";
import { Service } from "../../services/Service";
import { useUser } from "../../hooks/queries/useUser";
import { useUploads } from "../../store/uploads";


export function AuthProviderContext({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient()
    const { clearUploads } = useUploads()
    const [tokens, setTokens] = useState<AuthTokensManager.Tokens | null>(null)
    const [isLoadingTokens, setIsLoadingTokens] = useState(true)
    const { user, isUserError } = useUser({ accessToken: tokens?.accessToken ?? null})

    // O header precisa estar no client antes de setTokens, senão o /me
    // (disparado assim que há token) pode sair sem Authorization.
    const applyTokens = useCallback((newTokens: AuthTokensManager.Tokens | null) => {
        if (newTokens) {
            Service.setAccessToken(newTokens.accessToken)
        } else {
            Service.removeAccessToken()
        }
        setTokens(newTokens)
    }, [])

    useEffect(() => {
        async function load() {
            const tokens = await AuthTokensManager.load()
            applyTokens(tokens)
            setIsLoadingTokens(false)
        }
        load()
    }, [applyTokens])

    useEffect(() => {
        if (tokens) {
            AuthTokensManager.save(tokens)
        }
    }, [tokens])

    const signOut = useCallback(async () => {
        applyTokens(null)
        queryClient.removeQueries({ queryKey: ['user'] })
        clearUploads()
        await AuthTokensManager.clear()
    }, [applyTokens, queryClient, clearUploads])

    const { mutateAsync: signIn } = useMutation({
        mutationFn: async (payload: AuthService.SignInPayload) => {
            const data = await AuthService.signIn(payload)
            applyTokens(data)
        }
    })

    const { mutateAsync: signUp } = useMutation({
        mutationFn: async (payload: AuthService.SignUpPayload) => {
            const data = await AuthService.signUp(payload)
            applyTokens(data)
        }
    })

    // Carregando = ainda lendo o token do storage, ou há token mas o usuário ainda não chegou.
    const isLoading = isLoadingTokens || (!!tokens && !user && !isUserError)

    return (
        <AuthContext.Provider
            value={{
                user: user || null,
                isLoading,
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
