import { useQuery } from "@tanstack/react-query"
import { AccountService } from "../../services/AccountService"

type UserParams = {
    accessToken: string | null
}

export function useUser({ accessToken }: UserParams) {
    const { data, isFetching } = useQuery({
        enabled: !!accessToken,
        queryKey: ['user'],
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
    }
}