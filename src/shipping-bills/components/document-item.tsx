import { documentCodes } from '@/data/e-sanchit-codes'
import { useState } from 'react'
import { Button } from 'ui/basic/button'
import { Input } from 'ui/inputs/input'
import { AsyncPartySelect } from './async-party-select'
import { Advanced, dateType } from './form-ui-helpers'

interface DocumentItemProps {
  formCtx: any
  index: number
  onRemove: () => void
}

const FILE_TYPES = [{ value: 'pdf', label: 'PDF' }]

export function DocumentItem({ formCtx, index, onRemove }: DocumentItemProps) {
  const { register, watch } = formCtx.hooks

  const documentValues = watch(`documents.${index}`)

  const fields = [
    'placeOfIssue',
    'invoiceSerialNumber',
    'itemSerialNumber',
    'issuingPartyCode',
    'issuingPartyName',
    'issuingPartyAddress1',
    'issuingPartyAddress2',
    'issuingPartyCity',
    'issuingPartyPin',
    'beneficiaryPartyCode',
    'beneficiaryPartyName',
    'beneficiaryPartyAddress1',
    'beneficiaryPartyAddress2',
    'beneficiaryPartyCity',
    'beneficiaryPartyPin',
    'fileType',
    'icegateId'
  ]

  const hasCustomValues = fields.some((f) => Boolean(documentValues?.[f]))
  const [showCustomDetails, setShowCustomDetails] = useState(hasCustomValues)

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-2xs">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Document {index + 1}</h3>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onRemove}>
          Remove
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <span className="mb-1 block text-sm font-medium text-gray-700">Document type code</span>
          <AsyncPartySelect
            name={`documents.${index}.documentTypeCode`}
            placeholder="Search document type..."
            fetchOptions={(query) => {
              const q = query.toLowerCase().trim()
              const filtered = documentCodes.filter(
                (doc) => doc.label.toLowerCase().includes(q) || doc.value.toLowerCase().includes(q)
              )
              return Promise.resolve(
                filtered.map((doc) => ({
                  value: doc.value,
                  label: doc.label
                }))
              )
            }}
            getInitialLabel={(val) => {
              const found = documentCodes.find((doc) => doc.value === val || doc.label === val)
              return Promise.resolve(found ? found.label : val)
            }}
          />
        </div>
        <Input label="Image reference number" {...register(`documents.${index}.imageReferenceNumber`)} />
        <Input label="Issue date" type={dateType} {...register(`documents.${index}.documentIssueDate`)} />
      </div>
      <Advanced
        title="Issuing party and ICEGATE details"
        open={showCustomDetails}
        onToggle={(isOpen) => setShowCustomDetails(isOpen)}>
        <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Reference number" {...register(`documents.${index}.documentReferenceNumber`)} />
          <Input label="Expiry date" type={dateType} {...register(`documents.${index}.documentExpiryDate`)} />
          <Input label="Invoice serial number" type="number" {...register(`documents.${index}.invoiceSerialNumber`)} />
          <Input label="Item serial number" type="number" {...register(`documents.${index}.itemSerialNumber`)} />
          <div>
            <span className="mb-1 block text-sm font-medium text-gray-700">File type</span>
            <AsyncPartySelect
              name={`documents.${index}.fileType`}
              placeholder="Search file type..."
              className="bg-transparent"
              fetchOptions={(query) => {
                const q = query.toLowerCase().trim()
                return Promise.resolve(
                  FILE_TYPES.filter((doc) => doc.label.toLowerCase().includes(q) || doc.value.toLowerCase().includes(q))
                )
              }}
              getInitialLabel={(val) => {
                const found = FILE_TYPES.find((doc) => doc.value === val || doc.label === val)
                return Promise.resolve(found ? found.label : val)
              }}
            />
          </div>
          <Input label="Place of issue" {...register(`documents.${index}.placeOfIssue`)} />
        </div>

        <div className="flex flex-col gap-4">
          <Advanced title="Issuing & Beneficiary details">
            <div className="flex flex-col gap-6 pt-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Issuing Details</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Input label="Issuing party code" {...register(`documents.${index}.issuingPartyCode`)} />
                  <Input label="Issuing party name" {...register(`documents.${index}.issuingPartyName`)} />
                  <Input label="Issuing address line 1" {...register(`documents.${index}.issuingPartyAddress1`)} />
                  <Input label="Issuing address line 2" {...register(`documents.${index}.issuingPartyAddress2`)} />
                  <Input label="Issuing city" {...register(`documents.${index}.issuingPartyCity`)} />
                  <Input label="Issuing postal code" {...register(`documents.${index}.issuingPartyPin`)} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Beneficiary Details</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Input label="Beneficiary code" {...register(`documents.${index}.beneficiaryPartyCode`)} />
                  <Input label="Beneficiary name" {...register(`documents.${index}.beneficiaryPartyName`)} />
                  <Input
                    label="Beneficiary address line 1"
                    {...register(`documents.${index}.beneficiaryPartyAddress1`)}
                  />
                  <Input
                    label="Beneficiary address line 2"
                    {...register(`documents.${index}.beneficiaryPartyAddress2`)}
                  />
                  <Input label="Beneficiary city" {...register(`documents.${index}.beneficiaryPartyCity`)} />
                  <Input label="Beneficiary postal code" {...register(`documents.${index}.beneficiaryPartyPin`)} />
                </div>
              </div>
            </div>
          </Advanced>
        </div>
      </Advanced>
    </div>
  )
}
