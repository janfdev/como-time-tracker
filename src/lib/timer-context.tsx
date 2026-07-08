import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react'

interface TimerState {
  seconds: number
  isRunning: boolean
  projectId: string
  projectName: string
  projectColor: string
  description: string
  isBillable: boolean
  tags: string[]
  startedAt: string | null
}

interface TimerContextType {
  state: TimerState
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  setProject: (id: string, name: string, color: string) => void
  setDescription: (desc: string) => void
  setBillable: (v: boolean) => void
  setTags: (tags: string[]) => void
  getElapsedSeconds: () => number
}

const TimerContext = createContext<TimerContextType | null>(null)

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used within TimerProvider')
  return ctx
}

const STORAGE_KEY = 'como-timer'

function loadState(): TimerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (saved.isRunning && saved.startedAt) {
        const elapsed = Math.floor((Date.now() - new Date(saved.startedAt).getTime()) / 1000)
        return { ...saved, seconds: saved.seconds + elapsed }
      }
      return saved
    }
  } catch {}
  return {
    seconds: 0,
    isRunning: false,
    projectId: '',
    projectName: '',
    projectColor: '#D97706',
    description: '',
    isBillable: false,
    tags: [],
    startedAt: null,
  }
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TimerState>(loadState)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState((s) => ({ ...s, seconds: s.seconds + 1 }))
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [state.isRunning])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const start = useCallback(() => {
    setState((s) => ({
      ...s,
      isRunning: true,
      startedAt: s.startedAt || new Date().toISOString(),
    }))
  }, [])

  const pause = useCallback(() => {
    setState((s) => ({ ...s, isRunning: false }))
  }, [])

  const resume = useCallback(() => {
    setState((s) => ({ ...s, isRunning: true }))
  }, [])

  const reset = useCallback(() => {
    setState({
      seconds: 0,
      isRunning: false,
      projectId: '',
      projectName: '',
      projectColor: '#D97706',
      description: '',
      isBillable: false,
      tags: [],
      startedAt: null,
    })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const setProject = useCallback((id: string, name: string, color: string) => {
    setState((s) => ({ ...s, projectId: id, projectName: name, projectColor: color }))
  }, [])

  const setDescription = useCallback((desc: string) => {
    setState((s) => ({ ...s, description: desc }))
  }, [])

  const setBillable = useCallback((v: boolean) => {
    setState((s) => ({ ...s, isBillable: v }))
  }, [])

  const setTags = useCallback((tags: string[]) => {
    setState((s) => ({ ...s, tags }))
  }, [])

  const getElapsedSeconds = useCallback(() => state.seconds, [state.seconds])

  return (
    <TimerContext.Provider value={{ state, start, pause, resume, reset, setProject, setDescription, setBillable, setTags, getElapsedSeconds }}>
      {children}
    </TimerContext.Provider>
  )
}
