import { useState, useCallback } from 'react';
import { geminiModel, GeminiModel } from '@/lib/gemini';
import { toast } from 'sonner';

interface UseGeminiOptions {
  onSuccess?: (response: string) => void;
  onError?: (error: Error) => void;
}

export const useGemini = (options?: UseGeminiOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(async (
    prompt: string,
    config?: {
      temperature?: number;
      maxTokens?: number;
      topK?: number;
      topP?: number;
    }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiModel.generateContent(prompt, config);
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options?.onError?.(err as Error);
      toast.error('Failed to generate content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const generateWellnessAdvice = useCallback(async (
    userInput: string,
    context?: {
      age?: number;
      symptoms?: string[];
      concerns?: string[];
    }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiModel.generateWellnessAdvice(userInput, context);
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options?.onError?.(err as Error);
      toast.error('Failed to generate wellness advice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const analyzeSymptoms = useCallback(async (
    symptoms: string[],
    additionalInfo?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiModel.analyzeSymptoms(symptoms, additionalInfo);
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options?.onError?.(err as Error);
      toast.error('Failed to analyze symptoms');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const generateMenopauseEducation = useCallback(async (
    topic: string,
    level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiModel.generateMenopauseEducation(topic, level);
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options?.onError?.(err as Error);
      toast.error('Failed to generate educational content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const generateHealthReport = useCallback(async (
    userData: {
      symptoms: string[];
      lifestyle: string[];
      concerns: string[];
      age?: number;
    }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiModel.generateHealthReport(userData);
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options?.onError?.(err as Error);
      toast.error('Failed to generate health report');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const generateMotivation = useCallback(async (
    userMood: string,
    goals?: string[]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiModel.generateMotivation(userMood, goals);
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options?.onError?.(err as Error);
      toast.error('Failed to generate motivation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    clearError,
    generateContent,
    generateWellnessAdvice,
    analyzeSymptoms,
    generateMenopauseEducation,
    generateHealthReport,
    generateMotivation,
  };
};

export default useGemini;
