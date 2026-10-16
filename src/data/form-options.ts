/**
 * Centralized static option lists used across form selects.
 * Keeping them here avoids inline arrays in components and makes additions/changes easy to trace.
 */

export interface SelectOption<T = string> {
  value: T
  label: string
}

// ── Invoice ────────────────────────────────────────────────────────────────────

export const igstPaymentOptions: SelectOption[] = [
  { value: 'NA', label: 'Not applicable' },
  { value: 'LUT', label: 'Under LUT / bond' },
  { value: 'P', label: 'Against payment' }
]

export const accessoryStatusOptions: SelectOption[] = [
  { value: '0', label: 'No accessory' },
  { value: '1', label: 'Included free of cost' },
  { value: '2', label: 'Entered separately' }
]

export const indigenousOrImportedOptions: SelectOption[] = [
  { value: 'I', label: 'Imported' },
  { value: 'D', label: 'Indigenous' }
]

// ── Cargo / Container ──────────────────────────────────────────────────────────

export const containerSizeOptions: SelectOption[] = [
  { value: '20', label: '20 ft' },
  { value: '40', label: '40 ft' },
  { value: '45', label: '45 ft' }
]

export const containerSealTypeOptions: SelectOption<number>[] = [
  { value: 1, label: 'BTSL - Bottle Seal' },
  { value: 2, label: 'ESEAL - Electronic Seal' },
  { value: 3, label: 'RFID - Radio Frequency Identifier' }
]

// ── Regulatory ────────────────────────────────────────────────────────────────

export const nfeiCategoryOptions: SelectOption[] = [
  { value: '01', label: 'Free trade sample' },
  { value: '02', label: 'Diplomatic goods' },
  { value: '03', label: 'Warranty replacement' },
  { value: '07', label: 'Gift parcel' },
  { value: '08', label: 'Other' }
]

// ── Currencies ────────────────────────────────────────────────────────────────

export const currencyOptions: SelectOption[] = ['USD', 'EUR', 'INR', 'AED', 'GBP', 'SGD'].map((v) => ({
  value: v,
  label: v
}))
