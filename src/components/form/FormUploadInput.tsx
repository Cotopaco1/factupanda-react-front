import { Controller, type Control } from "react-hook-form";
import { CheckIcon, UploadIcon, XIcon } from "lucide-react";
import { Field, FieldError, FieldLabel } from "../ui/field";
import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useTemporaryFileService } from "@/services/temporaryFileService";
import { ButtonLoader } from "../ButtonLoader";

interface Props {
    name : string;
    control : Control<any>;
    label : string;
    accept : React.InputHTMLAttributes<HTMLInputElement>["accept"]
}

export function FormUploadInput({name,control, label, accept}:Props){
    const [nameFile, setNameFile] = useState('');
    const [blobUrl, setBlobUrl] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { uploadLogo, loading } = useTemporaryFileService();

    const showBloblUrl = (blob : Blob) => {
        setBlobUrl(URL.createObjectURL(blob));
    }

    useEffect(() => {
        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [blobUrl]);


    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => {
                console.log(fieldState.error);
                const resetField = () => {
                    if(inputRef.current){
                        inputRef.current.value = '';
                    }
                    field.onChange(null);
                    setNameFile('');
                    setBlobUrl('');
                }

                const onChange = async (event : ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if(!file) return;
                    
                    setNameFile(file.name);
                    
                    try {
                        const hash = await uploadLogo(file);
                        field.onChange(hash);
                        showBloblUrl(file);
                    } catch (error: any) {
                        setNameFile('');
                        const fileErrors : string[] = error.response?.data?.errors?.[name] ?? [error.response?.data?.message];
                        if(!fileErrors || !Array.isArray(fileErrors) || fileErrors.length < 1) return;
                        const message = fileErrors.join(', ');
                        control.setError(name, {
                            message : message,
                            type : 'server'
                        });
                    }
                }

                return (
                <Field>
                    <FieldLabel>{label}</FieldLabel>
                    {/* Input type file hidden */}
                    <input ref={inputRef} onChange={onChange}  type="file" hidden accept={accept} />
                    <input {...field}  type="text" hidden />
                    <div className="flex gap-2 items-center">
                        <ButtonLoader type="button" onClick={() => inputRef.current?.click()} loading={loading} variant="outline">
                            {!loading && <UploadIcon/>}
                        </ButtonLoader>
                        {nameFile && <p>{nameFile}</p>}
                        {nameFile && <XIcon onClick={resetField} className="cursor-pointer"/>}
                    </div>
                    {blobUrl && (
                        <div>
                            <p className="text-success-foreground text-xs"> <CheckIcon className="inline size-5"/> Cargado </p>
                            <img className="max-w-[200px]" src={blobUrl} alt={nameFile} />
                        </div>
                    )}
                    {fieldState.error && (
                        <FieldError errors={[fieldState.error]}/>
                    )}
                </Field>
                )
            }}
        >

        </Controller>
    )
}