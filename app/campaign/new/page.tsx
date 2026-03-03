import { BriefForm } from '@/components/campaign/BriefForm'
import Link from 'next/link'

export default function NewCampaignPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-zinc-900">
        <Link href="/" className="font-display font-bold text-sm tracking-tight text-amber-400">
          Brief→Pack
        </Link>
        <Link
          href="/login"
          className="text-sm text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          Sign in to save →
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 mb-3">
            Brief your campaign
          </h1>
          <p className="text-zinc-500">
            Fill in the details below. The more specific you are, the sharper the output.
          </p>
        </div>

        <BriefForm />
      </main>
    </div>
  )
}
