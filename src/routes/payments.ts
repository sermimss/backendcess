import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * GET /api/payments
 * Obtiene todos los pagos con su inscripción, alumno y carrera
 */
router.get('/', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: {
        dueDate: 'asc',
      },
      include: {
        enrollment: {
          include: {
            student: true,
            career: true,
          },
        },
      },
    });

    res.json(payments);
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ message: 'Error al obtener pagos' });
  }
});

/**
 * GET /api/payments/overdue
 * Obtiene pagos vencidos y no pagados
 */
router.get('/overdue', async (req, res) => {
  try {
    const today = new Date();

    const overduePayments = await prisma.payment.findMany({
      where: {
        paid: false,
        dueDate: {
          lt: today,
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
      include: {
        enrollment: {
          include: {
            student: true,
            career: true,
          },
        },
      },
    });

    res.json(overduePayments);
  } catch (error) {
    console.error('Error al obtener pagos vencidos:', error);
    res.status(500).json({ message: 'Error al obtener pagos vencidos' });
  }
});

/**
 * PATCH /api/payments/:id/pay
 * Marca un pago como pagado
 */
router.patch('/:id/pay', async (req, res) => {
  try {
    const paymentId = Number(req.params.id);

    if (isNaN(paymentId)) {
      return res.status(400).json({ message: 'ID de pago inválido' });
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paid: true,
        paidAt: new Date(),
      },
    });

    res.json(payment);
  } catch (error) {
    console.error('Error al marcar pago como pagado:', error);
    res.status(500).json({ message: 'Error al actualizar el pago' });
  }
});

export default router;
