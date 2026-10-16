import { accessoryStatusOptions, igstPaymentOptions } from '@/data/form-options'
import { quantityCodes } from '@/data/quantity-code'
import schemeCodes from '@/data/scheme-codes'
import { Trades } from '@/data/trade-agrements'
import { BillItemForm, Business, lineTotal, ShippingBillFormValues } from '@/shipping-bills/model'
import { Button } from 'ui/basic/button'
import { Checkbox } from 'ui/inputs/checkbox'
import { Input } from 'ui/inputs/input'
import { Select } from 'ui/inputs/select'
import { Advanced, dateType } from './form-ui-helpers'
import { BranchPath, PartyFields } from './party-fields'

interface InvoiceItemEditorProps {
  formCtx: any
  invoiceIndex: number
  itemIndex: number
  item: BillItemForm
  currency: string
  canRemove: boolean
  onRemove: () => void
  businesses: Business[]
  onQuickAdd: (role: 'itemThirdParty', invoiceIndex: number, itemIndex: number) => void
  onAddBranch: (ownerId: number, branchName: BranchPath) => void
}

export function InvoiceItemEditor({
  formCtx,
  invoiceIndex,
  itemIndex,
  item,
  currency,
  canRemove,
  onRemove,
  businesses,
  onQuickAdd,
  onAddBranch
}: InvoiceItemEditorProps) {
  const { register } = formCtx.hooks

  const selectedScheme = schemeCodes.find((s) => s.value === item.schemeCode)
  const showDrawback = Boolean(
    selectedScheme && (selectedScheme.drawback || selectedScheme.RODTEP || selectedScheme.ROSCTL)
  )

  const thirdPartyOptions = businesses.filter((b) => Boolean(b.isThirdParty || b.id === Number(item.itemThirdPartyId)))

  const computedTotal = lineTotal(item)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-2xs">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Item {itemIndex + 1}</h4>
        {canRemove && (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onRemove}>
            Remove item
          </Button>
        )}
      </div>

      <div className="mb-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Input
          label="RITC / HS code"
          {...register(`invoices.${invoiceIndex}.items.${itemIndex}.ritcCode`)}
          placeholder="e.g. 61091000"
        />
        <Select<ShippingBillFormValues>
          label="Scheme code"
          name={`invoices.${invoiceIndex}.items.${itemIndex}.schemeCode` as any}
          options={schemeCodes}
          placeholder="Select scheme"
        />
        <Input
          label="Goods description"
          {...register(`invoices.${invoiceIndex}.items.${itemIndex}.goodsDescription1`)}
          wrapClass="lg:col-span-4"
          placeholder="e.g. Cotton T-shirts"
        />
        <Input label="Quantity" type="number" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.quantity`)} />
        <Select<ShippingBillFormValues>
          label="Unit"
          name={`invoices.${invoiceIndex}.items.${itemIndex}.unitOfMeasurement` as any}
          options={quantityCodes}
          rules={{ required: true }}
        />
        <Input
          label={`Unit price (${currency ?? 'USD'})`}
          type="number"
          {...register(`invoices.${invoiceIndex}.items.${itemIndex}.unitPrice`)}
        />
        <Input
          label="Item total"
          type="number"
          placeholder={`${currency ?? 'USD'} ${computedTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          {...register(`invoices.${invoiceIndex}.items.${itemIndex}.lineTotal`)}
        />
        <Select<ShippingBillFormValues>
          label="IGST payment"
          name={`invoices.${invoiceIndex}.items.${itemIndex}.igstPaymentStatus` as any}
          options={igstPaymentOptions}
          placeholder="Select if applicable"
        />
      </div>

      {/* Conditional drawback inputs + flags */}
      <div className="mb-3 flex flex-wrap items-end gap-4">
        {showDrawback && (
          <>
            <div className="w-36">
              <Input
                label="Drawback Serial no."
                {...register(`invoices.${invoiceIndex}.items.${itemIndex}.drawbackSerialNumber`)}
              />
            </div>
            <div className="w-32">
              <Input label="Drawback unit" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.drawbackUnit`)} />
            </div>
            <div className="w-36">
              <Input
                label="Drawback quantity"
                type="number"
                {...register(`invoices.${invoiceIndex}.items.${itemIndex}.drawbackQuantity`)}
              />
            </div>
          </>
        )}
        <label className="flex cursor-pointer items-center gap-2 pb-1 text-sm font-medium text-gray-700">
          <Checkbox {...register(`invoices.${invoiceIndex}.items.${itemIndex}.rewardItem`)} />
          Claim reward
        </label>
        <label className="flex cursor-pointer items-center gap-2 pb-1 text-sm font-medium text-gray-700">
          <Checkbox {...register(`invoices.${invoiceIndex}.items.${itemIndex}.thirdPartyItem`)} />
          Third-party item
        </label>
      </div>

      {item.thirdPartyItem && (
        <div className="my-4 rounded-md border border-gray-100 bg-gray-50/50 p-3">
          <PartyFields
            formCtx={formCtx}
            ownerName={`invoices.${invoiceIndex}.items.${itemIndex}.itemThirdPartyId`}
            branchName={`invoices.${invoiceIndex}.items.${itemIndex}.itemThirdPartyBranchId`}
            label="Item third party"
            kind="business"
            parties={thirdPartyOptions}
            onQuickAdd={() => onQuickAdd('itemThirdParty', invoiceIndex, itemIndex)}
            onAddBranch={(ownerId) =>
              onAddBranch(ownerId, `invoices.${invoiceIndex}.items.${itemIndex}.itemThirdPartyBranchId`)
            }
          />
        </div>
      )}

      <Advanced title="Item customs, taxes and incentives">
        <div className="mb-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select<ShippingBillFormValues>
            label="Unit of rate"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.unitOfRate`)}
            options={quantityCodes}
            placeholder={item.unitOfMeasurement ?? 'PCS'}
          />
          <Input
            label="Per unit (Rate)"
            type="number"
            placeholder="1"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.numberOfUnits`)}
          />
          <Input
            label="Present market value"
            type="number"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.presentMarketValue`)}
          />
          <Input label="Cess" type="number" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.cess`)} />
          <Input
            label="Accessories description"
            wrapClass="lg:col-span-3"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.accessoriesDescription`)}
          />
          <Select<ShippingBillFormValues>
            label="Accessory status"
            name={`invoices.${invoiceIndex}.items.${itemIndex}.accessoryStatus` as any}
            options={accessoryStatusOptions}
            placeholder="Select if relevant"
          />
          {item.igstPaymentStatus === 'P' && (
            <>
              <Input
                label="Taxable value"
                type="number"
                {...register(`invoices.${invoiceIndex}.items.${itemIndex}.taxableValue`)}
              />
              <Input
                label="IGST amount"
                type="number"
                {...register(`invoices.${invoiceIndex}.items.${itemIndex}.igstAmount`)}
              />
            </>
          )}

          <Input
            label="Origin district code"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.originDistrictCode`)}
          />
          <Select<ShippingBillFormValues>
            label="Trade agreement code"
            name={`invoices.${invoiceIndex}.items.${itemIndex}.tradeAgreementsCode` as any}
            options={Trades}
            placeholder="NCPTI"
          />
          <Input label="End use code" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.endUseOfItem`)} />
          <Input
            label="Packages for item"
            type="number"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.totalPackage`)}
          />
        </div>
        <Advanced title="AR4 / excise details">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="AR4 number" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.ar4Number`)} />
            <Input
              label="AR4 date"
              type={dateType}
              {...register(`invoices.${invoiceIndex}.items.${itemIndex}.ar4Date`)}
            />
            <Input
              label="Commissionerate"
              {...register(`invoices.${invoiceIndex}.items.${itemIndex}.ar4Commissionerate`)}
            />
            <Input label="Division" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.ar4Division`)} />
            <Input label="Range" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.ar4Range`)} />
            <Input label="Remarks" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.ar4Remarks`)} />
          </div>
        </Advanced>
      </Advanced>
    </div>
  )
}
