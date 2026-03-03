import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !campaign) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ campaign })
}

export async function PATCH(_request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await createSupabaseServiceClient()
    .from('campaigns')
    .update({ user_id: user.id })
    .eq('id', id)
    .is('user_id', null)

  if (error) {
    return NextResponse.json({ error: 'Claim failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
