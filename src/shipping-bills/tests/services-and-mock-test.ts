import { describe, expect, it } from 'vitest'
import { formOptionsService } from '../form-options-service'
import { partyMockService } from '../party-mock-service'

describe('Mock API Services Layer', () => {
  describe('partyMockService', () => {
    it('searches exporters by name or iec', async () => {
      const results = await partyMockService.searchExporters('aarav')
      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results[0].name).toContain('Aarav')

      const iecResults = await partyMockService.searchExporters('AAECA1234F')
      expect(iecResults.length).toBeGreaterThanOrEqual(1)
    })

    it('searches exporter branches for a valid exporter id', async () => {
      const branches = await partyMockService.searchExporterBranches('1000', 'ludhiana')
      expect(branches.length).toBeGreaterThanOrEqual(1)
      expect(branches[0].city).toBe('Ludhiana')
    })

    it('returns empty array for invalid exporter id branch search', async () => {
      const branches = await partyMockService.searchExporterBranches('999999', '')
      expect(branches).toEqual([])
    })

    it('searches consignees and consignee branches', async () => {
      const consignees = await partyMockService.searchConsignees('gulf')
      expect(consignees.length).toBeGreaterThanOrEqual(1)

      const branches = await partyMockService.searchConsigneeBranches(String(consignees[0].id), '')
      expect(branches.length).toBeGreaterThanOrEqual(1)
    })

    it('searches Indian loading ports (codes starting with IN)', async () => {
      const ports = await partyMockService.searchLoadingPorts('mun')
      expect(ports.length).toBeGreaterThanOrEqual(1)
      expect(ports[0].code).toBe('INMUN1')
      expect(ports.every((p) => p.code.startsWith('IN'))).toBe(true)
    })

    it('searches destination ports across worldwide hubs', async () => {
      const ports = await partyMockService.searchDestinationPorts('orleans')
      expect(ports.length).toBeGreaterThanOrEqual(1)
      expect(ports[0].code).toBe('USMSY')
    })

    it('retrieves port by code for display resolution', async () => {
      const port = await partyMockService.getPortByCode('INMUN1')
      expect(port?.name).toBe('Mundra')
      expect(port?.countryCode).toBe('IN')
    })

    it('fetches exporter marks and numbers', async () => {
      const marks = await partyMockService.getMarksAndNumbers('1000')
      expect(marks.length).toBeGreaterThanOrEqual(1)
      expect(marks[0].value).toContain('AARAV')
    })
  })

  describe('formOptionsService', () => {
    it('fetches scheme codes with incentives metadata flags', async () => {
      const schemes = await formOptionsService.fetchSchemeCodes()
      expect(schemes.length).toBeGreaterThan(0)
      const sample = schemes[0]
      expect(sample.value).toBeDefined()
      expect(sample.label).toBeDefined()
      expect(typeof sample.drawback).toBe('boolean')
    })

    it('fetches quantity unit codes', async () => {
      const units = await formOptionsService.fetchQuantityCodes()
      expect(units.some((u) => u.value === 'PCS' || u.value === 'KGS')).toBe(true)
    })

    it('fetches states with string value conversion', async () => {
      const states = await formOptionsService.fetchStates()
      expect(states.length).toBeGreaterThan(0)
      expect(typeof states[0].value).toBe('string')
    })

    it('fetches e-sanchit document types', async () => {
      const docs = await formOptionsService.fetchDocumentTypes()
      expect(docs.length).toBeGreaterThan(0)
    })

    it('fetches trade agreements', async () => {
      const trades = await formOptionsService.fetchTradeAgreements()
      expect(trades.length).toBeGreaterThan(0)
    })
  })
})
