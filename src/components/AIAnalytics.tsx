import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Moon, 
  Thermometer,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AnalyticsData {
  totalSymptoms: number;
  averageSeverity: number;
  symptomTrends: { [key: string]: number };
  weeklyPattern: { day: string; severity: number }[];
  recommendations: {
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    icon: any;
  }[];
  insights: {
    type: 'positive' | 'warning' | 'info';
    title: string;
    description: string;
    action?: string;
  }[];
}

export const AIAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch symptoms data
      const { data: symptoms, error: symptomsError } = await supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (symptomsError) throw symptomsError;

      // Process analytics data
      const analyticsData = processAnalyticsData(symptoms || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (symptoms: any[]): AnalyticsData => {
    const totalSymptoms = symptoms.length;
    const averageSeverity = symptoms.length > 0 
      ? symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length 
      : 0;

    // Calculate symptom trends
    const symptomTrends: { [key: string]: number } = {};
    symptoms.forEach(s => {
      symptomTrends[s.symptom_type] = (symptomTrends[s.symptom_type] || 0) + 1;
    });

    // Calculate weekly patterns
    const weeklyPattern = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      .map(day => {
        const daySymptoms = symptoms.filter(s => {
          const date = new Date(s.recorded_at);
          return date.toLocaleDateString('en-US', { weekday: 'long' }) === day;
        });
        const avgSeverity = daySymptoms.length > 0 
          ? daySymptoms.reduce((sum, s) => sum + s.severity, 0) / daySymptoms.length 
          : 0;
        return { day, severity: avgSeverity };
      });

    // Generate AI recommendations
    const recommendations = generateRecommendations(symptoms, averageSeverity);
    
    // Generate insights
    const insights = generateInsights(symptoms, averageSeverity, symptomTrends);

    return {
      totalSymptoms,
      averageSeverity: Math.round(averageSeverity * 10) / 10,
      symptomTrends,
      weeklyPattern,
      recommendations,
      insights
    };
  };

  const generateRecommendations = (symptoms: any[], avgSeverity: number) => {
    const recommendations = [];

    // Hot flashes recommendations
    const hotFlashes = symptoms.filter(s => s.symptom_type === 'hot_flashes');
    if (hotFlashes.length > 0) {
      recommendations.push({
        category: 'Hot Flashes',
        title: 'Cooling Strategies',
        description: 'Try wearing layers, using a fan, and avoiding spicy foods during hot flash episodes.',
        priority: 'high' as const,
        icon: Thermometer
      });
    }

    // Sleep recommendations
    const sleepIssues = symptoms.filter(s => s.symptom_type === 'sleep_issues');
    if (sleepIssues.length > 0) {
      recommendations.push({
        category: 'Sleep',
        title: 'Sleep Hygiene',
        description: 'Maintain a consistent sleep schedule and create a cool, dark bedroom environment.',
        priority: 'high' as const,
        icon: Moon
      });
    }

    // Mood recommendations
    const moodIssues = symptoms.filter(s => ['mood_swings', 'anxiety', 'depression'].includes(s.symptom_type));
    if (moodIssues.length > 0) {
      recommendations.push({
        category: 'Mood',
        title: 'Stress Management',
        description: 'Practice deep breathing, meditation, or gentle yoga to help manage mood changes.',
        priority: 'medium' as const,
        icon: Heart
      });
    }

    // General recommendations based on severity
    if (avgSeverity > 6) {
      recommendations.push({
        category: 'General',
        title: 'Professional Support',
        description: 'Consider consulting with a healthcare provider about your symptoms.',
        priority: 'high' as const,
        icon: Target
      });
    }

    return recommendations.slice(0, 4);
  };

  const generateInsights = (symptoms: any[], avgSeverity: number, trends: { [key: string]: number }) => {
    const insights = [];

    if (symptoms.length === 0) {
      insights.push({
        type: 'info' as const,
        title: 'Start Tracking',
        description: 'Begin logging your symptoms to get personalized insights and recommendations.',
        action: 'Track your first symptom'
      });
      return insights;
    }

    // Severity insights
    if (avgSeverity > 7) {
      insights.push({
        type: 'warning' as const,
        title: 'High Symptom Severity',
        description: 'Your symptoms are quite severe. Consider seeking professional medical advice.',
        action: 'Find nearby PHC'
      });
    } else if (avgSeverity < 4) {
      insights.push({
        type: 'positive' as const,
        title: 'Well-Managed Symptoms',
        description: 'Great job! Your symptoms appear to be well-managed. Keep up the good work.',
        action: 'Continue tracking'
      });
    }

    // Pattern insights
    const mostCommonSymptom = Object.entries(trends).sort(([,a], [,b]) => b - a)[0];
    if (mostCommonSymptom) {
      insights.push({
        type: 'info' as const,
        title: 'Most Common Symptom',
        description: `You experience ${mostCommonSymptom[0].replace('_', ' ')} most frequently. Focus on managing this symptom.`,
        action: 'View recommendations'
      });
    }

    // Trend insights
    const recentSymptoms = symptoms.slice(0, 7);
    const olderSymptoms = symptoms.slice(7, 14);
    if (recentSymptoms.length > 0 && olderSymptoms.length > 0) {
      const recentAvg = recentSymptoms.reduce((sum, s) => sum + s.severity, 0) / recentSymptoms.length;
      const olderAvg = olderSymptoms.reduce((sum, s) => sum + s.severity, 0) / olderSymptoms.length;
      
      if (recentAvg > olderAvg * 1.2) {
        insights.push({
          type: 'warning' as const,
          title: 'Symptoms Worsening',
          description: 'Your symptoms have increased in severity recently. Consider adjusting your management strategies.',
          action: 'Review recommendations'
        });
      } else if (recentAvg < olderAvg * 0.8) {
        insights.push({
          type: 'positive' as const,
          title: 'Symptoms Improving',
          description: 'Your symptoms have decreased in severity recently. Your management strategies are working!',
          action: 'Keep tracking'
        });
      }
    }

    return insights.slice(0, 3);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'info': return <Lightbulb className="w-5 h-5 text-blue-500" />;
      default: return <Brain className="w-5 h-5 text-purple-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'warning': return 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800';
      case 'info': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800';
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
          <p className="text-gray-600 dark:text-gray-300">Analyzing your data...</p>
        </motion.div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8">
        <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Start tracking your symptoms to get AI-powered insights
        </p>
        <Button onClick={fetchAnalytics}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            AI Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-300">AI-powered insights from your symptom data</p>
        </div>
        <Button
          onClick={() => {
            setRefreshing(true);
            fetchAnalytics().finally(() => setRefreshing(false));
          }}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{analytics.totalSymptoms}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Symptoms Tracked</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{analytics.averageSeverity}/10</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Average Severity</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{analytics.recommendations.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">AI Recommendations</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Personalized insights based on your symptom patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {analytics.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {insight.description}
                        </p>
                        {insight.action && (
                          <Button size="sm" variant="outline" className="text-xs">
                            {insight.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-500" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>
              AI-generated suggestions to help manage your symptoms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {analytics.recommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <Icon className="w-5 h-5 text-pink-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {rec.title}
                            </h4>
                            <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {rec.description}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {rec.category}
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

      {/* Weekly Pattern */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Weekly Pattern
            </CardTitle>
            <CardDescription>
              Your symptom severity patterns throughout the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.weeklyPattern.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-20 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={day.severity * 10} 
                      className="h-2"
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-500 dark:text-gray-400 text-right">
                    {day.severity.toFixed(1)}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};