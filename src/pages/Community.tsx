import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { MessageCircle, Heart, Send, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Community = () => {
  const posts = [
    {
      user: "प्रिया",
      initial: "प्र",
      time: "2 तास",
      content: "योगाच्या मदतीने मला खूप फरक जाणवतो आहे. तुम्ही सुद्धा प्रयत्न करा!",
      likes: 12,
    },
    {
      user: "मीना",
      initial: "मी",
      time: "5 तास",
      content: "गरम लाटा कमी करण्यासाठी काही उपाय सांगाल का?",
      likes: 8,
    },
    {
      user: "सुनीता",
      initial: "सु",
      time: "1 दिवस",
      content: "ध्यान आणि प्राणायाम खूप मदत करतात. दररोज 15 मिनिटे करा.",
      likes: 15,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary-light/20 to-primary-glow/30 pb-24">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 pb-6 px-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-secondary/20 rounded-xl">
            <MessageCircle className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">समुदाय</h1>
            <p className="text-muted-foreground mt-1">एकत्र आम्ही मजबूत आहोत</p>
          </div>
        </div>
      </motion.header>

      {/* Safety Notice */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-6 mb-6"
      >
        <Card className="glass-card p-4 border-secondary/30">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-secondary mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-secondary mb-1">सुरक्षित जागा</p>
              <p className="text-muted-foreground">
                ही एक सुरक्षित आणि सहायक समुदाय आहे. कृपया सन्माना आणि दयाळूपणा ठेवा.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Posts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 space-y-4 mb-6"
      >
        {posts.map((post, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="glass-card p-5">
              <div className="flex items-start gap-3 mb-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {post.initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.user}</span>
                    <span className="text-xs text-muted-foreground">· {post.time}</span>
                  </div>
                  <p className="text-sm text-foreground mt-2 leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">उत्तर द्या</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Message Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-20 left-0 right-0 px-6 py-4 bg-background/80 backdrop-blur-lg border-t border-border"
      >
        <div className="flex gap-2">
          <Input
            placeholder="तुमचे विचार शेअर करा..."
            className="flex-1 bg-card"
          />
          <Button size="icon" className="bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <Navigation />
    </div>
  );
};

export default Community;
