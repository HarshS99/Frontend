import { useSyncExternalStore } from 'react'
import { Branch, Business, Exporter, SavedBill, ShippingBillFormValues, toShippingBillPayload } from './model'

interface DemoData {
  exporters: Exporter[]
  businesses: Business[]
  bills: SavedBill[]
}

const storageKey = 'export-software-shipping-bills-v2'

const seed: DemoData = {
  exporters: [
    {
      id: 1000,
      name: 'Aarav Textiles Pvt Ltd',
      iec: 'AAECA1234F',
      class: 'F',
      type: 'P',
      branches: [
        {
          id: 1000,
          branchName: 'Ludhiana factory',
          address1: '12 Industrial Area',
          city: 'Ludhiana',
          state: 'Punjab',
          pincode: '141015',
          countryCode: 'IN',
          gstnId: '03AAECA1234F1Z5',
          adCode: '62093230170136'
        },
        {
          id: 1001,
          branchName: 'Tirupur Processing Unit',
          address1: '45 Cotton Mill Road',
          city: 'Tirupur',
          state: 'Tamil Nadu',
          pincode: '641601',
          countryCode: 'IN'
        }
      ]
    },
    {
      id: 1002,
      name: 'Blue Harbor Exports',
      iec: 'AABCB5678G',
      class: 'R',
      type: 'P',
      branches: [
        {
          id: 1003,
          branchName: 'Mumbai office',
          address1: '8 Dock Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          countryCode: 'IN'
        },
        {
          id: 1005,
          branchName: 'Mundra Port Logistics Hub',
          address1: 'Plot 14 Port SEZ',
          city: 'Mundra',
          state: 'Gujarat',
          pincode: '370421',
          countryCode: 'IN'
        }
      ]
    },
    {
      id: 1010,
      name: 'Apex Garments & Fashion Pvt Ltd',
      iec: 'AAACG9876K',
      class: 'F',
      type: 'P',
      branches: [
        {
          id: 1011,
          branchName: 'Surat Apparel Park',
          address1: 'Sector 3 GIDC Khatodara',
          city: 'Surat',
          state: 'Gujarat',
          pincode: '395002',
          countryCode: 'IN'
        },
        {
          id: 1012,
          branchName: 'Ahmedabad Central Warehouse',
          address1: 'NH-8 Narol Highway',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '382405',
          countryCode: 'IN'
        }
      ]
    },
    {
      id: 1020,
      name: 'Zenith Spices & Agri Corp',
      iec: 'AADCZ3456M',
      class: 'R',
      type: 'P',
      branches: [
        {
          id: 1021,
          branchName: 'Kochi Export Hub',
          address1: 'Willingdon Island Terminal',
          city: 'Kochi',
          state: 'Kerala',
          pincode: '682003',
          countryCode: 'IN'
        },
        {
          id: 1022,
          branchName: 'Guntur Spice Processing Center',
          address1: 'Guntur GT Road',
          city: 'Guntur',
          state: 'Andhra Pradesh',
          pincode: '522001',
          countryCode: 'IN'
        }
      ]
    },
    {
      id: 1030,
      name: 'Titanium Engineering Works',
      iec: 'AAEET7788P',
      class: 'F',
      type: 'P',
      branches: [
        {
          id: 1031,
          branchName: 'Pune Auto Cluster Plant',
          address1: 'Chinchwad MIDC Industrial Zone',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411019',
          countryCode: 'IN'
        },
        {
          id: 1032,
          branchName: 'Chennai Guindy Depot',
          address1: 'Guindy Industrial Estate',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600032',
          countryCode: 'IN'
        }
      ]
    },
    {
      id: 1040,
      name: 'Evergreen Organics Pvt Ltd',
      iec: 'AAEOE5544R',
      class: 'F',
      type: 'P',
      branches: [
        {
          id: 1041,
          branchName: 'Bengaluru Biotech Park Branch',
          address1: 'Electronics City Phase 1',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560100',
          countryCode: 'IN'
        },
        {
          id: 1042,
          branchName: 'Mysuru Herbal Extraction Unit',
          address1: 'Hebbal Industrial Area',
          city: 'Mysuru',
          state: 'Karnataka',
          pincode: '570016',
          countryCode: 'IN'
        }
      ]
    },
    {
      id: 1050,
      name: 'Rajputana Handicrafts Ltd',
      iec: 'AARPR9911X',
      class: 'R',
      type: 'P',
      branches: [
        {
          id: 1051,
          branchName: 'Jaipur Artisan Export Hub',
          address1: 'Sitapura Industrial Area',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302022',
          countryCode: 'IN'
        },
        {
          id: 1052,
          branchName: 'Jodhpur Wooden Craft Depot',
          address1: 'Boranada SEZ Phase II',
          city: 'Jodhpur',
          state: 'Rajasthan',
          pincode: '342012',
          countryCode: 'IN'
        }
      ]
    }
  ],
  businesses: [
    {
      id: 1000,
      name: 'Gulf Retail LLC',
      isConsignee: true,
      isBuyer: true,
      isNotify: false,
      isThirdParty: false,
      branches: [
        {
          id: 1000,
          branchName: 'Dubai head office',
          address1: '18 Creek Road',
          city: 'Dubai',
          countryCode: 'AE'
        },
        {
          id: 2004,
          branchName: 'Abu Dhabi Distribution Hub',
          address1: 'KIZAD Industrial Zone',
          city: 'Abu Dhabi',
          countryCode: 'AE'
        }
      ]
    },
    {
      id: 2002,
      name: 'Northstar Trading Inc',
      isConsignee: true,
      isBuyer: true,
      isNotify: true,
      isThirdParty: false,
      branches: [
        {
          id: 2003,
          branchName: 'New Orleans warehouse',
          address1: '456 Import Street',
          city: 'New Orleans',
          state: 'Louisiana',
          countryCode: 'US'
        },
        {
          id: 2005,
          branchName: 'Houston Fulfillment Center',
          address1: '8900 Port of Houston Parkway',
          city: 'Houston',
          state: 'Texas',
          countryCode: 'US'
        }
      ]
    },
    {
      id: 2010,
      name: 'EuroGlobal Fashion GmbH',
      isConsignee: true,
      isBuyer: true,
      isNotify: true,
      isThirdParty: false,
      branches: [
        {
          id: 2011,
          branchName: 'Hamburg Central Hub',
          address1: 'Speicherstadt Logistics Park 4',
          city: 'Hamburg',
          countryCode: 'DE'
        },
        {
          id: 2012,
          branchName: 'Frankfurt Distribution Depot',
          address1: 'Flughafen Gateway Gardens',
          city: 'Frankfurt',
          countryCode: 'DE'
        }
      ]
    },
    {
      id: 2020,
      name: 'Pacific Rim Import Co.',
      isConsignee: true,
      isBuyer: true,
      isNotify: false,
      isThirdParty: false,
      branches: [
        {
          id: 2021,
          branchName: 'Los Angeles Port Terminal Branch',
          address1: '700 Harbor Boulevard',
          city: 'Los Angeles',
          state: 'California',
          countryCode: 'US'
        },
        {
          id: 2022,
          branchName: 'Seattle Gateway Warehouse',
          address1: '1200 Pacific Highway',
          city: 'Seattle',
          state: 'Washington',
          countryCode: 'US'
        }
      ]
    },
    {
      id: 2030,
      name: 'Al-Mansoor Trading FZE',
      isConsignee: true,
      isBuyer: true,
      isNotify: true,
      isThirdParty: false,
      branches: [
        {
          id: 2031,
          branchName: 'Jebel Ali Free Zone Office',
          address1: 'JAFZA North Tower 2',
          city: 'Dubai',
          countryCode: 'AE'
        },
        {
          id: 2032,
          branchName: 'Sharjah Industrial Depot',
          address1: 'SAIF Zone Building 5',
          city: 'Sharjah',
          countryCode: 'AE'
        }
      ]
    },
    {
      id: 2040,
      name: 'Apex Overseas Pte Ltd',
      isConsignee: true,
      isBuyer: true,
      isNotify: false,
      isThirdParty: false,
      branches: [
        {
          id: 2041,
          branchName: 'Singapore Tech Park Branch',
          address1: '50 Jurong East Street 21',
          city: 'Singapore',
          countryCode: 'SG'
        },
        {
          id: 2042,
          branchName: 'Changi Air Freight Center',
          address1: 'Cargo Agents Building C',
          city: 'Singapore',
          countryCode: 'SG'
        }
      ]
    },
    {
      id: 2050,
      name: 'British Heritage Imports Ltd',
      isConsignee: true,
      isBuyer: true,
      isNotify: true,
      isThirdParty: false,
      branches: [
        {
          id: 2051,
          branchName: 'London Gateway Terminal',
          address1: 'Thames Port Logistics Park',
          city: 'London',
          countryCode: 'GB'
        },
        {
          id: 2052,
          branchName: 'Manchester Regional Depot',
          address1: 'Trafford Industrial Estate',
          city: 'Manchester',
          countryCode: 'GB'
        }
      ]
    }
  ],
  bills: [
    {
      id: 3000,
      created: '2026-09-18T08:00:00.000Z',
      updated: '2026-09-18T08:00:00.000Z',
      values: {
        jobNumber: '2081',
        jobDate: '2026-09-18',
        exporterId: '1000',
        exporterBranchId: '1001',
        consigneeId: '2002',
        consigneeBranchId: '2003',
        loadingPort: 'INMUN1',
        finalDestinationPort: 'USMSY',
        natureOfCargo: 'P',
        grossWeight: '34.6',
        netWeight: '23.5',
        measurementUnit: 'KG',
        totalPackages: '12',
        invoices: [
          {
            invoiceNumber: 'EX/2081/2026',
            invoiceDate: '2026-09-17',
            currency: 'USD',
            contractType: 'FOB',
            buyerSameAsConsignee: true,
            buyerId: '2002',
            buyerBranchId: '2003',
            items: [
              {
                ritcCode: '61091000',
                goodsDescription1: 'Cotton T-shirts',
                quantity: '51',
                unitOfMeasurement: 'PCS',
                unitPrice: '3.831',
                igstPaymentStatus: 'LUT',
                rewardItem: true
              }
            ]
          }
        ],
        containers: [],
        packingRanges: [],
        documents: [],
        licenses: []
      }
    }
  ]
}

function loadData(): DemoData {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoData
      if (Array.isArray(parsed.exporters) && Array.isArray(parsed.businesses) && Array.isArray(parsed.bills)) {
        // Merge missing seed exporters and businesses into parsed store
        const existingExporterIds = new Set(parsed.exporters.map((e) => e.id))
        const missingExporters = seed.exporters.filter((e) => !existingExporterIds.has(e.id))
        const mergedExporters = [...parsed.exporters, ...missingExporters]

        const existingBusinessIds = new Set(parsed.businesses.map((b) => b.id))
        const missingBusinesses = seed.businesses.filter((b) => !existingBusinessIds.has(b.id))
        const mergedBusinesses = [...parsed.businesses, ...missingBusinesses]

        return {
          exporters: mergedExporters,
          businesses: mergedBusinesses,
          bills: parsed.bills.map((bill) => ({
            ...bill,
            values: {
              ...bill.values,
              packingRanges: (bill.values as Partial<ShippingBillFormValues>).packingRanges ?? []
            }
          }))
        }
      }
    }
  } catch {
    // Use sample data when local storage is unavailable or contains invalid data.
  }
  return seed
}

let snapshot = loadData()
const listeners = new Set<() => void>()

function publish(next: DemoData) {
  snapshot = next
  try {
    localStorage.setItem(storageKey, JSON.stringify(next))
  } catch {
    // The in-memory demo remains usable when storage is disabled.
  }
  listeners.forEach((listener) => listener())
}

export function useDemoData() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => snapshot
  )
}

export function getDemoData() {
  return snapshot
}

function nextId() {
  const ids = [
    ...snapshot.exporters.flatMap((record) => [record.id, ...record.branches.map((branch) => branch.id)]),
    ...snapshot.businesses.flatMap((record) => [record.id, ...record.branches.map((branch) => branch.id)]),
    ...snapshot.bills.map((bill) => bill.id)
  ]
  return Math.max(3000, ...ids) + 1
}

export function saveExporter(
  exporter: Omit<Exporter, 'id' | 'branches'> & { id?: number; firstBranch?: Omit<Branch, 'id'> }
) {
  const id = exporter.id ?? nextId()
  const previous = snapshot.exporters.find((record) => record.id === id)
  const branches = previous?.branches ?? (exporter.firstBranch ? [{ ...exporter.firstBranch, id: id + 1 }] : [])
  const record: Exporter = {
    id,
    branches,
    name: exporter.name,
    iec: exporter.iec,
    class: exporter.class,
    type: exporter.type,
    pan: exporter.pan,
    tan: exporter.tan,
    aeoNumber: exporter.aeoNumber,
    website: exporter.website,
    notes: exporter.notes,
    disabled: exporter.disabled ?? previous?.disabled
  }
  publish({ ...snapshot, exporters: [...snapshot.exporters.filter((item) => item.id !== id), record] })
  return record
}

export function saveBusiness(
  business: Omit<Business, 'id' | 'branches'> & { id?: number; firstBranch?: Omit<Branch, 'id'> }
) {
  const id = business.id ?? nextId()
  const previous = snapshot.businesses.find((record) => record.id === id)
  const branches = previous?.branches ?? (business.firstBranch ? [{ ...business.firstBranch, id: id + 1 }] : [])
  const record: Business = {
    id,
    branches,
    name: business.name,
    iec: business.iec,
    isConsignee: business.isConsignee,
    isBuyer: business.isBuyer,
    isNotify: business.isNotify,
    isThirdParty: business.isThirdParty
  }
  publish({ ...snapshot, businesses: [...snapshot.businesses.filter((item) => item.id !== id), record] })
  return record
}

export function saveBranch(
  kind: 'exporter' | 'business',
  ownerId: number,
  branch: Omit<Branch, 'id'> & { id?: number }
) {
  const id = branch.id ?? nextId()
  const record = { ...branch, id }
  if (kind === 'exporter') {
    publish({
      ...snapshot,
      exporters: snapshot.exporters.map((owner) =>
        owner.id === ownerId
          ? { ...owner, branches: [...owner.branches.filter((item) => item.id !== id), record] }
          : owner
      )
    })
  } else {
    publish({
      ...snapshot,
      businesses: snapshot.businesses.map((owner) =>
        owner.id === ownerId
          ? { ...owner, branches: [...owner.branches.filter((item) => item.id !== id), record] }
          : owner
      )
    })
  }
  return record
}

export function deleteParty(kind: 'exporter' | 'business', id: number) {
  const inUse = snapshot.bills.some((bill) =>
    kind === 'exporter'
      ? bill.values.exporterId === String(id)
      : bill.values.consigneeId === String(id) ||
        bill.values.invoices.some(
          (invoice) =>
            invoice.buyerId === String(id) ||
            invoice.thirdPartyId === String(id) ||
            invoice.items.some((item) => item.itemThirdPartyId === String(id))
        )
  )
  if (inUse) return false
  publish({
    ...snapshot,
    exporters: kind === 'exporter' ? snapshot.exporters.filter((record) => record.id !== id) : snapshot.exporters,
    businesses: kind === 'business' ? snapshot.businesses.filter((record) => record.id !== id) : snapshot.businesses
  })
  return true
}

export function deleteBranch(kind: 'exporter' | 'business', ownerId: number, id: number) {
  const inUse = snapshot.bills.some((bill) =>
    kind === 'exporter'
      ? bill.values.exporterBranchId === String(id)
      : bill.values.consigneeBranchId === String(id) ||
        bill.values.invoices.some(
          (invoice) =>
            invoice.buyerBranchId === String(id) ||
            invoice.thirdPartyBranchId === String(id) ||
            invoice.items.some((item) => item.itemThirdPartyBranchId === String(id))
        )
  )
  if (inUse) return false
  if (kind === 'exporter') {
    publish({
      ...snapshot,
      exporters: snapshot.exporters.map((owner) =>
        owner.id === ownerId ? { ...owner, branches: owner.branches.filter((branch) => branch.id !== id) } : owner
      )
    })
  } else {
    publish({
      ...snapshot,
      businesses: snapshot.businesses.map((owner) =>
        owner.id === ownerId ? { ...owner, branches: owner.branches.filter((branch) => branch.id !== id) } : owner
      )
    })
  }
  return true
}

export function saveBill(values: ShippingBillFormValues, id?: number) {
  const now = new Date().toISOString()
  const previous = snapshot.bills.find((bill) => bill.id === id)
  const record: SavedBill = {
    id: id ?? nextId(),
    created: previous?.created ?? now,
    updated: now,
    values,
    payload: toShippingBillPayload(values)
  }
  publish({ ...snapshot, bills: [record, ...snapshot.bills.filter((bill) => bill.id !== id)] })
  return record
}

export function syncBillsFromApi(apiBills: SavedBill[]) {
  if (!apiBills?.length) return
  const existingMap = new Map<number, SavedBill>()
  // Put existing bills first
  for (const b of snapshot.bills) {
    existingMap.set(b.id, b)
  }
  // Overlay/add API bills
  for (const b of apiBills) {
    existingMap.set(b.id, b)
  }
  publish({
    ...snapshot,
    bills: Array.from(existingMap.values())
  })
}
