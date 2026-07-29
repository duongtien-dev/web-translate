import { Dot } from 'lucide-react'
import { cn } from '../lib/utils'

const DELAYS_MS = [0, 180, 360] as const

type Spinner3DotsFadeProps = {
    className?: string
}

/** Ba chấm fade — Lucide không có Spinner3DotsFade, dùng 3× Dot. */
export function Spinner3DotsFade({ className }: Spinner3DotsFadeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center gap-1 text-indigo-600',
                className,
            )}
            role="status"
            aria-live="polite"
            aria-label="Đang dịch"
        >
            {DELAYS_MS.map((delay) => (
                <Dot
                    key={delay}
                    className="dot-fade-dot size-3 shrink-0 fill-current stroke-none"
                    style={{ animationDelay: `${delay}ms` }}
                    aria-hidden
                />
            ))}
        </span>
    )
}
