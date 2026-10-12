import { LayoutDashboard } from 'lucide-react';
import PagePlaceholder from '@/components/page-placeholder';

export default function Dashboard() {
  return (
    <PagePlaceholder
      title="Dashboard"
      eyebrow="OVERVIEW"
      description="A clear starting point for the people supporting students across their college journey."
      icon={LayoutDashboard}
      index="dashboard"
    />
  );
}
