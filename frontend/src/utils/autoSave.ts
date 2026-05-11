import { ref, onUnmounted } from 'vue'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface AutoSaveOptions {
  debounceMs?: number
}

export function useAutoSave(
  saveFn: (data: any) => Promise<any>,
  key: string,
  options: AutoSaveOptions = {}
) {
  const { debounceMs = 30000 } = options

  const status = ref<SaveStatus>('idle')
  const lastSavedTime = ref<Date | null>(null)
  const lastSavedContent = ref<string>('')

  let debounceTimer: number | null = null

  const performSave = async (content: string, isManual = false) => {
    try {
      status.value = 'saving'

      const result = await saveFn({ content, key })

      if (result.success) {
        status.value = 'saved'
        lastSavedTime.value = new Date()
        lastSavedContent.value = content

        // Save to localStorage
        localStorage.setItem(`draft-${key}`, content)

        return { success: true }
      } else {
        status.value = 'error'
        return { success: false, error: result.error }
      }
    } catch (error) {
      status.value = 'error'
      console.error('Auto-save failed:', error)
      return { success: false, error }
    }
  }

  const triggerAutoSave = (content: string) => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = window.setTimeout(() => {
      performSave(content)
    }, debounceMs)
  }

  const manualSave = async (content: string) => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    return await performSave(content, true)
  }

  const stopAutoSave = () => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  const restoreDraft = (): string | null => {
    const draft = localStorage.getItem(`draft-${key}`)
    return draft
  }

  const clearDraft = () => {
    localStorage.removeItem(`draft-${key}`)
  }

  // Clean up on component unmount
  onUnmounted(() => {
    stopAutoSave()
  })

  return {
    status,
    lastSavedTime,
    lastSavedContent,
    triggerAutoSave,
    manualSave,
    stopAutoSave,
    restoreDraft,
    clearDraft
  }
}
