import { routes } from '@/shared/route-paths'
import { saveBill, useDemoData } from '@/shipping-bills/demo-store'
import { billSchema } from '@/shipping-bills/form-schema'
import {
  Branch,
  Business,
  emptyBill,
  emptyInvoice,
  Exporter,
  SavedBill,
  ShippingBillFormValues
} from '@/shipping-bills/model'
import { BranchDialog, PartyDialog } from '@/shipping-bills/party-dialogs'
import { shippingBillService } from '@/shipping-bills/shipping-bill-service'
import { useFieldArray, useForm } from 'core/form'
import { Form } from 'core/form/components'
import { navigate } from 'core/routing'
import { toast } from 'core/toast-manager'
import { useEffect, useState } from 'react'
import { Button } from 'ui/basic/button'
import { Tabs, TabsList, TabsTrigger } from 'ui/interactive/tabs'
import { ContainersAndPacking } from './containers-and-packing'
import { PersistentTab } from './form-ui-helpers'
import { InvoiceEditor } from './invoice-editor'
import { BranchPath } from './party-fields'
import { ShipmentBasicsSection } from './shipment-basics-section'
import { WorkflowTracker } from './workflow-tracker'

export interface QuickAddState {
  kind: 'exporter' | 'business'
  role?: 'consignee' | 'buyer' | 'thirdParty' | 'itemThirdParty'
  invoiceIndex?: number
  itemIndex?: number
}

export interface QuickBranchState {
  kind: 'exporter' | 'business'
  ownerId: number
  branchName: BranchPath
}

export function BillEditor({ bill }: { bill?: SavedBill }) {
  const { exporters, businesses } = useDemoData()
  const formCtx = useForm<ShippingBillFormValues>(billSchema, {
    defaultValues: bill?.values ?? emptyBill()
  })

  const { control, setValue, formState, watch } = formCtx.hooks
  const values = watch()

  const { fields: invoices, append: addInvoice, remove: removeInvoice } = useFieldArray({ control, name: 'invoices' })

  const [activeTab, setActiveTab] = useState('details')
  const [draftId, setDraftId] = useState<number | undefined>(bill?.id)
  const [quickAdd, setQuickAdd] = useState<QuickAddState | null>(null)
  const [quickBranch, setQuickBranch] = useState<QuickBranchState | null>(null)

  const consigneeOptions = businesses.filter((business) =>
    Boolean(business.isConsignee || String(business.id) === values.consigneeId)
  )

  const exporter = exporters.find((item) => String(item.id) === values.exporterId)
  const consignee = businesses.find((item) => String(item.id) === values.consigneeId)
  const totalLines = (values.invoices ?? []).reduce((sum, inv) => sum + (inv.items?.length ?? 0), 0)

  // Auto-switch tabs if validation fails on submit
  useEffect(() => {
    if (!formState.submitCount || !Object.keys(formState.errors).length) return
    toast.error('Please check the required fields')

    if (
      [
        'jobDate',
        'exporterId',
        'exporterBranchId',
        'consigneeId',
        'consigneeBranchId',
        'loadingPort',
        'finalDestinationPort'
      ].some((field) => field in formState.errors)
    ) {
      setActiveTab('details')
    } else if (formState.errors.invoices) {
      setActiveTab('invoices')
    } else if (
      formState.errors.containers ||
      formState.errors.packingRanges ||
      formState.errors.documents ||
      formState.errors.licenses
    ) {
      setActiveTab('documents')
    }
  }, [formState.submitCount, formState.errors])

  async function handleSave(data: ShippingBillFormValues) {
    try {
      const saved = saveBill(data, draftId)
      setDraftId(saved.id)

      // Submit payload to backend API with graceful local fallback
      try {
        await shippingBillService.upsert(data)
      } catch (apiErr) {
        console.warn('Backend API notice (saved in local store):', apiErr)
      }

      toast.success(bill ? 'Shipping bill updated' : 'Shipping bill created')
      navigate(routes.toShippingBillEdit(saved.id))
    } catch (err: any) {
      console.error('Error saving shipping bill:', err)
      toast.error('Failed to save shipping bill')
    }
  }

  function handleQuickSaved(party: Exporter | Business) {
    const branchId = party.branches[0]?.id
    if (!quickAdd || !branchId) return

    if (quickAdd.kind === 'exporter') {
      setValue('exporterId', String(party.id), { shouldValidate: true })
      setValue('exporterBranchId', String(branchId), { shouldValidate: true })
    } else if (quickAdd.role === 'consignee') {
      setValue('consigneeId', String(party.id), { shouldValidate: true })
      setValue('consigneeBranchId', String(branchId), { shouldValidate: true })
    } else if (quickAdd.role === 'itemThirdParty' && quickAdd.invoiceIndex != null && quickAdd.itemIndex != null) {
      setValue(`invoices.${quickAdd.invoiceIndex}.items.${quickAdd.itemIndex}.itemThirdPartyId`, String(party.id), {
        shouldValidate: true
      })
      setValue(
        `invoices.${quickAdd.invoiceIndex}.items.${quickAdd.itemIndex}.itemThirdPartyBranchId`,
        String(branchId),
        { shouldValidate: true }
      )
    } else if (quickAdd.invoiceIndex != null) {
      const field = quickAdd.role === 'buyer' ? 'buyer' : 'thirdParty'
      setValue(`invoices.${quickAdd.invoiceIndex}.${field}Id`, String(party.id), { shouldValidate: true })
      setValue(`invoices.${quickAdd.invoiceIndex}.${field}BranchId`, String(branchId), { shouldValidate: true })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Summary Bar */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <button
            className="mb-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-950 hover:underline"
            onClick={() => navigate(routes.dashboard)}>
            ← Back to Shipping bills
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-950">
              {bill ? `Edit shipping bill #${bill.id}` : 'New shipping bill'}
            </h1>
            {exporter && (
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Exporter: {exporter.name}
              </span>
            )}
            {consignee && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Consignee: {consignee.name}
              </span>
            )}
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {totalLines} line {totalLines === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Enter shipment basics and route, then add invoices and goods details.
          </p>
        </div>
      </div>

      {/* Workflow Step Tracker */}
      <WorkflowTracker />

      {/* Main Form */}
      <Form ctx={formCtx} handleSubmit={handleSave} className="space-y-6">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(String(val))}>
          <TabsList className="flex w-full justify-start overflow-x-auto border-b border-gray-200">
            <TabsTrigger value="details">1. Shipment Details</TabsTrigger>
            <TabsTrigger value="invoices">2. Invoices & Goods ({invoices.length})</TabsTrigger>
            <TabsTrigger value="documents">3. Containers & Others</TabsTrigger>
          </TabsList>

          {/* Tab 1: Shipment Details */}
          <PersistentTab value="details" activeTab={activeTab}>
            <ShipmentBasicsSection
              formCtx={formCtx}
              exporters={exporters}
              consigneeOptions={consigneeOptions}
              onQuickAddExporter={() => setQuickAdd({ kind: 'exporter' })}
              onQuickAddConsignee={() => setQuickAdd({ kind: 'business', role: 'consignee' })}
              onAddBranch={(kind, ownerId, branchName) => setQuickBranch({ kind, ownerId, branchName })}
            />
          </PersistentTab>

          {/* Tab 2: Invoices & Goods */}
          <PersistentTab value="invoices" activeTab={activeTab}>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">Invoices & goods</h2>
                  <p className="text-sm text-gray-500">Add commercial invoices and their corresponding line items.</p>
                </div>
                <Button variant="outline" onClick={() => addInvoice(emptyInvoice())}>
                  + Add invoice
                </Button>
              </div>

              {invoices.map((field, index) => (
                <InvoiceEditor
                  key={field.id}
                  formCtx={formCtx}
                  index={index}
                  invoice={values.invoices?.[index] ?? emptyInvoice()}
                  businesses={businesses}
                  onQuickAdd={(role, invoiceIndex, itemIndex) =>
                    setQuickAdd({ kind: 'business', role, invoiceIndex, itemIndex })
                  }
                  onAddBranch={(ownerId, branchName) => setQuickBranch({ kind: 'business', ownerId, branchName })}
                  onRemove={() => removeInvoice(index)}
                  canRemove={invoices.length > 1}
                />
              ))}
            </div>
          </PersistentTab>

          {/* Tab 3: Containers, Packing, Docs, Licences */}
          <PersistentTab value="documents" activeTab={activeTab}>
            <ContainersAndPacking formCtx={formCtx} />
          </PersistentTab>
        </Tabs>

        {/* Footer Navigation & Submit Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5">
          <Button variant="outline" type="button" onClick={() => navigate(routes.dashboard)}>
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            {activeTab !== 'details' && (
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  const current = formCtx.hooks.getValues()
                  const saved = saveBill(current, draftId)
                  setDraftId(saved.id)
                  setActiveTab(activeTab === 'documents' ? 'invoices' : 'details')
                }}>
                ← Previous
              </Button>
            )}

            {activeTab !== 'documents' ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  const current = formCtx.hooks.getValues()
                  const saved = saveBill(current, draftId)
                  setDraftId(saved.id)
                  toast.success('Step saved')
                  setActiveTab(activeTab === 'details' ? 'invoices' : 'documents')
                }}>
                Save & Next →
              </Button>
            ) : (
              <Button type="submit">Save shipping bill</Button>
            )}
          </div>
        </div>
      </Form>

      {/* Quick Add Party Dialog */}
      {quickAdd && (
        <PartyDialog
          key={`${quickAdd.kind}-${quickAdd.role ?? 'exporter'}-${quickAdd.invoiceIndex ?? 0}`}
          kind={quickAdd.kind}
          initialRole={quickAdd.role === 'itemThirdParty' ? 'thirdParty' : quickAdd.role}
          onClose={() => setQuickAdd(null)}
          onSaved={handleQuickSaved}
        />
      )}

      {/* Quick Add Branch Dialog */}
      {quickBranch && (
        <BranchDialog
          key={`${quickBranch.kind}-${quickBranch.ownerId}`}
          kind={quickBranch.kind}
          ownerId={quickBranch.ownerId}
          onClose={() => setQuickBranch(null)}
          onSaved={(branch: Branch) => setValue(quickBranch.branchName, String(branch.id), { shouldValidate: true })}
        />
      )}
    </div>
  )
}
