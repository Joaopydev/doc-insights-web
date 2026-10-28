import * as Collapsible from "@radix-ui/react-collapsible"
import { useCycle, motion } from "motion/react"
import { useRef } from "react"

import OpenSideBar from "./OpenSideBar";
import ClosedSideBar from "./ClosedSideBar";

function SideBar() {
    const ref = useRef<HTMLDivElement>(null)
    const [isSideBarOpen, toggleSideBarOpen] = useCycle(true, false)

    return (
        <Collapsible.Root open={isSideBarOpen} onOpenChange={() => toggleSideBarOpen()} asChild>
            <motion.div
                ref={ref}
                initial={isSideBarOpen ? "open" : "closed"}
                animate={isSideBarOpen ? "open" : "closed"}
                variants={{
                    closed: {
                        width: "72px",
                        transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }
                    },
                    open: {
                        width: "264px",
                        transition: {
                            duration: 0.3,
                            ease: "easeOut"
                        }
                    }
                }}
                style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
                className="h-full bg-zinc-950 border-r border-zinc-800"
            >
                {isSideBarOpen ? <OpenSideBar /> : <ClosedSideBar />}
            </motion.div>
        </Collapsible.Root>
    )
}

export default SideBar