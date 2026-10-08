import type React from "react";
import { DialogHeader, Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { DownloadIcon, XIcon } from "lucide-react";
import { PandaLottie } from "@/components/brand/PandaLottie";

    interface Props {
        open : boolean;
        setOpen : React.Dispatch<React.SetStateAction<boolean>>
        url : string; // Url del pdf
    }
export function DialogPdfQuotation({open, setOpen, url}:Props){

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[90vw] md:max-w-7xl h-[90vh] md:h-[90vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        {/* El panda confirma que salio bien antes de que el
                            usuario tenga que interpretar el iframe. */}
                        <PandaLottie name='listo' size={56} label=''/>
                        <Button variant='outline' onClick={() => setOpen(false)}><XIcon/> Cerrar</Button>
                        <a href={url} download="Cotización" >
                            <Button><DownloadIcon/> Descargar</Button>
                        </a>
                    </div>
                </DialogHeader>
                <div className="flex-1 w-full h-full">
                    {/* Iframe */}
                {url && (
                    <iframe src={url} className="w-full h-full" />
                )}
                </div>
            </DialogContent>
        </Dialog>
    )
}