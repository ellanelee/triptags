import "@/app/globals.css"
import "react-datepicker/dist/react-datepicker.css"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { getMessages } from "next-intl/server"
import { headers } from "next/headers"
import { NextIntlClientProvider } from "next-intl"
import { Header } from "@/components/common/layout/Header"
import { LocalSync } from "@/lib/utils/localSync"

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
          <LocalSync />
          {!isAuthPage && <Header />}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
