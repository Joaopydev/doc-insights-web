import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useParams } from "react-router-dom";
import { SendHorizonalIcon } from "lucide-react";
import { useEffect, useState } from "react";

import Input from "../input/Input";
import { cn } from "../../utils/cn";

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

  useEffect(() => {
    if (!chatId) return

    form.setValue("question", drafts[chatId] ?? "")
  }, [chatId])


  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      question: ""
    }
  })
  const question = form.watch("question")

  const { chat } = useChat({ chatId: chatId! })
  const { mutateAsync: sendQuestion } = useQuestion(chatId!)
  const { isThinkingChats, setIsThinkingChats, setWaitingForAnswer } = useWebSocket() 

  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const handleSubmit = form.handleSubmit(async (formData) => {
      try {
        setWaitingForAnswer(true)
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

      <div className="w-full shrink-0 px-4 pb-3 pt-4 mb-3">
        <div className="mx-auto w-full max-w-3xl">
          <div className="relative">
            <Controller 
              control={form.control}
              name="question"
              render={({ field }) => (
                <Input
                  placeholder="Digite sua pergunta..."
                  className="pr-12"
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
              size="icon-sm"
              className="absolute right-2 top-1.5"
              onClick={handleSubmit}
            >
              <SendHorizonalIcon
                size={20}
                className={cn(
                  "text-zinc-400",
                  question.trim() !== "" && !isThinkingChats[chatId!] && "hover:text-zinc-200"
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatScreen;