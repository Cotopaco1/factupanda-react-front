import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type Announcement = {
  id: string
  title: string
  publishedAt: string
  summary: string
  content: string[]
}

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim()

export function UpdatesDialog() {
  const [open, setOpen] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadAnnouncements = async () => {
      setLoading(true)
      try {
        const response = await fetch('/announcements-history.json')
        if (!response.ok) throw new Error('Error al cargar anuncios')
        const data = (await response.json()) as Announcement[]
        if (!mounted) return
        setAnnouncements(data)
      } catch {
        if (mounted) setAnnouncements([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadAnnouncements()

    return () => {
      mounted = false
    }
  }, [])

  const sortedAnnouncements = useMemo(
    () =>
      [...announcements].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ),
    [announcements],
  )

  useEffect(() => {
    if (!sortedAnnouncements.length) {
      setSelectedAnnouncementId('')
      return
    }

    if (!selectedAnnouncementId) {
      setSelectedAnnouncementId(sortedAnnouncements[0].id)
    }
  }, [selectedAnnouncementId, sortedAnnouncements])

  const selectedAnnouncement =
    sortedAnnouncements.find((item) => item.id === selectedAnnouncementId) ??
    sortedAnnouncements[0]

  const latestAnnouncement = sortedAnnouncements[0]

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(
      new Date(date),
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full justify-start gap-2 py-5 text-sm'>
          <Star className='size-4.5' />
          Anuncios
          {latestAnnouncement && (
            <span className='text-xs text-muted-foreground'>({formatDate(latestAnnouncement.publishedAt)})</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='text-xl'>
            Anuncios{' '}
            {selectedAnnouncement && (
              <span className='text-sm font-normal text-muted-foreground'>
                {formatDate(selectedAnnouncement.publishedAt)}
              </span>
            )}
          </DialogTitle>
          {selectedAnnouncement && (
            <DialogDescription className='text-sm leading-6'>
              {selectedAnnouncement.summary}
            </DialogDescription>
          )}
        </DialogHeader>
        {loading && <p className='text-sm text-muted-foreground'>Cargando anuncios...</p>}
        {!loading && !sortedAnnouncements.length && (
          <p className='text-sm text-muted-foreground'>No hay anuncios disponibles en este momento.</p>
        )}
        {!!selectedAnnouncement && !loading && (
          <div className='grid items-start gap-5 md:grid-cols-[240px_minmax(0,1fr)]'>
            <div className='space-y-2'>
              <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                Historial
              </p>
              <div className='space-y-2'>
                {sortedAnnouncements.map((announcement, index) => {
                  const isSelected = selectedAnnouncement.id === announcement.id
                  const isLatest = index === 0

                  return (
                    <button
                      key={announcement.id}
                      type='button'
                      onClick={() => setSelectedAnnouncementId(announcement.id)}
                      className={cn(
                        'w-full rounded-md border px-3 py-2 text-left transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted/50',
                      )}
                    >
                      <p className='line-clamp-2 text-sm font-medium leading-5 text-foreground'>
                        {announcement.title}
                      </p>
                      <p className='text-xs text-muted-foreground'>{formatDate(announcement.publishedAt)}</p>
                      {isLatest && (
                        <span className='inline-flex items-center gap-1 text-xs text-primary'>
                          <CheckCircle2 className='size-3.5' />
                          Última
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className='self-start rounded-md border p-4'>
              <h3 className='text-lg font-semibold leading-6'>{selectedAnnouncement.title}</h3>
              <div className='mt-3 space-y-2 text-sm leading-5 text-foreground'>
                {selectedAnnouncement.content.map((paragraph, index) => (
                  <p key={`${selectedAnnouncement.id}-${index}`}>{normalizeText(paragraph)}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
