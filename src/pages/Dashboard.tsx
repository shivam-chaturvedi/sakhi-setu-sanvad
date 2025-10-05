import { motion } from "framer-motion";
import { Heart, TrendingUp, Users, Sparkles, Bell, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const insights = [
    {
      icon: Heart,
      title: "Today's Advice",
      description: "Practice 10 minutes of meditation",
      bgColor: "bg-primary-light",
      iconColor: "text-primary",
      onClick: () => {
        toast.success("Great choice! Let's meditate together");
        navigate("/resources");
      },
    },
    {
      icon: TrendingUp,
      title: "Your Trend",
      description: "Sleep quality has improved",
      bgColor: "bg-energy-light",
      iconColor: "text-energy",
      onClick: () => {
        toast.info("View your detailed progress");
        navigate("/tracker");
      },
    },
    {
      icon: Users,
      title: "Community",
      description: "New messages available",
      bgColor: "bg-secondary-light",
      iconColor: "text-secondary",
      onClick: () => {
        navigate("/community");
      },
    },
  ];

  const handleLearnMore = () => {
    toast.success("Opening wellness insights...");
    setTimeout(() => navigate("/resources"), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/20 to-secondary-light/30 pb-24">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 pb-6 px-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome 🌸</h1>
            <p className="text-muted-foreground mt-1">Your wellness journey starts here</p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => toast.info("No new notifications")}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-energy rounded-full animate-pulse" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-8"
      >
        <Card className="glass-card p-6 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="p-3 bg-primary/20 rounded-2xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">Today's Wellness Tip</h2>
                <p className="text-sm text-muted-foreground">AI-powered insight</p>
              </div>
            </div>
            <p className="text-foreground leading-relaxed">
              Your sleep quality is excellent! Continue with 15 minutes of morning yoga practice today.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                className="mt-4 bg-primary hover:bg-primary/90"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Insights Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-6 mb-8"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div key={index} variants={item}>
                <Card 
                  className="glass-card p-5 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={insight.onClick}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className={`p-3 ${insight.bgColor} rounded-xl`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className={`w-5 h-5 ${insight.iconColor}`} />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-6"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              className="w-full h-24 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary transition-all"
              onClick={() => navigate("/tracker")}
            >
              <Calendar className="w-6 h-6 text-primary" />
              <span className="text-sm">Log Symptoms</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              className="w-full h-24 flex flex-col gap-2 hover:bg-secondary/5 hover:border-secondary transition-all"
              onClick={() => {
                toast.success("Let's get moving!");
                navigate("/resources");
              }}
            >
              <Heart className="w-6 h-6 text-secondary" />
              <span className="text-sm">Exercise</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <Navigation />
    </div>
  );
};

export default Dashboard;
