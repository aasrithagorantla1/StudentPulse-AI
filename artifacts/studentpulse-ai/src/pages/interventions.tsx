import { Activity } from 'lucide-react';
import PagePlaceholder from '@/components/page-placeholder';

export default function Interventions() {
  return (
    <PagePlaceholder
      title="Interventions"
      eyebrow="STUDENT CARE"
      description="A future space for coordinated interventions and responsive student support."
      icon={Activity}
      index="interventions"
    />
  );
}
