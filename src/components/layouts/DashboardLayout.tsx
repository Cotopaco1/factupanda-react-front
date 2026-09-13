import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, type LinkProps } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export type BreadcrumbItemType = {
    to : LinkProps["to"];
    label : string;
}

const DashboardBreadcrumb = ({items} : {items : BreadcrumbItemType[]}) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items && items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <React.Fragment key={item.to}>
                            {/* En movil solo se muestra el tramo actual, para que no salte de linea. */}
                            {index !== 0 && <BreadcrumbSeparator className="hidden sm:block" />}
                            <BreadcrumbItem className={isLast ? undefined : "hidden sm:inline-flex"}>
                                {isLast ? (
                                    <BreadcrumbPage className="font-medium">{item.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={item.to}>{item.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

type Props = {
    title : string;
    description : string;
    /** Accion principal de la pagina, alineada a la derecha del titulo. */
    actions ?: React.ReactNode;
    children : React.ReactNode,
    breadcrumb ?: BreadcrumbItemType[]
}

export function DashboardLayout({title, description, actions, children, breadcrumb}:Props){
    return (
        <>
            <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
                <SidebarTrigger className="-ml-1" />
                {breadcrumb && (
                    <>
                        <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
                        <DashboardBreadcrumb items={breadcrumb}/>
                    </>
                )}
            </header>
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground text-sm">{description}</p>
                    </div>
                    {actions && (
                        <div className="flex shrink-0 items-center gap-2">{actions}</div>
                    )}
                </div>
                {children}
            </div>
        </>
    )
}
