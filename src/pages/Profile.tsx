import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { User, Settings, Bell, Shield, Heart, LogOut, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Profile = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { 
      icon: Settings, 
      label: "Settings",
      onClick: () => toast.info("Settings page coming soon!"),
    },
    { 
      icon: Bell, 
      label: "Notifications",
      onClick: () => toast.info("Notification preferences coming soon!"),
    },
    { 
      icon: Shield, 
      label: "Privacy",
      onClick: () => toast.info("Privacy settings coming soon!"),
    },
    { 
      icon: Heart, 
      label: "Wellness Goals",
      onClick: () => toast.success("Set your wellness goals!"),
    },
  ];

  const handleEditProfile = () => {
    toast.success("Edit profile feature coming soon!");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!", {
      description: "See you soon! Take care of yourself.",
    });
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/20 to-accent/30 pb-24">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 pb-6 px-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your information</p>
          </div>
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Profile Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-6 mb-8"
      >
        <Card className="glass-card p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar className="w-20 h-20 cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
                  P
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Priya Patil</h2>
              <p className="text-sm text-muted-foreground">priya.patil@example.com</p>
              <div className="flex gap-2 mt-2">
                <motion.span 
                  className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  45 years old
                </motion.span>
                <motion.span 
                  className="text-xs bg-energy/20 text-energy px-3 py-1 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  7 days active
                </motion.span>
              </div>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              className="w-full hover:bg-primary/5 hover:border-primary transition-all"
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          </motion.div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-8"
      >
        <div className="grid grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="glass-card p-4 text-center cursor-pointer hover:shadow-lg transition-all">
              <motion.div 
                className="text-2xl font-bold text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                12
              </motion.div>
              <div className="text-xs text-muted-foreground mt-1">Days tracked</div>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="glass-card p-4 text-center cursor-pointer hover:shadow-lg transition-all">
              <motion.div 
                className="text-2xl font-bold text-energy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                8
              </motion.div>
              <div className="text-xs text-muted-foreground mt-1">Articles read</div>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="glass-card p-4 text-center cursor-pointer hover:shadow-lg transition-all">
              <motion.div 
                className="text-2xl font-bold text-secondary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                5
              </motion.div>
              <div className="text-xs text-muted-foreground mt-1">Community posts</div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 space-y-3"
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="glass-card p-4 cursor-pointer hover:shadow-lg transition-all group"
                onClick={item.onClick}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-2 bg-primary/10 rounded-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {item.label}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Logout Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-6 mt-8"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          variant="outline" 
          className="w-full text-destructive hover:bg-destructive/10 hover:border-destructive transition-all"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </motion.div>

      <Navigation />
    </div>
  );
};

export default Profile;
