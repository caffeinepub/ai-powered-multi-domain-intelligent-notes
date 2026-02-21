import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { FileText, Upload, LogOut, Heart, Calendar, Brain, Bell } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const routerState = useRouterState();

  const isAuthenticated = !!identity;
  const currentPath = routerState.location.pathname;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleNavigation = (path: string) => {
    navigate({ to: path });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-amber-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleNavigation('/')}
                className="flex items-center gap-2 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Smart Notes AI
                </span>
              </button>

              {isAuthenticated && userProfile && (
                <nav className="hidden lg:flex items-center gap-1">
                  <Button
                    variant={currentPath === '/notes' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleNavigation('/notes')}
                    className={currentPath === '/notes' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' : ''}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Notes
                  </Button>
                  <Button
                    variant={currentPath === '/reports' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleNavigation('/reports')}
                    className={currentPath === '/reports' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' : ''}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Documents
                  </Button>
                  <Button
                    variant={currentPath === '/timetable' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleNavigation('/timetable')}
                    className={currentPath === '/timetable' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' : ''}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Timetable
                  </Button>
                  <Button
                    variant={currentPath === '/quizzes' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleNavigation('/quizzes')}
                    className={currentPath === '/quizzes' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' : ''}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Quizzes
                  </Button>
                  <Button
                    variant={currentPath === '/reminders' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleNavigation('/reminders')}
                    className={currentPath === '/reminders' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' : ''}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Reminders
                  </Button>
                </nav>
              )}
            </div>

            {isAuthenticated && userProfile && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">{userProfile.name}</p>
                  <p className="text-xs text-muted-foreground">Logged in</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full border-amber-300 hover:bg-amber-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-180px)]">{children}</main>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-t border-amber-200/50 dark:border-gray-700/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              © {new Date().getFullYear()} Built with{' '}
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
