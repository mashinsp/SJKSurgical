// Usage in your layout or page:

// app/layout.tsx or pages/_app.tsx
import VisitorTracker from './components/VisitorTracker'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <VisitorTracker />
        {children}
      </body>
    </html>
  )
}