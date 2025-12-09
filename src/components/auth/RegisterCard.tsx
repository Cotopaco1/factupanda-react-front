import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormInput } from "../form/FormInput"
import { registerSchema, type RegisterForm } from "@/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserService } from "@/services/userService";
import { MergeServerErrorsToForm } from "@/services/errorService";
import { FormRootErrorMessage } from "../form/FormRootErrorMessage";
import { ButtonLoader } from "../ButtonLoader";
import { useState } from "react";
import { CheckIcon } from "lucide-react";


export function RegisterCard() {
    const {register, loading} = useUserService();
    const [registerSucces, setRegisterSucces] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const form = useForm<RegisterForm>({
        defaultValues: {
            email: '',
            name: '',
        },
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = (data) => {
        register(data)
        .then((data)=>{
            setRegisterSucces(true);
            setSuccessMessage(data.message);
        }).catch((error)=>{
            MergeServerErrorsToForm(error, form);
        })
    }
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {!registerSucces && (
                <Card>
                    <CardHeader>
                        <CardTitle>Registro</CardTitle>
                        <CardDescription>
                            Registrate con tu Nombre y Correo electronico
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        
                            <FormInput name="email" control={form.control} label="Correo Electronico" type="email" placeholder="correo@ejemplo.com" required />
                            <FormInput name="name" control={form.control} label="Nombre" type="text" placeholder="Sergio Silva" required />
                        
                    </CardContent>
                    <CardFooter className="grid gap-4">
                        <FormRootErrorMessage form={form}/>
                        <ButtonLoader loading={loading}>Registrarse</ButtonLoader>
                    </CardFooter>
                </Card>
            )}
            {registerSucces && (
                <Card>
                    <CardHeader>
                        <CardTitle>Revisa tu correo electronico</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p ><CheckIcon className="bg-success text-success-foreground rounded-full inline mr-2 p-1" />{successMessage}</p>
                    </CardContent>
                </Card>
            )}
        </form>
    )
}