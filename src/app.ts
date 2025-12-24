import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import studentsRoutes from './routes/students'
import careersRoutes from './routes/careers'
import enrollmentsRoutes from './routes/enrollments'
import paymentsRoutes from './routes/payments'

export const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/students', studentsRoutes)
app.use('/api/careers', careersRoutes)
app.use('/api/enrollments', enrollmentsRoutes)
app.use('/api/payments', paymentsRoutes)

app.get('/', (req, res) => res.json({ ok: true }))