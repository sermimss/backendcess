import { Router, Request, Response } from 'express'
import { PrismaClient, PlanType } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// ===================================================
// POST /enrollments
// Crear inscripción + generar pagos automáticamente
// ===================================================
router.post('/', async (req: Request, res: Response) => {
  try {
    const { studentId, careerId, startDate } = req.body

    if (!studentId || !careerId || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // 1️⃣ Validar carrera
    const career = await prisma.career.findUnique({
      where: { id: Number(careerId) }
    })

    if (!career) {
      return res.status(400).json({ error: 'Career not found' })
    }

    // 2️⃣ Calcular fechas
    const sDate = new Date(startDate)
    const endDate = new Date(sDate)
    endDate.setMonth(endDate.getMonth() + career.durationMonths)

    // 3️⃣ Crear inscripción
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: Number(studentId),
        careerId: Number(careerId),
        startDate: sDate,
        endDate
      }
    })

    // 4️⃣ Generar pagos
    const payments = generatePaymentSchedule(
      enrollment.id,
      sDate,
      career.planType,
      career.durationMonths,
      career.periodicPayment
    )

    await prisma.payment.createMany({
      data: payments
    })

    // 5️⃣ Respuesta completa
    const result = await prisma.enrollment.findUnique({
      where: { id: enrollment.id },
      include: {
        student: true,
        career: true,
        payments: true
      }
    })

    res.status(201).json(result)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error creating enrollment' })
  }
})

// ===================================================
// GET /enrollments
// Listar inscripciones
// ===================================================
router.get('/', async (_req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: true,
        career: true,
        payments: true
      }
    })

    res.json(enrollments)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching enrollments' })
  }
})

// ===================================================
// Generador de pagos (LÓGICA CLARA Y AISLADA)
// ===================================================
function generatePaymentSchedule(
  enrollmentId: number,
  startDate: Date,
  planType: PlanType,
  durationMonths: number,
  periodicPayment: number
) {
  const payments: {
    enrollmentId: number
    dueDate: Date
    amount: number
    paid: boolean
  }[] = []

  let numberOfPayments = 0
  let intervalDays = 30

  switch (planType) {
    case 'SEMANAL':
      numberOfPayments = Math.ceil((durationMonths * 30) / 7)
      intervalDays = 7
      break

    case 'MENSUAL':
      numberOfPayments = durationMonths
      intervalDays = 30
      break

    case 'CUATRIMESTRAL':
      numberOfPayments = Math.ceil(durationMonths / 4)
      intervalDays = 120
      break

    case 'SEMESTRAL':
      numberOfPayments = Math.ceil(durationMonths / 6)
      intervalDays = 180
      break
  }

  for (let i = 0; i < numberOfPayments; i++) {
    const dueDate = new Date(startDate)
    dueDate.setDate(dueDate.getDate() + intervalDays * i)

    payments.push({
      enrollmentId,
      dueDate,
      amount: periodicPayment,
      paid: false
    })
  }

  return payments
}

export default router
