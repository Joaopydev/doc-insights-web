import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useParams } from "react-router-dom";
import { SendHorizonalIcon } from "lucide-react";
import { useEffect, useState } from "react";

import Input from "../input/Input";

import { useChat } from "../../hooks/queries/useChat";
import { useQuestion } from "../../hooks/mutations/useQuestion";
import { Button } from "../button/Button";
import { MessagesList } from "../message/MessagesList";
import { useWebSocket } from "../../contexts/webscoket/useWebScoket";


const schema = z.object({
  question: z.string().min(2, "A pergunta deve conter no mínimo 2 caracteres.")
})

function ChatScreen() {
  const { chatId } = useParams();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      question: ""
    }
  })

  useEffect(() => {
    if (!chatId) return

    form.setValue("question", drafts[chatId] ?? "")
  }, [chatId])

  const question = form.watch("question")

  const { chat } = useChat({ chatId: chatId! })
  const { mutateAsync: sendQuestion } = useQuestion(chatId!)
  const { isThinkingChats, setIsThinkingChats } = useWebSocket() 

  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const handleSubmit = form.handleSubmit(async (formData) => {
      try {
        setIsThinkingChats(prev => ({
          ...prev,
          [chatId!]: true,
        }))
        setDrafts(prev => ({
            ...prev,
            [chatId!]: "",
        }))
        form.reset()
        await sendQuestion({ question: formData.question, documentId: chat?.documentId!})
      } catch (err) {
        console.log(err)
        form.reset()
      }
  })

  return (
    <div className="flex h-full w-full flex-col">
      <MessagesList chatId={chatId!} />

      <div className="w-full shrink-0 border-t border-zinc-900 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:pb-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="relative">
            <Controller 
              control={form.control}
              name="question"
              render={({ field }) => (
                <Input
                  placeholder="Digite sua pergunta..."
                  aria-label="Pergunta sobre o documento"
                  className="min-h-12 rounded-xl pr-14"
                  value={field.value}
                  onChange={(event) => {
                      field.onChange(event)

                      setDrafts(prev => ({
                          ...prev,
                          [chatId!]: event,
                      }))
                  }}
                  onKeyDown={async (event) => {
                    if (event.key === "Enter" && field.value.trim() !== "") {
                      if (!isThinkingChats[chatId!]) {
                        await handleSubmit()
                        event.preventDefault()
                      }
                    }
                  }}
                />
              )}
            />

            <Button 
              disabled={question.trim().length < 2 || isThinkingChats[chatId!]}
              size="icon"
              variant="primary"
              aria-label="Enviar pergunta"
              className="absolute right-1 top-1 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:opacity-100"
              onClick={handleSubmit}
            >
              <SendHorizonalIcon size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatScreen;