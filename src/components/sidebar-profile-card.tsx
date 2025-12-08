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



export function SidebarProfileCard(){
    const { logout } = useUserService();
    const logoutUser = useUserStore((state) => state.logoutUser);
    const handleLogout = () => {
        logout()
            .then(()=>{
                logoutUser();
            }).catch((error) => {
                // Show alert dialog
                console.log("Error in attempt to logout user :", error);
            })
    }
    const user = useUserStore((state) => state.user);

    return (
        <DropdownMenu >
            <DropdownMenuTrigger className="flex gap-4 w-full">
                {/* Avatar */}
                    <Avatar className="max-w-10">
                        <AvatarImage src={PandaAvatar} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {/* User Info */}
                    <div className="flex flex-col">
                    <strong className="text-sm">{user?.name}</strong>
                    <p className="text-xs">{user?.email}</p>
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