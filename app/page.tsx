import Link from 'next/link'

const OUTPUTS = [
  { label: '5 Headlines', icon: '◈' },
  { label: '5 Email Subjects', icon: '◈' },
  { label: 'Social Captions', icon: '◈' },
  { label: '5 CTAs', icon: '◈' },
  { label: '4 Ad Hooks', icon: '◈' },
  { label: 'Channel Tags', icon: '◈' },
  { label: 'Funnel Stage Tags', icon: '◈' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-zinc-900">
        <span className="font-display font-bold text-sm tracking-tight text-amber-400">
          Campaign Brief → Content Pack
        </span>
        <Link
          href="/login"
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-amber-400 tracking-wide">
            No account needed to generate
          </span>
        </div>

        <h1 className="font-display font-extrabold text-5xl md:text-7xl text-zinc-100 leading-[1.05] tracking-tight max-w-3xl">
          From brief
          <br />
          <span className="text-amber-400">to content pack.</span>
          <br />
          In seconds.
        </h1>

        <p className="mt-6 text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed">
          Stop spending days turning campaign briefs into copy assets.
          Generate a full pack of channel-ready content in one click.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/campaign/new"
            className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold px-8 py-4 rounded-lg transition-colors text-base"
          >
            Generate now — no account needed
          </Link>
          <Link
            href="/login"
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-medium px-8 py-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors text-base"
          >
            Sign in with Google
          </Link>
        </div>

        {/* What you get */}
        <div className="mt-20 max-w-2xl w-full">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-6 font-medium">
            What you get
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {OUTPUTS.map(item => (
              <div
                key={item.label}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-left"
              >
                <span className="text-amber-400 text-xs mb-1 block">{item.icon}</span>
                <span className="text-zinc-300 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-zinc-700 border-t border-zinc-900">
        Campaign Brief → Content Pack — Free to generate. Sign in to save.
      </footer>
    </div>
  )
}
