import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { useLanguage } from "@/contexts/useLanguage";
import { ROUTES } from "@/routes/paths";
import { clearAuth } from "@/store/authSlice";
import { persistor } from "@/store/store";
import type { RootState } from "@/store/store";
import fannLogo from "figma:asset/3b0b3b085f063d168ed55b6b769b2fbf5143db61.png";

interface DashboardNavProps {
  currentPage?: "dashboard" | "profile" | "settings" | "leaderboard";
  onLogout?: () => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const content = {
  en: {
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    leaderboard: "Leaderboard",
    logout: "Logout",
    collapse: "Collapse",
    expand: "Expand",
    roles: {
      artist: "Artist",
      collector: "Collector",
      gallery: "Gallery",
      ambassador: "Ambassador",
    },
  },
  ar: {
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    leaderboard: "لوحة المتصدرين",
    logout: "تسجيل الخروج",
    collapse: "طي",
    expand: "توسيع",
    roles: {
      artist: "فنان",
      collector: "جامع",
      gallery: "معرض",
      ambassador: "سفير",
    },
  },
};

export function DashboardNav({
  currentPage,
  onLogout,
  isCollapsed: isCollapsedProp,
  onCollapseChange,
}: DashboardNavProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const persona = useSelector((state: RootState) => state.auth.persona);
  const t = content[language];
  const isRTL = language === "ar";
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user display data
  const userName = storedUser
    ? `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim() ||
      storedUser.title ||
      storedUser.email ||
      "User"
    : "User";

  const userInitials = storedUser
    ? `${storedUser.first_name || ""} ${storedUser.last_name || ""}`
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ||
      storedUser.email?.[0]?.toUpperCase() ||
      "U"
    : "U";

  // Get user role for display
  const getUserRole = () => {
    // Get role from storedUser.role first, then fallback to persona
    const displayRoleRaw =
      storedUser?.role?.toLowerCase() || persona?.toLowerCase() || "artist";
    
    // Validate and map role to our supported roles
    const validRoles: Array<"artist" | "collector" | "gallery" | "ambassador"> = [
      "artist",
      "collector",
      "gallery",
      "ambassador",
    ];
    const displayRole = validRoles.includes(
      displayRoleRaw as "artist" | "collector" | "gallery" | "ambassador"
    )
      ? (displayRoleRaw as "artist" | "collector" | "gallery" | "ambassador")
      : "artist";
    
    return t.roles[displayRole] || t.roles.artist;
  };

  // Use controlled state if provided, otherwise use internal state
  const isCollapsed =
    isCollapsedProp !== undefined ? isCollapsedProp : internalCollapsed;
  const setIsCollapsed = (collapsed: boolean) => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    } else {
      setInternalCollapsed(collapsed);
    }
  };

  // Determine current page from location if not provided
  const activePage =
    currentPage ||
    (location.pathname === ROUTES.DASHBOARD
      ? "dashboard"
      : location.pathname === ROUTES.PROFILE
      ? "profile"
      : location.pathname === ROUTES.SETTINGS
      ? "settings"
      : location.pathname === ROUTES.LEADERBOARD
      ? "leaderboard"
      : "dashboard");

  // Check profile visibility from user settings
  const profileVisibility = storedUser?.profile_visibility ?? true;

  const navItems = [
    {
      id: "dashboard",
      label: t.dashboard,
      icon: Home,
      onClick: () => navigate(ROUTES.DASHBOARD),
      show: true,
    },
    {
      id: "leaderboard",
      label: t.leaderboard,
      icon: Trophy,
      onClick: () => navigate(ROUTES.LEADERBOARD),
      show: true,
    },
    {
      id: "profile",
      label: t.profile,
      icon: User,
      onClick: () => navigate(ROUTES.PROFILE),
      show: profileVisibility, // Hide profile menu if profile visibility is false
    },
    {
      id: "settings",
      label: t.settings,
      icon: Settings,
      onClick: () => navigate(ROUTES.SETTINGS),
      show: true,
    },
  ];

  const handleLogout = async () => {
    // Clear Redux auth state
    dispatch(clearAuth());

    // Clear persisted Redux state from localStorage
    // redux-persist stores data with key "persist:auth" based on the persist config
    localStorage.removeItem("persist:auth");

    // Clear any other localStorage items set during signup/signin
    localStorage.removeItem("tryfann_expired_last_visit_page");

    // Purge the persistor to ensure all persisted state is cleared
    await persistor.purge();

    // Call custom logout handler if provided
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior - navigate to sign in
      navigate(ROUTES.SIGN_IN);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-[#ffcc33]/20">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={fannLogo}
              alt="FANN Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#ffffff] p-2 hover:text-[#ffcc33] hover:bg-[#ffcc33]/10 rounded-lg transition-all cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[#ffcc33]/20"
            >
              <div className="flex flex-col gap-2 p-4">
                {navItems
                  .filter((item) => item.show)
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => {
                          item.onClick();
                          setMobileMenuOpen(false);
                        }}
                        className={`justify-start gap-3 transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-[#ffcc33]/20 text-[#ffcc33] border border-[#ffcc33]/30"
                            : "text-[#808c99] hover:text-[#ffcc33] hover:bg-[#ffcc33]/20"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Button>
                    );
                  })}
                <div className="h-px bg-[#ffcc33]/20 my-2" />
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start gap-3 text-[#808c99] hover:text-destructive hover:bg-destructive/20 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  {t.logout}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? "80px" : "280px" }}
        className={`hidden lg:flex fixed ${
          isRTL ? "right-0 border-l" : "left-0 border-r"
        } top-0 bottom-0 z-40 glass border-[#ffcc33]/20 flex-col`}
        style={{ pointerEvents: "auto" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#ffcc33]/20">
          <motion.div
            className="flex items-center justify-center"
            initial={false}
          >
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <ImageWithFallback
                  src={fannLogo}
                  alt="FANN Logo"
                  className="h-12 w-auto object-contain mx-auto"
                />
              </motion.div>
            )}
            {isCollapsed && (
              <ImageWithFallback
                src={fannLogo}
                alt="FANN Logo"
                className="h-10 w-auto object-contain"
              />
            )}
          </motion.div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-[#ffcc33]/20">
          <motion.div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
            initial={false}
          >
            <Avatar
              className="w-12 h-12 border-2 border-[#ffcc33] cursor-pointer shrink-0 hover:scale-105 transition-transform"
              onClick={() => navigate(ROUTES.PROFILE)}
            >
              <AvatarImage
                src={storedUser?.profile_image || ""}
                alt={userName}
              />
              <AvatarFallback className="bg-gradient-to-br from-[#ffcc33] to-[#45e3d3] text-[#0F021C]">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-[#ffffff] truncate">{userName}</span>
                <span className="text-[#808c99]/60 text-sm">
                  {getUserRole()}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={item.onClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-[#808c99] hover:text-primary hover:bg-primary/10"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  style={{ pointerEvents: "auto" }}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#ffcc33]/20 space-y-2">
          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#808c99] hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer ${
              isCollapsed ? "justify-center" : ""
            }`}
            style={{ pointerEvents: "auto" }}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {t.logout}
              </motion.span>
            )}
          </motion.button>

          {/* Collapse/Expand Button */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#808c99]/60 hover:text-[#808c99] hover:bg-[#ffffff]/5 transition-all cursor-pointer ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? t.expand : t.collapse}
            style={{ pointerEvents: "auto" }}
          >
            {isRTL ? (
              isCollapsed ? (
                <ChevronLeft className="w-5 h-5 shrink-0" />
              ) : (
                <ChevronRight className="w-5 h-5 shrink-0" />
              )
            ) : isCollapsed ? (
              <ChevronRight className="w-5 h-5 shrink-0" />
            ) : (
              <ChevronLeft className="w-5 h-5 shrink-0" />
            )}
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                {t.collapse}
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
