import type React from "react";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";
import { PartyPopperIcon, X } from "lucide-react";

type Props = {
    open : boolean;
    setOpen : React.Dispatch<React.SetStateAction<boolean>>, 
}
const Donationlink = 'https://buymeacoffee.com/cotopaco/goals/share/720445';
export function DonationDomainAlertBanner({open, setOpen}:Props){
    if (!open) return null;
    
    const handleClose = () => {
        setOpen(false);
    };
    
    return createPortal(
        <div 
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-100 pointer-events-auto"
            onPointerDownCapture={(e) => e.stopPropagation()}
        >
            <div 
                className="w-[400px] grid p-0 m-0 border-3 border-blue-800 gap-0 rounded-4xl overflow-hidden bg-blue-200 shadow-2xl relative pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10 text-white hover:text-white/80"
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </button>
                
                <div className="h-20 shrink-0 bg-blue-500"></div>
                
                <div className="text-center relative border-t-0 mt-0 p-4 grid gap-6">
                    <div className="absolute inset-x-0 flex justify-center -top-10 ">
                        <div className="bg-blue-100 text-blue-700 p-4 rounded-full">
                            <PartyPopperIcon size="60"/>
                        </div>
                    </div>
                    <div className="mt-16">
                        <h3 className="text-3xl mb-6">¡Felicidades!</h3>
                        <p>Me alegra que <strong>FactuPanda</strong> te este siendo util, estoy buscando fondos para antes de febrero del 2026 comprar el dominio  <strong>Factupanda.com</strong> por $10 dolares y seguir teniendo Factupanda <strong>¡Online!</strong> </p>
                        <p>Si deseas apoyar a <strong>FactuPanda</strong>, te invito a donar en <a target="_blank" rel="noopener noreferrer" href={Donationlink} className="link-text">Buy me a Coffe</a> </p>
                    </div>
                    <p className="text-left">Gracias por tu cooperación <span className="italic block"> Sergio Silva - Creador de FactuPanda </span> </p>
                    <div className="mt-4 flex justify-around gap-4">
                        <Button onClick={handleClose}>Lo pensaré 🥲</Button>
                        <a href={Donationlink} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-success-foreground text-success">¡Quiero Contribuir! </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}