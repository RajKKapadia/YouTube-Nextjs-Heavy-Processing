import { Queue, QueueEvents } from 'bullmq'
import IORedis from 'ioredis'

import { JobData } from '@/types'

const connection = new IORedis(process.env.REDIS_URL!, { maxRetriesPerRequest: null })

export const myQueue = new Queue<JobData>('my-queue', { connection })
export const queueEvents = new QueueEvents('my-queue', { connection })

export const addJobToQueue = async ({ data }: { data: JobData }) => {
    const job = await myQueue.add('heavy-task', data)
    return job
}

export const getJobStatus = async ({ id }: { id: string }) => {
    const job = await myQueue.getJob(id)
    if (!job) return null
    return {
        id: job.id,
        status: await job.getState(),
        progress: job.progress,
        result: job.returnvalue,
    }
}
