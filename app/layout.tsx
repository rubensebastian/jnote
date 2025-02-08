import type { Metadata } from 'next'
import './globals.css'
import Menu from '@/components/Menu'

export const metadata: Metadata = {
  title: 'JobNote',
  description: 'Track and Apply for Jobs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <Menu />
        {children}
      </body>
    </html>
  )
}
