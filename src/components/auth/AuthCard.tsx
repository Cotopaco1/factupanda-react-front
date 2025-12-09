import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormInput } from "../form/FormInput"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button";
import { loginSchema, type LoginForm } from "@/schemas/login";
import { useUserService } from "@/services/userService";
import { FieldError } from "../ui/field";
import { useUserStore } from "@/stores/userStore";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { MergeServerErrorsToForm } from "@/services/errorService";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterCard } from "./RegisterCard";

interface Props {
    onLogin : CallableFunction
}

export function AuthCard({onLogin}:Props) {

    const { login, loading } = useUserService();
    const setUser = useUserStore((state) => state.setUser);
    const setIsLogin = useUserStore((state) => state.setIsLogin);
    const setToken = useUserStore((state) => state.setToken);
    const form = useForm<LoginForm>({
        defaultValues : {
            email : '',
            password : ''
        },
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = (data) => {
        login(data)
            .then((data) => {
                setUser(data.user);
                setIsLogin(true);
                setToken(data.token);
                onLogin();
                localStorage.setItem('tkn', data.token);
                toast.success("Inicio de sesión exitoso");
            })
            .catch((error)=>{
                MergeServerErrorsToForm(error, form);
                console.log("Error root despues de MergeServerErrorsToForm: ", form.formState.errors?.root);
            })
    }


    return (
        <div className="flex w-full flex-col gap-6">
            <Tabs defaultValue="login">
                <TabsList>
                    <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                    <TabsTrigger value="register">Registro</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cuenta</CardTitle>
                            <CardDescription>
                                Escribe tus credenciales e inica sesión
                            </CardDescription>
                        </CardHeader>
                        <CardContent >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                                <FormInput name="email" control={form.control} label="Correo Electronico" type="email" placeholder="correo@ejemplo.com" required />
                                <FormInput name="password" control={form.control} label="Contraseña" type="password" placeholder="********" required />
                                {form.formState.errors?.root && (
                                    <FieldError errors={[form.formState.errors?.root]}/>
                                )}
                                <div className="mt-4">
                                    <Button disabled={loading}> {loading && <Spinner/>} Iniciar Sesión</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <RegisterCard/>
                </TabsContent>
            </Tabs>
        </div>
    )
}