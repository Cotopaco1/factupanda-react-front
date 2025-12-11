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
    auth: true,
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
  item: SidebarItem
}

function AppSidebarItem({ item }: AppSidebarItemProps) {
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={item.link}
          activeProps={{ className: "bg-secondary flex items-center gap-2" }}
          activeOptions={{ exact: true }}
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
  // const user = useUserStore((state) => state.user);

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
                <AppSidebarItem key={item.link} item={item} />
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