import type { Metadata } from "next"
import "../globals.css"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { getMessages } from "next-intl/server"
import { headers } from "next/headers"
import { NextIntlClientProvider } from "next-intl"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  const messages = await getMessages()
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  const isAuthPage =
    pathname.includes("/login") || pathname.includes("/register")

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

