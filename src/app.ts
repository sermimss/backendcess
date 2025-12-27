import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import studentsRoutes from './routes/students'
import careersRoutes from './routes/careers'
import enrollmentsRoutes from './routes/enrollments'
import paymentsRoutes from './routes/payments'
import prisma from './lib/prisma'

export const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/students', studentsRoutes)
app.use('/api/careers', careersRoutes)
app.use('/api/enrollments', enrollmentsRoutes)
app.use('/api/payments', paymentsRoutes)

// Healthcheck for load balancers / Render
app.get('/health', async (_req, res) => {
    try {
        // simple DB ping
        await prisma.$queryRaw`SELECT 1`
        res.json({ ok: true, db: 'ok' })
    } catch (err: any) {
        console.error('Healthcheck DB failed', err)
        res.status(500).json({ ok: false, db: 'error', error: String(err) })
    }
})

app.get('/', (req, res) => res.json({ ok: true }))