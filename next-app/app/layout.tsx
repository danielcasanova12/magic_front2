import './globals.css'

export const metadata = {
  title: 'Magic Front Minimal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <main style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>{children}</main>
      </body>
    </html>
  )
}
