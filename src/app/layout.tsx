import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Biordle',
  description: 'Adivinhe a espécie do dia! Um jogo educativo baseado em biodiversidade.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}