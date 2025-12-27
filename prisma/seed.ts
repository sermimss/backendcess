import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Ejecutando seed...')

  // Usuario admin
  await prisma.user.upsert({
    where: { email: 'admin@cess.local' },
    update: {},
    create: {
      email: 'admin@cess.local',
      password: '$2b$10$examplehashhere',
      role: 'admin'
    }
  })

  const carreras: Array<{
    name: string;
    durationMonths: number;
    planType: 'CUATRIMESTRAL' | 'SEMESTRAL' | 'SEMANAL';
    periodicPayment: number;
    costTitle: number;
    inscription: number;
  }> = [
    {
      name: 'Licenciatura en Enfermería por Nivelación',
      durationMonths: 12,
      planType: 'CUATRIMESTRAL',
      periodicPayment: 2200,
      costTitle: 40000,
      inscription: 2200
    },
    {
      name: 'Licenciatura en Radiología e Imagen por Nivelación',
      durationMonths: 12,
      planType: 'CUATRIMESTRAL',
      periodicPayment: 2200,
      costTitle: 40000,
      inscription: 2200
    },
    {
      name: 'Técnico en Enfermería General',
      durationMonths: 24,
      planType: 'CUATRIMESTRAL',
      periodicPayment: 1900,
      costTitle: 17000,
      inscription: 1900
    },
    {
      name: 'Enfermero Auxiliar',
      durationMonths: 12,
      planType: 'SEMESTRAL',
      periodicPayment: 1000,
      costTitle: 4500,
      inscription: 900
    },
    {
      name: 'Podología',
      durationMonths: 6,
      planType: 'SEMANAL',
      periodicPayment: 1000,
      costTitle: 4500,
      inscription: 900
    },
    {
      name: 'Enfermería Industrial',
      durationMonths: 6,
      planType: 'SEMANAL',
      periodicPayment: 1000,
      costTitle: 4500,
      inscription: 900
    },
    {
      name: 'Enfermería Quirúrgica',
      durationMonths: 6,
      planType: 'SEMANAL',
      periodicPayment: 1000,
      costTitle: 4500,
      inscription: 900
    },
    {
      name: 'Técnico en Atención Médica Prehospitalaria o Paramédico',
      durationMonths: 15,
      planType: 'SEMANAL',
      periodicPayment: 1000,
      costTitle: 4500,
      inscription: 900
    }
  ]

  for (const c of carreras) {
    const existing = await prisma.career.findFirst({
      where: { name: c.name }
    })

    if (!existing) {
      await prisma.career.create({
        data: c
      })
    }
  }

  console.log('✅ Seed completado correctamente')
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect())
