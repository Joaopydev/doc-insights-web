import * as Collapsible from "@radix-ui/react-collapsible"
import { FileText, LogOut, PanelLeftClose } from "lucide-react"

import { useAuth } from "../../contexts/auth/useAuth"
import NewButton from "./NewButton"
import RecentConversations from "./RecentsConversations"
import { Button } from "../button/Button"


function OpenSideBar() {
    const { signOut, user } = useAuth()

    return (
        <div className="w-full min-w-64 h-full min-h-0 p-3 flex flex-col">
            <div className="flex flex-col flex-1 min-h-0">
                <div className="flex justify-between items-center mb-4 pl-2">
                    <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                        <span className="flex size-7 items-center justify-center rounded-md bg-indigo-500/15">
                            <FileText size={16} className="text-indigo-400" aria-hidden="true" />
                        </span>
                        Doc Insights
                    </h1>

                    <Collapsible.Trigger asChild>
                        <Button size="icon" aria-label="Recolher menu" title="Recolher menu">
                            <PanelLeftClose size={20} aria-hidden="true" />
                        </Button>
                    </Collapsible.Trigger>
                </div>

                <NewButton />

                <RecentConversations />
            </div>

            <div className="flex shrink-0 items-center gap-3 border-t border-zinc-800 pt-3 mt-3 pl-2">
                <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-200"
                    aria-hidden="true"
                >
                    {user?.name?.charAt(0).toUpperCase()}
                </span>
                <span className="flex-1 truncate text-sm text-zinc-300">{`Olá, ${user?.name}`}</span>
                <Button
                    size="icon"
                    onClick={signOut}
                    aria-label="Sair"
                    title="Sair"
                >
                    <LogOut size={18} aria-hidden="true" />
                </Button>
            </div>
        </div>
    )
}

export default OpenSideBar
