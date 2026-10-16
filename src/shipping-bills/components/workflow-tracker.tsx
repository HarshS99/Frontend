import { workflowSteps } from '../workflow'

export function WorkflowTracker() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {workflowSteps.map((step, index) => {
        const isShippingBill = step.id === 'shipping-bill'
        return (
          <div
            key={step.id}
            className={`rounded-lg border p-3 ${
              isShippingBill ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-gray-50'
            }`}>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex size-6 items-center justify-center rounded-full bg-white text-xs font-semibold shadow-xs">
                {index + 1}
              </span>
              <span className={isShippingBill ? 'text-primary-950 font-semibold' : 'text-gray-700'}>{step.title}</span>
            </div>
            <p className="ml-8 text-xs text-gray-500">{step.description}</p>
          </div>
        )
      })}
    </div>
  )
}
