import * as Collapsible from "@radix-ui/react-collapsible"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { FileText, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"

import SideBar from "./SideBar"
import OpenSideBar from "./OpenSideBar"

function AppLayout() {
  const { pathname } = useLocation()
  // Guarda a rota em que o menu foi aberto: ao navegar, ele fecha sozinho.
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null)
  const isMobileMenuOpen = menuOpenedAt === pathname

  function setIsMobileMenuOpen(open: boolean) {
    setMenuOpenedAt(open ? pathname : null)
  }

  useEffect(() => {
    if (!isMobileMenuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpenedAt(null)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isMobileMenuOpen])

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-dvh flex-col overflow-hidden md:flex-row">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-2 md:hidden">
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex size-11 items-center justify-center rounded-lg text-zinc-400 transition-colors duration-150 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <span className="flex items-center gap-2 font-semibold">
            <FileText size={18} className="text-indigo-400" aria-hidden="true" />
            Doc Insights
          </span>
        </header>

        <div className="hidden h-full md:flex">
          <SideBar />
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <Collapsible.Root open onOpenChange={setIsMobileMenuOpen}>
              <motion.div
                className="fixed inset-0 z-40 bg-black/60 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navegação"
                className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] border-r border-zinc-800 bg-zinc-950 md:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              >
                <OpenSideBar />
              </motion.aside>
            </Collapsible.Root>
          )}
        </AnimatePresence>

        <main className="flex-1 min-h-0 min-w-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </MotionConfig>
  )
}

export default AppLayout
