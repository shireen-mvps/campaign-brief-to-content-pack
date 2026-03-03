import { createSupabaseServerClient } from '@/lib/supabase'
import { generateContentPack } from '@/lib/claude'
import type { BriefData } from '@/lib/claude'
import { NextResponse } from 'next/server'

const VALID_CHANNELS = ['LinkedIn', 'Instagram', 'X (Twitter)', 'Email', 'Paid Ads']
const VALID_GOALS = ['Launch', 'Awareness', 'Conversion', 'Retention']
const VALID_TONES = ['Professional', 'Conversational', 'Bold', 'Playful', 'Inspirational']

export async function POST(request: Request) {
  const body = await request.json()
  const { title, product_name, target_audience, campaign_goal, key_message, channels, tone_of_voice } = body

  if (!title || !product_name || !target_audience || !key_message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!VALID_GOALS.includes(campaign_goal)) {
    return NextResponse.json({ error: 'Invalid campaign goal' }, { status: 400 })
  }
  if (!VALID_TONES.includes(tone_of_voice)) {
    return NextResponse.json({ error: 'Invalid tone of voice' }, { status: 400 })
  }
  if (!Array.isArray(channels) || channels.length === 0 || channels.some((c: string) => !VALID_CHANNELS.includes(c))) {
    return NextResponse.json({ error: 'Invalid channels' }, { status: 400 })
  }
  if (key_message.length > 300) {
    return NextResponse.json({ error: 'Key message too long' }, { status: 400 })
  }

  const brief: BriefData = { title, product_name, target_audience, campaign_goal, key_message, channels, tone_of_voice }

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  let output_data
  try {
    output_data = await generateContentPack(brief)
  } catch {
    return NextResponse.json({ error: 'Content generation failed. Please try again.' }, { status: 500 })
  }

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert({
      user_id: user?.id ?? null,
      title,
      brief_data: brief,
      output_data,
      status: 'complete',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to save campaign' }, { status: 500 })
  }

  return NextResponse.json({ id: campaign.id, output_data })
}

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, title, created_at, brief_data, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ campaigns })
}
