"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
/**
 * GET /api/payments
 * Obtiene todos los pagos (opcional: por enrollmentId)
 */
router.get('/', async (req, res) => {
    try {
        const { enrollmentId } = req.query;
        const payments = await prisma_1.default.payment.findMany({
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
        });
        res.json(payments);
    }
    catch (error) {
        console.error('Error al obtener pagos:', error);
        res.status(500).json({ message: 'Error al obtener pagos' });
    }
});
/**
 * GET /api/payments/overdue
 * Obtiene pagos vencidos y no pagados
 */
router.get('/overdue', async (_req, res) => {
    try {
        const today = new Date();
        const overduePayments = await prisma_1.default.payment.findMany({
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
        });
        res.json(overduePayments);
    }
    catch (error) {
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
        const payment = await prisma_1.default.payment.findUnique({
            where: { id: paymentId }
        });
        if (!payment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }
        if (payment.paid) {
            return res.status(400).json({ message: 'El pago ya fue realizado' });
        }
        const updatedPayment = await prisma_1.default.payment.update({
            where: { id: paymentId },
            data: {
                paid: true,
                paidAt: new Date()
            }
        });
        res.json(updatedPayment);
    }
    catch (error) {
        console.error('Error al marcar pago como pagado:', error);
        res.status(500).json({ message: 'Error al actualizar el pago' });
    }
});
exports.default = router;
