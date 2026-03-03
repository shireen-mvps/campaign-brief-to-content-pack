'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'

export function ClaimCampaigns() {
  const router = useRouter()

  useEffect(() => {
    const ids: string[] = JSON.parse(localStorage.getItem('guest_campaign_ids') || '[]')
    if (ids.length === 0) return

    Promise.all(ids.map(id => fetch(`/api/campaigns/${id}`, { method: 'PATCH' }))).then(() => {
      localStorage.removeItem('guest_campaign_ids')
      router.refresh()
    })
  }, [router])

  return null
}

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
    >
      Sign out
    </button>
  )
}

export function DeleteButton({ campaignId }: { campaignId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this campaign?')) return
    await fetch(`/api/campaigns/${campaignId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-zinc-700 hover:text-red-400 transition-colors px-2"
      title="Delete"
    >
      ✕
    </button>
  )
}
