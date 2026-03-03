import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface BriefData {
  title: string
  product_name: string
  target_audience: string
  campaign_goal: string
  key_message: string
  channels: string[]
  tone_of_voice: string
}

export interface ContentItem {
  text: string
  funnel_stage: 'awareness' | 'consideration' | 'conversion'
  channel?: string
}

export interface ContentPack {
  headlines: ContentItem[]
  email_subjects: ContentItem[]
  social_captions: ContentItem[]
  cta_options: ContentItem[]
  ad_hooks: ContentItem[]
}

export async function generateContentPack(brief: BriefData): Promise<ContentPack> {
  const systemPrompt =
    'You are a B2B marketing copywriter. Given a campaign brief, return a structured content pack as valid JSON only. Be specific, direct, and channel-appropriate. No explanation — output only the JSON object.'

  const userPrompt = `Campaign Brief:
Product: ${brief.product_name}
Audience: ${brief.target_audience}
Goal: ${brief.campaign_goal}
Key message: ${brief.key_message}
Channels: ${brief.channels.join(', ')}
Tone: ${brief.tone_of_voice}

Generate:
- 5 headline variations
- 5 email subject lines
- 2 social captions per channel (${brief.channels.join(', ')})
- 5 CTA options
- 4 ad hooks

Tag each item with funnel_stage (awareness | consideration | conversion).

Return as JSON:
{
  "headlines": [{"text": "...", "funnel_stage": "..."}],
  "email_subjects": [{"text": "...", "funnel_stage": "..."}],
  "social_captions": [{"text": "...", "channel": "...", "funnel_stage": "..."}],
  "cta_options": [{"text": "...", "funnel_stage": "..."}],
  "ad_hooks": [{"text": "...", "channel": "paid", "funnel_stage": "..."}]
}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected Claude response type')

  const text = block.text.trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in Claude response')

  return JSON.parse(jsonMatch[0]) as ContentPack
}
