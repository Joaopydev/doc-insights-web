import { useQueryClient } from "@tanstack/react-query"

import { useEffect, useState } from "react"
import { useAuth } from "../auth/useAuth"
import { env } from "../../config/env"
import { WebSocketContext } from "."


export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [isThinkingChats, setIsThinkingChats] = useState<Record<string, boolean>>({})

  useEffect(() => {
      if (!token) return

      let ws: WebSocket | null = null
      let reconnectTimer: ReturnType<typeof setTimeout> | undefined
      let retryCount = 0
      let disposed = false

      const connect = () => {
          if (disposed) return

          ws = new WebSocket(
              `${env.api.websocketEndPoint}?token=${token}`
          )

          ws.onopen = () => {
              console.log("WebSocket conectado")
              retryCount = 0
          }

          ws.onmessage = async (event) => {
            const message = JSON.parse(event.data)
            const conversationId = message.conversation_id

            await queryClient.invalidateQueries({
                queryKey: ["messages", conversationId],
            })

            setIsThinkingChats((prev) => ({
                ...prev,
                [conversationId]: false,
            }))
          }

          ws.onclose = (event) => {
              console.log("WebSocket fechado", {
                  code: event.code,
                  reason: event.reason,
                  wasClean: event.wasClean,
              })

              if (disposed) return

              const delay = Math.min(
                  1000 * 2 ** retryCount,
                  30000
              )

              retryCount += 1

              console.log(`Tentando reconectar em ${delay / 1000}s`)

              reconnectTimer = setTimeout(connect, delay)
          }

          ws.onerror = (event) => {
              console.error("Erro no WebSocket:", event)
          }
      }

      connect()

      return () => {
          disposed = true

          if (reconnectTimer) {
              clearTimeout(reconnectTimer)
          }

          ws?.close()
      }
  }, [token, queryClient])
  return (
    <WebSocketContext
      value={{
        isThinkingChats,
        setIsThinkingChats,
      }}
    >
      {children}
    </WebSocketContext>
  )
}