/**
 * AsyncPartySelect — a searchable combobox that integrates with React Hook Form via useController.
 *
 * Designed to work with any async data source (exporters, ports, document types, etc.).
 * The caller supplies:
 *   - `fetchOptions(query)` — called on open and as the user types (debounced 200ms)
 *   - `getInitialLabel(id)` — resolves a persisted ID back to a display label on mount
 *
 * This separation means the component has no knowledge of where data comes from, so it can
 * be reused for exporters, ports, document codes, or any future entity without modification.
 */

import { RrCaretDown } from 'icons/rr/fi-rr-caret-down'
import { useEffect, useRef, useState } from 'react'
import { getFormContext, RegisterOptions, useController } from 'ui/form'
import { InputError } from 'ui/inputs/error'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/interactive/popover'
import { PopoverContext } from 'ui/interactive/popover-context'
import { clsx, getContext } from 'ui/utils'

export interface AsyncOption {
  value: string
  label: string
  sublabel?: string
}

interface AsyncPartySelectProps {
  name: string
  placeholder?: string
  disabled?: boolean
  className?: string
  rules?: RegisterOptions
  /** Re-run the initial label lookup when these deps change (e.g. when parent ID changes). */
  deps?: React.DependencyList
  fetchOptions: (query: string) => Promise<AsyncOption[]>
  getInitialLabel?: (id: string) => Promise<string>
}

function PopoverOptionItem({
  option,
  isSelected,
  onSelect
}: {
  option: AsyncOption
  isSelected: boolean
  onSelect: (opt: AsyncOption) => void
}) {
  const { setOpen } = getContext(PopoverContext)

  return (
    <div
      onClick={() => {
        onSelect(option)
        setOpen(false)
      }}
      className={clsx(
        'flex cursor-pointer flex-col rounded p-2 text-sm transition-colors',
        isSelected ? 'bg-primary-50 text-primary-900 font-semibold' : 'text-gray-950 hover:bg-gray-100'
      )}>
      <span>{option.label}</span>
      {option.sublabel && <span className="text-xs text-gray-500">{option.sublabel}</span>}
    </div>
  )
}

export function AsyncPartySelect({
  name,
  placeholder = 'Search...',
  disabled = false,
  className,
  rules,
  deps = [],
  fetchOptions,
  getInitialLabel
}: AsyncPartySelectProps) {
  const ctx = getFormContext()
  const {
    field: { onChange, value, ref }
  } = useController({
    name,
    control: ctx.hooks.control,
    rules: ctx.schema.shape[name] ?? rules,
    disabled
  })

  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<AsyncOption[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Keep refs stable so effects don't need them as deps
  const fetchOptionsRef = useRef(fetchOptions)
  fetchOptionsRef.current = fetchOptions
  const getInitialLabelRef = useRef(getInitialLabel)
  getInitialLabelRef.current = getInitialLabel

  // Resolve selected value → display label on mount or when the value changes
  useEffect(() => {
    let active = true
    if (value) {
      if (getInitialLabelRef.current) {
        void getInitialLabelRef.current(String(value)).then((lbl) => {
          if (active && lbl) setSelectedLabel(lbl)
        })
      } else {
        const found = options.find((o) => o.value === String(value))
        if (found) setSelectedLabel(found.label)
      }
    } else {
      setSelectedLabel('')
    }
    return () => {
      active = false
    }
  }, [value, ...deps])

  // Fetch search results; debounced 200ms so we don't hammer the service on every keystroke
  useEffect(() => {
    if (!isOpen && !query) return

    let active = true
    setLoading(true)
    const timer = setTimeout(() => {
      void fetchOptionsRef
        .current(query)
        .then((results) => {
          if (active) {
            setOptions(results)
            setLoading(false)
          }
        })
        .catch(() => {
          if (active) {
            setOptions([])
            setLoading(false)
          }
        })
    }, 200)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query, isOpen, ...deps])

  return (
    <div>
      <input type="hidden" name={name} value={value ?? ''} ref={ref} disabled={disabled} />
      <Popover placement="bottom-start" fallbackPlacements={['top-start']} onOpenCallback={(open) => setIsOpen(open)}>
        <PopoverTrigger
          className={clsx(
            'outline-focus-select group flex w-full cursor-pointer items-center justify-between rounded border border-gray-200 pr-2 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50',
            `${className ?? 'bg-white'}${disabled ? 'cursor-not-allowed opacity-50' : ''}`
          )}
          disabled={disabled}>
          <div className="flex items-center p-2 text-sm">
            <span className={selectedLabel ? 'font-medium text-gray-900' : 'text-gray-400'}>
              {selectedLabel ?? placeholder}
            </span>
          </div>
          <RrCaretDown className="size-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
        </PopoverTrigger>
        {/* @ts-expect-error InputError generic path */}
        <InputError name={name} />
        <PopoverContent className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 p-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:ring-1"
              autoFocus
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {loading ? (
              <div className="p-3 text-center text-xs text-gray-500">Searching...</div>
            ) : options.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-400">No matching results found</div>
            ) : (
              options.map((opt) => (
                <PopoverOptionItem
                  key={opt.value}
                  option={opt}
                  isSelected={String(value) === opt.value}
                  onSelect={(selected) => {
                    onChange(selected.value)
                    ctx.hooks.setValue(name, selected.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true
                    })
                    setSelectedLabel(selected.label)
                    setQuery('')
                  }}
                />
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
