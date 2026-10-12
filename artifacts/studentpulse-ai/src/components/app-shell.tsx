import { Link, useLocation } from 'wouter';
import {
  Activity,
  BookOpenCheck,
  Building2,
  ChartNoAxesCombined,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  MapPinned,
  UsersRound,
} from 'lucide-react';
import type { ReactNode } from 'react';

const navigation = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Students', href: '/students', icon: UsersRound },
  { label: 'Academic Analytics', href: '/academic-analytics', icon: ChartNoAxesCombined },
  { label: 'Placement', href: '/placement', icon: MapPinned },
  { label: 'Interventions', href: '/interventions', icon: Activity },
  { label: 'College Insights', href: '/college-insights', icon: Building2 },
];

function Brand() {
  return (
    <div className="flex items-center gap-3" data-testid="brand-studentpulse">
      <span className="brand-mark" aria-hidden="true">
        <GraduationCap size={19} strokeWidth={1.9} />
      </span>
      <span className="brand-wordmark">
        <span>StudentPulse</span>
        <span className="brand-ai">AI</span>
      </span>
    </div>
  );
}

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  const [location] = useLocation();
  return (
    <nav
      aria-label={mobile ? 'Primary navigation' : 'Main navigation'}
      className={mobile ? 'mobile-navigation' : 'sidebar-navigation'}
      data-testid={mobile ? 'mobile-navigation' : 'sidebar-navigation'}
    >
      {navigation.map(({ label, href, icon: Icon }) => {
        const active = location === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`navigation-link${active ? ' navigation-link-active' : ''}`}
            data-testid={`link-nav-${href === '/' ? 'dashboard' : href.slice(1)}`}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
            {active && <span className="active-indicator" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const current = navigation.find((item) => item.href === location);

  return (
    <div className="app-frame">
      <aside className="desktop-sidebar">
        <div className="sidebar-brand"><Brand /></div>
        <div className="sidebar-label">WORKSPACE</div>
        <NavigationLinks />
        <div className="sidebar-footer">
          <div className="support-note">
            <span className="support-icon"><LifeBuoy size={17} /></span>
            <div>
              <p className="support-title">A clearer path forward</p>
              <p className="support-copy">One workspace for student success.</p>
            </div>
          </div>
          <div className="sidebar-rule" />
          <div className="footer-product">
            <BookOpenCheck size={15} aria-hidden="true" />
            <span>Student success workspace</span>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="mobile-brand"><Brand /></div>
          <div className="breadcrumb">
            <span>Workspace</span><span className="breadcrumb-slash">/</span>
            <span className="breadcrumb-current">{current?.label ?? 'Page not found'}</span>
          </div>
          <div className="topbar-note">
            <span className="status-dot" />
            <span>Foundation workspace</span>
          </div>
        </header>
        <div className="notice-bar" role="note" data-testid="notice-demo-data">
          <Activity size={14} aria-hidden="true" />
          <span><strong>Demonstration workspace.</strong> No live college data is connected; sample records and statistics are illustrative. Changes are held only in client memory and are lost on refresh.</span>
        </div>
        <div className="mobile-nav-wrap"><NavigationLinks mobile /></div>
        <main className="page-content" data-testid="main-content">
          {children}
        </main>
        <footer className="page-footer">
          <span>StudentPulse AI</span>
          <span className="footer-separator" />
          <span>Student success, in one place.</span>
        </footer>
      </div>
    </div>
  );
}
