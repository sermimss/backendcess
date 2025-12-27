import { PlanType } from '@prisma/client'

export type FeeType = 'Mensualidad' | 'Semanalidad'

export interface PlanConfig {
  fees: number
  feeType: FeeType
  prices: {
    enrollment: number
    reEnrollment: number
    fee: number
  }
  reEnrollmentSchedule: number[]
}

export enum PaymentCategory {
  ENROLLMENT = 'ENROLLMENT',
  REENROLLMENT = 'REENROLLMENT',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
}
