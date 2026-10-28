import * as Collapsible from "@radix-ui/react-collapsible"
import { PanelLeftOpen, Plus, MessageSquare, LogOut } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "../button/Button"
import { useAuth } from "../../contexts/auth/useAuth"

function ClosedSideBar() {
    const { signOut } = useAuth()

    return (
        <div className="w-full h-full py-3 flex flex-col items-center">
            <div className="flex flex-col gap-2 items-center">
                <Collapsible.Trigger asChild>
                    <Button size="icon" aria-label="Expandir menu" title="Expandir menu">
                        <PanelLeftOpen size={20} aria-hidden="true" />
                    </Button>
                </Collapsible.Trigger>

                <Link
                    to="/"
                    aria-label="Novo documento"
                    title="Novo documento"
                    className="flex size-10 items-center justify-center rounded-lg bg-indigo-500 text-white transition-colors duration-150 hover:bg-indigo-400"
                >
                    <Plus size={18} aria-hidden="true" />
                </Link>

                <Collapsible.Trigger asChild>
                    <Button size="icon" aria-label="Conversas recentes" title="Conversas recentes">
                        <MessageSquare size={18} aria-hidden="true" />
                    </Button>
                </Collapsible.Trigger>
            </div>

            <Button
                className="mt-auto"
                size="icon"
                onClick={signOut}
                aria-label="Sair"
                title="Sair"
            >
                <LogOut size={18} aria-hidden="true" />
            </Button>
        </div>
    )
}

export default ClosedSideBar
