import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import { Activity, Moon, Smile, Droplets, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Tracker = () => {
  const navigate = useNavigate();
  const [sleep, setSleep] = useState([7]);
  const [mood, setMood] = useState([5]);
  const [hotFlashes, setHotFlashes] = useState([0]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const symptoms = [
    { icon: Moon, label: "Sleep (hours)", value: sleep, setter: setSleep, max: 12, color: "primary" },
    { icon: Smile, label: "Mood", value: mood, setter: setMood, max: 10, color: "energy" },
    { icon: Droplets, label: "Hot Flashes", value: hotFlashes, setter: setHotFlashes, max: 10, color: "secondary" },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Symptoms logged successfully!", {
      description: "Your data has been saved and AI is analyzing patterns.",
      icon: <CheckCircle2 className="w-5 h-5" />,
    });
    
    setIsSaving(false);
    
    // Navigate back after a short delay
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-energy-light/20 to-primary-glow/30 pb-24">
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
          <div>
            <h1 className="text-3xl font-bold">Log Symptoms</h1>
            <p className="text-muted-foreground mt-1">Track your progress today</p>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 space-y-6"
      >
        {symptoms.map((symptom, index) => {
          const Icon = symptom.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="glass-card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`p-2 bg-${symptom.color}/20 rounded-lg`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Icon className={`w-5 h-5 text-${symptom.color}`} />
                  </motion.div>
                  <Label className="text-lg font-semibold">{symptom.label}</Label>
                </div>
                <div className="space-y-4">
                  <Slider
                    value={symptom.value}
                    onValueChange={symptom.setter}
                    max={symptom.max}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0</span>
                    <motion.span 
                      className={`font-semibold text-${symptom.color} text-lg`}
                      key={symptom.value[0]}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                    >
                      {symptom.value[0]}
                    </motion.span>
                    <span>{symptom.max}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card p-6">
            <Label className="text-lg font-semibold mb-4 block">Today's Notes</Label>
            <Textarea
              placeholder="How are you feeling today? Any observations or symptoms to note..."
              className="min-h-32 resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Card>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Activity className="w-5 h-5 mr-2" />
                </motion.div>
                Saving...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 mr-2" />
                Save Entry
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>

      <Navigation />
    </div>
  );
};

export default Tracker;
