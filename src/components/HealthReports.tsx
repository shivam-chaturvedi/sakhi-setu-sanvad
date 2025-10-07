import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Share2, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Moon, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface HealthReport {
  id: string;
  report_type: string;
  period_start: string;
  period_end: string;
  symptoms_summary: any;
  recommendations: any;
  insights: any;
  file_url?: string;
  created_at: string;
}

const HealthReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('health_reports')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch health reports');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: 'weekly' | 'monthly') => {
    if (!user) return;

    setGenerating(true);
    try {
      // Fetch recent symptoms data
      const { data: symptoms, error: symptomsError } = await supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', new Date(Date.now() - (type === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false });

      if (symptomsError) throw symptomsError;

      // Generate AI insights based on symptoms
      const insights = generateAIInsights(symptoms || []);
      const recommendations = generateRecommendations(symptoms || []);

      // Create report
      const reportData = {
        user_id: user.id,
        report_type: type,
        period_start: new Date(Date.now() - (type === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        period_end: new Date().toISOString().split('T')[0],
        symptoms_summary: {
          total_entries: symptoms?.length || 0,
          average_severity: symptoms?.length ? symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length : 0,
          most_common_symptoms: getMostCommonSymptoms(symptoms || []),
          trends: analyzeTrends(symptoms || [])
        },
        recommendations,
        insights
      };

      const { data, error } = await supabase
        .from('health_reports')
        .insert([reportData])
        .select()
        .single();

      if (error) throw error;

      setReports(prev => [data, ...prev]);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully!`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate health report');
    } finally {
      setGenerating(false);
    }
  };

  const generateAIInsights = (symptoms: any[]) => {
    const insights = [];
    
    if (symptoms.length === 0) {
      insights.push({
        type: 'info',
        title: 'No Recent Data',
        description: 'Start tracking your symptoms to get personalized insights.'
      });
      return insights;
    }

    const avgSeverity = symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length;
    
    if (avgSeverity > 7) {
      insights.push({
        type: 'warning',
        title: 'High Symptom Severity',
        description: 'Your symptoms are quite severe. Consider consulting with a healthcare provider.'
      });
    } else if (avgSeverity > 4) {
      insights.push({
        type: 'info',
        title: 'Moderate Symptoms',
        description: 'Your symptoms are moderate. Focus on self-care and stress management.'
      });
    } else {
      insights.push({
        type: 'success',
        title: 'Mild Symptoms',
        description: 'Great job! Your symptoms are well-managed. Keep up the good work.'
      });
    }

    // Analyze patterns
    const hotFlashes = symptoms.filter(s => s.symptom_type === 'hot_flashes');
    if (hotFlashes.length > 0) {
      insights.push({
        type: 'info',
        title: 'Hot Flash Pattern',
        description: `You experienced ${hotFlashes.length} hot flash episodes. Consider tracking triggers.`
      });
    }

    return insights;
  };

  const generateRecommendations = (symptoms: any[]) => {
    const recommendations = [];
    
    const avgSeverity = symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length;
    
    if (avgSeverity > 5) {
      recommendations.push({
        category: 'Stress Management',
        suggestions: ['Practice daily meditation', 'Try deep breathing exercises', 'Consider yoga or gentle stretching']
      });
    }

    const sleepIssues = symptoms.filter(s => s.symptom_type === 'sleep_quality' && s.severity > 5);
    if (sleepIssues.length > 0) {
      recommendations.push({
        category: 'Sleep Hygiene',
        suggestions: ['Maintain consistent sleep schedule', 'Avoid caffeine after 2 PM', 'Create a relaxing bedtime routine']
      });
    }

    const anxiety = symptoms.filter(s => s.symptom_type === 'anxiety' && s.severity > 5);
    if (anxiety.length > 0) {
      recommendations.push({
        category: 'Mental Health',
        suggestions: ['Practice mindfulness meditation', 'Consider talking to a counselor', 'Engage in regular physical activity']
      });
    }

    return recommendations;
  };

  const getMostCommonSymptoms = (symptoms: any[]) => {
    const symptomCounts: { [key: string]: number } = {};
    symptoms.forEach(s => {
      symptomCounts[s.symptom_type] = (symptomCounts[s.symptom_type] || 0) + 1;
    });
    
    return Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([symptom, count]) => ({ symptom, count }));
  };

  const analyzeTrends = (symptoms: any[]) => {
    if (symptoms.length < 2) return 'insufficient_data';
    
    const recent = symptoms.slice(0, Math.floor(symptoms.length / 2));
    const older = symptoms.slice(Math.floor(symptoms.length / 2));
    
    const recentAvg = recent.reduce((sum, s) => sum + s.severity, 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + s.severity, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'worsening';
    if (recentAvg < olderAvg * 0.9) return 'improving';
    return 'stable';
  };

  const downloadReport = async (report: HealthReport) => {
    // In a real app, this would generate and download a PDF
    toast.info('Report download feature coming soon!');
  };

  const shareReport = async (report: HealthReport) => {
    // In a real app, this would share the report
    toast.info('Report sharing feature coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Reports</h2>
          <p className="text-gray-600">AI-generated wellness reports for your doctor</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => generateReport('weekly')}
            disabled={generating}
            variant="outline"
            size="sm"
          >
            {generating ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            Weekly Report
          </Button>
          <Button
            onClick={() => generateReport('monthly')}
            disabled={generating}
            size="sm"
          >
            {generating ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            Monthly Report
          </Button>
        </div>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
            <p className="text-gray-600 mb-4">
              Generate your first health report to track your wellness journey
            </p>
            <Button onClick={() => generateReport('weekly')}>
              Generate Weekly Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)} Report
                      </CardTitle>
                      <CardDescription>
                        {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareReport(report)}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="insights">AI Insights</TabsTrigger>
                      <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="summary" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {report.symptoms_summary.total_entries}
                          </div>
                          <div className="text-sm text-gray-600">Total Entries</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {report.symptoms_summary.average_severity.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600">Avg Severity</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {report.symptoms_summary.trends === 'improving' ? '↗' : 
                             report.symptoms_summary.trends === 'worsening' ? '↘' : '→'}
                          </div>
                          <div className="text-sm text-gray-600">Trend</div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="insights" className="mt-4">
                      <div className="space-y-3">
                        {report.insights.map((insight: any, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                            {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />}
                            {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                            {insight.type === 'info' && <Activity className="w-5 h-5 text-blue-500 mt-0.5" />}
                            <div>
                              <div className="font-medium">{insight.title}</div>
                              <div className="text-sm text-gray-600">{insight.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="recommendations" className="mt-4">
                      <div className="space-y-4">
                        {report.recommendations.map((rec: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-2">{rec.category}</h4>
                            <ul className="space-y-1">
                              {rec.suggestions.map((suggestion: string, idx: number) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthReports;
