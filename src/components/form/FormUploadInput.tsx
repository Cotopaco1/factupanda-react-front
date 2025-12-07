import { apiClient } from "@/lib/apiClient"
import { Controller, type Control } from "react-hook-form";
import { Button } from "../ui/button";
import { UploadIcon, XIcon } from "lucide-react";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { useRef, useState, type ChangeEvent, type ChangeEventHandler } from "react";
import type { AxiosError } from "axios";
interface Props {
    name : string;
    control : Control;
    label : string;
}

export function FormUploadInput({name,control, label}:Props){
    const [nameFile, setNameFile] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null) // InputFile
    /* Upload file, and save hash reference to this file in the database. */
    function upload(data : FormData){
        return apiClient.post('/temporary-files/logo', data)
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => {

                const resetField = () => {
                    if(inputRef.current){
                        inputRef.current.value = '';
                    }
                    field.onChange(null);
                    setNameFile('');
                }

                const onChange = (event : ChangeEvent<HTMLInputElement>) => {
                    /* If files[0] exists and value is valid, then use upload function */
                    const file = event.target.files?.[0];
                    if(!file) return;
                    setNameFile(file.name);
                    const formData = new FormData();
                    formData.append('file', file);
                    upload(formData)
                        .then((response)=>{
                            const hash = response.data?.temporaryFile?.hash ?? null
                            console.log('Hash recibido :', hash);
                            /* Actualizar el valor del input asociado al formulario. */
                            field.onChange(hash);
                        })
                        .catch((error:AxiosError)=>{
                            const errors = error.response?.data?.errors;
                            console.log("Ha habido un error al intentar uplodear el file..", error)
                            if(!errors || !Array.isArray(errors) || errors.length < 1) return;
                            control.setError(name, errors[0]);
                        })
                }

                return (
                <Field>
                    <FieldLabel>{label}</FieldLabel>
                    {/* Input type file hidden */}
                    <input ref={inputRef} onChange={onChange}  type="file" hidden />
                    <input {...field}  type="text" hidden/>
                    <div className="flex gap-2 items-center">
                        {/* Button -> active input  */}
                        <Button type="button" onClick={() => inputRef.current?.click()} variant='outline'><UploadIcon/></Button>
                        {nameFile && <p>{nameFile}</p>}
                        {nameFile && <XIcon onClick={resetField}/>}
                    </div>
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