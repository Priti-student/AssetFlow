import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Package,
  ArrowRightLeft,
  GitCompareArrows,
  CalendarCheck,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  ChevronLeft,
  Search,
  ChevronDown,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/authStore';
import { APP_NAME, APP_VERSION, SIDEBAR_ITEMS } from '@/constants';
import { Button } from '@/components/ui/Button';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Building2, Package, ArrowRightLeft,
  GitCompareArrows, CalendarCheck, Wrench, ClipboardCheck,
  BarChart3, Bell, Settings, HelpCircle,
};

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedItems] = useState<string[]>(['/dashboard', '/assets']);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 72 : 280,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border/50 bg-background/80 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <span className="text-sm font-bold text-white">AF</span>
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {APP_NAME}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="shrink-0"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-lg border border-input/50 bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = iconMap[item.icon] || Package;
          const active = isActive(item.path);
          const isPinned = pinnedItems.includes(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground'
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary/10 dark:bg-primary/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                  active ? 'bg-primary/20' : 'group-hover:bg-accent/10'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isPinned && !isCollapsed && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary/50" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-border/50 p-3">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate capitalize">
                  {user?.role?.replace('_', ' ') || 'Loading...'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Version */}
      {!isCollapsed && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-muted-foreground/50">v{APP_VERSION}</p>
        </div>
      )}
    </motion.aside>
  );
}