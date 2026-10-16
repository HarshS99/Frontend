import { DarkModeToggle } from 'ui/basic/dark-mode'

interface ApplicationLayoutProps {
  children?: React.ReactNode
  maxWidth?: string
}

export function ApplicationLayout({ children, maxWidth }: ApplicationLayoutProps) {
  return (
    <div className="foreground relative isolate flex min-h-svh w-full flex-col">
      <header className="flex items-center justify-end px-4 py-2 print:hidden">
        <DarkModeToggle />
      </header>

      {/* Content */}
      <main className="grow print:m-0 print:p-0">
        <div className="background m-2 h-full rounded-xl p-6 print:m-0 print:p-0">
          <div className="mx-auto h-full" style={{ maxWidth: maxWidth ?? '72rem' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
