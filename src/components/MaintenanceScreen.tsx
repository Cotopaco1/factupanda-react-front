import { LogoHorizontal } from '@/components/LogoHorizontal'

type MaintenanceScreenProps = {
  message: string
}

export function MaintenanceScreen({ message }: MaintenanceScreenProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--color-warning)_0%,_transparent_30%),radial-gradient(circle_at_bottom_right,_var(--color-secondary)_0%,_transparent_38%)] opacity-60" />

        <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-border/80 bg-card/90 p-8 text-center shadow-2xl backdrop-blur sm:p-12">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning text-warning-foreground shadow-lg">
            <span className="text-3xl font-black">!</span>
          </div>

          <LogoHorizontal className="mx-auto mb-8 h-auto w-52 text-foreground" />

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Modo mantenimiento
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Estamos en mantenimiento
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            {message}
          </p>

          <div className="mt-8 rounded-2xl bg-secondary px-5 py-4 text-sm text-secondary-foreground">
            Estamos realizando ajustes para volver lo antes posible.
          </div>
        </div>
      </section>
    </main>
  )
}
