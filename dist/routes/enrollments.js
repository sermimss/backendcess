"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Crear inscripción -> genera esquema de pagos automático
router.post('/', async (req, res) => {
    const { studentId, careerId, startDate } = req.body;
    const career = await prisma.career.findUnique({ where: { id: Number(careerId) } });
    if (!career)
        return res.status(400).json({ error: 'career not found' });
    const sDate = new Date(startDate);
    // Calcular endDate sumando durationMonths
    const endDate = new Date(sDate);
    endDate.setMonth(endDate.getMonth() + career.durationMonths);
    const enrollment = await prisma.enrollment.create({
        data: { studentId: Number(studentId), careerId: Number(careerId), startDate: sDate, endDate }
    });
    // Generar pagos dependiendo del planType
    const payments = generatePaymentSchedule(enrollment.id, sDate, career);
    for (const p of payments) {
        await prisma.payment.create({ data: p });
    }
    const full = await prisma.enrollment.findUnique({ where: { id: enrollment.id }, include: { payments: true } });
    res.json(full);
});
function generatePaymentSchedule(enrollmentId, startDate, career) {
    const payments = [];
    const plan = career.planType;
    let numPayments = 0;
    let intervalDays = 30;
    if (plan === 'cuatrimestral') {
        numPayments = Math.ceil(career.durationMonths / 4);
        intervalDays = 30 * 4;
    }
    else if (plan === 'semestral') {
        numPayments = Math.ceil(career.durationMonths / 6);
        intervalDays = 30 * 6;
    }
    else if (plan === 'semanal') {
        numPayments = Math.ceil((career.durationMonths * 30) / 7);
        intervalDays = 7;
    }
    else { // mensual
        numPayments = career.durationMonths;
        intervalDays = 30;
    }
    // División simple: costTitle / numPayments as extra, plus periodicPayment for recurring
    const baseAmount = career.periodicPayment;
    for (let i = 0; i < numPayments; i++) {
        const due = new Date(startDate);
        due.setDate(due.getDate() + intervalDays * i);
        payments.push({ enrollmentId, dueDate: due, amount: baseAmount });
    }
    return payments;
}
exports.default = router;
