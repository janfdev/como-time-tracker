import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router'
import { Meta, Scripts, Html, Body, Head } from '@tanstack/start'
import type { ReactNode } from 'react'
import '../app.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <Html lang="en">
      <Head>
        <Meta />
      </Head>
      <Body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  )
}
