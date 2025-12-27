"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
/**
 * POST /api/students
 * Crear un alumno
 */
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;
        // Validación básica
        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                error: 'firstName, lastName y email son obligatorios'
            });
        }
        const student = await prisma_1.default.student.create({
            data: {
                firstName,
                lastName,
                email,
                phone
            }
        });
        return res.status(201).json(student);
    }
    catch (error) {
        console.error('Error creating student:', error);
        // Error típico: email duplicado
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Ya existe un alumno con ese email'
            });
        }
        return res.status(500).json({
            error: 'Error interno al crear el alumno'
        });
    }
});
/**
 * GET /api/students
 * Listar alumnos (con filtros opcionales)
 */
router.get('/', async (req, res) => {
    try {
        const { careerId, startDate, endDate } = req.query;
        // Por ahora devolvemos todos
        // (luego aplicaremos filtros reales)
        const students = await prisma_1.default.student.findMany({
            include: {
                enrollments: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.json(students);
    }
    catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({
            error: 'Error al obtener los alumnos'
        });
    }
});
exports.default = router;
