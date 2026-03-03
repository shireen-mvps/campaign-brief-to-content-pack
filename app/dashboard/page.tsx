import { createSupabaseServerClient } from '@/lib/supabase'
import { SignOutButton, DeleteButton, ClaimCampaigns } from '@/components/dashboard/Actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, title, created_at, brief_data, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const name = user.user_metadata?.full_name || user.email

  return (
    <div className="min-h-screen bg-zinc-950">
      <ClaimCampaigns />
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-zinc-900">
        <Link href="/" className="font-display font-bold text-sm tracking-tight text-amber-400">
          Campaign Brief → Content Pack
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500 hidden sm:block">{name}</span>
          <SignOutButton />
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-zinc-100">Your campaigns</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {campaigns?.length ?? 0} saved packs
            </p>
          </div>
          <Link
            href="/campaign/new"
            className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            New brief →
          </Link>
        </div>

        {!campaigns || campaigns.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <p className="text-zinc-500 mb-4">No campaigns yet.</p>
            <Link
              href="/campaign/new"
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Generate your first pack
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map(c => (
              <div
                key={c.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl px-5 py-4 flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <Link href={`/result/${c.id}`} className="group">
                    <h2 className="font-medium text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                      {c.title}
                    </h2>
                    <p className="text-zinc-600 text-xs mt-0.5">
                      {c.brief_data?.product_name} · {c.brief_data?.campaign_goal} ·{' '}
                      {new Date(c.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </Link>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {c.status === 'error' && (
                    <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded">
                      Error
                    </span>
                  )}
                  <Link
                    href={`/result/${c.id}`}
                    className="text-xs text-zinc-500 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View
                  </Link>
                  <DeleteButton campaignId={c.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

