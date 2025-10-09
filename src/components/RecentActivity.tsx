import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, MessageCircle, User, FileText, Heart, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Activity {
  id: string;
  type: 'video' | 'message' | 'profile' | 'post';
  title: string;
  description: string;
  created_at: string;
  metadata?: any;
}

interface RecentActivityProps {
  profile?: any;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ profile }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user, profile]);

  const fetchActivities = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const allActivities: Activity[] = [];

      // Fetch video activities
      const { data: videos, error: videoError } = await supabase
        .from('video_library')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!videoError && videos) {
        videos.forEach(video => {
          allActivities.push({
            id: `video-${video.id}`,
            type: 'video',
            title: 'Published a video',
            description: video.title,
            created_at: video.created_at,
            metadata: { videoId: video.id }
          });
        });
      }

      // Fetch community post activities
      const { data: posts, error: postError } = await supabase
        .from('community_posts')
        .select('id, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!postError && posts) {
        posts.forEach(post => {
          allActivities.push({
            id: `post-${post.id}`,
            type: 'message',
            title: 'Shared a message',
            description: post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content,
            created_at: post.created_at,
            metadata: { postId: post.id }
          });
        });
      }

      // Fetch profile update activities
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('updated_at')
        .eq('user_id', user.id)
        .single();

      if (!profileError && profileData?.updated_at) {
        allActivities.push({
          id: 'profile-update',
          type: 'profile',
          title: 'Updated profile',
          description: 'Profile information was updated',
          created_at: profileData.updated_at,
          metadata: {}
        });
      }

      // Add sample wellness activities (in a real app, these would come from wellness tracking tables)
      const sampleWellnessActivities = generateSampleWellnessActivities();
      allActivities.push(...sampleWellnessActivities);

      // Sort by date and take most recent 5
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setActivities(sortedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load recent activity');
    } finally {
      setLoading(false);
    }
  };

  const generateSampleWellnessActivities = (): Activity[] => {
    const now = new Date();
    const activities: Activity[] = [];

    // Generate sleep tracking activities
    for (let i = 0; i < 3; i++) {
      const sleepQuality = Math.floor(Math.random() * 3) + 7; // 7-9
      const hoursAgo = (i + 1) * 8; // 8, 16, 24 hours ago
      const activityDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      activities.push({
        id: `sleep-${i}`,
        type: 'wellness',
        title: 'Logged sleep quality',
        description: `${sleepQuality}/10`,
        created_at: activityDate.toISOString(),
        metadata: { quality: sleepQuality }
      });
    }

    // Generate meditation activities
    for (let i = 0; i < 2; i++) {
      const hoursAgo = (i + 1) * 12; // 12, 24 hours ago
      const activityDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      const duration = Math.floor(Math.random() * 10) + 10; // 10-20 minutes
      
      activities.push({
        id: `meditation-${i}`,
        type: 'wellness',
        title: 'Completed meditation',
        description: `${duration} minutes`,
        created_at: activityDate.toISOString(),
        metadata: { duration }
      });
    }

    // Generate exercise activities
    for (let i = 0; i < 2; i++) {
      const hoursAgo = (i + 1) * 24; // 1, 2 days ago
      const activityDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      const exercises = ['yoga', 'walking', 'stretching', 'breathing exercises'];
      const exercise = exercises[Math.floor(Math.random() * exercises.length)];
      
      activities.push({
        id: `exercise-${i}`,
        type: 'wellness',
        title: 'Completed exercise',
        description: exercise,
        created_at: activityDate.toISOString(),
        metadata: { exercise }
      });
    }

    return activities;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'message':
        return <MessageCircle className="w-4 h-4" />;
      case 'profile':
        return <User className="w-4 h-4" />;
      case 'post':
        return <FileText className="w-4 h-4" />;
      case 'wellness':
        return <Heart className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-green-500';
      case 'message':
        return 'bg-blue-500';
      case 'profile':
        return 'bg-purple-500';
      case 'post':
        return 'bg-orange-500';
      case 'wellness':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">Start engaging with the community to see your activity here!</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getActivityIcon(activity.type)}
                    <span className="text-sm font-medium">{activity.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {formatTime(activity.created_at)}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
