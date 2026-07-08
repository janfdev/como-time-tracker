/// <reference types="vite/client" />
import {
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { TimerProvider } from '~/lib/timer-context'
import { FloatingTimer } from '~/components/FloatingTimer'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
      { name: 'theme-color', content: '#0C0E12' },
      { name: 'description', content: 'Dead-simple time tracking for freelancers and students.' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'Como' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'application-name', content: 'Como' },
      { name: 'msapplication-TileColor', content: '#0C0E12' },
      { name: 'msapplication-tap-highlight', content: 'no' },
      ...seo({
        title: 'Como — Time tracker for people who value their time',
        description: 'Dead-simple time tracking. One click to start. See where your hours actually go.',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'mask-icon', href: '/favicon.png', color: '#D97706' },
    ],
    scripts: [],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TimerProvider>
          {children}
          <FloatingTimer />
        </TimerProvider>
        <Scripts />
      </body>
    </html>
  )
}
