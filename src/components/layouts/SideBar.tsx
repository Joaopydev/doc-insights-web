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
                        width: "80px",
                        transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }
                    },
                    open: {
                        width: "250px",
                        transition: {
                            duration: 0.5
                        }
                    }
                }}
                style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
                className="bg-zinc-950 border border-zinc-950 border-r-4 border-r-amber-600"
            >
                {isSideBarOpen ? <OpenSideBar /> : <ClosedSideBar />}
            </motion.div>
        </Collapsible.Root>
    )
}

export default SideBar