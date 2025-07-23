'use client'

import { useEffect, useState } from 'react'

export default function JobStatusPage() {
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startJob = async () => {
    setIsLoading(true)
    const res = await fetch('/api/jobs', {
      method: 'POST',
      body: JSON.stringify({ userId: 'abcd-1234' }),
    })
    const data = await res.json()
    setJobId(data.id)
    setStatus(null)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!jobId) return

    const interval = setInterval(async () => {
      const res = await fetch(`/api/jobs/status/${jobId}`)
      const data = await res.json()
      setStatus(data)

      if (data.status === 'completed') {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [jobId])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold">Heavy Job Processor</h1>

        {!jobId && (
          <button
            onClick={startJob}
            disabled={isLoading}
          >
            {isLoading ? 'Starting...' : 'Start Job'}
          </button>
        )}

        {jobId && status && (
          <div className="space-y-2">
            <p>Job ID: {jobId}</p>
            <p>
              Status:{' '}
              <span className="font-semibold capitalize">
                {status.status === 'completed'
                  ? 'Completed'
                  : status.status}
              </span>
            </p>
            <div className="w-64 mx-auto rounded-full h-4 overflow-hidden">
              <div
                className="h-4 transition-all duration-500"
                style={{ width: `${status.progress || 0}%` }}
              ></div>
            </div>
            <p>{status.progress || 0}%</p>
          </div>
        )}
      </div>
    </div>
  )
}
