import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { CommunityChat } from "@/components/CommunityChat";
import VoiceAssistant from "@/components/VoiceAssistant";
import { MessageCircle, ArrowLeft, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Community = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary-light/20 to-primary-glow/30 pb-24">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 pb-6 px-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2 bg-secondary/20 rounded-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <MessageCircle className="w-6 h-6 text-secondary" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold">Community</h1>
              <p className="text-muted-foreground mt-1">Together we are stronger</p>
            </div>
          </div>
        </div>
      </motion.header>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-6"
            >
              <Tabs defaultValue="community" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="community" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Community
                  </TabsTrigger>
                  <TabsTrigger value="assistant" className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    AI Assistant
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="community" className="mt-6">
                  <CommunityChat />
                </TabsContent>
                
                <TabsContent value="assistant" className="mt-6">
                  <VoiceAssistant />
                </TabsContent>
              </Tabs>
            </motion.div>

      <Navigation />
    </div>
  );
};

export default Community;
