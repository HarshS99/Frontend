import { routes } from '@/shared/route-paths'
import { invoiceTotal, SavedBill } from '@/shipping-bills/model'
import { shippingBillService } from '@/shipping-bills/shipping-bill-service'
import { navigate } from 'core/routing'
import { toast } from 'core/toast-manager'
import { useEffect, useState } from 'react'
import { Badge } from 'ui/basic/badge'
import { Button } from 'ui/basic/button'
import { Card, CardContent } from 'ui/basic/card'
import { Table } from 'ui/basic/table'
import { Input } from 'ui/inputs/input'

export default function ListDashboard() {
  const [bills, setBills] = useState<SavedBill[]>(() => shippingBillService.getInitialBills())
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  async function fetchBills() {
    setIsLoading(true)
    try {
      const remoteBills = await shippingBillService.list()
      if (remoteBills.length > 0) {
        setBills(remoteBills)
        toast.success(`Loaded ${remoteBills.length} shipping bills`)
      }
    } catch (err: any) {
      console.warn('Backend API listing notice:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchBills()
  }, [])

  async function handleDownloadFlatFile(bill: SavedBill) {
    try {
      setDownloadingId(bill.id)
      const res = await shippingBillService.downloadFlatFile(bill.id, bill)
      if (res.source === 'api') {
        toast.success('Flat file downloaded from backend API')
      } else {
        toast.success(`Flat file (.sb) generated and downloaded for #${bill.values.jobNumber ?? bill.id}`)
      }
    } catch (err: any) {
      console.warn('Flat file notice:', err)
      toast.error('Failed to generate flat file')
    } finally {
      setDownloadingId(null)
    }
  }

  const filtered = bills
    .filter((bill) => {
      const exporter = bill.values.exporterName ?? ''
      const consignee = bill.values.consigneeName ?? ''
      return [
        bill.id,
        bill.values.jobNumber,
        exporter,
        consignee,
        ...bill.values.invoices.map((invoice) => invoice.invoiceNumber)
      ]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })
    .sort((a, b) => {
      const timeA = a.updated ? new Date(a.updated).getTime() : 0
      const timeB = b.updated ? new Date(b.updated).getTime() : 0
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA)
    })

  const uniqueExportersCount = new Set(bills.map((b) => b.values.exporterName).filter(Boolean)).size

  const uniqueConsigneesCount = new Set(bills.map((b) => b.values.consigneeName).filter(Boolean)).size

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">Shipping bills</h1>
          <p className="mt-1 text-sm text-gray-500">Create and continue the shipping bill step of each export job.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void fetchBills()
            }}
            disabled={isLoading}>
            {isLoading ? 'Syncing...' : 'Sync from API'}
          </Button>
          <Button onClick={() => navigate(routes.shippingBillNew)}>+ New shipping bill</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-gray-500">Shipping bills</p>
            <p className="mt-1 text-2xl font-semibold">{bills.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-gray-500">Exporters</p>
            <p className="mt-1 text-2xl font-semibold">{uniqueExportersCount || 1}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-gray-500">Businesses / Consignees</p>
            <p className="mt-1 text-2xl font-semibold">{uniqueConsigneesCount || 1}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="w-full max-w-sm">
              <Input
                label="Search bills"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Job, invoice, exporter or consignee"
              />
            </div>
            <span className="text-sm text-gray-500">
              {filtered.length} {filtered.length === 1 ? 'bill' : 'bills'}
            </span>
          </div>
          {filtered.length ? (
            <Table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Exporter → Consignee</th>
                  <th>Route</th>
                  <th>Invoices</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((bill) => {
                  const exporterName = bill.values.exporterName ?? '—'
                  const consigneeName = bill.values.consigneeName ?? '—'
                  const total = bill.values.invoices.reduce((sum, invoice) => sum + invoiceTotal(invoice), 0)
                  return (
                    <tr key={bill.id}>
                      <td className="font-medium">
                        {bill.values.jobNumber ? `#${bill.values.jobNumber}` : `Bill #${bill.id}`}
                        <span className="block text-xs font-normal text-gray-500">{bill.values.jobDate}</span>
                      </td>
                      <td>
                        {exporterName}
                        <span className="block text-xs text-gray-500">to {consigneeName}</span>
                      </td>
                      <td>
                        {bill.values.loadingPort || '—'} → {bill.values.finalDestinationPort || '—'}
                      </td>
                      <td>
                        {bill.values.invoices.length}
                        <span className="block text-xs text-gray-500">
                          {total.toLocaleString(undefined, { maximumFractionDigits: 2 })} across items
                        </span>
                      </td>
                      <td>
                        <Badge variant="secondary">Draft</Badge>
                      </td>
                      <td>
                        {bill.updated && !isNaN(new Date(bill.updated).getTime())
                          ? new Date(bill.updated).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={downloadingId === bill.id}
                            onClick={() => {
                              void handleDownloadFlatFile(bill)
                            }}>
                            {downloadingId === bill.id ? 'Downloading...' : 'Flat File'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(routes.toShippingBillEdit(bill.id))}>
                            Open
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center">
              <p className="font-medium">{search ? 'No matching shipping bills' : 'No shipping bills yet'}</p>
              <p className="mt-1 text-sm text-gray-500">
                {search ? 'Try another job number or party name.' : 'Create a bill to start an export job.'}
              </p>
              {!search && (
                <Button className="mt-4" onClick={() => navigate(routes.shippingBillNew)}>
                  Create shipping bill
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
