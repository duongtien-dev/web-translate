import { Dot } from 'lucide-react'

import { cn } from '../lib/utils'

type Spinner3DotsFadeProps = {
    className?: string
}

export function Spinner3DotsFade({ className }: Spinner3DotsFadeProps) {
    return (
        <span
            className={cn('inline-flex items-center justify-center gap-1 text-indigo-600', className)}
            role="status"
            aria-live="polite"
            aria-label="Đang dịch"
        >
            <Dot
                className="dot-fade-dot size-3 shrink-0 fill-current stroke-none [animation-delay:0ms]"
                aria-hidden
            />
            <Dot
                className="dot-fade-dot size-3 shrink-0 fill-current stroke-none [animation-delay:0.18s]"
                aria-hidden
            />
            <Dot
                className="dot-fade-dot size-3 shrink-0 fill-current stroke-none [animation-delay:0.36s]"
                aria-hidden
            />
        </span>
    )
}
