import { Spinner } from "./ui/spinner";
import Logo from "@/assets/factupanda-logo.svg";

export function DialogLoading(){
    return (
        <div className="fixed inset-0 bg-primary/50 z-10 text-primary-foreground flex items-center justify-center">
            <div className="flex flex-col gap-20">
                <div className="flex items-center gap-2 text-3xl">
                    <Spinner className="size-8"/>
                    <h1> Cargando</h1>
                </div>
                <div>
                    <img src={Logo} alt="logo-factu-panda" />
                </div>
            </div>
        </div>
    )
}