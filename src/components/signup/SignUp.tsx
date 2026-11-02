import { useEffect, useRef, useState } from "react"
import { z } from "zod"
import { isAxiosError } from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router-dom"

import { useAuth } from "../../contexts/auth/useAuth";
import { Button } from "../button/Button";
import Input from "../input/Input";
import AuthLayout from "../layouts/AuthLayout";
import { AuthErrorAlert } from "../ui/AuthErrorAlert";


const schema = z.object({
    name: z.string().min(3, "Nome deve conter no mínimo 3 caracteres"),
    email: z.email("Informe um e-mail válido"),
    password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres.")
})

function SignUp() {

    const form  = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const { signUp } = useAuth()

    const [submitError, setSubmitError] = useState<string | null>(null)
    const [attempt, setAttempt] = useState(0)
    const alertRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (attempt > 0) alertRef.current?.focus()
    }, [attempt])

    const handleSubmit = form.handleSubmit(async (formData) => {
        setSubmitError(null)
        try {
            await signUp(formData)
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 409) {
                form.setError(
                    "email",
                    { message: "Este e-mail já está em uso. Entre na sua conta ou use outro e-mail." },
                    { shouldFocus: true }
                )
                return
            }

            setSubmitError(
                isAxiosError(err) && !err.response
                    ? "Tivemos um problema de conexão. Tente novamente em instantes."
                    : "Não foi possível criar sua conta agora. Tente novamente."
            )
            setAttempt((n) => n + 1)
        }
    })

    return (
        <AuthLayout
            title="Crie sua conta"
            subtitle="Cadastre-se para acessar o sistema"
        >
            <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                <AuthErrorAlert
                    ref={alertRef}
                    title="Não foi possível criar a conta"
                    message={submitError}
                    attempt={attempt}
                    onDismiss={() => setSubmitError(null)}
                />
                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Input
                            label="Nome"
                            placeholder="Digite seu nome"
                            autoCapitalize="words"
                            autoComplete="name"
                            onChange={field.onChange}
                            value={field.value}
                            error={fieldState.error?.message}
                        />
                    )}

                />

                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Input
                            label="Email"
                            placeholder="Digite seu email"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            onChange={field.onChange}
                            value={field.value}
                            error={fieldState.error?.message}
                        />
                    )}  
                />

                <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <Input
                            label="Senha"
                            placeholder="Digite sua senha"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="new-password"
                            onChange={field.onChange}
                            value={field.value}
                            error={fieldState.error?.message}
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
                        Criar Conta
                    </Button>
                    <p className="text-sm text-zinc-400">
                        Já tem uma conta?{" "}
                        <Link to="/login" className="font-medium text-indigo-400 underline-offset-4 hover:underline">
                            Entrar
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}

export default SignUp