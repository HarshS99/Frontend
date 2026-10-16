import { nfeiCategoryOptions } from '@/data/form-options'
import { stateOptions } from '@/data/states'
import { cargoOptions, sealTypes, weightUnits } from '@/data/types'
import { Business, Exporter, portCountry, ports, ShippingBillFormValues } from '@/shipping-bills/model'
import { partyMockService } from '@/shipping-bills/party-mock-service'
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { Input } from 'ui/inputs/input'
import { Select } from 'ui/inputs/select'
import { AsyncPartySelect } from './async-party-select'
import { Advanced, dateType, SectionHeading } from './form-ui-helpers'
import { BranchPath, PartyFields } from './party-fields'

const portOptions = ports.map((port) => ({ value: port.code, label: `${port.name} · ${port.code}` }))

interface ShipmentBasicsSectionProps {
  formCtx: any
  exporters: Exporter[]
  consigneeOptions: Business[]
  onQuickAddExporter: () => void
  onQuickAddConsignee: () => void
  onAddBranch: (kind: 'exporter' | 'business', ownerId: number, branchName: BranchPath) => void
}

export function ShipmentBasicsSection({
  formCtx,
  exporters,
  consigneeOptions,
  onQuickAddExporter,
  onQuickAddConsignee,
  onAddBranch
}: ShipmentBasicsSectionProps) {
  const { register, setValue, watch } = formCtx.hooks
  const values = watch()

  const [marksOptions, setMarksOptions] = useState<{ value: string; label: string }[]>([])
  const [marksLoading, setMarksLoading] = useState(false)
  const previousExporterRef = useRef(values.exporterId)

  useEffect(() => {
    const exporterId = values.exporterId
    if (previousExporterRef.current !== exporterId) {
      previousExporterRef.current = exporterId
      setValue('marksAndNumbers', '', { shouldValidate: true })
    }

    let active = true
    setMarksOptions([])
    setMarksLoading(Boolean(exporterId))

    if (exporterId) {
      partyMockService
        .getMarksAndNumbers(exporterId)
        .then((options) => {
          if (active) {
            setMarksOptions(options)
            setMarksLoading(false)
          }
        })
        .catch(() => {
          if (active) {
            setMarksOptions([])
            setMarksLoading(false)
          }
        })
    }

    return () => {
      active = false
    }
  }, [setValue, values.exporterId])

  return (
    <Card className="border border-gray-200 shadow-xs">
      <CardHeader title="Shipment basics" description="Parties and route are the core details for this bill." />
      <CardContent className="space-y-6">
        <PartyFields
          formCtx={formCtx}
          ownerName="exporterId"
          branchName="exporterBranchId"
          label="Exporter"
          kind="exporter"
          parties={exporters.filter((item) => Boolean(!item.disabled || String(item.id) === values.exporterId))}
          onQuickAdd={onQuickAddExporter}
          onAddBranch={(ownerId) => onAddBranch('exporter', ownerId, 'exporterBranchId')}
        />
        <PartyFields
          formCtx={formCtx}
          ownerName="consigneeId"
          branchName="consigneeBranchId"
          label="Consignee"
          kind="business"
          parties={consigneeOptions}
          onQuickAdd={onQuickAddConsignee}
          onAddBranch={(ownerId) => onAddBranch('business', ownerId, 'consigneeBranchId')}
        />

        <div className="border-t border-gray-200 pt-5">
          <SectionHeading title="Route" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1 block text-sm font-medium text-gray-700">Port of loading</span>
              <AsyncPartySelect
                name="loadingPort"
                placeholder="Select Indian port"
                rules={{ required: true }}
                fetchOptions={async (query) => {
                  const res = await partyMockService.searchLoadingPorts(query)
                  return res.map((port) => ({
                    value: port.code,
                    label: `${port.name} · ${port.code}`,
                    sublabel: `Country: ${port.countryCode}`
                  }))
                }}
                getInitialLabel={async (code) => {
                  const port = await partyMockService.getPortByCode(code)
                  return port ? `${port.name} · ${port.code}` : code
                }}
              />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-gray-700">Final destination port</span>
              <AsyncPartySelect
                name="finalDestinationPort"
                placeholder="Select destination"
                rules={{ required: true }}
                fetchOptions={async (query) => {
                  const res = await partyMockService.searchDestinationPorts(query)
                  return res.map((port) => ({
                    value: port.code,
                    label: `${port.name} · ${port.code}`,
                    sublabel: `Country: ${port.countryCode}`
                  }))
                }}
                getInitialLabel={async (code) => {
                  const port = await partyMockService.getPortByCode(code)
                  return port ? `${port.name} · ${port.code}` : code
                }}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Countries are derived from the port codes: {portCountry(values.loadingPort) ?? '—'} →{' '}
            {portCountry(values.finalDestinationPort) ?? '—'}.
          </p>
        </div>

        <Advanced title="Regulatory and route exceptions">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Select<ShippingBillFormValues>
              label="Discharge port"
              name="dischargePort"
              options={portOptions}
              placeholder="Defaults to destination"
            />
            <Select<ShippingBillFormValues>
              label="Origin state"
              name="originStateCode"
              options={stateOptions}
              placeholder="Defaults to Branch State Code"
            />
            <div></div>
            <Select<ShippingBillFormValues>
              label="NFEI category"
              name="nfeiCategory"
              options={nfeiCategoryOptions}
              placeholder="Not applicable"
            />
            <Input label="RBI waiver number" {...register('rbiWaiverNumber')} />
            <Input label="RBI waiver date" type={dateType} {...register('rbiWaiverDate')} />
          </div>
        </Advanced>

        <div className="border-t border-gray-200 pt-5">
          <SectionHeading title="Package Details" />
          <div className="grid gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select<ShippingBillFormValues> label="Nature of cargo" name="natureOfCargo" options={cargoOptions} />
            <Input label="Gross weight" type="number" {...register('grossWeight')} />
            <Input label="Net weight" type="number" {...register('netWeight')} />
            <Select<ShippingBillFormValues> label="Weight unit" name="measurementUnit" options={weightUnits} />
            <Input label="Total packages" type="number" {...register('totalPackages')} />
            <Select<ShippingBillFormValues>
              label="Marks and numbers"
              name="marksAndNumbers"
              options={marksOptions}
              placeholder={
                !values.exporterId
                  ? 'Select exporter first'
                  : marksLoading
                    ? 'Loading marks and numbers...'
                    : 'Select marks and numbers'
              }
              disabled={Boolean(!values.exporterId || marksLoading || !marksOptions.length)}
              wrapClass="sm:col-span-3"
            />
          </div>
          <Advanced title="Additional Shipment Details">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Select<ShippingBillFormValues>
                label="Seal type"
                name="sealType"
                options={sealTypes}
                placeholder="Select if relevant"
              />
              {(!values.containers || values.containers.length === 0) && (
                <Input label="Number of containers" type="number" {...register('numberOfContainers')} />
              )}
              <Input label="Loose packets" type="number" {...register('loosePackets')} />
              <Input label="MAWB number" {...register('mawbNumber')} />
              <Input label="HAWB number" {...register('hawbNumber')} />
            </div>
          </Advanced>
        </div>
      </CardContent>
    </Card>
  )
}
