import { useState, useEffect, useCallback } from 'react'
import { Button } from '~/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(isIOSDevice)

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const dismissedBefore = localStorage.getItem('pwa-install-dismissed')
    if (dismissedBefore) {
      const dismissedTime = parseInt(dismissedBefore)
      const daysSinceDismiss = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
      if (daysSinceDismiss < 7) {
        setDismissed(true)
        return
      }
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    if (isIOSDevice && !window.matchMedia('(display-mode: standalone)').matches) {
      setTimeout(() => {
        const dismissedBefore = localStorage.getItem('pwa-install-dismissed')
        if (!dismissedBefore) {
          setShowInstall(true)
        }
      }, 3000)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setShowInstall(false)
    }
    setDeferredPrompt(null)
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setShowInstall(false)
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }, [])

  if (isInstalled || dismissed || !showInstall) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-sm">
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[#F1F5F9]">Install Como</h4>
            {isIOS ? (
              <p className="text-xs mt-1" style={{ color: '#8892A0' }}>
                Tap <span className="font-medium text-[#CDD5DF]">Share</span> then{' '}
                <span className="font-medium text-[#CDD5DF]">Add to Home Screen</span> to install
              </p>
            ) : (
              <p className="text-xs mt-1" style={{ color: '#8892A0' }}>
                Install Como for quick access and offline use
              </p>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="text-[#8892A0] hover:text-[#CDD5DF] p-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {!isIOS && deferredPrompt && (
          <div className="mt-3 flex gap-2">
            <Button onClick={handleInstall} className="flex-1" size="sm">
              Install app
            </Button>
            <Button onClick={handleDismiss} variant="outline" size="sm">
              Later
            </Button>
          </div>
        )}
        {isIOS && (
          <div className="mt-3 flex gap-2">
            <Button onClick={handleDismiss} variant="outline" size="sm" className="flex-1">
              Got it
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
