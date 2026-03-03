'use client'

import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'

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
