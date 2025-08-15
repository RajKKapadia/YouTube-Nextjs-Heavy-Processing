import { getJobStatus } from '@/lib/queue'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const status = await getJobStatus({ id: id })
    if (!status) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    return NextResponse.json(status)
}
