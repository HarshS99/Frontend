import { currencyOptions } from '@/data/form-options'
import { contractTypes, paymentTypes, priceInclusionTypes } from '@/data/types'
import { BillInvoiceForm, Business, emptyItem, invoiceTotal, ShippingBillFormValues } from '@/shipping-bills/model'
import { useFieldArray } from 'core/form'
import { Button } from 'ui/basic/button'
import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { Checkbox } from 'ui/inputs/checkbox'
import { Input } from 'ui/inputs/input'
import { Select } from 'ui/inputs/select'
import { DeductionRow } from './deduction-row'
import { dateType, SectionHeading } from './form-ui-helpers'
import { InvoiceItemEditor } from './invoice-item-editor'
import { BranchPath, PartyFields } from './party-fields'

interface InvoiceEditorProps {
  formCtx: any
  index: number
  invoice: BillInvoiceForm
  businesses: Business[]
  onQuickAdd: (role: 'buyer' | 'thirdParty' | 'itemThirdParty', invoiceIndex: number, itemIndex?: number) => void
  onAddBranch: (ownerId: number, branchName: BranchPath) => void
  onRemove: () => void
  canRemove: boolean
}

export function InvoiceEditor({
  formCtx,
  index,
  invoice,
  businesses,
  onQuickAdd,
  onAddBranch,
  onRemove,
  canRemove
}: InvoiceEditorProps) {
  const { register, control, watch } = formCtx.hooks
  const invoiceValues = watch(`invoices.${index}`) ?? invoice
  const {
    fields: items,
    append: addItem,
    remove: removeItem
  } = useFieldArray({ control, name: `invoices.${index}.items` })

  const buyerSame = watch(`invoices.${index}.buyerSameAsConsignee`)
  const buyerOptions = businesses.filter((b) => Boolean(b.isBuyer || b.id === Number(invoice.buyerId)))
  const thirdPartyOptions = businesses.filter((b) => Boolean(b.isThirdParty || b.id === Number(invoice.thirdPartyId)))

  return (
    <Card className="mb-4 overflow-hidden border border-gray-200 shadow-xs">
      <CardHeader className="flex-row items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/50 py-3">
        <div>
          <h3 className="font-semibold text-gray-950">Invoice {index + 1}</h3>
        </div>
        {canRemove && (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onRemove}>
            Remove invoice
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Invoice number" {...register(`invoices.${index}.invoiceNumber`)} />
          <Input label="Invoice date" type={dateType} {...register(`invoices.${index}.invoiceDate`)} />
          <div className="flex gap-2">
            <div className="w-[100px] shrink-0">
              <Select<ShippingBillFormValues>
                label="Currency"
                name={`invoices.${index}.currency` as any}
                options={currencyOptions}
                rules={{ required: true }}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Total"
                type="number"
                min={0}
                {...register(`invoices.${index}.invoiceTotal`)}
                placeholder="0.00"
              />
            </div>
          </div>
          <Select<ShippingBillFormValues>
            label="Contract"
            name={`invoices.${index}.contractType` as any}
            options={contractTypes}
            rules={{ required: true }}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-800">
          <Checkbox {...register(`invoices.${index}.buyerSameAsConsignee`)} />
          Buyer & consignee are same
        </label>

        {!buyerSame && (
          <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
            <PartyFields
              formCtx={formCtx}
              ownerName={`invoices.${index}.buyerId`}
              branchName={`invoices.${index}.buyerBranchId`}
              label="Buyer"
              kind="business"
              parties={buyerOptions}
              onQuickAdd={() => onQuickAdd('buyer', index)}
              onAddBranch={(ownerId) => onAddBranch(ownerId, `invoices.${index}.buyerBranchId`)}
            />
          </div>
        )}

        {/* Deductions and charges section using reusable DeductionRow */}
        <div className="space-y-4">
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            <div className="grid grid-cols-1 divide-y divide-gray-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              <DeductionRow
                label="Freight"
                rateField={`invoices.${index}.freightRate`}
                amountField={`invoices.${index}.freightAmount`}
                currencyField={`invoices.${index}.freightCurrency`}
                rateValue={invoiceValues.freightRate}
                amountValue={invoiceValues.freightAmount}
                defaultCurrencyPlaceholder={invoice.currency ?? 'USD'}
                register={register}
              />
              <DeductionRow
                label="Insurance"
                rateField={`invoices.${index}.insuranceRate`}
                amountField={`invoices.${index}.insuranceAmount`}
                currencyField={`invoices.${index}.insuranceCurrency`}
                rateValue={invoiceValues.insuranceRate}
                amountValue={invoiceValues.insuranceAmount}
                defaultCurrencyPlaceholder={invoice.currency ?? 'USD'}
                register={register}
              />
            </div>
            <div className="grid grid-cols-1 divide-y divide-gray-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              <DeductionRow
                label="Commission"
                rateField={`invoices.${index}.commissionRate`}
                amountField={`invoices.${index}.commissionAmount`}
                currencyField={`invoices.${index}.commissionCurrency`}
                rateValue={invoiceValues.commissionRate}
                amountValue={invoiceValues.commissionAmount}
                defaultCurrencyPlaceholder={invoice.currency ?? 'USD'}
                register={register}
              />
              <DeductionRow
                label="Discount"
                rateField={`invoices.${index}.discountRate`}
                amountField={`invoices.${index}.discountAmount`}
                currencyField={`invoices.${index}.discountCurrency`}
                rateValue={invoiceValues.discountRate}
                amountValue={invoiceValues.discountAmount}
                defaultCurrencyPlaceholder={invoice.currency ?? 'USD'}
                register={register}
              />
            </div>
            <div className="grid grid-cols-1 divide-y divide-gray-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              <DeductionRow
                label="Other Deductions"
                rateField={`invoices.${index}.otherDeductionsRate`}
                amountField={`invoices.${index}.otherDeductionsAmount`}
                currencyField={`invoices.${index}.otherDeductionsCurrency`}
                rateValue={invoiceValues.otherDeductionsRate}
                amountValue={invoiceValues.otherDeductionsAmount}
                defaultCurrencyPlaceholder={invoice.currency ?? 'USD'}
                register={register}
              />
              <div className="p-2">
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                  <span className="w-28 shrink-0 font-medium text-gray-900">Packing Charges</span>
                  <Input
                    type="number"
                    {...register(`invoices.${index}.packingCharges`)}
                    className="py-1 text-right"
                    placeholder="Amount"
                  />
                  <span className="w-14 text-sm text-gray-400">—</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select<ShippingBillFormValues>
              label="Price includes"
              name={`invoices.${index}.freightInsuranceIncluded` as any}
              options={priceInclusionTypes}
              placeholder="Select if applicable"
            />
            <Input label="Contract / order number" {...register(`invoices.${index}.contractNumber`)} />
            <Select<ShippingBillFormValues>
              label="Payment type"
              name={`invoices.${index}.natureOfPayment` as any}
              options={paymentTypes}
              placeholder="Select if applicable"
            />
            <Input label="Payment period (days)" type="number" {...register(`invoices.${index}.periodOfPayment`)} />
          </div>

          <PartyFields
            formCtx={formCtx}
            ownerName={`invoices.${index}.thirdPartyId`}
            branchName={`invoices.${index}.thirdPartyBranchId`}
            label="Third party (optional)"
            kind="business"
            parties={thirdPartyOptions}
            required={false}
            onQuickAdd={() => onQuickAdd('thirdParty', index)}
            onAddBranch={(ownerId) => onAddBranch(ownerId, `invoices.${index}.thirdPartyBranchId`)}
          />
        </div>

        {/* Goods items */}
        <div className="border-t border-gray-200 pt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <SectionHeading
              title="Goods items"
              description="Specify commodities, quantities, HS codes and incentives."
            />
            <Button size="sm" variant="outline" onClick={() => addItem(emptyItem())}>
              + Add item
            </Button>
          </div>
          <div className="space-y-4">
            {items.map((field, itemIndex) => {
              const currentItem = invoiceValues.items?.[itemIndex] ?? emptyItem()
              return (
                <InvoiceItemEditor
                  key={field.id}
                  formCtx={formCtx}
                  invoiceIndex={index}
                  itemIndex={itemIndex}
                  item={currentItem}
                  currency={invoice.currency ?? 'USD'}
                  canRemove={items.length > 1}
                  onRemove={() => removeItem(itemIndex)}
                  businesses={businesses}
                  onQuickAdd={onQuickAdd}
                  onAddBranch={onAddBranch}
                />
              )
            })}
          </div>
        </div>

        <div className="flex justify-end rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm font-semibold text-gray-900">
          Invoice total: {invoice.currency ?? 'USD'}{' '}
          {invoiceTotal(invoiceValues).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>
      </CardContent>
    </Card>
  )
}
