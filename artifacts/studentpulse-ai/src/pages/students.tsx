import { UsersRound } from 'lucide-react';
import PagePlaceholder from '@/components/page-placeholder';

export default function Students() {
  return (
    <PagePlaceholder
      title="Students"
      eyebrow="STUDENT SUPPORT"
      description="A dedicated home for future student-progress and support workflows."
      icon={UsersRound}
      index="students"
    />
  );
}
