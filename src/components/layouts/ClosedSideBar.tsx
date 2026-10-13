import * as Collapsible from "@radix-ui/react-collapsible"
import { PanelLeftOpen, Plus, MessageSquare, LogOut } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "../button/Button"
import { useAuth } from "../../contexts/auth/useAuth"

function ClosedSideBar() {
    const { signOut } = useAuth()

    return (
        <div className="w-16 h-full p-4 flex flex-col">
            <div className="flex flex-col gap-6 items-center">
                <Collapsible.Trigger asChild>
                    <PanelLeftOpen
                        size={24}
                        className="hover:text-zinc-800"
                    />
                </Collapsible.Trigger>

                <Link to="/">
                    <Plus
                        size={18}
                        className="hover:text-zinc-800"
                    />
                </Link>

                <MessageSquare
                    size={18}
                    className="hover:text-zinc-800"
                />
            </div>

            <Button
                className="mt-auto flex justify-center items-center hover:text-zinc-800"
                size="icon-sm"
                onClick={signOut}
            >
                <LogOut size={18} />
            </Button>
        </div>
    )
}

export default ClosedSideBar