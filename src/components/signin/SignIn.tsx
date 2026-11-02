import { useEffect, useRef, useState } from "react"
import { z } from "zod"
import { isAxiosError } from "axios"
import { zodResolver } from "@hookform/resolvers/zod"

import { Link } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"


import AuthLayout from "../layouts/AuthLayout"
import Input from "../input/Input"
import { Button } from "../button/Button"
import { AuthErrorAlert } from "../ui/AuthErrorAlert"
import { useAuth } from "../../contexts/auth/useAuth"


const schema = z.object({
    email: z.email("Informe um e-mail válido"),
    password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres.")
})

function SignIn() {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const { signIn } = useAuth()
    const [authError, setAuthError] = useState<string | null>(null)
    const [attempt, setAttempt] = useState(0)
    const alertRef = useRef<HTMLDivElement>(null)

    // Leva o foco ao aviso para leitores de tela e teclado.
    useEffect(() => {
        if (attempt > 0) alertRef.current?.focus()
    }, [attempt])

    const handleSubmit = form.handleSubmit(async (formData) => {
        setAuthError(null)
        try {
            await signIn(formData)
        } catch (err) {
            // Mensagem única para e-mail inexistente ou senha errada: não revela se a conta existe.
            const isServerOrNetworkFailure =
                isAxiosError(err) && (!err.response || err.response.status >= 500)

            setAuthError(
                isServerOrNetworkFailure
                    ? "Tivemos um problema de conexão. Tente novamente em instantes."
                    : "Usuário ou senha incorretos. Confira os dados e tente novamente."
            )
            setAttempt((n) => n + 1)
            form.resetField("password")
            form.setFocus("password")
        }
    })

    const clearAuthError = () => setAuthError(null)
    const credentialsInvalid = !!authError

    return (
        <AuthLayout
            title="Entre com sua conta"
            subtitle="Faça login para acessar o sistema"
        >
            <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                <AuthErrorAlert
                    ref={alertRef}
                    message={authError}
                    attempt={attempt}
                    onDismiss={clearAuthError}
                />
                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Input
                            label="E-mail"
                            type="email"
                            placeholder="Digite seu email"
                            autoCapitalize="none"
                            autoComplete="email"
                            value={field.value}
                            onChange={(value) => { clearAuthError(); field.onChange(value) }}
                            error={fieldState.error?.message}
                            invalid={credentialsInvalid}
                        />
                    )}
                />
                <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState}) => (
                        <Input
                            label="Senha"
                            type="password"
                            placeholder="Digite sua senha"
                            autoCapitalize="none"
                            autoComplete="current-password"
                            value={field.value}
                            onChange={(value) => { clearAuthError(); field.onChange(value) }}
                            error={fieldState.error?.message}
                            invalid={credentialsInvalid}
                        />
                    )}
                />
                <div className="mt-2 flex flex-col items-center gap-4">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        loading={form.formState.isSubmitting}
                    >
                        Entrar
                    </Button>
                    <p className="text-sm text-zinc-400">
                        Não tem uma conta ainda?{" "}
                        <Link to="/register" className="font-medium text-indigo-400 underline-offset-4 hover:underline">
                            Criar conta
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}

export default SignIn