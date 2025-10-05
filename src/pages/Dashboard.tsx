import { motion } from "framer-motion";
import { Heart, TrendingUp, Users, Sparkles, Bell, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
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
    },
    {
      icon: TrendingUp,
      title: "Your Trend",
      description: "Sleep quality has improved",
      bgColor: "bg-energy-light",
      iconColor: "text-energy",
    },
    {
      icon: Users,
      title: "Community",
      description: "New messages available",
      bgColor: "bg-secondary-light",
      iconColor: "text-secondary",
    },
  ];

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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-energy rounded-full animate-pulse" />
          </Button>
        </div>
      </motion.header>

      {/* Hero Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-8"
      >
        <Card className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/20 rounded-2xl">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Today's Wellness Tip</h2>
                <p className="text-sm text-muted-foreground">AI-powered insight</p>
              </div>
            </div>
            <p className="text-foreground leading-relaxed">
              Your sleep quality is excellent! Continue with 15 minutes of morning yoga practice today.
            </p>
            <Button className="mt-4 bg-primary hover:bg-primary/90">
              Learn More
            </Button>
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
                <Card className="glass-card p-5 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${insight.bgColor} rounded-xl`}>
                      <Icon className={`w-5 h-5 ${insight.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{insight.title}</h4>
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
          <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-primary/5">
            <Calendar className="w-6 h-6 text-primary" />
            <span className="text-sm">Log Symptoms</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-secondary/5">
            <Heart className="w-6 h-6 text-secondary" />
            <span className="text-sm">Exercise</span>
          </Button>
        </div>
      </motion.div>

      <Navigation />
    </div>
  );
};

export default Dashboard;
