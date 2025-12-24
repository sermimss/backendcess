"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Crear alumno
router.post('/', async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;
    const student = await prisma.student.create({ data: { firstName, lastName, email, phone } });
    res.json(student);
});
// Listar con filtros
router.get('/', async (req, res) => {
    const { careerId, startDate, endDate } = req.query;
    // Si hay filtros por fechas o carrera, buscar enrollments y devolver estudiantes relacionados
    // Implementación simplificada: devolver todos los estudiantes
    const students = await prisma.student.findMany({ include: { enrollments: true } });
    res.json(students);
});
exports.default = router;
