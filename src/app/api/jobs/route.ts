import { NextRequest, NextResponse } from 'next/server'
import { addJobToQueue } from '@/lib/queue'
import { JobSchema } from '@/types'

export async function POST(req: NextRequest) {
    const rawBody = await req.text()
    const body = JSON.parse(rawBody)
    const { success, data: parsedBody } = JobSchema.safeParse(body)
    if (!success) {
        return NextResponse.json({ error: "Unsupported body" }, { status: 400 })
    }
    const job = await addJobToQueue({ data: { jobData: parsedBody } })
    return NextResponse.json({ id: job.id }, { status: 200 })
}
