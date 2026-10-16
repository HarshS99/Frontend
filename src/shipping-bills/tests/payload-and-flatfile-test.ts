import { describe, expect, it } from 'vitest'
import { emptyBill, emptyInvoice, emptyItem, SavedBill, ShippingBillFormValues, toShippingBillPayload } from '../model'
import {
  generateFlatFileContent,
  normalizeApiBill,
  normalizeApiBills,
  toHttpShippingBillPayload
} from '../shipping-bill-service'

describe('Payload Transformations & Flat-File (.sb) Generation', () => {
  const sampleValues: ShippingBillFormValues = {
    ...emptyBill(),
    jobNumber: '150011',
    jobDate: '2026-10-15',
    exporterId: '1000',
    exporterBranchId: '1001',
    exporterName: 'Aarav Textiles',
    consigneeId: '2002',
    consigneeBranchId: '2003',
    consigneeName: 'Northstar Trading',
    loadingPort: 'INMUN1',
    finalDestinationPort: 'USMSY',
    dischargePort: 'USMSY',
    grossWeight: '1500.5',
    netWeight: '1420',
    measurementUnit: 'KG',
    totalPackages: '50',
    marksAndNumbers: 'ATPL / 2026 / US',
    invoices: [
      {
        ...emptyInvoice(),
        invoiceNumber: 'INV-2026-001',
        invoiceDate: '2026-10-14',
        currency: 'USD',
        contractType: 'FOB',
        freightAmount: '250',
        insuranceAmount: '75',
        items: [
          {
            ...emptyItem(),
            ritcCode: '61091000',
            goodsDescription1: '100% Combed Cotton T-Shirts',
            quantity: '1000',
            unitOfMeasurement: 'PCS',
            unitPrice: '5.25',
            schemeCode: '19',
            rewardItem: true
          }
        ]
      }
    ],
    packingRanges: [
      {
        packingNumberFrom: '1',
        packingNumberTo: '50',
        packingCode: 'CTN'
      }
    ]
  }

  describe('toShippingBillPayload', () => {
    it('correctly maps form values to shipping bill payload domain structure', () => {
      const payload = toShippingBillPayload(sampleValues)

      expect(payload.shipping_bill.job_number).toBe(150011)
      expect(payload.shipping_bill.job_date).toBe('2026-10-15')
      expect(payload.shipping_bill.exporter).toBe(1000)
      expect(payload.shipping_bill.exporter_branch).toBe(1001)
      expect(payload.shipping_bill.consignee).toBe(2002)
      expect(payload.shipping_bill.consignee_address).toBe(2003)
      expect(payload.shipping_bill.loading_port).toBe('INMUN1')
      expect(payload.shipping_bill.loading_country_code).toBe('IN')
      expect(payload.shipping_bill.final_destination_port).toBe('USMSY')
      expect(payload.shipping_bill.final_destination_country_code).toBe('US')
      expect(payload.shipping_bill.grossweight).toBe(1500.5)
      expect(payload.shipping_bill.netweight).toBe(1420)
      expect(payload.shipping_bill.total_packages).toBe(50)

      expect(payload.invoices).toHaveLength(1)
      const inv = payload.invoices[0]
      expect(inv.invoicenumber).toBe('INV-2026-001')
      expect(inv.currency).toBe('USD')
      expect(inv.buyer).toBe(2002) // buyerSameAsConsignee uses consigneeId
      expect(inv.items).toHaveLength(1)
      expect(inv.items[0].ritc_code).toBe('61091000')
      expect(inv.items[0].quantity).toBe(1000)
      expect(inv.items[0].unit_price).toBe(5.25)
      expect(inv.items[0].line_total).toBe(5250)
      expect(inv.items[0].reward_item).toBe(true)

      expect(payload.packging_list).toHaveLength(1)
      expect(payload.packging_list[0].packing_number_from).toBe(1)
      expect(payload.packging_list[0].packing_number_to).toBe(50)
    })
  })

  describe('toHttpShippingBillPayload', () => {
    it('transforms form values to API wire format', () => {
      const httpPayload = toHttpShippingBillPayload(sampleValues)

      expect(httpPayload.chaId).toBe(1000)
      expect(httpPayload.exporterId).toBe(1000)
      expect(httpPayload.exporterBranchId).toBe(1001)
      expect(httpPayload.consigneeId).toBe(2002)
      expect(httpPayload.consigneeAddressId).toBe(2003)
      expect(httpPayload.loadingPort).toBe('INMUN1')
      expect(httpPayload.measurementUnit).toBe('KGS')
      expect(httpPayload.invoices[0].invoiceNumber).toBe('INV-2026-001')
      expect(httpPayload.invoices[0].currency).toBe(840) // USD code
      expect(httpPayload.invoices[0].freightAmount).toBe(250)
      expect(httpPayload.invoices[0].insuranceAmount).toBe(75)
      expect(httpPayload.invoices[0].items[0].ritcCode).toBe('61091000')
      expect(httpPayload.invoices[0].items[0].quantity).toBe(1000)
      expect(httpPayload.invoices[0].items[0].unitPrice).toBe(5.25)
      expect(httpPayload.packgingList[0].packingNumberFrom).toBe(1)
      expect(httpPayload.packgingList[0].packingNumberTo).toBe(50)
    })
  })

  describe('normalizeApiBill & normalizeApiBills', () => {
    it('normalizes raw API responses into SavedBill interface', () => {
      const rawApi = {
        id: 9999,
        jobNumber: 150099,
        jobDate: 20728, // epoch days
        exporterId: 1000,
        exporterBranchId: 1001,
        exporterName: 'Aarav Textiles',
        consigneeId: 2002,
        consigneeName: 'Northstar Trading',
        loadingPort: 'INMUN1',
        destinationPort: 'USMSY',
        grossWeight: 450,
        invoices: [
          {
            invoiceNumber: 'INV-99',
            currency: 840,
            contractType: 1,
            items: [
              {
                ritcCode: '61091000',
                quantity: 100,
                unitPrice: 10
              }
            ]
          }
        ]
      }

      const bill = normalizeApiBill(rawApi)
      expect(bill.id).toBe(9999)
      expect(bill.values.jobNumber).toBe('150099')
      expect(bill.values.exporterId).toBe('1000')
      expect(bill.values.exporterName).toBe('Aarav Textiles')
      expect(bill.values.finalDestinationPort).toBe('USMSY')
      expect(bill.values.invoices[0].currency).toBe('USD')
      expect(bill.values.invoices[0].items[0].quantity).toBe('100')
    })

    it('returns empty array when input is null or undefined', () => {
      expect(normalizeApiBills(null)).toEqual([])
      expect(normalizeApiBills(undefined)).toEqual([])
    })

    it('extracts list correctly from wrapped responses', () => {
      const list = normalizeApiBills({ data: [{ id: 1, jobNumber: 101 }] })
      expect(list).toHaveLength(1)
      expect(list[0].id).toBe(1)
    })
  })

  describe('generateFlatFileContent', () => {
    it('generates valid ICEGATE .sb flat-file string with HREC, TABLE and TREC records', () => {
      const bill: SavedBill = {
        id: 150011,
        created: '2026-10-15T10:00:00.000Z',
        updated: '2026-10-15T10:00:00.000Z',
        values: sampleValues
      }

      const flatFile = generateFlatFileContent(bill)

      expect(flatFile).toContain('HREC**ZZ*INMUN1*ZZ*ICEGATE*01*SB*1.0*')
      expect(flatFile).toContain('<TABLE>SHIPPING_BILL')
      expect(flatFile).toContain('<TABLE>INVOICE')
      expect(flatFile).toContain('INV-2026-001')
      expect(flatFile).toContain('<TABLE>ITEM')
      expect(flatFile).toContain('61091000')
      expect(flatFile).toContain('100% Combed Cotton T-Shirts')
      expect(flatFile).toContain('<TABLE>PACKING')
      expect(flatFile).toContain('TREC**ZZ*INMUN1*ZZ*ICEGATE*01*SB*1.0*')
    })
  })
})
