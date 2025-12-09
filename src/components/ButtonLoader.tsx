import type React from "react"
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"

interface Props {
    loading : boolean,
    children : React.ReactNode;
    type ?: "submit" | "button" | "reset" | undefined;
}
export function ButtonLoader({loading, children, type='submit'}:Props){
    return <Button type={type} disabled={loading}> {loading && <Spinner/>} {children}</Button>
}