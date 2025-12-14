import type React from "react"
import { Button, type ButtonProps } from "./ui/button"
import { Spinner } from "./ui/spinner"

interface Props extends Omit<ButtonProps, 'disabled'> {
    loading : boolean;
    children : React.ReactNode;
}

export function ButtonLoader({loading, children, type='submit', className, ...props}:Props){
    return <Button className={className} type={type} disabled={loading} {...props}> {loading && <Spinner/>} {children}</Button>
}