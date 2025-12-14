import { createFileRoute } from '@tanstack/react-router'
import { FormInput } from '@/components/form/FormInput'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { useForm } from 'react-hook-form'
import { type forgotPasswordForm, forgotPasswordSchema } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonLoader } from '@/components/ButtonLoader'
import { useUserService } from '@/services/userService'
import { MergeServerErrorsToForm } from '@/services/errorService'
import { FormRootErrorMessage } from '@/components/form/FormRootErrorMessage'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckIcon } from 'lucide-react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const Route = createFileRoute('/olvide-password')({
  component: RouteComponent,
})

function RouteComponent() {
  useDocumentTitle('Olvide contraseña');
  const {forgotPassword, loading} = useUserService();
  const [message, setMessage] = useState('');
  const form = useForm<forgotPasswordForm>({
    defaultValues : {
      email : ''
    },
    resolver : zodResolver(forgotPasswordSchema)
  });
  const onSubmit = (data) => {
    forgotPassword(data)
      .then((data)=>{
        setMessage(`Correo enviado a ${data.email}`)
      }).catch(async(error)=>{
        await MergeServerErrorsToForm(error,form)
      })
  }
  const header = (
    <>
      <CardTitle>Olvide la contraseña</CardTitle>
      <CardDescription>Escriba su correo, y le enviaremos un enlace para reestablecer la contraseña</CardDescription>
    </>
  )
  return (
        <AuthLayout header={header} >
          {message === '' && (
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
              <FormInput name='email' control={form.control} label='Correo electronico' type='email' placeholder='correo@ejemplo.com' />
              <div className='mt-2 grid gap-2'>
                {!form.formState.errors.email && <FormRootErrorMessage form={form} className='my-4' />} {/* Aplicamos esto para que el mensaje no se duplique, de esta manera solo se muestra el message cuando se un erro diferente a email. */}
                <ButtonLoader loading={loading}>Enviar Correo</ButtonLoader>
              </div>
            </form>
          )}
          {message != '' && (
            <Alert className='border border-success-foreground bg-success text-success-foreground'>
              <CheckIcon/>
              <AlertTitle>{message}</AlertTitle>
              <AlertDescription>Revise su bandeja de entrada y/o carpeta de spam</AlertDescription>
            </Alert>
          )}
      </AuthLayout>
  )
}
