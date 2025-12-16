import { HomeIcon, PackageIcon, type LucideIcon } from "lucide-react"
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
import { SidebarProfileCard } from "./sidebar-profile-card";
import { LogoHorizontal } from "./LogoHorizontal";
import { SwitchDarkAndLightMode } from "./SwitchDarkAndLightMode";

type SidebarItem = {
  label: string
  link: string
  status: boolean
  auth: boolean
  icon: LucideIcon
}

const items: SidebarItem[] = [
  {
    label: "Cotización",
    link: "/dashboard/quotation/create",
    status: true,
    auth: false,
    icon: HomeIcon,
  },
  {
    label: "Productos",
    link: "/dashboard/products",
    status: true,
    auth: true,
    icon: PackageIcon,
  },
]


type AppSidebarItemProps = {
  item: SidebarItem;
  isLogin : boolean;
}

function AppSidebarItem({ item, isLogin }: AppSidebarItemProps) {
  const Icon = item.icon
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={item.link}
          activeProps={{ className: "bg-secondary flex items-center gap-2" }}
          activeOptions={{ exact: true }}
          disabled={item.auth && !isLogin}
        >
          <Icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}


export function AppSidebar() {
  const isLogin = useUserStore((state) => state.isLogin);
  return (
    <Sidebar>
      <SidebarHeader>
        <LogoHorizontal/>
        <div className="grid gap-2 my-2 ">
          <p className="text-xs text-muted-foreground">Tema de la aplicación</p>
          <SwitchDarkAndLightMode/>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup >
          <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <AppSidebarItem key={item.link} item={item} isLogin={isLogin} />
              ))}
              {!isLogin && (
                  <SidebarMenuItem className="bg-warning text-warning-foreground p-2 rounded-xl">
                    Inicia sesión para acceder a todas las funcionalidades
                  </SidebarMenuItem>
                )}
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