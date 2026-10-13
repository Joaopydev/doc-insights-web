import { Service } from "./Service";


export class AuthService extends Service {
    static async signIn(payload: AuthService.SignInPayload): Promise<AuthService.Response> {
        const { data } = await this.client.post(
            "/signin",
            payload
        )

        return data
    }

    static async signUp(payload: AuthService.SignUpPayload): Promise<AuthService.Response> {
        const { data } = await this.client.post(
            "/signup",
            payload
        )

        return data
    }
}


export namespace AuthService {
    export type Response = {
        accessToken: string
    }

    export type SignInPayload = {
        email: string,
        password: string,
    }

    export type SignUpPayload = {
        name: string,
        email: string,
        password: string,
    }
}