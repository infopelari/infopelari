import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// GET: Fetch pending events untuk admin
export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: Approve or reject event
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createAdminClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { event_id, action, is_verified } = body;

    if (!event_id || !action) {
      return NextResponse.json(
        { error: 'event_id dan action diperlukan' },
        { status: 400 }
      );
    }

    let updateData: any = {};

    if (action === 'approve') {
      updateData.status = 'published';
      if (is_verified !== undefined) {
        updateData.is_verified = is_verified;
      }
    } else if (action === 'reject') {
      updateData.status = 'rejected';
    } else {
      return NextResponse.json(
        { error: 'Action tidak valid' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', event_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TODO: Send email notification ke panitia

    return NextResponse.json({
      success: true,
      message: `Event berhasil ${action === 'approve' ? 'disetujui' : 'ditolak'}`,
      event: data,
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update event (untuk edit dari admin)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createAdminClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { event_id, ...updateData } = body;

    if (!event_id) {
      return NextResponse.json(
        { error: 'event_id diperlukan' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', event_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Event berhasil diupdate',
      event: data,
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete event
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createAdminClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const event_id = searchParams.get('event_id');

    if (!event_id) {
      return NextResponse.json(
        { error: 'event_id diperlukan' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', event_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Event berhasil dihapus',
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
