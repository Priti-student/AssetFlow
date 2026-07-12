import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Command,
  Sun,
  Moon,
  Monitor,
  Menu,
  Plus,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationCount = 3;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search Bar */}
      <div className="hidden sm:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets, employees, bookings..."
            className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
            onFocus={() => setShowSearch(true)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 rounded-md border border-border/50 px-1.5 py-0.5">
            <Command className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Quick Create */}
        <Button
          variant="glass"
          size="sm"
          className="hidden md:flex gap-2"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Quick Create
        </Button>

        {/* Theme Switcher */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
              const currentIndex = themes.indexOf(theme);
              const nextTheme = themes[(currentIndex + 1) % themes.length];
              setTheme(nextTheme);
            }}
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {notificationCount}
              </span>
            )}
          </Button>
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2 h-10 px-2"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium">
              {user?.firstName || 'User'}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-lg p-1.5"
                onClick={() => setShowProfile(false)}
              >
                <div className="px-2 py-2 mb-1">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="border-t border-border/50 my-1" />
                {[
                  { icon: User, label: 'Profile', path: ROUTES.PROFILE },
                  { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
                  { icon: Settings, label: 'Settings', path: ROUTES.SETTINGS },
                  { icon: HelpCircle, label: 'Help', path: ROUTES.HELP },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-accent/5 hover:text-foreground transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-border/50 my-1" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}