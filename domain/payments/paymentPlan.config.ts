import { PlanConfig } from './paymentPlan.types'

export const PAYMENT_PLAN_CONFIG: Record<string, PlanConfig> = {
  GENERAL_NURSING: {
    fees: 36,
    feeType: 'Mensualidad',
    prices: { enrollment: 1900, reEnrollment: 1900, fee: 1900 },
    reEnrollmentSchedule: [4,8,12,16,20,24,28,32],
  },
  LEVELING_DEGREE: {
    fees: 12,
    feeType: 'Mensualidad',
    prices: { enrollment: 2200, reEnrollment: 2200, fee: 2200 },
    reEnrollmentSchedule: [4,8],
  },
  PODIATRY: {
    fees: 27,
    feeType: 'Semanalidad',
    prices: { enrollment: 900, reEnrollment: 0, fee: 250 },
    reEnrollmentSchedule: [],
  },
  NURSING_ASSISTANT: {
    fees: 54,
    feeType: 'Semanalidad',
    prices: { enrollment: 900, reEnrollment: 900, fee: 250 },
    reEnrollmentSchedule: [27],
  },
  PREHOSPITAL_CARE: {
    fees: 54,
    feeType: 'Semanalidad',
    prices: { enrollment: 900, reEnrollment: 900, fee: 250 },
    reEnrollmentSchedule: [27],
  },
  SURGICAL_NURSING: {
    fees: 27,
    feeType: 'Semanalidad',
    prices: { enrollment: 900, reEnrollment: 0, fee: 250 },
    reEnrollmentSchedule: [],
  },
  INDUSTRIAL_NURSING: {
    fees: 27,
    feeType: 'Semanalidad',
    prices: { enrollment: 900, reEnrollment: 0, fee: 250 },
    reEnrollmentSchedule: [],
  },
}
