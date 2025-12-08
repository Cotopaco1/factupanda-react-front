import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import PandaAvatar from "@/assets/avatar-panda.png"
import { useUserStore } from "@/stores/userStore";
import { useUserService } from "@/services/userService";
import { toast } from "sonner";
import { ChevronsUpDownIcon } from "lucide-react";


export function SidebarProfileCard(){
    const { logout } = useUserService();
    const logoutUser = useUserStore((state) => state.logoutUser);
    const handleLogout = () => {
        toast.promise(
            logout()
                .then(()=>{
                    logoutUser();
                }),
                {
                    success : () =>  'Logout Exitoso',
                    error : () => 'Ha ocurrido un error, intentalo de nuevo.'
                }

        );
    }
    const user = useUserStore((state) => state.user);

    return (
        <DropdownMenu >
            <DropdownMenuTrigger className="flex gap-4 w-full justify-between items-center cursor-pointer">
                <div className="flex gap-2">
                    {/* Avatar */}
                    <Avatar className="max-w-10">
                        <AvatarImage src={PandaAvatar} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {/* User Info */}
                    <div className="text-left flex flex-col">
                        <strong className="text-sm">{user?.name}</strong>
                        <p className="text-xs">{user?.email}</p>
                    </div>

                </div>
                <div>
                    <ChevronsUpDownIcon/>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent >
                <DropdownMenuItem onClick={handleLogout}>
                        Cerrar Sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}