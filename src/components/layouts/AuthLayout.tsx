import type { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import FactupandaLogo from "@/assets/factupanda-logo-horizontal.svg";
import { Link } from "@tanstack/react-router";

interface Props {
    header?: ReactNode
    footer?: ReactNode
    children: ReactNode
    title ?: string
}

export function AuthLayout({footer, children, title, header}:Props){
    return (
        <div className='h-screen flex items-center justify-center'>
        <Card className="w-full max-w-xl">
            <CardHeader className="grid gap-6">
                <Link to='/dashboard/quotation/create'>
                    <img className="max-w-[150px]" src={FactupandaLogo} alt="Logo factupanda" />
                </Link>
                <hr />
                {header && header}
                {title && <CardTitle>{title}</CardTitle>}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {footer && (
                <CardFooter>
                    {footer}
                </CardFooter>
            )}
        </Card>
        </div>
    )
}