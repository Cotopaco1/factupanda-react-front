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
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormInput } from "../form/FormInput"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button";
import type { LoginForm } from "@/schemas/login";
import { useUserService } from "@/services/userService";
import { FieldError } from "../ui/field";
import { useUserStore } from "@/stores/userStore";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { MergeServerErrorsToForm } from "@/services/errorService";

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
        }
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
            <Tabs defaultValue="account">
                <TabsList>
                    <TabsTrigger value="account">Cuenta</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
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
                                ) }
                                <div className="mt-4">
                                    <Button disabled={loading}> {loading && <Spinner/>} Iniciar Sesión</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you&apos;ll be logged
                                out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            
                        </CardContent>
                        <CardFooter>
                            <Button>Save password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}