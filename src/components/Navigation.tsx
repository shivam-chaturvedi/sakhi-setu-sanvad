import { Link, useLocation } from "react-router-dom";
import { Home, Activity, Users, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "होम", labelHi: "होम" },
    { path: "/tracker", icon: Activity, label: "लक्षणे", labelHi: "लक्षण" },
    { path: "/community", icon: Users, label: "समुदाय", labelHi: "समुदाय" },
    { path: "/resources", icon: BookOpen, label: "माहिती", labelHi: "जानकारी" },
    { path: "/profile", icon: User, label: "प्रोफाइल", labelHi: "प्रोफ़ाइल" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} to={item.path} className="relative">
                <motion.div
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="text-xs font-medium relative z-10">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
