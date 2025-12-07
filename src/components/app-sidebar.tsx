import { Home, HomeIcon } from "lucide-react"
import LogoFactupanda from "@/assets/factupanda-logo-horizontal.svg"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,

} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router";
import { useUserStore } from "@/stores/userStore";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth/AuthDialog";
import { Avatar, AvatarImage } from "./ui/avatar";
import PandaAvatar from "@/assets/avatar-panda.png";
import { AvatarFallback } from "@radix-ui/react-avatar";

export function AppSidebar() {
  const isLogin = useUserStore((state) => state.isLogin);
  const user = useUserStore((state) => state.user);
  const items = [
    {
      label: "Cotización",
      link: "/dashboard/quotation/create",
      status: true
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <img src={LogoFactupanda} alt="" />
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup >
          <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.link}>
                  <SidebarMenuButton  asChild >
                    <Link to={item.link} activeProps={{ className: "bg-secondary  flex items-center gap-2" }} activeOptions={{ exact: true }}>
                      <HomeIcon/>
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
                {/* Si no esta logueado entonces ... */}
                  {!isLogin && (
                    <AuthDialog/>
                  )}
                {/* Si esta logueado entonces ... */}
                {isLogin && (
                <SidebarMenuItem className="flex gap-4">
                    {/* Avatar */}
                      <Avatar>
                        <AvatarImage src={PandaAvatar} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      {/* User Info */}
                      <div className="flex flex-col">
                        <strong className="text-sm">{user?.name}</strong>
                        <p className="text-xs">{user?.email}</p>
                      </div>
                </SidebarMenuItem>
                )}
                
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}