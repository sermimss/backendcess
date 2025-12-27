import { PAYMENT_PLAN_CONFIG } from './paymentPlan.config'
import { PaymentCategory } from './paymentPlan.types'

export function calculateDueDate(
  startDate: Date,
  feeType: 'Mensualidad' | 'Semanalidad',
  index: number
): Date {
  const date = new Date(startDate)

  if (feeType === 'Mensualidad') {
    date.setMonth(date.getMonth() + index)
  } else {
    date.setDate(date.getDate() + index * 7)
  }

  return date
}

export function generatePaymentSchedule(
  enrollmentId: number,
  startDate: Date,
  studyPlanKey: string
) {
  const config = PAYMENT_PLAN_CONFIG[studyPlanKey]
  const reEnrollSet = new Set(config.reEnrollmentSchedule)

  return Array.from({ length: config.fees }).map((_, i) => {
    const isReEnrollment = reEnrollSet.has(i)

    return {
      enrollmentId,
      dueDate: calculateDueDate(startDate, config.feeType, i),
      amount: isReEnrollment
        ? config.prices.fee + config.prices.reEnrollment
        : config.prices.fee,
      category: isReEnrollment
        ? PaymentCategory.REENROLLMENT
        : config.feeType === 'Mensualidad'
          ? PaymentCategory.MONTHLY
          : PaymentCategory.WEEKLY,
    }
  })
}
