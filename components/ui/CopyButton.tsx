'use client'

import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-md border transition-all duration-150 ${
        copied
          ? 'bg-emerald-400/10 border-emerald-400/40 text-emerald-400'
          : 'bg-transparent border-zinc-700 text-zinc-500 hover:border-amber-400/60 hover:text-amber-400'
      }`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
