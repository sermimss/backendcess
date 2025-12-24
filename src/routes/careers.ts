
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req, res) => {
  const careers = await prisma.career.findMany()
  res.json(careers)
})

export default router