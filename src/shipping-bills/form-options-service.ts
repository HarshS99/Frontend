/**
 * form-options-service.ts
 *
 * Async Promise-based service that supplies form options (scheme codes, quantity units,
 * document types, etc.) to UI components.
 *
 * Why this exists:
 *   - Directly importing hard-coded arrays into components ties UI to a single data source.
 *   - This service provides an async boundary: the real implementation can swap the
 *     mock data for an HTTP call (e.g. GET /api/ref/scheme-codes) without any change
 *     to the consuming components.
 *   - Loading, empty, and error states are handled uniformly by callers.
 *
 * Replacing the mock with a real API:
 *   Replace the `Promise.resolve(...)` body of each function with a `fetch(...)` call.
 *   The function signatures and return types remain identical.
 */

import { documentCodes } from '@/data/e-sanchit-codes'
import { quantityCodes } from '@/data/quantity-code'
import schemeCodes from '@/data/scheme-codes'
import { stateOptions } from '@/data/states'
import { Trades } from '@/data/trade-agrements'
import { cargoOptions, contractTypes, paymentTypes, priceInclusionTypes, sealTypes, weightUnits } from '@/data/types'

export interface FormOption {
  value: string
  label: string
}

export interface SchemeOption extends FormOption {
  drawback: boolean
  RODTEP: boolean
  ROSCTL: boolean
}

// Simulated async latency — keep it small so UX stays snappy.
const DELAY_MS = 0

function resolve<T>(data: T): Promise<T> {
  if (DELAY_MS > 0) return new Promise((res) => setTimeout(() => res(data), DELAY_MS))
  return Promise.resolve(data)
}

export const formOptionsService = {
  /** GET /api/ref/scheme-codes  */
  fetchSchemeCodes(): Promise<SchemeOption[]> {
    return resolve(schemeCodes as SchemeOption[])
  },

  /** GET /api/ref/quantity-codes  */
  fetchQuantityCodes(): Promise<FormOption[]> {
    return resolve(quantityCodes as FormOption[])
  },

  /** GET /api/ref/document-types  */
  fetchDocumentTypes(): Promise<FormOption[]> {
    return resolve(documentCodes as FormOption[])
  },

  /** GET /api/ref/states  */
  fetchStates(): Promise<FormOption[]> {
    return resolve(stateOptions.map((s) => ({ value: String(s.value), label: s.label })))
  },

  /** GET /api/ref/trade-agreements  */
  fetchTradeAgreements(): Promise<FormOption[]> {
    return resolve(Trades as FormOption[])
  },

  /** GET /api/ref/contract-types  */
  fetchContractTypes(): Promise<FormOption[]> {
    return resolve(contractTypes as FormOption[])
  },

  /** GET /api/ref/payment-types  */
  fetchPaymentTypes(): Promise<FormOption[]> {
    return resolve(paymentTypes as FormOption[])
  },

  /** GET /api/ref/price-inclusion-types  */
  fetchPriceInclusionTypes(): Promise<FormOption[]> {
    return resolve(priceInclusionTypes as FormOption[])
  },

  /** GET /api/ref/cargo-types  */
  fetchCargoTypes(): Promise<FormOption[]> {
    return resolve(cargoOptions as FormOption[])
  },

  /** GET /api/ref/weight-units  */
  fetchWeightUnits(): Promise<FormOption[]> {
    return resolve(weightUnits as FormOption[])
  },

  /** GET /api/ref/seal-types  */
  fetchSealTypes(): Promise<FormOption[]> {
    return resolve(sealTypes as FormOption[])
  },

  /**
   * GET /api/exporters/:id/marks
   * Returns the set of marks-and-numbers options for a specific exporter.
   * The component only depends on the { value, label } shape.
   */
  fetchMarksAndNumbers(exporterId: string): Promise<FormOption[]> {
    const marksByExporter: Record<string, FormOption[]> = {
      '1000': [
        { value: 'AARAV TEXTILES / MADE IN INDIA', label: 'AARAV TEXTILES / MADE IN INDIA' },
        { value: 'ATPL / LOT NO. ______', label: 'ATPL / LOT NO. ______' }
      ],
      '1002': [
        { value: 'BLUE HARBOR EXPORTS / INDIA', label: 'BLUE HARBOR EXPORTS / INDIA' },
        { value: 'BHE / SHIPPING MARKS AS PER INVOICE', label: 'BHE / SHIPPING MARKS AS PER INVOICE' }
      ]
    }
    return resolve(marksByExporter[exporterId] ?? [])
  }
}
