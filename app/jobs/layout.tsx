import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Job Applications',
  description: 'Track your applied jobs',
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
