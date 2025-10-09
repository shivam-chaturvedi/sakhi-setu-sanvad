import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Bot } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';

interface AIAssistantProps {
  onResponse?: (response: string) => void;
  placeholder?: string;
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  onResponse, 
  placeholder = "Ask me anything about your health and wellness...",
  className = ""
}) => {
  const [input, setInput] = useState('');
  const { isLoading, generateWellnessAdvice } = useGemini({
    onSuccess: (response) => {
      onResponse?.(response);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      await generateWellnessAdvice(input, {
        age: 45, // You can make this dynamic
        symptoms: [], // Extract from user data
        concerns: [] // Extract from user data
      });
    } catch (error) {
      console.error('AI Assistant Error:', error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-500" />
          AI Health Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px]"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Ask AI
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
