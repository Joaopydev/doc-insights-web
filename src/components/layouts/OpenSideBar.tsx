import * as Collapsible from "@radix-ui/react-collapsible"
import { LogOut, PanelLeftClose } from "lucide-react"

import { useAuth } from "../../contexts/auth/useAuth"
import NewButton from "./NewButton"
import RecentConversations from "./RecentsConversations"
import { Button } from "../button/Button"


function OpenSideBar() {
    const { signOut, user } = useAuth()

    return (
        <div className="w-64 h-full p-4 flex flex-col">
            <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-xl font-bold">Doc Insights</h1>

                    <Collapsible.Trigger asChild>
                        <PanelLeftClose className="hover:text-zinc-800" />
                    </Collapsible.Trigger>
                </div>

                <NewButton />

                <RecentConversations />
            </div>

            <div className="flex items-center gap-2">
                <Button
                    className="flex items-center gap-2 hover:text-zinc-800"
                    size="icon-sm"
                    onClick={signOut}
                    >
                    <LogOut size={18} />
                </Button>
                <span className="text-sm text-zinc-400">{`Olá, ${user?.name}`}</span>
            </div>
        </div>
    )
}

export default OpenSideBar