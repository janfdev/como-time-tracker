import { describe, it, expect } from 'vitest'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

describe('formatDuration', () => {
  it('formats seconds to hours and minutes', () => {
    expect(formatDuration(3600)).toBe('1h 0m')
    expect(formatDuration(5400)).toBe('1h 30m')
    expect(formatDuration(7200)).toBe('2h 0m')
  })

  it('formats minutes only when under 1 hour', () => {
    expect(formatDuration(1800)).toBe('30m')
    expect(formatDuration(900)).toBe('15m')
    expect(formatDuration(60)).toBe('1m')
  })

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0m')
  })

  it('handles large durations', () => {
    expect(formatDuration(36000)).toBe('10h 0m')
    expect(formatDuration(28800)).toBe('8h 0m')
  })
})

describe('formatCurrency', () => {
  it('formats cents to dollars', () => {
    expect(formatCurrency(1000)).toBe('$10.00')
    expect(formatCurrency(495000)).toBe('$4,950.00')
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('handles small amounts', () => {
    expect(formatCurrency(50)).toBe('$0.50')
    expect(formatCurrency(1)).toBe('$0.01')
  })
})
