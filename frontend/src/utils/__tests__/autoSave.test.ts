import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAutoSave } from '../autoSave'

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('TC-AS-001: should create auto-save composable', () => {
    const mockSaveFn = vi.fn()
    const { status, lastSavedTime } = useAutoSave(mockSaveFn, 'test-id')

    expect(status.value).toBe('idle')
    expect(lastSavedTime.value).toBeNull()
  })

  it('TC-AS-002: should call save function after 30 seconds of inactivity', async () => {
    const mockSaveFn = vi.fn().mockResolvedValue({ success: true })
    const { triggerAutoSave } = useAutoSave(mockSaveFn, 'test-id')

    triggerAutoSave()

    // Fast-forward 30 seconds
    await vi.advanceTimersByTimeAsync(30000)

    expect(mockSaveFn).toHaveBeenCalledTimes(1)
  })

  it('TC-AS-003: should reset debounce timer on new input', async () => {
    const mockSaveFn = vi.fn()
    const { triggerAutoSave } = useAutoSave(mockSaveFn, 'test-id')

    // First trigger
    triggerAutoSave()

    // Wait 20 seconds
    await vi.advanceTimersByTimeAsync(20000)

    // Second trigger should reset the timer
    triggerAutoSave()

    // Wait another 20 seconds (total 40s from first trigger)
    await vi.advanceTimersByTimeAsync(20000)

    // Should not have been called yet (needs 30s from last trigger)
    expect(mockSaveFn).not.toHaveBeenCalled()

    // Wait another 10 seconds (30s from second trigger)
    await vi.advanceTimersByTimeAsync(10000)

    expect(mockSaveFn).toHaveBeenCalledTimes(1)
  })

  it('TC-AS-004: should trigger manual save immediately', async () => {
    const mockSaveFn = vi.fn().mockResolvedValue({ success: true })
    const { manualSave } = useAutoSave(mockSaveFn, 'test-id')

    await manualSave()

    expect(mockSaveFn).toHaveBeenCalledTimes(1)
  })

  it('TC-AS-005: should clear timer on component unmount', () => {
    const mockSaveFn = vi.fn()
    const { triggerAutoSave, stopAutoSave } = useAutoSave(mockSaveFn, 'test-id')

    triggerAutoSave()

    // Clear timers like component unmount
    stopAutoSave()

    // Fast-forward 30 seconds
    vi.advanceTimersByTime(30000)

    // Should not have been called because timer was cleared
    expect(mockSaveFn).not.toHaveBeenCalled()
  })

  it('TC-AS-006: should update status during save lifecycle', async () => {
    let resolveSave: (value: any) => void
    const mockSaveFn = vi.fn(() => new Promise(resolve => {
      resolveSave = resolve
    }))
    const { status, manualSave } = useAutoSave(mockSaveFn, 'test-id')

    // Initially idle
    expect(status.value).toBe('idle')

    // Start saving
    const savePromise = manualSave()
    expect(status.value).toBe('saving')

    // Complete save
    resolveSave!({ success: true })
    await savePromise
    expect(status.value).toBe('saved')
  })
})
