import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/posts')) return 'Posts';
  return '';
}

export function App() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-56 shrink-0 border-r bg-card">
        <div className="flex h-14 items-center px-4 border-b">
          <span className="text-lg font-semibold tracking-tight">Plan Admin</span>
        </div>
        <nav className="p-3 space-y-1">
          <NavLink
            to="/posts"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <FileText className="h-4 w-4" />
            Posts
          </NavLink>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-6">
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
