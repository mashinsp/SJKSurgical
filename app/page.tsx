// app/page.tsx
import { redirect } from 'next/navigation'

export default function Page() {
  // Immediately redirect to /home
  redirect('/home')
}
