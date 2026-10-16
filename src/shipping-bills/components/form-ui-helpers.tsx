import React from 'react'

export const dateType = 'date' as 'text'

export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-gray-950">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  )
}

export function Advanced({
  title,
  children,
  open,
  onToggle
}: {
  title: string
  children: React.ReactNode
  open?: boolean
  onToggle?: (isOpen: boolean) => void
}) {
  return (
    <details
      className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-colors"
      open={open}
      onToggle={(e) => onToggle?.(e.currentTarget.open)}>
      <summary className="cursor-pointer text-sm font-medium text-gray-700 select-none hover:text-gray-900">
        {title}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}

export interface PersistentTabProps {
  value: string
  activeTab: string
  children: React.ReactNode
  className?: string
}

/**
 * Keep fields registered in the DOM while another tab is active so React Hook Form
 * validates the entire form on submission without losing unsubmitted tab state.
 */
export function PersistentTab({ value, activeTab, children, className }: PersistentTabProps) {
  return (
    <div role="tabpanel" hidden={activeTab !== value} className={`mt-3 ${className ?? ''}`}>
      {children}
    </div>
  )
}
