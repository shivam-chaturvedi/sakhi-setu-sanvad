import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { User, Settings, Bell, Shield, Heart, LogOut, ChevronRight, ArrowLeft, FileText, Clock, MapPin, Mic, Video, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import HealthReports from "@/components/HealthReports";
import Reminders from "@/components/Reminders";
import PHCDirectory from "@/components/PHCDirectory";
import VoiceAssistant from "@/components/VoiceAssistant";
import { EditProfileForm } from "@/components/EditProfileForm";
import EnhancedProfile from "@/components/EnhancedProfile";
import VideoLibrary from "@/components/VideoLibrary";
import EnhancedChat from "@/components/EnhancedChat";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Profile = () => {
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

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!", {
      description: "See you soon! Take care of yourself.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/20 to-accent/30 pb-24">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 pb-6 px-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your information</p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
          </div>
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
                  {user.user_metadata?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.user_metadata?.full_name || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
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

      {/* Tabs for different sections */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6"
      >
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Publish Videos
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Assistant
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <EnhancedProfile />
          </TabsContent>
          
          <TabsContent value="edit" className="mt-6">
            <EditProfileForm />
          </TabsContent>
          
          <TabsContent value="library" className="mt-6">
            <VideoLibrary />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <EnhancedChat />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <HealthReports />
          </TabsContent>
          
          <TabsContent value="reminders" className="mt-6">
            <Reminders />
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

export default Profile;