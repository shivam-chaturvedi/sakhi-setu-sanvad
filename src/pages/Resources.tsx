import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { BookOpen, Video, Utensils, Play, Clock } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      type: "Video",
      icon: Video,
      title: "Yoga & Breathing",
      subtitle: "Guided exercises",
      duration: "15 minutes",
      bgColor: "bg-primary-light",
      iconColor: "text-primary",
    },
    {
      type: "Article",
      icon: BookOpen,
      title: "Menopause Guide",
      subtitle: "Comprehensive information",
      duration: "5 min read",
      bgColor: "bg-energy-light",
      iconColor: "text-energy",
    },
    {
      type: "Recipe",
      icon: Utensils,
      title: "Nutritious Diet",
      subtitle: "Healthy meals",
      duration: "Traditional recipes",
      bgColor: "bg-secondary-light",
      iconColor: "text-secondary",
    },
  ];

  const videos = [
    {
      title: "Morning Yoga",
      duration: "10:30",
      thumbnail: "bg-gradient-to-br from-primary-light to-primary",
    },
    {
      title: "Meditation Techniques",
      duration: "15:00",
      thumbnail: "bg-gradient-to-br from-energy-light to-energy",
    },
    {
      title: "Breathing Exercises",
      duration: "8:45",
      thumbnail: "bg-gradient-to-br from-secondary-light to-secondary",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-energy-light/30 pb-24">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 pb-6 px-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-energy/20 rounded-xl">
            <BookOpen className="w-6 h-6 text-energy" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Resource Center</h1>
            <p className="text-muted-foreground mt-1">Learn and grow</p>
          </div>
        </div>
      </motion.header>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 gap-4">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="glass-card p-5 cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 ${resource.bgColor} rounded-2xl`}>
                      <Icon className={`w-6 h-6 ${resource.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          {resource.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.subtitle}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {resource.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Featured Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-6"
      >
        <h2 className="text-lg font-semibold mb-4">Featured Videos</h2>
        <div className="space-y-4">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card className="glass-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex gap-4 p-4">
                  <div
                    className={`relative w-32 h-20 ${video.thumbnail} rounded-lg flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 bg-black/20 rounded-lg" />
                    <Play className="w-8 h-8 text-white relative z-10" />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Expert guidance
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 h-8 text-xs">
                      Watch Now
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Navigation />
    </div>
  );
};

export default Resources;
