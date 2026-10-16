import { routes } from '@/shared/route-paths'
import { navigate, useParams } from 'core/routing'
import { Button } from 'ui/basic/button'
import { BillEditor } from './components/bill-editor'
import { useDemoData } from './demo-store'
import { shippingBillService } from './shipping-bill-service'

export default function ShippingBillPage() {
  const { id } = useParams<{ id?: string }>()
  const { bills } = useDemoData()
  const bill = id ? (bills.find((item) => item.id === Number(id)) ?? shippingBillService.getById(id)) : undefined

  if (id && !bill) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-xs">
        <div className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-950">Shipping bill not found</h1>
        <p className="max-w-md text-sm text-gray-500">
          The requested shipping bill ID #{id} could not be located in your local store or the remote registry.
        </p>
        <Button onClick={() => navigate(routes.dashboard)}>Back to dashboard</Button>
      </div>
    )
  }

  return <BillEditor key={id ?? 'new'} bill={bill} />
}
