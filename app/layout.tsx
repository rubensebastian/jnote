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
      <body className='bg-background h-svh flex flex-col'>
        <Menu />
        {children}
      </body>
    </html>
  )
}
