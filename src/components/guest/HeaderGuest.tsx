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
import { useUserStore } from "@/stores/userStore"

type NavItem = {
    label : string;
    to : LinkProps["to"]
}

/* Cualquiera puede cotizar sin cuenta, pero el listado exige sesion: si se
   ofrece a un anonimo, la pagina responde 401 y solo se ve un toast de error. */
const PUBLIC_NAV : NavItem[] = [
    {
        label : 'Crear Cotización',
        to : '/dashboard/quotation/create'
    },
];

const PRIVATE_NAV : NavItem[] = [
    ...PUBLIC_NAV,
    {
        label : 'Mis cotizaciones',
        to : '/dashboard/quotations'
    },
];

function NavegationMenu(){
    const isLogin = useUserStore(state => state.isLogin);
    const items = isLogin ? PRIVATE_NAV : PUBLIC_NAV;

    return (
        <nav>
            <ul className="flex flex-col md:flex-row gap-4">
                {items.map(item => (
                    <li key={item.to}>
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
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
            {/* Logo */}
            <Link to='/' aria-label='Ir al inicio de Factupanda'>
                <LogoHorizontal className="w-[150px]"/>
            </Link>
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