import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Play, BookOpen, FileText, Video, Calendar, Clock, ExternalLink } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  language: string;
  category: string;
  created_at: string;
}

const categories = [
  'All',
  'Exercise',
  'Nutrition',
  'Meditation',
  'Medical',
  'Community',
  'Education'
];

const resourceTypes = [
  { value: 'all', label: 'All', icon: FileText },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'article', label: 'Articles', icon: BookOpen },
];

export const ResourceRepository: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const { user } = useAuth();
  const { language, translate } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      // For now, we'll use mock data since we don't have resources in the database yet
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Yoga for Menopause Relief',
          description: 'A gentle 20-minute yoga routine specifically designed for women experiencing menopause symptoms.',
          type: 'video',
          url: 'https://www.youtube.com/watch?v=example1',
          language: 'en',
          category: 'Exercise',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Nutritional Guidelines for Menopause',
          description: 'Essential dietary recommendations to support your body during menopause transition.',
          type: 'article',
          url: 'https://example.com/nutrition-guide',
          language: 'en',
          category: 'Nutrition',
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Meditation for Hot Flashes',
          description: 'Breathing techniques and meditation practices to help manage hot flash episodes.',
          type: 'video',
          url: 'https://www.youtube.com/watch?v=example2',
          language: 'en',
          category: 'Meditation',
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          title: 'Understanding Hormonal Changes',
          description: 'A comprehensive guide to understanding what happens to your body during menopause.',
          type: 'article',
          url: 'https://example.com/hormonal-changes',
          language: 'en',
          category: 'Education',
          created_at: new Date().toISOString(),
        },
        {
          id: '5',
          title: 'Sleep Hygiene Tips',
          description: 'Practical advice for improving sleep quality during menopause.',
          type: 'article',
          url: 'https://example.com/sleep-tips',
          language: 'en',
          category: 'Medical',
          created_at: new Date().toISOString(),
        },
        {
          id: '6',
          title: 'Community Support Groups',
          description: 'Connect with local support groups and online communities for menopause support.',
          type: 'article',
          url: 'https://example.com/support-groups',
          language: 'en',
          category: 'Community',
          created_at: new Date().toISOString(),
        },
      ];

      setResources(mockResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: 'Error',
        description: 'Failed to load resources',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const categoryMatch = selectedCategory === 'All' || resource.category === selectedCategory;
    const typeMatch = selectedType === 'all' || resource.type === selectedType;
    return categoryMatch && typeMatch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'article':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Exercise': 'bg-green-100 text-green-800',
      'Nutrition': 'bg-orange-100 text-orange-800',
      'Meditation': 'bg-purple-100 text-purple-800',
      'Medical': 'bg-red-100 text-red-800',
      'Community': 'bg-blue-100 text-blue-800',
      'Education': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleResourceClick = (resource: Resource) => {
    // In a real app, you might want to track resource views
    toast({
      title: 'Opening Resource',
      description: `Opening ${resource.title}`,
    });
    
    // Open in new tab
    window.open(resource.url, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading resources...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Resource Repository
          </CardTitle>
          <CardDescription>
            Educational content, videos, and articles to support your menopause journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {resourceTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TabsTrigger key={type.value} value={type.value} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredResources.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No resources found for the selected filters.</p>
                  </div>
                ) : (
                  filteredResources.map((resource) => (
                    <Card
                      key={resource.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleResourceClick(resource)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              {getTypeIcon(resource.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                  {resource.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {resource.description}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getCategoryColor(resource.category)}>
                                    {resource.category}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    {getTypeIcon(resource.type)}
                                    {resource.type}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-4">
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(resource.created_at).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {resource.type === 'video' ? '20 min' : '5 min read'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
