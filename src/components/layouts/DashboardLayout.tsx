import React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, type LinkProps } from "@tanstack/react-router";

export type BreadcrumbItemType = {
    to : LinkProps["to"];
    label : string;
}

const DashboardBreadcrumb = ({items} : {items : BreadcrumbItemType[]}) => {
    return (
        <Breadcrumb >
            <BreadcrumbList>
                {items && items.map((item, index) => (
                    <React.Fragment key={item.to}>
                        {index !== 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                        { index < items.length - 1 ? (
                            <BreadcrumbLink asChild>
                                <Link to={item.to}>{item.label}</Link>
                            </BreadcrumbLink>
                            ) :
                            <BreadcrumbPage className="font-semibold">{item.label}</BreadcrumbPage>
                        }
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}


type Props = {
    title : string;
    description : string;
    children : React.ReactNode,
    breadcrumb ?: BreadcrumbItemType[]
}
export function DashboardLayout({title, description, children, breadcrumb}:Props){
    return (
        <div className='grid gap-10 p-4'>
            {breadcrumb && <DashboardBreadcrumb items={breadcrumb}/>}
            <div className='my-6'>
                <h1 className='text-2xl mb-2'>{title}</h1>
                <p className='text-muted-foreground text-sm md:text-base'>{description}</p>
            </div>
            {children}
        </div>
    )
}