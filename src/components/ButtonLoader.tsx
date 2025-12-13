import type React from "react"
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"

interface Props {
    loading : boolean,
    children : React.ReactNode;
    type ?: "submit" | "button" | "reset" | undefined;
    className ?: string;
}
export function ButtonLoader({loading, children, type='submit', className}:Props){
    return <Button className={className} type={type} disabled={loading}> {loading && <Spinner/>} {children}</Button>
}