import React, { createContext } from "react";

interface IWebSocketContextValue {
    isThinkingChats: Record<string, boolean>
    setIsThinkingChats: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

export const WebSocketContext = createContext({} as IWebSocketContextValue)