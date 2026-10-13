import { use } from "react";
import { WebSocketContext } from ".";

export function useWebSocket() {
    return use(WebSocketContext)
}