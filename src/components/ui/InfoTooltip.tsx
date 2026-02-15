import { Info } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

type InfoTooltipProps = {
  content: string
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          className='h-6 w-6 text-muted-foreground hover:text-foreground'
          aria-label='Información'
        >
          <Info className='size-3.5' />
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className='max-w-[260px] text-xs'>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
