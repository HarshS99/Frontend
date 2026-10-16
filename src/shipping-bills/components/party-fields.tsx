/**
 * PartyFields — a paired (party + branch) selector for any party role in the form.
 *
 * Handles:
 *  - Exporter / consignee / buyer / third-party selection via async search
 *  - Branch auto-clearing when the parent party changes
 *  - "Add new" and "Add branch" quick-action links
 *
 * The component is deliberately generic over party role; the caller decides which
 * mock-service methods to call, keeping this file free of role-specific branching.
 */

import { getDemoData } from '@/shipping-bills/demo-store'
import { Branch, Business, Exporter } from '@/shipping-bills/model'
import { partyMockService } from '@/shipping-bills/party-mock-service'
import { useEffect } from 'react'
import type { RegisterOptions } from 'ui/form'
import { AsyncPartySelect } from './async-party-select'

export type BranchPath =
  | 'exporterBranchId'
  | 'consigneeBranchId'
  | `invoices.${number}.buyerBranchId`
  | `invoices.${number}.thirdPartyBranchId`
  | `invoices.${number}.items.${number}.itemThirdPartyBranchId`

// Minimal form-context shape — enough for PartyFields without importing the full BillFormContext type
interface FormCtx {
  hooks: {
    watch: (name: string) => string
    getValues: (name: string) => string
    setValue: (name: string, value: string, opts?: object) => void
  }
}

interface PartyFieldsProps {
  formCtx: FormCtx
  ownerName:
    | 'exporterId'
    | 'consigneeId'
    | `invoices.${number}.buyerId`
    | `invoices.${number}.thirdPartyId`
    | `invoices.${number}.items.${number}.itemThirdPartyId`
  branchName: BranchPath
  label: string
  kind: 'exporter' | 'business'
  parties: (Exporter | Business)[]
  required?: boolean
  onAddBranch: (ownerId: number) => void
  onQuickAdd: () => void
}

export function PartyFields({
  formCtx,
  ownerName,
  branchName,
  label,
  kind,
  parties,
  required = true,
  onAddBranch,
  onQuickAdd
}: PartyFieldsProps) {
  const ownerId = formCtx.hooks.watch(ownerName)
  const { exporters, businesses } = getDemoData()

  // Resolve current owner so we can show/enable the branch selector
  const owner =
    kind === 'exporter'
      ? (exporters.find((p) => String(p.id) === ownerId) ?? parties.find((p) => String(p.id) === ownerId))
      : (businesses.find((p) => String(p.id) === ownerId) ?? parties.find((p) => String(p.id) === ownerId))

  // When the owner changes, clear a branch that no longer belongs to the new owner
  useEffect(() => {
    const selectedBranch = formCtx.hooks.getValues(branchName)
    if (
      selectedBranch &&
      owner &&
      owner.branches.length > 0 &&
      !owner.branches.some((branch: Branch) => String(branch.id) === selectedBranch)
    ) {
      formCtx.hooks.setValue(branchName, '', { shouldValidate: true })
    }
  }, [branchName, formCtx.hooks, owner])

  async function fetchOwnerOptions(query: string) {
    if (kind === 'exporter') {
      const res = await partyMockService.searchExporters(query)
      return res.map((item) => ({
        value: String(item.id),
        label: item.name,
        sublabel: item.iec ? `IEC: ${item.iec}` : undefined
      }))
    } else {
      const res = await partyMockService.searchConsignees(query)
      return res.map((item) => ({ value: String(item.id), label: item.name }))
    }
  }

  async function getOwnerLabel(id: string) {
    if (kind === 'exporter') {
      const item = await partyMockService.getExporterById(id)
      return item ? item.name : ''
    } else {
      const item = await partyMockService.getConsigneeById(id)
      return item ? item.name : ''
    }
  }

  async function fetchBranchOptions(query: string) {
    if (!ownerId) return []
    if (kind === 'exporter') {
      const res = await partyMockService.searchExporterBranches(ownerId, query)
      return res.map((b) => ({ value: String(b.id), label: `${b.branchName} · ${b.city}`, sublabel: b.address1 }))
    } else {
      const res = await partyMockService.searchConsigneeBranches(ownerId, query)
      return res.map((b) => ({ value: String(b.id), label: `${b.branchName} · ${b.city}`, sublabel: b.address1 }))
    }
  }

  async function getBranchLabel(id: string) {
    const branch = owner?.branches.find((b: Branch) => String(b.id) === id)
    return branch ? `${branch.branchName} · ${branch.city}` : ''
  }

  const branchRules: RegisterOptions = { required: required ?? !!ownerId }

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{label}</span>
          <button type="button" className="text-primary-700 text-xs font-medium hover:underline" onClick={onQuickAdd}>
            + Add new
          </button>
        </div>
        <AsyncPartySelect
          name={ownerName}
          placeholder={`Search & select ${kind}...`}
          rules={{ required }}
          fetchOptions={fetchOwnerOptions}
          getInitialLabel={getOwnerLabel}
        />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Branch / address</span>
          {owner && (
            <button
              type="button"
              className="text-primary-700 text-xs font-medium hover:underline"
              onClick={() => onAddBranch(owner.id)}>
              + Add branch
            </button>
          )}
        </div>
        <AsyncPartySelect
          name={branchName}
          placeholder={owner ? 'Search & select branch...' : `Choose ${kind} first`}
          disabled={!owner}
          rules={branchRules}
          deps={[ownerId]}
          fetchOptions={fetchBranchOptions}
          getInitialLabel={getBranchLabel}
        />
      </div>
    </div>
  )
}
