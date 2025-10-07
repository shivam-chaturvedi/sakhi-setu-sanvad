import { motion } from "framer-motion";
import { Heart, TrendingUp, Users, Sparkles, Bell, Calendar, LogOut, FileText, MapPin, Mic, Clock, Video, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import GoogleTranslate from "@/components/GoogleTranslate";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
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

  const quickActions = [
    {
      icon: Calendar,
      title: "Log Symptoms",
      description: "Track your daily symptoms",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      onClick: () => navigate("/tracker")
    },
    {
      icon: Heart,
      title: "Exercise",
      description: "Start your workout",
      color: "text-green-500",
      bgColor: "bg-green-50",
      onClick: () => navigate("/resources")
    },
    {
      icon: FileText,
      title: "Health Reports",
      description: "View your reports",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      onClick: () => navigate("/profile")
    },
    {
      icon: MapPin,
      title: "Find PHC",
      description: "Locate health centers",
      color: "text-red-500",
      bgColor: "bg-red-50",
      onClick: () => navigate("/resources")
    },
    {
      icon: Mic,
      title: "Voice Assistant",
      description: "Chat with AI",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      onClick: () => navigate("/community")
    },
    {
      icon: Clock,
      title: "Reminders",
      description: "Set wellness reminders",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      onClick: () => navigate("/profile")
    },
    {
      icon: Video,
      title: "Video Library",
      description: "Publish and discover wellness videos",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      onClick: () => navigate("/library")
    },
    {
      icon: MessageCircle,
      title: "Community Chat",
      description: "Connect with others",
      color: "text-teal-500",
      bgColor: "bg-teal-50",
      onClick: () => navigate("/profile")
    }
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome {user.user_metadata?.full_name || 'User'} 🌸
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Your wellness journey starts here</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <GoogleTranslate />
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => toast.info("No new notifications")}
            >
              <Bell className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-energy rounded-full animate-pulse" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={signOut}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="p-4 cursor-pointer hover:shadow-lg transition-all group"
                  onClick={action.onClick}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`p-3 rounded-full ${action.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{action.title}</h4>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-6"
      >
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Logged sleep quality: 8/10</span>
              <Badge variant="secondary" className="text-xs">2 hours ago</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Completed morning meditation</span>
              <Badge variant="secondary" className="text-xs">4 hours ago</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Shared experience in community</span>
              <Badge variant="secondary" className="text-xs">1 day ago</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      <Navigation />
    </div>
  );
};

export default Dashboard;
