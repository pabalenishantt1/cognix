"use client"

import { useEffect } from "react"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import OnboardingPage from "./onboarding/page"

export default function Home() {
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      router.replace('/dashboard')
    }
  }, [isConnected, router])

  if (!isConnected) {
    return <OnboardingPage />
  }

  return null
}
