import { FormInput } from '@/components/form/FormInput'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { type ResetPasswordForm, resetPasswordSchema } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonLoader } from '@/components/ButtonLoader'
import { useUserService } from '@/services/userService'
import { MergeServerErrorsToForm } from '@/services/errorService'
import { FormRootErrorMessage } from '@/components/form/FormRootErrorMessage'
import { toast } from 'sonner'
import { useUserStore } from '@/stores/userStore'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/configurar-password')({
  component: RouteComponent,
})

function RouteComponent() {

  const { resetPassword, loading } = useUserService();
  const loginUser = useUserStore(data => data.loginUser);
  const navigate = useNavigate();
  const search = Route.useSearch()

  const form = useForm<ResetPasswordForm>({
    defaultValues: {
      password: '',
      password_confirmed: '',
      tkn: search?.tkn ?? 'no-token'
    },
    resolver: zodResolver(resetPasswordSchema)
  });
  console.log(form.formState.errors);
  const onSubmit = (data) => {
    console.log("Ha pasado el submit...")
    resetPassword(data)
      .then((data) => {
        loginUser(data.tkn, data.user);
        toast.success('Nueva contraseña configurada');
        navigate({ to: '/dashboard/quotation/create' })
      }).catch(async(error) => {
        await MergeServerErrorsToForm(error, form)
      })
  }

  return (
    <AuthLayout title='Configura nueva contraseña' >
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
        <FormInput name='password' control={form.control} label='Contraseña' type='password' placeholder='********' />
        <FormInput name='password_confirmed' control={form.control} label='Confirmar Contraseña' type='password' placeholder='********' />
        <div className='mt-2 grid gap-2'>
          <FormRootErrorMessage form={form} className='my-4' />
          <ButtonLoader loading={loading}>Guardar contraseña</ButtonLoader>
        </div>
      </form>
    </AuthLayout>
  )
}
