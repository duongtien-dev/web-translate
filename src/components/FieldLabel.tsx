import type { ReactNode } from 'react'

type FieldLabelProps = {
    children: ReactNode
}

export function FieldLabel({ children }: FieldLabelProps) {
    return (
        <div className="mb-2 flex flex-wrap items-center gap-2">
            <label
                className="text-sm font-semibold tracking-tight text-slate-900"
            >
                {children}
            </label>
        </div>
    )
}
