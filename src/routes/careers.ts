import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

/**
 * GET /api/careers
 * Listar todas las carreras / planes de estudio
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const careers = await prisma.career.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return res.json(careers)
  } catch (error) {
    console.error('Error fetching careers:', error)
    return res.status(500).json({
      error: 'Error al obtener las carreras'
    })
  }
})

export default router
