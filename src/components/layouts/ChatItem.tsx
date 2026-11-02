import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "../button/Button"
import { useDeleteChat } from "../../hooks/mutations/useDeleteChat"
import { cn } from "../../utils/cn"
import { useUploads } from "../../store/uploads"

interface IChatItemProps {
  id: string
  documentId: string
  name: string
  isActive: boolean
}

export function ChatItem({ id, documentId, name, isActive }: IChatItemProps) {
  const navigate = useNavigate()
  const { mutateAsync: deleteChat, isPending } = useDeleteChat(id)
  const { removeUploadByDocumentId } = useUploads()

  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const isMenuOpen = menuPosition !== null

  function toggleMenu() {
    if (isMenuOpen) {
      setMenuPosition(null)
      return
    }

    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return

    setMenuPosition({ top: rect.bottom + 4, left: rect.right - 176 })
  }

  function closeMenu() {
    setMenuPosition(null)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!isMenuOpen) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      setMenuPosition(null)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu()
    }

    function handleDismiss() {
      setMenuPosition(null)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("resize", handleDismiss)
    window.addEventListener("scroll", handleDismiss, true)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("resize", handleDismiss)
      window.removeEventListener("scroll", handleDismiss, true)
    }
  }, [isMenuOpen])

  function openConfirm() {
    setMenuPosition(null)
    dialogRef.current?.showModal()
  }

  function closeConfirm() {
    dialogRef.current?.close()
    triggerRef.current?.focus()
  }

  async function handleConfirmDelete() {
    try {
      await deleteChat()
      removeUploadByDocumentId(documentId)
      dialogRef.current?.close()

      if (isActive) navigate("/")
    } catch {
      // mantain the dialog open for the user to try again
    }
  }

  return (
    <div
      className={cn(
        "group relative flex items-center rounded-lg text-zinc-400 transition-colors duration-150 hover:bg-zinc-900 hover:text-zinc-100",
        isActive && "bg-zinc-800 text-zinc-100 hover:bg-zinc-800",
        isMenuOpen && "bg-zinc-900",
      )}
    >
      <Link
        to={`/chat/${id}`}
        title={name}
        aria-current={isActive ? "page" : undefined}
        className="block min-w-0 flex-1 truncate rounded-lg px-3 py-2 text-sm"
      >
        {name}
      </Link>

      <button
        ref={triggerRef}
        type="button"
        onClick={toggleMenu}
        aria-label={`Opções da conversa ${name}`}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        className={cn(
          "mr-1 flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-opacity duration-150 hover:bg-zinc-700 hover:text-zinc-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-indigo-500",
          "opacity-100 md:opacity-0 md:group-hover:opacity-100",
          isMenuOpen && "md:opacity-100",
        )}
      >
        <MoreHorizontal size={16} aria-hidden="true" />
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: menuPosition.top, left: menuPosition.left }}
          className="fixed z-50 w-44 rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-xl shadow-black/40"
        >
          <button
            type="button"
            role="menuitem"
            autoFocus
            onClick={openConfirm}
            className="flex min-h-10 w-full items-center gap-2 rounded-md px-3 text-sm text-red-400 transition-colors duration-150 hover:bg-red-500/10 focus-visible:bg-red-500/10 focus-visible:outline-none"
          >
            <Trash2 size={16} aria-hidden="true" />
            Excluir
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-chat-title-${id}`}
        aria-describedby={`delete-chat-description-${id}`}
        onCancel={(event) => {
          if (isPending) event.preventDefault()
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current && !isPending) closeConfirm()
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-0 text-zinc-100 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col gap-4 p-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <Trash2 size={20} aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 id={`delete-chat-title-${id}`} className="text-base font-semibold">
              Excluir conversa
            </h2>
            <p id={`delete-chat-description-${id}`} className="text-sm text-zinc-400">
              Tem certeza que deseja excluir a conversa{" "}
              <strong className="break-words font-medium text-zinc-200">{name}</strong>? Essa ação
              não pode ser desfeita.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={closeConfirm} disabled={isPending} autoFocus>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmDelete}
              loading={isPending}
              className="bg-red-500 enabled:hover:bg-red-400"
            >
              Excluir
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
