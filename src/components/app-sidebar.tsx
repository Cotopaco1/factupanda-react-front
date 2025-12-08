import { HomeIcon } from "lucide-react"
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
  // SidebarSeparator,

} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router";
import { useUserStore } from "@/stores/userStore";
import { AuthDialog } from "./auth/AuthDialog";
import { Avatar, AvatarImage } from "./ui/avatar";
import PandaAvatar from "@/assets/avatar-panda.png";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { SidebarProfileCard } from "./sidebar-profile-card";


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
                <SidebarMenuItem >
                    <SidebarProfileCard />
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