"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// ===================================================
// POST /enrollments
// Crear inscripción + generar pagos automáticamente
// ===================================================
router.post('/', async (req, res) => {
    try {
        const { student, careerId, startDate } = req.body;
        if (!student ||
            !student.firstName ||
            !student.lastName ||
            !careerId ||
            !startDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // 1️⃣ Buscar o crear alumno
        let newStudent = await prisma_1.default.student.findUnique({
            where: { email: student.email }
        });
        if (!newStudent) {
            newStudent = await prisma_1.default.student.create({
                data: {
                    firstName: student.firstName,
                    lastName: student.lastName,
                    email: student.email,
                    phone: student.phone
                }
            });
        }
        // 2️⃣ Obtener carrera
        const career = await prisma_1.default.career.findUnique({
            where: { id: Number(careerId) }
        });
        if (!career) {
            return res.status(404).json({ error: 'Career not found' });
        }
        // 3️⃣ Validar y calcular fechas
        const sDate = new Date(startDate);
        if (isNaN(sDate.getTime()))
            return res.status(400).json({ error: 'Invalid startDate' });
        // validación durationMonths y periodicPayment...
        const endDate = new Date(sDate);
        endDate.setMonth(endDate.getMonth() + career.durationMonths);
        // 4️⃣ Crear inscripción
        const enrollment = await prisma_1.default.enrollment.create({
            data: {
                studentId: newStudent.id,
                careerId: career.id,
                startDate: sDate,
                endDate
            }
        });
        // 5️⃣ Generar pagos (usar plan de la carrera y crear pagos en transacción)
        const payments = generatePaymentSchedule(enrollment.id, sDate, career.planType, career.durationMonths, career.periodicPayment);
        if (payments.length > 0) {
            await prisma_1.default.$transaction(payments.map(p => prisma_1.default.payment.create({ data: p })));
        }
        // 6️⃣ Respuesta completa
        const fullEnrollment = await prisma_1.default.enrollment.findUnique({
            where: { id: enrollment.id },
            include: {
                student: true,
                career: true,
                payments: true
            }
        });
        res.status(201).json(fullEnrollment);
    }
    catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).json({ error: 'Error creating enrollment' });
    }
});
// ===================================================
// GET /enrollments
// Listar inscripciones
// ===================================================
router.get('/', async (_req, res) => {
    try {
        const enrollments = await prisma_1.default.enrollment.findMany({
            include: {
                student: true,
                career: true,
                payments: true
            }
        });
        res.json(enrollments);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching enrollments' });
    }
});
// ===================================================
// Generador de pagos (LÓGICA CLARA Y AISLADA)
// ===================================================
function generatePaymentSchedule(enrollmentId, startDate, planType, durationMonths, periodicPayment) {
    const payments = [];
    let numberOfPayments = 0;
    let intervalDays = null;
    let intervalMonths = null;
    switch (planType) {
        case 'SEMANAL':
            numberOfPayments = Math.ceil((durationMonths * 30) / 7);
            intervalDays = 7;
            break;
        case 'MENSUAL':
            numberOfPayments = durationMonths;
            intervalMonths = 1;
            break;
        case 'CUATRIMESTRAL':
            numberOfPayments = Math.ceil(durationMonths / 4);
            intervalMonths = 4;
            break;
        case 'SEMESTRAL':
            numberOfPayments = Math.ceil(durationMonths / 6);
            intervalMonths = 6;
            break;
    }
    for (let i = 0; i < numberOfPayments; i++) {
        const dueDate = new Date(startDate);
        if (intervalMonths !== null) {
            dueDate.setMonth(dueDate.getMonth() + intervalMonths * i);
        }
        else {
            dueDate.setDate(dueDate.getDate() + intervalDays * i);
        }
        payments.push({
            enrollmentId,
            dueDate,
            amount: periodicPayment,
            paid: false
        });
    }
    return payments;
}
exports.default = router;
