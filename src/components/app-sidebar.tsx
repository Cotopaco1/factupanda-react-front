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

export function AppSidebar() {

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
      <SidebarContent>
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
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}