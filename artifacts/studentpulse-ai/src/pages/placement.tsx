import { MapPinned } from 'lucide-react';
import PagePlaceholder from '@/components/page-placeholder';

export default function Placement() {
  return (
    <PagePlaceholder
      title="Placement"
      eyebrow="PLACEMENT"
      description="A future home for placement resources and student pathway support."
      icon={MapPinned}
      index="placement"
    />
  );
}
