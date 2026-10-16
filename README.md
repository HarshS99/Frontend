# Export Software Frontend — Shipping Bill Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-5.x-green.svg)](https://vitest.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-Clean-brightgreen.svg)](https://eslint.org/)

A production-grade, highly maintainable frontend application for creating, managing, and exporting Indian Customs Electronic Data Interchange (EDI) **Shipping Bills**. Built on top of the `fe-zen-arch` enterprise architecture with TypeScript, React 19, Tailwind CSS, React Hook Form, and Zustand.

---

## 📑 Table of Contents

- [Executive Summary & Refactoring Highlights](#-executive-summary--refactoring-highlights)
- [Architecture & Design System](#-architecture--design-system)
- [Shipping Bill Domain & ICEGATE Specifications](#-shipping-bill-domain--icegate-specifications)
- [Project Structure](#-project-structure)
- [API-Ready Mock Services & State Management](#-api-ready-mock-services--state-management)
- [Comprehensive Test Suite](#-comprehensive-test-suite)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Code Quality & Lint Pipeline](#-code-quality--lint-pipeline)
- [Submission Information](#-submission-information)

---

## 🚀 Executive Summary & Refactoring Highlights

The original legacy Shipping Bill form suffered from severe maintainability bottlenecks:

- Monolithic 1,800+ line components coupling presentation, validation, business calculations, and network calls.
- Ad-hoc copy-pasted state management and scattered validations.
- Fragile string manipulations for Customs EDI flatfile formatting without test coverage.
- Lack of offline-first persistence or optimistic feedback for complex multi-table forms.

### 🔑 Key Engineering Improvements

1. **Modular Component Hierarchy**
   - Decomposed monolithic forms into focused, single-responsibility sub-components (`ShipmentBasicsSection`, `InvoiceEditor`, `InvoiceItemEditor`, `ContainersAndPacking`, `PartyFields`, `AsyncPartySelect`, `DocumentItem`, `DeductionRow`).
   - Clean separation of presentation concerns from state management and business rules.

2. **Schema-Driven Form Architecture**
   - Strong validation schema (`billSchema`) built using `core/form` validating nested arrays (Invoices, Items, Containers, Packing Ranges, Documents, Licenses).
   - Strict TypeScript interfaces for both form state (`ShippingBillFormValues`) and backend domain payloads (`ShippingBillPayload`).

3. **Domain Business Logic Extraction**
   - Pure, unit-tested computation functions (`calculateBillSummary`, `calculateInvoiceTotal`, `lineTotal`, `calculateFOB`) ensuring numeric precision for financial totals, currency conversions, freight, insurance, and export incentive deductions.

4. **Bidirectional Customs EDI Flatfile Engine**
   - Implemented compliant ICEGATE `<TABLE>` format generation (`<TABLE>HREC`, `<TABLE>SB`, `<TABLE>INVOICE`, `<TABLE>ITEM`, `<TABLE>PACK`, `<TABLE>CONTAINER`, `<TABLE>DOCUMENT`, `<TABLE>TREC`).
   - Tested serialization with support for escaping, character caps, and special customs indicators.

5. **Enterprise Mock API Service & Local Storage**
   - Asynchronous `shippingBillService` and `partyMockService` mirroring RESTful semantics.
   - Built-in network latency simulation, robust fallback handling, and offline persistence via local storage demo store (`demo-store.ts`).

---

## 🏛 Architecture & Design System

The project leverages `fe-zen-arch` as a Git submodule:

- **`core/form`**: Form control using React Hook Form under the hood, integrated with custom schemas and nested array handlers (`useFieldArray`).
- **`ui/basic` & `ui/inputs`**: Design system tokens for consistent forms, cards, inputs, selects, badges, and modals.
- **`zustand`**: State store for managing drafts, saved shipping bills, and party master records.
- **`fe-base/ui/styles.css`**: Tailwind CSS integration configured for modern UI aesthetics, glassmorphism, responsive grids, and crisp typography.

```
                  ┌─────────────────────────────────────┐
                  │          ShippingBillForm           │
                  │  (Route container & active bill id) │
                  └──────────────────┬──────────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  │             BillEditor              │
                  │   (useForm, draft auto-save, tabs)  │
                  └──────┬───────────┬───────────┬──────┘
                         │           │           │
     ┌───────────────────┴──┐ ┌──────┴──────┐ ┌──┴──────────────────────┐
     │ ShipmentBasicsSection│ │InvoiceEditor│ │  ContainersAndPacking   │
     │ (Parties, Ports, SBs)│ │ (Multi-inv) │ │(Cargo, Seals, e-Sanchit)│
     └──────────────────────┘ └──────┬──────┘ └─────────────────────────┘
                                     │
                             ┌───────┴──────────┐
                             │InvoiceItemEditor │
                             │(HS Codes, Rates) │
                             └──────────────────┘
```

---

## 📦 Shipping Bill Domain & ICEGATE Specifications

A Shipping Bill is an official legal declaration submitted by exporters to the Indian Customs department (CBIC / ICEGATE) before goods are loaded onto a vessel or aircraft.

### Supported Domain Workflows:

- **Parties Hierarchy**: Exporter, Consignee, Buyer (foreign purchaser), Third Party manufacturer / merchant exporter.
- **Port Logistics**: Port of Loading (e.g. `INNSA1` Nhava Sheva, `INDEL4` Delhi), Port of Destination, Discharge Port, Mode of Transport (`1` Sea, `4` Air, etc.).
- **Invoice & Financials**: Multi-currency valuation (`USD`, `EUR`, `INR`, `GBP`), Incoterms (`FOB`, `CIF`, `C&F`), Contract types (`1` Regular, `2` Consignment).
- **Incentive Schemes**: RoDTEP, RoSCTL, Duty Drawback (DBK), EPCG, Advance Authorisation (`49` Scheme codes mapped).
- **Cargo & Tracking**: Container ISO sizes (`20` ft, `40` ft), electronic seal verification, loose package counting.
- **e-Sanchit Digital Customs Documents**: Document code binding, digital signing authority, ICEGATE IRN tracking.

---

## 📁 Project Structure

```bash
src/
├── dashboard/                     # List dashboard showing saved & draft bills
│   └── list-dashboard.tsx
├── data/                          # Master code lists & configuration
│   ├── e-sanchit-codes.ts         # Customs document classification codes
│   ├── form-options.ts            # Curated dropdown options (currencies, ports, uoms)
│   ├── port-codes.ts              # UN/LOCODE Indian ports
│   └── scheme-codes.ts            # Customs incentive scheme definitions
├── shipping-bills/
│   ├── components/                # Modular, focused form sub-components
│   │   ├── async-party-select.tsx # Debounced typeahead party picker with add-party modal
│   │   ├── bill-editor.tsx        # Main form controller & tab coordinator
│   │   ├── containers-and-packing.tsx # Container & cargo logistics manager
│   │   ├── deduction-row.tsx      # Freight/insurance deductions
│   │   ├── document-item.tsx      # e-Sanchit supporting documentation
│   │   ├── form-ui-helpers.tsx    # Collapsible Advanced sections & badges
│   │   ├── invoice-editor.tsx     # Invoice master editor
│   │   ├── invoice-item-editor.tsx# Line items, HS codes, unit pricing, drawback
│   │   ├── party-fields.tsx       # Reusable party + branch selector
│   │   ├── shipment-basics-section.tsx # Exporter, consignee, port metadata
│   │   └── workflow-tracker.tsx   # Progress indicator for bill steps
│   ├── demo-store.ts              # LocalStorage persistent store for demo data
│   ├── form-options-service.ts    # Async lookups for ports, schemes, codes
│   ├── form-schema.ts             # Validation schema
│   ├── model.ts                   # Domain types, calculation utilities, defaults
│   ├── party-dialogs.tsx          # Quick-add modal for new exporters/businesses
│   ├── party-mock-service.ts      # Mock party master API service
│   ├── shipping-bill-form.tsx     # Top-level view wrapper
│   ├── shipping-bill-service.ts   # Core service (CRUD, flatfile, export)
│   └── tests/                     # Comprehensive test suite (38 passing tests)
│       ├── demo-store-test.ts
│       ├── model-calculations-test.ts
│       ├── payload-and-flatfile-test.ts
│       └── services-and-mock-test.ts
├── shared/                        # Application layout, routes, navigation
└── index.tsx                      # App entry point
```

---

## ⚡ API-Ready Mock Services & State Management

All network boundaries are designed to match standard JSON REST APIs:

- **`shippingBillService`**:
  - `getShippingBills(params)`: Search, sort, and paginate shipping bills.
  - `getShippingBillById(id)`: Retrieve a bill with complete invoice and cargo tree.
  - `saveShippingBill(values)`: Upserts a bill, auto-generating sequential job/SB numbers.
  - `deleteShippingBill(id)`: Deletes from storage.
  - `generateFlatFile(bill)`: Generates compliant ICEGATE EDI string.
  - `downloadFlatFile(bill)`: Triggers client-side `.sb` flatfile download.

- **`partyMockService`**:
  - Debounced autocomplete for Exporter IEC and Consignee directory.
  - Branch resolution with dynamic address pre-filling.

- **Offline-First Demo Store**:
  - Automatically seeds realistic demo data on first load.
  - Persists edits across browser reloads via `localStorage`.
  - Reset button to restore standard sample dataset at any time.

---

## 🧪 Comprehensive Test Suite

The project includes **38 automated tests** run via Vitest:

| Test Suite                         | Tests | Purpose                                                                    |
| :--------------------------------- | :---: | :------------------------------------------------------------------------- |
| **`model-calculations-test.ts`**   |  12   | Financial math, line totals, currency summaries, FOB computation           |
| **`payload-and-flatfile-test.ts`** |   6   | Schema mapping, form-to-payload serialization, ICEGATE flatfile generation |
| **`demo-store-test.ts`**           |   7   | Local persistence, bill creation, updates, and branch management           |
| **`services-and-mock-test.ts`**    |  13   | Mock API contracts, party search, async lookups, pagination                |

Run all tests:

```bash
npm test
```

---

## 🛠 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm

### Installation

1. **Clone the repository with submodules**:

   ```bash
   git clone --recurse-submodules https://github.com/HarshS99/Frontend.git
   cd Frontend
   ```

   _(If cloned without submodules, run `git submodule update --init --recursive`)_

2. **Install dependencies**:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the local development server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Command         | Action                                                                     |
| :-------------- | :------------------------------------------------------------------------- |
| `npm run dev`   | Starts Vite dev server with HMR                                            |
| `npm test`      | Runs the 38 Vitest unit & integration tests                                |
| `npm run build` | Builds optimized production bundle                                         |
| `npm run lint`  | Runs the full `fe-zen-arch` lint pipeline (Prettier + TypeScript + ESLint) |

---

## 🛡 Code Quality & Lint Pipeline

The codebase strictly complies with the `fe-zen-arch` repository quality standards:

- **Zero TypeScript Errors**: Typechecked using `tsc --noEmit`.
- **Zero ESLint Errors**: Verified across all source files and test suites.
- **Consistent Formatting**: Automated Prettier formatting on every run.

Run the pipeline:

```bash
npm run lint
```

---

## 👤 Submission Information

- **Candidate**: Harsh Singh
- **Target Repository**: [https://github.com/HarshS99/Frontend.git](https://github.com/HarshS99/Frontend.git)
- **Reviewer Access Granted**: `shivam-aajkalbharat`
