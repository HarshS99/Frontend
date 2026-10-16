import { describe, expect, it } from 'vitest'
import { emptyBill, emptyDocument, emptyInvoice, emptyItem, invoiceTotal, lineTotal, portCountry } from '../model'

describe('Shipping Bill Model Calculations & Factories', () => {
  describe('empty factories', () => {
    it('creates emptyItem with standard defaults', () => {
      const item = emptyItem()
      expect(item.unitOfMeasurement).toBe('PCS')
      expect(item.tradeAgreementsCode).toBe('NCPTI')
      expect(item.ritcCode).toBe('')
      expect(item.quantity).toBe('')
      expect(item.unitPrice).toBe('')
    })

    it('creates emptyInvoice with FOB, USD and today date', () => {
      const invoice = emptyInvoice()
      expect(invoice.currency).toBe('USD')
      expect(invoice.contractType).toBe('FOB')
      expect(invoice.buyerSameAsConsignee).toBe(true)
      expect(invoice.items).toHaveLength(1)
      expect(invoice.invoiceDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('creates emptyDocument with today date', () => {
      const doc = emptyDocument()
      expect(doc.documentTypeCode).toBe('')
      expect(doc.documentReferenceNumber).toBe('')
      expect(doc.documentIssueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('creates emptyBill with default natureOfCargo and kg unit', () => {
      const bill = emptyBill()
      expect(bill.natureOfCargo).toBe('P')
      expect(bill.measurementUnit).toBe('KG')
      expect(bill.invoices).toHaveLength(1)
      expect(bill.containers).toEqual([])
      expect(bill.packingRanges).toEqual([])
      expect(bill.documents).toEqual([])
      expect(bill.licenses).toEqual([])
    })
  })

  describe('lineTotal', () => {
    it('calculates total as quantity * unitPrice when lineTotal is not specified', () => {
      const item = {
        ...emptyItem(),
        quantity: '10',
        unitPrice: '5.5'
      }
      expect(lineTotal(item)).toBe(55)
    })

    it('uses explicit lineTotal when provided', () => {
      const item = {
        ...emptyItem(),
        quantity: '10',
        unitPrice: '5.5',
        lineTotal: '60'
      }
      expect(lineTotal(item)).toBe(60)
    })

    it('falls back to calculation when explicit lineTotal is whitespace', () => {
      const item = {
        ...emptyItem(),
        quantity: '4',
        unitPrice: '25',
        lineTotal: '   '
      }
      expect(lineTotal(item)).toBe(100)
    })
  })

  describe('invoiceTotal', () => {
    it('sums all item line totals in an invoice', () => {
      const invoice = {
        ...emptyInvoice(),
        items: [
          { ...emptyItem(), quantity: '2', unitPrice: '10' },
          { ...emptyItem(), quantity: '5', unitPrice: '20' },
          { ...emptyItem(), quantity: '1', unitPrice: '50', lineTotal: '45' } // override discount
        ]
      }
      // 2*10 (20) + 5*20 (100) + 45 = 165
      expect(invoiceTotal(invoice)).toBe(165)
    })

    it('returns 0 for invoice with empty items array', () => {
      const invoice = {
        ...emptyInvoice(),
        items: []
      }
      expect(invoiceTotal(invoice)).toBe(0)
    })
  })

  describe('portCountry', () => {
    it('resolves port country from known ports list', () => {
      expect(portCountry('INMUN1')).toBe('IN')
      expect(portCountry('USMSY')).toBe('US')
      expect(portCountry('DEHAM')).toBe('DE')
      expect(portCountry('AEJEA')).toBe('AE')
      expect(portCountry('SGSIN')).toBe('SG')
    })

    it('falls back to the 2-letter prefix for unknown port codes', () => {
      expect(portCountry('FRLEH')).toBe('FR')
      expect(portCountry('JPTYO')).toBe('JP')
    })

    it('returns empty string when undefined or invalid', () => {
      expect(portCountry(undefined)).toBe('')
      expect(portCountry('123')).toBe('')
    })
  })
})
