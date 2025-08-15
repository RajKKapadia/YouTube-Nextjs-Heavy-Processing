import { Worker } from 'bullmq'

import { JobData } from '@/types'
import { redisClient } from '@/lib/redis'

const worker = new Worker<JobData>(
    'my-queue',
    async (job) => {
        const data = job.data
        for (let i = 0; i <= 100; i += 10) {
            await new Promise((r) => setTimeout(r, 500))
            await job.updateProgress(i)
        }
        return { message: 'Done processing', data: job.data }
    },
    { connection: redisClient }
)

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed!`)
})

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err)
})
