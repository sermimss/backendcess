"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Marcar pago
router.post('/:id/pay', async (req, res) => {
    const id = Number(req.params.id);
    const { paidAt } = req.body;
    const payment = await prisma.payment.update({ where: { id }, data: { paid: true, paidAt: paidAt ? new Date(paidAt) : new Date() } });
    res.json(payment);
});
// Obtener pagos vencidos
router.get('/overdue', async (req, res) => {
    const now = new Date();
    const overdue = await prisma.payment.findMany({ where: { paid: false, dueDate: { lt: now } }, include: { enrollment: { include: { student: true, career: true } } } });
    res.json(overdue);
});
exports.default = router;
