import { Queue } from 'bullmq'

import { JobData } from '@/types'
import { redisClient } from '@/lib//redis'

export const myQueue = new Queue<JobData>('my-queue', { connection: redisClient })

export const addJobToQueue = async ({ data }: { data: JobData }) => {
    const job = await myQueue.add('my-queue', data)
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
