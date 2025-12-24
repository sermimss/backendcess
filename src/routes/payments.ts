import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = Router()

/**
 * GET /api/payments
 * Obtiene todos los pagos (opcional: por enrollmentId)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { enrollmentId } = req.query

    const payments = await prisma.payment.findMany({
      where: enrollmentId
        ? { enrollmentId: Number(enrollmentId) }
        : undefined,
      orderBy: {
        dueDate: 'asc'
      },
      include: {
        enrollment: {
          include: {
            student: true,
            career: true
          }
        }
      }
    })

    res.json(payments)
  } catch (error) {
    console.error('Error al obtener pagos:', error)
    res.status(500).json({ message: 'Error al obtener pagos' })
  }
})

/**
 * GET /api/payments/overdue
 * Obtiene pagos vencidos y no pagados
 */
router.get('/overdue', async (_req: Request, res: Response) => {
  try {
    const today = new Date()

    const overduePayments = await prisma.payment.findMany({
      where: {
        paid: false,
        dueDate: { lt: today }
      },
      orderBy: {
        dueDate: 'asc'
      },
      include: {
        enrollment: {
          include: {
            student: true,
            career: true
          }
        }
      }
    })

    res.json(overduePayments)
  } catch (error) {
    console.error('Error al obtener pagos vencidos:', error)
    res.status(500).json({ message: 'Error al obtener pagos vencidos' })
  }
})

/**
 * PATCH /api/payments/:id/pay
 * Marca un pago como pagado
 */
router.patch('/:id/pay', async (req: Request, res: Response) => {
  try {
    const paymentId = Number(req.params.id)

    if (isNaN(paymentId)) {
      return res.status(400).json({ message: 'ID de pago inválido' })
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    })

    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' })
    }

    if (payment.paid) {
      return res.status(400).json({ message: 'El pago ya fue realizado' })
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paid: true,
        paidAt: new Date()
      }
    })

    res.json(updatedPayment)
  } catch (error) {
    console.error('Error al marcar pago como pagado:', error)
    res.status(500).json({ message: 'Error al actualizar el pago' })
  }
})

export default router
