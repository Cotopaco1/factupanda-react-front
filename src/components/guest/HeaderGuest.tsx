import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import {  Menu } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import type { LinkProps } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { LogoHorizontal } from "../LogoHorizontal"

type NavItem = {
    label : string;
    to : LinkProps["to"]
}

const NavList : NavItem[] = [
    {
        label : 'Crear Cotización',
        to : '/dashboard/quotation/create'
    },
    {
        label : 'Dashboard',
        to : '/dashboard/quotation/create'
    },
];

function NavegationMenu(){
    return (
        <nav>
            <ul className="flex flex-col md:flex-row gap-4">
                {NavList.map(item => (
                    <li >
                        <Link className="p-2 bg-primary text-primary-foreground rounded-lg text-center block"  to={item.to}>{item.label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

function MobileMenu(){
    return (
        <Sheet >
            <SheetTrigger> <Menu/> </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    {/* <img color="white" src={HorizontalLogo} alt="logo-factupanda" /> */}
                    <LogoHorizontal/>
                </SheetHeader>
                <div className="h-full px-4 flex flex-col justify-between">
                    <NavegationMenu/>
                    <div className="my-4">
                        <p>Desarrollado por <a href="https://www.linkedin.com/in/sergio-silva-sanchez-2556a9244/" className="link-text">Sergio Silva</a> </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export function HeaderGuest(){
    const isMobile = useIsMobile();
    return (
    <header className="bg-secondary text-foreground border-b">
        <div className="container flex justify-between items-center">
            {/* Logo */}
            <div>
                {/* <img width="500" style={{color: "white"}} src={HorizontalLogo} alt="logo factupanda" /> */}
                <LogoHorizontal className="w-[150px]"/>
            </div>
            {/* Navegation Menu */}
            <div>
                {isMobile ? (
                    <MobileMenu />
                ) : 
                    <div>
                        <NavegationMenu/>
                    </div>
                }
                
            </div>
        </div>
    </header>
    )
}