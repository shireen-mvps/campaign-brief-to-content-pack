'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CHANNELS = ['LinkedIn', 'Instagram', 'X (Twitter)', 'Email', 'Paid Ads']
const GOALS = ['Launch', 'Awareness', 'Conversion', 'Retention']
const TONES = ['Professional', 'Conversational', 'Bold', 'Playful', 'Inspirational']

export function BriefForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    product_name: '',
    target_audience: '',
    campaign_goal: 'Launch',
    key_message: '',
    channels: [] as string[],
    tone_of_voice: 'Professional',
  })

  const toggleChannel = (channel: string) => {
    setForm(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.channels.length === 0) {
      setError('Select at least one channel.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Generation failed')
      }

      const { id } = await res.json()
      router.push(`/result/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-colors'
  const labelClass = 'block text-xs font-medium text-zinc-400 uppercase tracking-widest mb-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Campaign Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Summer Product Launch"
            className={inputClass}
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass}>Product / Service Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Acme Pro Plan"
            className={inputClass}
            value={form.product_name}
            onChange={e => setForm(prev => ({ ...prev, product_name: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Target Audience</label>
        <input
          type="text"
          required
          placeholder="e.g. B2B SaaS founders, 30–50, bootstrapped"
          className={inputClass}
          value={form.target_audience}
          onChange={e => setForm(prev => ({ ...prev, target_audience: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Campaign Goal</label>
          <select
            className={inputClass}
            value={form.campaign_goal}
            onChange={e => setForm(prev => ({ ...prev, campaign_goal: e.target.value }))}
          >
            {GOALS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tone of Voice</label>
          <select
            className={inputClass}
            value={form.tone_of_voice}
            onChange={e => setForm(prev => ({ ...prev, tone_of_voice: e.target.value }))}
          >
            {TONES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Key Message / USP
          <span className="ml-2 text-zinc-600 normal-case tracking-normal">
            ({form.key_message.length}/300)
          </span>
        </label>
        <textarea
          required
          rows={3}
          maxLength={300}
          placeholder="What's the one thing your audience must walk away knowing?"
          className={`${inputClass} resize-none`}
          value={form.key_message}
          onChange={e => setForm(prev => ({ ...prev, key_message: e.target.value }))}
        />
      </div>

      <div>
        <label className={labelClass}>Channels</label>
        <div className="flex flex-wrap gap-3">
          {CHANNELS.map(channel => {
            const selected = form.channels.includes(channel)
            return (
              <button
                key={channel}
                type="button"
                onClick={() => toggleChannel(channel)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                  selected
                    ? 'bg-amber-400/10 border-amber-400/60 text-amber-400'
                    : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                {channel}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating your content pack…
          </>
        ) : (
          'Generate Content Pack →'
        )}
      </button>
    </form>
  )
}
