import { Position } from '@/lib/generated/prisma/enums';
import type { Position as PositionValue } from '@/lib/generated/prisma/enums';

type PositionLabels = {
  en: string;
  th: string;
};

export const positionLabels: Record<PositionValue, PositionLabels> = {
  professor: { en: 'Professor', th: 'อาจารย์' },
  department_head: { en: 'Head of Department', th: 'หัวหน้าภาควิชา' },
  secretary: { en: 'Secretary', th: 'เลขานุการ' },
  hr: { en: 'Human Resources', th: 'บุคลากร' },
  academic: { en: 'Academic Affairs', th: 'งานวิชาการ' },
  finance: { en: 'Finance', th: 'การเงิน' },
  support_director: { en: 'Support Director', th: 'ผู้อำนวยการส่วนสนับสนุน' },
  vice_dean: { en: 'Vice Dean', th: 'รองคณบดี' },
  dean: { en: 'Dean', th: 'คณบดี' },
};

export function formatPositionLabel(
  position: string | null | undefined,
  language: 'en' | 'th' = 'en'
) {
  if (!position) return undefined;

  if (isPosition(position)) {
    return positionLabels[position][language];
  }

  return position;
}

function isPosition(position: string): position is PositionValue {
  return Object.values(Position).includes(position as PositionValue);
}
