import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const router = Router()

// Crear alumno
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone } = req.body
  const student = await prisma.student.create({ data: { firstName, lastName, email, phone } })
  res.json(student)
})

// Listar con filtros
router.get('/', async (req, res) => {
  const { careerId, startDate, endDate } = req.query
  // Si hay filtros por fechas o carrera, buscar enrollments y devolver estudiantes relacionados
  // Implementación simplificada: devolver todos los estudiantes
  const students = await prisma.student.findMany({ include: { enrollments: true } })
  res.json(students)
})

export default router