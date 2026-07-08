import { useLocation, Link } from '@tanstack/react-router'
import { useTimer } from '~/lib/timer-context'

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function FloatingTimer() {
  const { state, pause, resume } = useTimer()
  const location = useLocation()

  if (!state.projectId || state.seconds === 0) return null
  if (location.pathname === '/dashboard/timer') return null

  return (
    <Link
      to="/dashboard/timer"
      className="fixed bottom-20 right-4 z-50 lg:bottom-6 lg:right-6"
    >
      <div className="bg-surface border border-border rounded-2xl shadow-2xl p-4 min-w-[200px] hover:border-accent/50 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: state.projectColor, animation: state.isRunning ? 'pulse 1.5s infinite' : 'none' }} />
          <span className="text-xs font-medium text-[#CDD5DF] truncate max-w-[120px]">{state.projectName || 'Timer'}</span>
        </div>
        <div
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-mono)', color: state.isRunning ? '#D97706' : '#F1F5F9' }}
        >
          {formatTime(state.seconds)}
        </div>
        {state.description && (
          <div className="text-[10px] mt-1 truncate" style={{ color: '#8892A0' }}>{state.description}</div>
        )}
        <div className="flex gap-1.5 mt-2">
          {state.isRunning ? (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); pause() }}
              className="text-xs px-3 py-1 rounded-md bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); resume() }}
              className="text-xs px-3 py-1 rounded-md bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              Resume
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
