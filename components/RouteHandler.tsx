"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RouteHandler({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const mnemonic = localStorage.getItem('mnemonic')
    if (mnemonic) {
      router.push('/dashboard')
    }
  }, [router])

  return <>{children}</>
}