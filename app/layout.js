import './globals.css'

export const metadata = {
  title: 'Azarraga Commercial Agent',
  description: 'Quotes, invoices and lead operations for Azarraga Glass & Aluminum'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
