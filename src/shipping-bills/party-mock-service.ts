import { getDemoData } from './demo-store'
import { Branch, Business, Exporter, loadingPorts, PortOption, ports } from './model'

const MOCK_DELAY_MS = 250

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const partyMockService = {
  /**
   * Search Exporters by name or IEC
   */
  async searchExporters(query: string): Promise<Exporter[]> {
    const { exporters } = getDemoData()
    const q = query.trim().toLowerCase()
    const filtered = exporters.filter(
      (item) => !item.disabled && (item.name.toLowerCase().includes(q) || item.iec.toLowerCase().includes(q))
    )
    return delay(filtered)
  },

  /**
   * Search Branches belonging to a specific Exporter ID
   */
  async searchExporterBranches(exporterId: string, query: string): Promise<Branch[]> {
    if (!exporterId) return delay([])
    const { exporters } = getDemoData()
    const exporter = exporters.find((item) => String(item.id) === exporterId)
    if (!exporter) return delay([])

    const q = query.trim().toLowerCase()
    const filtered = exporter.branches.filter(
      (branch) => branch.branchName.toLowerCase().includes(q) || branch.city.toLowerCase().includes(q)
    )
    return delay(filtered)
  },

  /**
   * Search Consignees by name
   */
  async searchConsignees(query: string): Promise<Business[]> {
    const { businesses } = getDemoData()
    const q = query.trim().toLowerCase()
    const filtered = businesses.filter((item) => item.isConsignee && item.name.toLowerCase().includes(q))
    return delay(filtered)
  },

  /**
   * Search Branches belonging to a specific Consignee ID
   */
  async searchConsigneeBranches(consigneeId: string, query: string): Promise<Branch[]> {
    if (!consigneeId) return delay([])
    const { businesses } = getDemoData()
    const consignee = businesses.find((item) => String(item.id) === consigneeId)
    if (!consignee) return delay([])

    const q = query.trim().toLowerCase()
    const filtered = consignee.branches.filter(
      (branch) => branch.branchName.toLowerCase().includes(q) || branch.city.toLowerCase().includes(q)
    )
    return delay(filtered)
  },

  /**
   * Fetch a single Exporter by ID (used for label resolution)
   */
  async getExporterById(exporterId: string): Promise<Exporter | undefined> {
    const { exporters } = getDemoData()
    return delay(
      exporters.find((item) => String(item.id) === exporterId),
      100
    )
  },

  /**
   * Fetch a single Consignee by ID (used for label resolution)
   */
  async getConsigneeById(consigneeId: string): Promise<Business | undefined> {
    const { businesses } = getDemoData()
    return delay(
      businesses.find((item) => String(item.id) === consigneeId),
      100
    )
  },

  /**
   * Search Port of Loading (Indian ports: code starts with 'IN')
   */
  async searchLoadingPorts(query: string): Promise<PortOption[]> {
    const q = query.trim().toLowerCase()
    const portsList = loadingPorts.filter((port) => port.code.startsWith('IN'))
    const filtered = portsList.filter(
      (port) => port.name.toLowerCase().includes(q) || port.code.toLowerCase().includes(q)
    )
    return delay(filtered)
  },

  /**
   * Search Final Destination Ports (all ports)
   */
  async searchDestinationPorts(query: string): Promise<PortOption[]> {
    const q = query.trim().toLowerCase()
    const filtered = ports.filter((port) => port.name.toLowerCase().includes(q) || port.code.toLowerCase().includes(q))
    return delay(filtered)
  },

  /**
   * Fetch Port by Code (used for label resolution)
   */
  async getPortByCode(code: string): Promise<PortOption | undefined> {
    const allPorts = [...loadingPorts, ...ports]
    return delay(
      allPorts.find((port) => port.code === code),
      100
    )
  },

  /**
   * Fetch Marks and Numbers options for a specific Exporter ID
   */
  async getMarksAndNumbers(exporterId: string): Promise<{ value: string; label: string }[]> {
    const marksByExporter: Record<string, { value: string; label: string }[]> = {
      '1000': [
        { value: 'AARAV TEXTILES / MADE IN INDIA', label: 'AARAV TEXTILES / MADE IN INDIA' },
        { value: 'ATPL / LOT NO. ______', label: 'ATPL / LOT NO. ______' }
      ],
      '1002': [
        { value: 'BLUE HARBOR EXPORTS / INDIA', label: 'BLUE HARBOR EXPORTS / INDIA' },
        { value: 'BHE / SHIPPING MARKS AS PER INVOICE', label: 'BHE / SHIPPING MARKS AS PER INVOICE' }
      ]
    }
    return delay(marksByExporter[exporterId] ?? [], 150)
  }
}
