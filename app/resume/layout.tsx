import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Edit Your Education and Experience',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
