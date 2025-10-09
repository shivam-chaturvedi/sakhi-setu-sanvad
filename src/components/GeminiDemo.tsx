import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Heart, Brain, BookOpen, FileText, Zap } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';

const GeminiDemo = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('general');

  const { 
    isLoading, 
    error, 
    generateContent, 
    generateWellnessAdvice, 
    analyzeSymptoms, 
    generateMenopauseEducation,
    generateHealthReport,
    generateMotivation 
  } = useGemini({
    onSuccess: (result) => setResponse(result),
    onError: (err) => console.error('Gemini Error:', err)
  });

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    try {
      let result: string;

      switch (selectedFunction) {
        case 'wellness':
          result = await generateWellnessAdvice(prompt, {
            age: 45,
            symptoms: ['hot flashes', 'mood changes'],
            concerns: ['sleep quality', 'energy levels']
          });
          break;
        case 'symptoms':
          result = await analyzeSymptoms(prompt.split(',').map(s => s.trim()));
          break;
        case 'education':
          result = await generateMenopauseEducation(prompt, 'beginner');
          break;
        case 'report':
          result = await generateHealthReport({
            symptoms: prompt.split(',').map(s => s.trim()),
            lifestyle: ['exercise', 'healthy diet'],
            concerns: ['weight management'],
            age: 45
          });
          break;
        case 'motivation':
          result = await generateMotivation(prompt, ['wellness', 'energy']);
          break;
        default:
          result = await generateContent(prompt);
      }

      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const functionOptions = [
    { value: 'general', label: 'General Chat', icon: Sparkles },
    { value: 'wellness', label: 'Wellness Advice', icon: Heart },
    { value: 'symptoms', label: 'Symptom Analysis', icon: Brain },
    { value: 'education', label: 'Menopause Education', icon: BookOpen },
    { value: 'report', label: 'Health Report', icon: FileText },
    { value: 'motivation', label: 'Motivation', icon: Zap },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Gemini AI Integration Demo
          </CardTitle>
          <CardDescription>
            Test the Gemini 2.5 Flash model with various health and wellness functions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Function Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Function:</label>
            <div className="flex flex-wrap gap-2">
              {functionOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={selectedFunction === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFunction(option.value)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {selectedFunction === 'symptoms' ? 'Enter symptoms (comma-separated):' : 
               selectedFunction === 'education' ? 'Enter topic:' :
               selectedFunction === 'report' ? 'Enter symptoms (comma-separated):' :
               selectedFunction === 'motivation' ? 'How are you feeling today?' :
               'Enter your prompt:'}
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                selectedFunction === 'symptoms' ? 'hot flashes, mood changes, sleep issues' :
                selectedFunction === 'education' ? 'hormone changes, bone health, nutrition' :
                selectedFunction === 'report' ? 'fatigue, weight gain, mood swings' :
                selectedFunction === 'motivation' ? 'feeling overwhelmed, tired, anxious' :
                'Ask me anything about health and wellness...'
              }
              className="min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !prompt.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Response
              </>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">AI Response</Badge>
                <Badge variant="outline">{functionOptions.find(f => f.value === selectedFunction)?.label}</Badge>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {response}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>Try these example prompts to test different functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Wellness Advice</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "I'm experiencing hot flashes and mood swings. What can I do to manage these symptoms naturally?"
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Symptom Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "hot flashes, night sweats, mood changes, sleep problems"
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Education</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "hormone replacement therapy, bone health, cardiovascular changes"
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Motivation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "feeling overwhelmed by all the changes in my body"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeminiDemo;
