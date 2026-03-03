import { CopyButton } from '@/components/ui/CopyButton'
import type { ContentItem, ContentPack } from '@/lib/claude'

const FUNNEL_STYLES: Record<string, string> = {
  awareness: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  consideration: 'bg-violet-400/10 text-violet-400 border-violet-400/20',
  conversion: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
}

function FunnelBadge({ stage }: { stage: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-medium uppercase tracking-wider ${
        FUNNEL_STYLES[stage] ?? 'bg-zinc-700/50 text-zinc-400 border-zinc-700'
      }`}
    >
      {stage}
    </span>
  )
}

function ChannelBadge({ channel }: { channel: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded border border-zinc-700 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
      {channel}
    </span>
  )
}

function ContentRow({ item }: { item: ContentItem }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-800/60 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-zinc-200 text-sm leading-relaxed">{item.text}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <FunnelBadge stage={item.funnel_stage} />
          {item.channel && item.channel !== 'paid' && <ChannelBadge channel={item.channel} />}
          {item.channel === 'paid' && <ChannelBadge channel="Paid Ads" />}
        </div>
      </div>
      <CopyButton text={item.text} />
    </div>
  )
}

function Section({
  title,
  items,
  count,
}: {
  title: string
  items: ContentItem[]
  count?: number
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <h2 className="font-display font-semibold text-zinc-100 tracking-tight">{title}</h2>
        <span className="text-xs text-zinc-600 tabular-nums">{count ?? items.length} items</span>
      </div>
      <div className="px-5">
        {items.map((item, i) => (
          <ContentRow key={i} item={item} />
        ))}
      </div>
    </div>
  )
}

export function ContentPackView({ pack }: { pack: ContentPack }) {
  return (
    <div className="space-y-4">
      <Section title="Headlines" items={pack.headlines} />
      <Section title="Email Subject Lines" items={pack.email_subjects} />
      <Section title="Social Captions" items={pack.social_captions} />
      <Section title="CTA Options" items={pack.cta_options} />
      <Section title="Ad Hooks" items={pack.ad_hooks} />
    </div>
  )
}
