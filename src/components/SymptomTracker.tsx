import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Calendar, 
  TrendingUp, 
  Activity, 
  Heart,
  Moon,
  Brain,
  Thermometer,
  Zap,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  Clock,
  Target
} from 'lucide-react';

const symptomTypes = [
  { value: 'hot_flashes', label: 'Hot Flashes', icon: Thermometer, color: 'text-red-500' },
  { value: 'night_sweats', label: 'Night Sweats', icon: Moon, color: 'text-blue-500' },
  { value: 'mood_swings', label: 'Mood Swings', icon: Heart, color: 'text-pink-500' },
  { value: 'sleep_issues', label: 'Sleep Issues', icon: Moon, color: 'text-purple-500' },
  { value: 'anxiety', label: 'Anxiety', icon: Brain, color: 'text-orange-500' },
  { value: 'depression', label: 'Depression', icon: Heart, color: 'text-indigo-500' },
  { value: 'headaches', label: 'Headaches', icon: Zap, color: 'text-yellow-500' },
  { value: 'joint_pain', label: 'Joint Pain', icon: Activity, color: 'text-green-500' },
  { value: 'weight_gain', label: 'Weight Gain', icon: Target, color: 'text-cyan-500' },
  { value: 'memory_issues', label: 'Memory Issues', icon: Brain, color: 'text-amber-500' },
  { value: 'vaginal_dryness', label: 'Vaginal Dryness', icon: Heart, color: 'text-rose-500' },
  { value: 'irregular_periods', label: 'Irregular Periods', icon: Calendar, color: 'text-pink-500' },
  { value: 'fatigue', label: 'Fatigue', icon: Activity, color: 'text-gray-500' },
  { value: 'irritability', label: 'Irritability', icon: Zap, color: 'text-red-600' },
  { value: 'breast_tenderness', label: 'Breast Tenderness', icon: Heart, color: 'text-pink-600' }
];

export const SymptomTracker: React.FC = () => {
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState([5]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalEntries: 0,
    averageSeverity: 0,
    mostCommonSymptom: '',
    recentTrend: 'stable'
  });
  const { user } = useAuth();
  const { language, translate } = useLanguage();

  useEffect(() => {
    if (user) {
      fetchSymptoms();
    }
  }, [user]);

  const fetchSymptoms = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (error) {
        if (error.code === 'PGRST205') {
          toast.error('Database tables not found. Please run the Supabase setup script first.');
          console.error('Database setup required. Run the SQL script in Supabase dashboard.');
          return;
        }
        throw error;
      }
      setSymptoms(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      toast.error('Failed to load symptoms. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (symptomData: any[]) => {
    if (symptomData.length === 0) return;

    const totalEntries = symptomData.length;
    const averageSeverity = symptomData.reduce((sum, s) => sum + s.severity, 0) / totalEntries;
    
    // Find most common symptom
    const symptomCounts: { [key: string]: number } = {};
    symptomData.forEach(s => {
      symptomCounts[s.symptom_type] = (symptomCounts[s.symptom_type] || 0) + 1;
    });
    const mostCommonSymptom = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    // Calculate trend (simplified)
    const recent = symptomData.slice(0, 7);
    const older = symptomData.slice(7, 14);
    const recentAvg = recent.reduce((sum, s) => sum + s.severity, 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + s.severity, 0) / older.length;
    
    let recentTrend = 'stable';
    if (recentAvg > olderAvg * 1.1) recentTrend = 'worsening';
    else if (recentAvg < olderAvg * 0.9) recentTrend = 'improving';

    setStats({
      totalEntries,
      averageSeverity: Math.round(averageSeverity * 10) / 10,
      mostCommonSymptom,
      recentTrend
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedSymptom) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('symptoms')
        .insert({
          user_id: user.id,
          symptom_type: selectedSymptom,
          severity: severity[0],
          notes: notes || null,
          recorded_at: new Date().toISOString(),
        });

      if (error) {
        if (error.code === 'PGRST205') {
          toast.error('Database tables not found. Please run the Supabase setup script first.');
          console.error('Database setup required. Run the SQL script in Supabase dashboard.');
          return;
        }
        throw error;
      }

      toast.success('Symptom recorded successfully!', {
        description: 'Your data has been saved and will be used for AI insights.'
      });

      setSelectedSymptom('');
      setSeverity([5]);
      setNotes('');
      fetchSymptoms();
    } catch (error) {
      console.error('Error recording symptom:', error);
      toast.error('Failed to record symptom. Please check your database connection.');
    } finally {
      setSaving(false);
    }
  };

  const getSeverityLabel = (value: number) => {
    if (value <= 2) return 'Mild';
    if (value <= 4) return 'Moderate';
    if (value <= 6) return 'Moderate-Severe';
    if (value <= 8) return 'Severe';
    return 'Very Severe';
  };

  const getSeverityColor = (value: number) => {
    if (value <= 2) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (value <= 4) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    if (value <= 6) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    if (value <= 8) return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    return 'text-red-800 bg-red-200 dark:bg-red-900/50';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'worsening': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'worsening': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          <p className="text-gray-600 dark:text-gray-300">Loading your symptoms...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-pink-500" />
            </div>
            <div className="text-2xl font-bold text-pink-600">{stats.totalEntries}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Entries</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.averageSeverity}/10</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Severity</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              {getTrendIcon(stats.recentTrend)}
            </div>
            <div className={`text-lg font-bold ${getTrendColor(stats.recentTrend)} capitalize`}>
              {stats.recentTrend}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Recent Trend</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-lg font-bold text-orange-600 truncate">
              {stats.mostCommonSymptom.replace('_', ' ')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Most Common</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Symptom Entry Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="h-6 w-6 text-pink-500" />
              Track Your Symptoms
            </CardTitle>
            <CardDescription>
              Record your menopause symptoms to get personalized AI insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="symptom" className="text-base font-medium">Symptom Type</Label>
                <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
                  <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20">
                    <SelectValue placeholder="Select a symptom to track" />
                  </SelectTrigger>
                  <SelectContent>
                    {symptomTypes.map((symptom) => {
                      const Icon = symptom.icon;
                      return (
                        <SelectItem key={symptom.value} value={symptom.value}>
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${symptom.color}`} />
                            <span>{symptom.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Severity Level: {severity[0]}/10
                  </Label>
                  <Badge className={`px-3 py-1 ${getSeverityColor(severity[0])}`}>
                    {getSeverityLabel(severity[0])}
                  </Badge>
                </div>
                <Slider
                  value={severity}
                  onValueChange={setSeverity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Mild (1-2)</span>
                  <span>Moderate (3-4)</span>
                  <span>Severe (5-6)</span>
                  <span>Very Severe (7-10)</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="notes" className="text-base font-medium">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional details about your symptoms, triggers, or context..."
                  rows={4}
                  className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  type="submit" 
                  disabled={saving || !selectedSymptom} 
                  className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Recording Symptom...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      Record Symptom
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Symptoms */}
      {symptoms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-6 w-6 text-purple-500" />
                Recent Symptoms
              </CardTitle>
              <CardDescription>
                Your latest symptom entries and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {symptoms.slice(0, 10).map((symptom, index) => {
                    const symptomType = symptomTypes.find(s => s.value === symptom.symptom_type);
                    const Icon = symptomType?.icon || Activity;
                    const color = symptomType?.color || 'text-gray-500';
                    
                    return (
                      <motion.div
                        key={symptom.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all duration-300 bg-white/50 dark:bg-gray-700/50"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-600`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {symptomType?.label || symptom.symptom_type.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {new Date(symptom.recorded_at).toLocaleDateString()} at {new Date(symptom.recorded_at).toLocaleTimeString()}
                            </div>
                            {symptom.notes && (
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">
                                "{symptom.notes}"
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`px-3 py-1 ${getSeverityColor(symptom.severity)}`}>
                            {symptom.severity}/10
                          </Badge>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {getSeverityLabel(symptom.severity)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};