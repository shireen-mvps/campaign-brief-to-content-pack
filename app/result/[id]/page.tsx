import { createSupabaseServerClient } from '@/lib/supabase'
import { ContentPackView } from '@/components/campaign/ContentPack'
import type { ContentPack } from '@/lib/claude'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !campaign) notFound()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user && campaign.user_id === user.id
  const isGuest = !campaign.user_id

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-zinc-900">
        <Link href="/" className="font-display font-bold text-sm tracking-tight text-amber-400">
          Brief→Pack
        </Link>
        {user ? (
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
            My campaigns
          </Link>
        ) : (
          <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
            Sign in to save →
          </Link>
        )}
      </nav>

      {/* Guest save banner */}
      {(isGuest || (!isOwner && !isGuest)) && (
        <div className="bg-amber-400/10 border-b border-amber-400/20 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-amber-300">
            This content pack isn&apos;t saved. Sign in to save campaigns and revisit them anytime.
          </p>
          <Link
            href="/login"
            className="shrink-0 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Sign in with Google
          </Link>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">Content Pack</p>
          <h1 className="font-display font-bold text-3xl text-zinc-100">{campaign.title}</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {campaign.brief_data?.product_name} · {campaign.brief_data?.campaign_goal} · {campaign.brief_data?.tone_of_voice}
          </p>
        </div>

        {campaign.status === 'error' ? (
          <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-6 text-center">
            <p className="text-red-400 font-medium mb-4">Generation failed.</p>
            <Link
              href="/campaign/new"
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm hover:border-zinc-700 transition-colors"
            >
              Try again
            </Link>
          </div>
        ) : (
          <ContentPackView pack={campaign.output_data as ContentPack} />
        )}

        <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row gap-3">
          <Link
            href="/campaign/new"
            className="flex-1 text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Generate another pack
          </Link>
          {!user && (
            <Link
              href="/login"
              className="flex-1 text-center bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Sign in to save this →
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
