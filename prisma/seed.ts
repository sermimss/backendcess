import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Usuario admin de ejemplo
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cess.local' },
    update: {},
    create: {
      email: 'admin@cess.local',
      password: '$2b$10$examplehashhere', // reemplazar por bcrypt hash real en producción
      role: 'admin'
    }
  })

  // Carreras y costos según tus memorias
  const carreras = [
    {
      name: 'Licenciatura en Enfermería por Nivelación',
      durationMonths: 12,
      planType: 'cuatrimestral',
      inscription: 2200,
      periodicPayment: 2200,
      costTitle: 40000,
      durationText: '1 año (3 cuatrimestres)'
    },
    {
      name: 'Licenciatura en Radiología e Imagen por Nivelación',
      durationMonths: 12,
      planType: 'cuatrimestral',
      inscription: 2200,
      periodicPayment: 2200,
      costTitle: 40000
    },
    {
      name: 'Técnico en Enfermería General',
      durationMonths: 24,
      planType: 'cuatrimestral',
      inscription: 1900,
      periodicPayment: 1900,
      costTitle: 17000
    },
    {
      name: 'Enfermero Auxiliar',
      durationMonths: 12,
      planType: 'semestral',
      inscription: 900,
      periodicPayment: 1000,
      costTitle: 4500
    },
    {
      name: 'Podología',
      durationMonths: 6,
      planType: 'semanal',
      inscription: 900,
      periodicPayment: 1000,
      costTitle: 4500
    },
    {
      name: 'Enfermería Industrial',
      durationMonths: 6,
      planType: 'semanal',
      inscription: 900,
      periodicPayment: 1000,
      costTitle: 4500
    },
    {
      name: 'Enfermería Quirúrgica',
      durationMonths: 6,
      planType: 'semanal',
      inscription: 900,
      periodicPayment: 1000,
      costTitle: 4500
    },
    {
      name: 'Técnico en Atención Médica Prehospitalaria o Paramédico',
      durationMonths: 15,
      planType: 'semanal',
      inscription: 900,
      periodicPayment: 1000,
      costTitle: 4500
    }
  ]

  for (const c of carreras) {
    await prisma.career.upsert({
      where: { name: c.name },
      update: {},
      create: c
    })
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())