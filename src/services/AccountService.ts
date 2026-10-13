import { Service } from "./Service";
import { type User } from "../types/User";

export class AccountService extends Service {
    static async getUser(){
        const { data } = await this.client.get<AccountService.GetUserResponse>("/me")
        return data.user
    }
}

export namespace AccountService {
    export type GetUserResponse = {
        user: User
    }
}