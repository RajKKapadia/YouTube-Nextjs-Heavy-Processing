import { Worker } from 'bullmq'
import IORedis from 'ioredis'

import { JobData } from '@/types'

const connection = new IORedis(process.env.REDIS_URL!, { maxRetriesPerRequest: null })

const worker = new Worker<JobData>(
    'my-queue',
    async (job) => {

        const data = job.data

        for (let i = 0; i <= 100; i += 10) {
            await new Promise((r) => setTimeout(r, 500))
            job.updateProgress(i)
        }

        return { message: 'Done processing', data: job.data }
    },
    { connection }
)

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed!`)
})

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err)
})
