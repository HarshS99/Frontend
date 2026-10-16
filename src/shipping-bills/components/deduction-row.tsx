/**
 * DeductionRow — a reusable row for rate/amount/currency triplets.
 *
 * The original form had four nearly identical blocks for freight, insurance,
 * commission, and discount. This component extracts the repeated pattern:
 *   - Rate input (disabled when amount is set)
 *   - Amount input (disabled when rate is set)
 *   - Currency select
 *
 * Callers supply the label and field paths; the mutual-exclusion logic lives here once.
 */

import { currencyOptions } from '@/data/form-options'
import { ShippingBillFormValues } from '@/shipping-bills/model'
import { Input } from 'ui/inputs/input'
import { Select } from 'ui/inputs/select'

interface DeductionRowProps {
  label: string
  rateField: string
  amountField: string
  currencyField: string
  rateValue: string | undefined
  amountValue: string | undefined
  defaultCurrencyPlaceholder: string
  register: (name: string) => object
}

export function DeductionRow({
  label,
  rateField,
  amountField,
  currencyField,
  rateValue,
  amountValue,
  defaultCurrencyPlaceholder,
  register
}: DeductionRowProps) {
  const rateDisabled = amountValue !== '' && amountValue != null
  const amountDisabled = rateValue !== '' && rateValue != null

  return (
    <div className="p-2">
      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
        <span className="w-28 shrink-0 font-medium text-gray-900">{label}</span>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            {...register(rateField)}
            className="text-right"
            disabled={rateDisabled}
            placeholder="Rate"
          />
          <span className="text-xs text-gray-500">%</span>
        </div>
        <Input
          type="number"
          {...register(amountField)}
          className="py-1 text-right"
          disabled={amountDisabled}
          placeholder="Amount"
        />
        <Select<ShippingBillFormValues>
          name={currencyField as keyof ShippingBillFormValues}
          options={currencyOptions}
          placeholder={defaultCurrencyPlaceholder}
        />
      </div>
    </div>
  )
}
