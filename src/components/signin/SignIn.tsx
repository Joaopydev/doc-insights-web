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
            <div className="flex flex-col items-center justify-center gap-6">
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
                            autoComplete="email"
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <div className="flex flex-col items-center-safe justify-center gap-4">
                    <Button 
                        className="flex-1 justify-center bg-blue-900 rounded-r-full rounded-l-full w-full"
                        onClick={handleSubmit}
                        loading={form.formState.isSubmitting}
                    >
                        Entrar
                    </Button>
                    <Link to="/register">
                        <span className="text-xs text-gray-500 underline">Não tem uma conta ainda? Clique aqui para criar.</span>
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}

export default SignIn