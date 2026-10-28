import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Link } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"


import AuthLayout from "../layouts/AuthLayout"
import Input from "../input/Input"
import { Button } from "../button/Button"
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

    const handleSubmit = form.handleSubmit(async (formData) => {
        try {
            await signIn(formData)
        } catch (err) {
            console.log(err)
            alert("Credenciais Inválidas")
        }
    })

    return (
        <AuthLayout
            title="Entre com sua conta"
            subtitle="Faça login para acessar o sistema"
        >
            <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
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
                            onChange={field.onChange}
                            error={fieldState.error?.message}
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
                            onChange={field.onChange}
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