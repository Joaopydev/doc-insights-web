import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useAuth } from "../../contexts/auth/useAuth";
import { Button } from "../button/Button";
import Input from "../input/Input";
import AuthLayout from "../layouts/AuthLayout";


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

    const handleSubmit = form.handleSubmit(async (formData) => {
        try {
            await signUp(formData)
        } catch (err) {
            console.error(err)
            alert(err)
        }
    })

    return (
        <AuthLayout
            title="Crie sua conta"
            subtitle="Cadastre-se para acessar o sistema"
        >
            <div className="flex flex-col items-center justify-center gap-6">
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
                            autoComplete="password"
                            onChange={field.onChange}
                            value={field.value}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Button 
                    className="flex-1 justify-center bg-blue-900 rounded-r-full rounded-l-full w-full"
                    onClick={handleSubmit}
                >
                    Criar Conta
                </Button>
            </div>
        </AuthLayout>
    )
}

export default SignUp