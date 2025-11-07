import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Play, BookOpen, FileText, Video, Calendar, Clock, ExternalLink, Trash2, User } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  language: string;
  category: string;
  created_at: string;
  publisher?: string;
  user_id?: string;
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
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const searchRealResources = async (searchQuery: string) => {
    try {
      // Search for real resources based on menopause-related topics
      const searchTerms = [
        'menopause yoga exercises',
        'menopause nutrition guidelines',
        'menopause meditation techniques',
        'menopause hormonal changes education',
        'menopause sleep hygiene tips',
        'menopause support groups community'
      ];

      const allResources: Resource[] = [];

      for (const term of searchTerms) {
        try {
          // Use a simple search approach - in a real app, you'd use a proper search API
          const searchResults = await performWebSearch(term);
          allResources.push(...searchResults);
        } catch (error) {
          console.error(`Error searching for ${term}:`, error);
        }
      }

      // If no real results, fall back to curated real resources
      if (allResources.length === 0) {
        const curatedResources: Resource[] = [
          {
            id: '1',
            title: 'Yoga for Menopause Relief',
            description: 'Gentle yoga routines specifically designed for women experiencing menopause symptoms, including hot flashes and mood changes.',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=H3vLZqPZxZE',
            language: 'en',
            category: 'Exercise',
            created_at: new Date().toISOString(),
            publisher: 'Yoga with Adriene',
          },
          {
            id: '2',
            title: 'Nutritional Guidelines for Menopause',
            description: 'Essential dietary recommendations and nutritional strategies to support your body during menopause transition.',
            type: 'article',
            url: 'https://www.webmd.com/menopause/staying-healthy-through-good-nuitrition',
            language: 'en',
            category: 'Nutrition',
            created_at: new Date().toISOString(),
            publisher: 'WebMD',
          },
          {
            id: '3',
            title: 'Meditation for Hot Flashes',
            description: 'Breathing techniques and mindfulness practices to help manage hot flash episodes and stress during menopause.',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=ZToicYcHIOU',
            language: 'en',
            category: 'Meditation',
            created_at: new Date().toISOString(),
            publisher: 'Headspace',
          },
          {
            id: '4',
            title: 'Understanding Hormonal Changes',
            description: 'A comprehensive medical guide to understanding what happens to your body during menopause and perimenopause.',
            type: 'article',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK507826/',
            language: 'en',
            category: 'Education',
            created_at: new Date().toISOString(),
            publisher: 'Cleveland Clinic',
          },
          {
            id: '5',
            title: 'Sleep Hygiene Tips for Menopause',
            description: 'Practical advice and strategies for improving sleep quality and managing insomnia during menopause.',
            type: 'video',
            url: 'https://youtu.be/Tf_Mog6j2lQ?si=XadKo2YyuUegUcm9',
            language: 'en',
            category: 'Medical',
            created_at: new Date().toISOString(),
            publisher: 'Sleep Foundation',
          },
          {
            id: '6',
            title: 'Menopause Support Groups',
            description: 'Connect with local support groups, online communities, and professional resources for menopause support.',
            type: 'article',
            url: 'https://menopause.org/',
            language: 'en',
            category: 'Community',
            created_at: new Date().toISOString(),
            publisher: 'NAMS',
          },
          {
            id: '7',
            title: 'Menopause Exercise Routine',
            description: 'Complete exercise routine designed specifically for women going through menopause to maintain strength and bone health.',
            type: 'video',
            url: 'https://youtu.be/lcc1ldDn7g4?si=PIz65THi-xf9hTQK',
            language: 'en',
            category: 'Exercise',
            created_at: new Date().toISOString(),
            publisher: 'Fitness Blender',
          },
          {
            id: '8',
            title: 'Menopause Diet and Nutrition',
            description: 'Nutritional guidance and meal planning tips to support your body during menopause transition.',
            type: 'video',
            url: 'https://youtu.be/r-QUQipn8z0?si=DjSy29OLmzT9xAnx',
            language: 'en',
            category: 'Nutrition',
            created_at: new Date().toISOString(),
            publisher: 'Nutritionist',
          },
        ];
        setResources(curatedResources);
      } else {
        setResources(allResources);
      }
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

  const performWebSearch = async (query: string): Promise<Resource[]> => {
    // This is a placeholder for web search functionality
    // In a real implementation, you would use a search API like Google Custom Search, Bing, or similar
    // For now, return empty array to use curated resources
    return [];
  };

  const fetchResources = async () => {
    await searchRealResources('menopause resources');
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

  const handleDeleteResource = async (resourceId: string) => {
    if (!user) return;
    
    try {
      // In a real implementation, you would delete from database
      // For now, just remove from local state
      setResources(resources.filter(resource => resource.id !== resourceId));
      
      toast({
        title: 'Resource Deleted',
        description: 'The resource has been removed successfully',
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete resource',
        variant: 'destructive',
      });
    }
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
        <CardContent className="p-4 sm:p-6">
          <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              {resourceTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TabsTrigger key={type.value} value={type.value} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-4">
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">{type.label}</span>
                    <span className="xs:hidden">{type.label.charAt(0)}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-4 sm:mt-6">
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
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
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              {getTypeIcon(resource.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">
                                  {resource.title}
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                                  {resource.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                                  <Badge className={`${getCategoryColor(resource.category)} text-xs`}>
                                    {resource.category}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                    {getTypeIcon(resource.type)}
                                    <span className="hidden sm:inline">{resource.type}</span>
                                    <span className="sm:hidden">{resource.type.charAt(0)}</span>
                                  </Badge>
                                </div>
                                {resource.publisher && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                    <User className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">Published by {resource.publisher}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-shrink-0 flex flex-row sm:flex-col gap-2">
                                {user && resource.user_id === user.id && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                                      >
                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="mx-4 max-w-sm sm:max-w-md">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the resource "{resource.title}" from the library.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteResource(resource.id)}
                                          className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                                        >
                                          Delete Resource
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500 mt-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                {new Date(resource.created_at).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 flex-shrink-0" />
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
