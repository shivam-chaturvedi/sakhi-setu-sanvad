import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import { Activity, Moon, Smile, Droplets, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Tracker = () => {
  const navigate = useNavigate();
  const [sleep, setSleep] = useState([7]);
  const [mood, setMood] = useState([5]);
  const [hotFlashes, setHotFlashes] = useState([0]);

  const symptoms = [
    { icon: Moon, label: "Sleep (hours)", value: sleep, setter: setSleep, max: 12 },
    { icon: Smile, label: "Mood", value: mood, setter: setMood, max: 10 },
    { icon: Droplets, label: "Hot Flashes", value: hotFlashes, setter: setHotFlashes, max: 10 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-energy-light/20 to-primary-glow/30 pb-24">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 pb-6 px-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
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
              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
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
                    <span className="font-semibold text-primary text-lg">
                      {symptom.value[0]}
                    </span>
                    <span>{symptom.max}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        <Card className="glass-card p-6">
          <Label className="text-lg font-semibold mb-4 block">Today's Notes</Label>
          <Input
            placeholder="How are you feeling today?"
            className="min-h-24 resize-none"
          />
        </Card>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg">
            <Activity className="w-5 h-5 mr-2" />
            Save Entry
          </Button>
        </motion.div>
      </motion.div>

      <Navigation />
    </div>
  );
};

export default Tracker;
