import { useQuery } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { AccountService } from "../../services/AccountService"

type UserParams = {
    accessToken: string | null
}

export function isUnauthorizedError(err: unknown) {
    return isAxiosError(err) && [401, 403].includes(err.response?.status ?? 0)
}

export function useUser({ accessToken }: UserParams) {
    const { data, isFetching, isError } = useQuery({
        enabled: !!accessToken,
        // Token na chave: cada sessão busca o próprio usuário, sem reaproveitar erro/usuário anterior.
        queryKey: ['user', accessToken],
        // Token inválido não melhora tentando de novo: falha logo para cair no login.
        retry: (failureCount, err) => !isUnauthorizedError(err) && failureCount < 3,
        queryFn: async () => {

            try {
                const user = await AccountService.getUser()

                return user
            } catch (err) {
                console.error(err)
                throw err
            }
        }
    })
    return {
        user: data,
        isLoadingUser: isFetching,
        isUserError: isError,
    }
}
