import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { User, Settings, Bell, Shield, Heart, LogOut, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const menuItems = [
    { icon: Settings, label: "सेटिंग्ज", subtitle: "Settings" },
    { icon: Bell, label: "सूचना", subtitle: "Notifications" },
    { icon: Shield, label: "गोपनीयता", subtitle: "Privacy" },
    { icon: Heart, label: "कल्याण लक्ष्य", subtitle: "Wellness Goals" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/20 to-accent/30 pb-24">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 pb-6 px-6"
      >
        <h1 className="text-3xl font-bold">माझे प्रोफाइल</h1>
        <p className="text-muted-foreground mt-1">तुमची माहिती व्यवस्थापित करा</p>
      </motion.header>

      {/* Profile Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-6 mb-8"
      >
        <Card className="glass-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
                प्र
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">प्रिया पाटील</h2>
              <p className="text-sm text-muted-foreground">priya.patil@example.com</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                  45 वर्षे
                </span>
                <span className="text-xs bg-energy/20 text-energy px-3 py-1 rounded-full">
                  7 दिवस सक्रिय
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            प्रोफाइल संपादित करा
          </Button>
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
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-xs text-muted-foreground mt-1">दिवस ट्रॅक</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-energy">8</div>
            <div className="text-xs text-muted-foreground mt-1">लेख वाचले</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-secondary">5</div>
            <div className="text-xs text-muted-foreground mt-1">समुदाय पोस्ट</div>
          </Card>
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
            >
              <Card className="glass-card p-4 cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
      >
        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
          <LogOut className="w-4 h-4 mr-2" />
          लॉग आउट
        </Button>
      </motion.div>

      <Navigation />
    </div>
  );
};

export default Profile;
