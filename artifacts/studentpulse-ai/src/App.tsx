import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppShell from '@/components/app-shell';
import Dashboard from '@/pages/dashboard';
import Students from '@/pages/students';
import AcademicAnalytics from '@/pages/academic-analytics';
import Placement from '@/pages/placement';
import Interventions from '@/pages/interventions';
import CollegeInsights from '@/pages/college-insights';
import NotFound from '@/pages/not-found';
import { StudentDataProvider } from '@/data/student-data';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <AppShell>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/students" component={Students} />
          <Route path="/academic-analytics" component={AcademicAnalytics} />
          <Route path="/placement" component={Placement} />
          <Route path="/interventions" component={Interventions} />
          <Route path="/college-insights" component={CollegeInsights} />
          <Route component={NotFound} />
        </Switch>
      </AppShell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StudentDataProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </StudentDataProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
