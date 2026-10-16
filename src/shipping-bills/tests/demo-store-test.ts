import { beforeEach, describe, expect, it } from 'vitest'
import {
  deleteBranch,
  deleteParty,
  getDemoData,
  saveBill,
  saveBranch,
  saveBusiness,
  saveExporter,
  syncBillsFromApi
} from '../demo-store'
import { emptyBill, SavedBill } from '../model'

describe('Demo Store & State Management', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('provides seed exporters and businesses', () => {
    const data = getDemoData()
    expect(data.exporters.length).toBeGreaterThanOrEqual(1)
    expect(data.businesses.length).toBeGreaterThanOrEqual(1)
  })

  it('saves and updates a shipping bill in the store', () => {
    const initialBill = {
      ...emptyBill(),
      jobNumber: 'TEST-999',
      exporterId: '1000'
    }

    const saved = saveBill(initialBill)
    expect(saved.id).toBeDefined()
    expect(saved.values.jobNumber).toBe('TEST-999')

    // Update the bill
    const updated = saveBill({ ...saved.values, jobNumber: 'TEST-1000' }, saved.id)
    expect(updated.id).toBe(saved.id)
    expect(updated.values.jobNumber).toBe('TEST-1000')

    const currentBills = getDemoData().bills
    expect(currentBills.some((b) => b.id === saved.id && b.values.jobNumber === 'TEST-1000')).toBe(true)
  })

  it('saves an exporter and auto-generates first branch if provided', () => {
    const created = saveExporter({
      name: 'Dynamic Global Fabrics',
      iec: 'AAAFG1234K',
      class: 'F',
      type: 'P',
      firstBranch: {
        branchName: 'Noida HQ',
        address1: 'Sector 62',
        city: 'Noida',
        countryCode: 'IN'
      }
    })

    expect(created.id).toBeDefined()
    expect(created.name).toBe('Dynamic Global Fabrics')
    expect(created.branches).toHaveLength(1)
    expect(created.branches[0].branchName).toBe('Noida HQ')
  })

  it('saves a business party and associates branches', () => {
    const business = saveBusiness({
      name: 'Pacific Traders Co.',
      isConsignee: true,
      isBuyer: true,
      isNotify: false,
      isThirdParty: false,
      firstBranch: {
        branchName: 'Main Depot',
        address1: 'Port Road 1',
        city: 'San Francisco',
        countryCode: 'US'
      }
    })

    expect(business.id).toBeDefined()
    expect(business.isConsignee).toBe(true)

    // Add branch to this business
    const branch = saveBranch('business', business.id, {
      branchName: 'East Coast Warehouse',
      address1: 'Bay Parkway',
      city: 'Oakland',
      countryCode: 'US'
    })

    expect(branch.id).toBeDefined()
    const stored = getDemoData().businesses.find((b) => b.id === business.id)
    expect(stored?.branches).toHaveLength(2)
  })

  it('prevents deletion of a party currently in use by a bill', () => {
    const inUseExporterId = 1000
    // Bill 3000 uses exporterId '1000'
    const deleted = deleteParty('exporter', inUseExporterId)
    expect(deleted).toBe(false)
  })

  it('prevents deletion of a branch currently in use by a bill', () => {
    const inUseBranchId = 1001
    // Bill 3000 uses exporterBranchId '1001'
    const deleted = deleteBranch('exporter', 1000, inUseBranchId)
    expect(deleted).toBe(false)
  })

  it('syncs bills from API overlaying existing map', () => {
    const mockApiBills: SavedBill[] = [
      {
        id: 7001,
        created: '2026-10-15T00:00:00.000Z',
        updated: '2026-10-15T00:00:00.000Z',
        values: {
          ...emptyBill(),
          jobNumber: 'API-7001'
        }
      }
    ]

    syncBillsFromApi(mockApiBills)
    const bills = getDemoData().bills
    expect(bills.some((b) => b.id === 7001)).toBe(true)
  })
})
