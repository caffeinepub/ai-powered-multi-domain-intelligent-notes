import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useUserProfile';
import LandingPage from './pages/LandingPage';
import NotesPage from './pages/NotesPage';
import ReportsPage from './pages/ReportsPage';
import TimetablePage from './pages/TimetablePage';
import QuizzesPage from './pages/QuizzesPage';
import RemindersPage from './pages/RemindersPage';
import Layout from './components/Layout';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: LayoutWrapper,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes',
  component: NotesPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const timetableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/timetable',
  component: TimetablePage,
});

const quizzesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quizzes',
  component: QuizzesPage,
});

const remindersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reminders',
  component: RemindersPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  notesRoute,
  reportsRoute,
  timetableRoute,
  quizzesRoute,
  remindersRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  // Show profile setup modal for authenticated users without a profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Redirect authenticated users with profile away from landing page
  if (isAuthenticated && userProfile && window.location.pathname === '/') {
    navigate({ to: '/notes' });
  }

  if (isInitializing || (isAuthenticated && !isFetched)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppContent />
    </ThemeProvider>
  );
}
