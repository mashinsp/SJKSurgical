// components/VisitorTracker.tsx
'use client'

import { useEffect } from 'react'

export default function VisitorTracker() {
  useEffect(() => {
    // Log visitor info on page load
    const logVisitor = async () => {
      try {
        const response = await fetch('/api/visitor-log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: window.location.pathname,
            timestamp: new Date().toISOString()
          })
        })
        
        const data = await response.json()
        console.log('Visitor logged:', data)
      } catch (error) {
        console.error('Failed to log visitor:', error)
      }
    }

    logVisitor()
  }, [])

  return null // This component doesn't render anything
}

