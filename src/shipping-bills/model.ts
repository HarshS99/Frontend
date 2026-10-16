export interface Branch {
  id: number
  branchName: string
  address1: string
  address2?: string
  city: string
  state?: string
  pincode?: string
  countryCode: string
  email?: string
  mobile?: string
  gstnId?: string
  adCode?: string
  accountNo?: string
  ifscCode?: string
}

export interface Exporter {
  id: number
  name: string
  iec: string
  class: string
  type: string
  pan?: string
  tan?: string
  aeoNumber?: string
  website?: string
  notes?: string
  disabled?: boolean
  branches: Branch[]
}

export interface Business {
  id: number
  name: string
  iec?: string
  isConsignee: boolean
  isBuyer: boolean
  isNotify: boolean
  isThirdParty: boolean
  branches: Branch[]
}

export interface PortOption {
  code: string
  name: string
  countryCode: string
}

export const loadingPorts: PortOption[] = [
  { code: 'INNSA1', name: 'Nhava Sheva', countryCode: 'IN' },
  { code: 'INMUN1', name: 'Mundra', countryCode: 'IN' },
  { code: 'INMAA1', name: 'Chennai', countryCode: 'IN' },
  { code: 'INBOM4', name: 'Mumbai Air Cargo', countryCode: 'IN' }
]

export const ports: PortOption[] = [
  // { code: 'INNSA1', name: 'Nhava Sheva', countryCode: 'IN' },
  // { code: 'INMUN1', name: 'Mundra', countryCode: 'IN' },
  // { code: 'INMAA1', name: 'Chennai', countryCode: 'IN' },
  // { code: 'INBOM4', name: 'Mumbai Air Cargo', countryCode: 'IN' },
  { code: 'USMSY', name: 'New Orleans', countryCode: 'US' },
  { code: 'USLAX', name: 'Los Angeles', countryCode: 'US' },
  { code: 'DEHAM', name: 'Hamburg', countryCode: 'DE' },
  { code: 'AEJEA', name: 'Jebel Ali', countryCode: 'AE' },
  { code: 'SGSIN', name: 'Singapore', countryCode: 'SG' }
]

export const countries = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'DE', label: 'Germany' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SG', label: 'Singapore' },
  { value: 'GB', label: 'United Kingdom' }
]

export interface BillItemForm {
  ritcCode: string
  goodsDescription1: string
  goodsDescription2?: string
  goodsDescription3?: string
  accessoriesDescription?: string
  quantity: string
  unitOfMeasurement: string
  unitPrice: string
  schemeCode?: string
  unitOfRate?: string
  presentMarketValue?: string
  numberOfUnits?: string
  lineTotal?: string
  accessoryStatus?: string
  thirdPartyItem?: boolean
  itemThirdPartyId?: string
  itemThirdPartyBranchId?: string
  ar4Number?: string
  ar4Date?: string
  ar4Commissionerate?: string
  ar4Division?: string
  ar4Range?: string
  ar4Remarks?: string
  igstPaymentStatus?: string
  taxableValue?: string
  igstAmount?: string
  mainDbkSerialNumber?: string
  drawbackSerialNumber?: string
  drawbackUnit?: string
  drawbackQuantity?: string
  customRateAdv?: string
  customRateSpec?: string
  totalDbkAmount?: string
  dbkAdv?: string
  dbkRateSpec?: string
  rosctlSerialNumber?: string
  centralTaxLevyDuty?: string
  centralTaxLevyRate?: string
  stateLevyDuty?: string
  stateLevyRate?: string
  rosctlQuantity?: string
  rosctlAmount?: string
  rodtep?: string
  rodtepRate?: string
  rodtepCap?: string
  rodtepQuantity?: string
  rodtepUnit?: string
  rodtepAmount?: string
  cess?: string
  originDistrictCode?: string
  tradeAgreementsCode?: string
  endUseOfItem?: string
  totalPackage?: string
  rewardItem?: boolean
}

export interface BillInvoiceForm {
  invoiceNumber: string
  invoiceDate: string
  currency: string
  contractType: string
  buyerSameAsConsignee: boolean
  buyerId: string
  buyerBranchId: string
  thirdPartyId?: string
  thirdPartyBranchId?: string
  freightRate?: string
  freightAmount?: string
  freightCurrency?: string
  insuranceRate?: string
  insuranceAmount?: string
  insuranceCurrency?: string
  commissionRate?: string
  commissionAmount?: string
  commissionCurrency?: string
  discountRate?: string
  discountAmount?: string
  discountCurrency?: string
  otherDeductionsRate?: string
  otherDeductionsAmount?: string
  otherDeductionsCurrency?: string
  packingCharges?: string
  freightInsuranceIncluded?: string
  contractNumber?: string
  natureOfPayment?: string
  periodOfPayment?: string
  invoiceTotal?: string
  items: BillItemForm[]
}

export interface ContainerForm {
  containerNumber: string
  containerSize?: string
  exciseSealNumber?: string
  sealDate?: string
  sealType?: string
  sealDeviceId?: string
  movementDocumentType?: string
  movementDocumentNumber?: string
  invoiceSerialNumber?: string
  itemSerialNumber?: string
  documentTypeCode?: string
  imageReferenceNumber?: string
}

export interface PackingRangeForm {
  packingNumberFrom: string
  packingNumberTo: string
  packingCode?: string
}

export interface SupportingDocForm {
  documentTypeCode: string
  documentReferenceNumber: string
  invoiceSerialNumber?: string
  itemSerialNumber?: string
  imageReferenceNumber?: string
  documentIssueDate?: string
  documentExpiryDate?: string
  placeOfIssue?: string
  issuingPartyCode?: string
  issuingPartyName?: string
  issuingPartyAddress1?: string
  issuingPartyAddress2?: string
  issuingPartyCity?: string
  issuingPartyPin?: string
  beneficiaryPartyCode?: string
  beneficiaryPartyName?: string
  beneficiaryPartyAddress1?: string
  beneficiaryPartyAddress2?: string
  beneficiaryPartyCity?: string
  beneficiaryPartyPin?: string
  fileType?: string
  icegateId?: string
}

export interface LicenseForm {
  registrationNumber: string
  registrationDate?: string
  invoiceSerialNumber?: string
  itemSerialNumber?: string
  licenseSerialNumber?: string
  itemSerialNumberPartE?: string
  itemSerialNumberPartC?: string
  licenseQuantity?: string
  licenseExportQuantity?: string
  indigenousOrImported?: string
}

export interface ShippingBillFormValues {
  jobNumber?: string
  jobDate: string
  exporterId: string
  exporterBranchId: string
  exporterName?: string
  consigneeId: string
  consigneeBranchId: string
  consigneeName?: string
  loadingPort: string
  finalDestinationPort: string
  dischargePort?: string
  originStateCode?: string
  nfeiCategory?: string
  rbiWaiverNumber?: string
  rbiWaiverDate?: string
  sealType?: string
  numberOfContainers?: string
  natureOfCargo: string
  grossWeight?: string
  netWeight?: string
  measurementUnit: string
  totalPackages?: string
  marksAndNumbers?: string
  loosePackets?: string
  mawbNumber?: string
  hawbNumber?: string
  invoices: BillInvoiceForm[]
  containers: ContainerForm[]
  packingRanges: PackingRangeForm[]
  documents: SupportingDocForm[]
  licenses: LicenseForm[]
  exchangeRate?: string
  chaNumber?: string
  chaName?: string
}

export interface SavedBill {
  id: number
  created: string
  updated: string
  values: ShippingBillFormValues
  payload?: ReturnType<typeof toShippingBillPayload>
}

export function emptyItem(): BillItemForm {
  return {
    ritcCode: '',
    goodsDescription1: '',
    quantity: '',
    unitOfMeasurement: 'PCS',
    unitPrice: '',
    lineTotal: '',
    tradeAgreementsCode: 'NCPTI'
  }
}

export function emptyInvoice(): BillInvoiceForm {
  return {
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().slice(0, 10),
    currency: 'USD',
    contractType: 'FOB',
    buyerSameAsConsignee: true,
    buyerId: '',
    buyerBranchId: '',
    items: [emptyItem()]
  }
}

export function emptyDocument(): SupportingDocForm {
  return {
    documentTypeCode: '',
    documentReferenceNumber: '',
    documentIssueDate: new Date().toISOString().slice(0, 10)
  }
}

export function emptyBill(): ShippingBillFormValues {
  return {
    jobDate: new Date().toISOString().slice(0, 10),
    exporterId: '',
    exporterBranchId: '',
    consigneeId: '',
    consigneeBranchId: '',
    loadingPort: '',
    finalDestinationPort: '',
    natureOfCargo: 'P',
    measurementUnit: 'KG',
    invoices: [emptyInvoice()],
    containers: [],
    packingRanges: [],
    documents: [],
    licenses: []
  }
}

export function portCountry(code?: string) {
  return ports.find((port) => port.code === code)?.countryCode ?? code?.match(/^[A-Z]{2}/)?.[0] ?? ''
}

export function lineTotal(item: BillItemForm) {
  if (item.lineTotal != null && item.lineTotal.trim() !== '') return Number(item.lineTotal)
  return Number(item.quantity) * Number(item.unitPrice)
}

export function invoiceTotal(invoice: BillInvoiceForm) {
  return invoice.items.reduce((sum, item) => sum + lineTotal(item), 0)
}

function optionalNumber(value?: any) {
  if (typeof value === 'number') return value
  return value != null && String(value).trim() !== '' ? Number(value) : undefined
}

// Form values contain only editable fields. Resolve references and calculated values at the save boundary.
export function toShippingBillPayload(values: ShippingBillFormValues) {
  const dischargePort =
    typeof values.dischargePort === 'string' && values.dischargePort.trim()
      ? values.dischargePort
      : values.finalDestinationPort
  return {
    shipping_bill: {
      job_number: optionalNumber(values.jobNumber),
      job_date: values.jobDate,
      exporter: Number(values.exporterId),
      exporter_branch: Number(values.exporterBranchId),
      consignee: Number(values.consigneeId),
      consignee_address: Number(values.consigneeBranchId),
      loading_port: values.loadingPort,
      loading_port_code: values.loadingPort,
      loading_country_code: portCountry(values.loadingPort),
      final_destination_port: values.finalDestinationPort,
      final_destination_country_code: portCountry(values.finalDestinationPort),
      discharge_port: dischargePort,
      discharge_country_code: portCountry(dischargePort),
      origin_state_code: optionalNumber(values.originStateCode),
      nfei_category: optionalNumber(values.nfeiCategory),
      rbi_waiver_number: values.rbiWaiverNumber,
      rbi_waiver_date: values.rbiWaiverDate,
      sealtype: values.sealType,
      natureofcargo: values.natureOfCargo,
      grossweight: optionalNumber(values.grossWeight),
      netweight: optionalNumber(values.netWeight),
      measurement_unit: values.measurementUnit,
      total_packages: optionalNumber(values.totalPackages),
      marks_and_numbers: values.marksAndNumbers,
      loose_packets: optionalNumber(values.loosePackets),
      number_of_containers:
        values.containers.length > 0 ? values.containers.length : (optionalNumber(values.numberOfContainers) ?? 0),
      mawb_number: values.mawbNumber,
      hawb_number: values.hawbNumber
    },
    invoices: values.invoices.map((invoice, index) => ({
      serial_number: index + 1,
      invoicenumber: invoice.invoiceNumber,
      date: invoice.invoiceDate,
      currency: invoice.currency,
      contract_type: invoice.contractType,
      buyer: Number(invoice.buyerSameAsConsignee ? values.consigneeId : invoice.buyerId),
      buyer_address: Number(invoice.buyerSameAsConsignee ? values.consigneeBranchId : invoice.buyerBranchId),
      third_party: optionalNumber(invoice.thirdPartyId),
      third_party_address: optionalNumber(invoice.thirdPartyBranchId),
      freight_rate: optionalNumber(invoice.freightRate),
      freight_amount: optionalNumber(invoice.freightAmount),
      freight_currency: invoice.freightCurrency?.trim() ? invoice.freightCurrency : invoice.currency,
      insurance_rate: optionalNumber(invoice.insuranceRate),
      insurance_amount: optionalNumber(invoice.insuranceAmount),
      insurance_currency: invoice.insuranceCurrency?.trim() ? invoice.insuranceCurrency : invoice.currency,
      commission_rate: optionalNumber(invoice.commissionRate),
      commission_amount: optionalNumber(invoice.commissionAmount),
      commission_currency: invoice.commissionCurrency?.trim() ? invoice.commissionCurrency : invoice.currency,
      discount_rate: optionalNumber(invoice.discountRate),
      discount_amount: optionalNumber(invoice.discountAmount),
      discount_currency: invoice.discountCurrency?.trim() ? invoice.discountCurrency : invoice.currency,
      other_deductions_rate: optionalNumber(invoice.otherDeductionsRate),
      other_deductions_amount: optionalNumber(invoice.otherDeductionsAmount),
      other_deductions_currency: invoice.otherDeductionsCurrency?.trim()
        ? invoice.otherDeductionsCurrency
        : invoice.currency,
      packing_charges: optionalNumber(invoice.packingCharges),
      freight_insaurance_included: invoice.freightInsuranceIncluded,
      contract_number: invoice.contractNumber,
      nature_of_payment: invoice.natureOfPayment,
      period_of_payment: optionalNumber(invoice.periodOfPayment),
      invoice_total:
        invoice.invoiceTotal != null && invoice.invoiceTotal.trim() !== ''
          ? Number(invoice.invoiceTotal)
          : invoiceTotal(invoice),
      items: invoice.items.map((item, itemIndex) => ({
        item_serial_number: itemIndex + 1,
        ritc_code: item.ritcCode,
        goods_description_1: item.goodsDescription1,
        goods_description_2: item.goodsDescription2,
        goods_description_3: item.goodsDescription3,
        accessories_description: item.accessoriesDescription,
        scheme_code: item.schemeCode,
        quantity: Number(item.quantity),
        unit_of_measurement: item.unitOfMeasurement,
        unit_price: Number(item.unitPrice),
        unit_of_rate: item.unitOfRate?.trim() ? item.unitOfRate : item.unitOfMeasurement,
        line_total: lineTotal(item),
        present_market_value: optionalNumber(item.presentMarketValue),
        no_of_units: optionalNumber(item.numberOfUnits),
        accessory_status: item.accessoryStatus,
        third_party: item.thirdPartyItem,
        igst_payment_status: item.igstPaymentStatus,
        taxable_value: item.igstPaymentStatus === 'P' ? optionalNumber(item.taxableValue) : undefined,
        igst_amount: item.igstPaymentStatus === 'P' ? optionalNumber(item.igstAmount) : undefined,
        drawback_serial_number: item.drawbackSerialNumber,
        drawback_quantity: optionalNumber(item.drawbackQuantity),
        rodtep: optionalNumber(item.rodtep),
        cess: optionalNumber(item.cess),
        origin_district_code: optionalNumber(item.originDistrictCode),
        trade_agreements_code: item.tradeAgreementsCode,
        end_use_of_item: item.endUseOfItem,
        total_package: optionalNumber(item.totalPackage),
        reward_item: item.rewardItem
      }))
    })),
    invoice_item_third_parties: values.invoices.flatMap((invoice, invoiceIndex) =>
      invoice.items.flatMap((item, itemIndex) =>
        item.thirdPartyItem && item.itemThirdPartyId
          ? [
              {
                invoice_serial_number: invoiceIndex + 1,
                item_serial_number: itemIndex + 1,
                third_party: Number(item.itemThirdPartyId),
                third_party_address: optionalNumber(item.itemThirdPartyBranchId)
              }
            ]
          : []
      )
    ),
    ar4_details: values.invoices.flatMap((invoice, invoiceIndex) =>
      invoice.items.flatMap((item, itemIndex) =>
        item.ar4Number
          ? [
              {
                invoice_serial_number: invoiceIndex + 1,
                item_serial_number: itemIndex + 1,
                ar4_number: item.ar4Number,
                ar4_date: item.ar4Date,
                commissionerate: item.ar4Commissionerate,
                division: item.ar4Division,
                range: item.ar4Range,
                remarks: item.ar4Remarks
              }
            ]
          : []
      )
    ),
    container_details: values.containers.map((container) => ({
      container_number: container.containerNumber,
      container_size: optionalNumber(container.containerSize),
      excise_seal_number: container.exciseSealNumber,
      seal_date: container.sealDate,
      seal_type: container.sealType,
      seal_device_id: container.sealDeviceId,
      movement_document_type: container.movementDocumentType,
      movement_document_number: container.movementDocumentNumber
    })),
    packging_list: values.packingRanges.map((range) => ({
      packing_number_from: optionalNumber(range.packingNumberFrom),
      packing_number_to: optionalNumber(range.packingNumberTo),
      packing_code: range.packingCode
    })),
    supporting_docs: values.documents.map((document, index) => ({
      serial_number: index + 1,
      invoice_serial_number: optionalNumber(document.invoiceSerialNumber),
      item_serial_number: optionalNumber(document.itemSerialNumber),
      document_type_code: document.documentTypeCode,
      document_reference_number: document.documentReferenceNumber,
      image_reference_number: document.imageReferenceNumber,
      document_issue_date: document.documentIssueDate
        ? Math.floor(new Date(document.documentIssueDate).getTime() / 86400000)
        : undefined,
      document_expiry_date: document.documentExpiryDate,
      place_of_issue: document.placeOfIssue,
      issuing_party_code: document.issuingPartyCode,
      issue_party_name: document.issuingPartyName,
      issuing_party_name_addr1: document.issuingPartyAddress1,
      issuing_party_name_addr2: document.issuingPartyAddress2,
      issuing_party_name_city: document.issuingPartyCity,
      issuing_party_name_pin: document.issuingPartyPin,
      beneficiary_party_code: document.beneficiaryPartyCode,
      beneficiary_party_name: document.beneficiaryPartyName,
      beneficiary_party_name_addr1: document.beneficiaryPartyAddress1,
      beneficiary_party_name_addr2: document.beneficiaryPartyAddress2,
      beneficiary_party_name_city: document.beneficiaryPartyCity,
      beneficiary_party_name_pin: document.beneficiaryPartyPin,
      file_type: document.fileType,
      icegate_id: document.icegateId
    })),
    licenses: values.licenses.map((license) => ({
      registration_number: license.registrationNumber,
      registration_date: license.registrationDate,
      invoice_serial_number: optionalNumber(license.invoiceSerialNumber),
      item_serial_number: optionalNumber(license.itemSerialNumber),
      licence_serial_number: optionalNumber(license.licenseSerialNumber),
      item_serial_number_part_e: license.itemSerialNumberPartE,
      item_serial_number_part_c: license.itemSerialNumberPartC,
      quantity: optionalNumber(license.licenseQuantity),
      export_quantity: optionalNumber(license.licenseExportQuantity),
      indigenous_or_imported: license.indigenousOrImported
    }))
  }
}
