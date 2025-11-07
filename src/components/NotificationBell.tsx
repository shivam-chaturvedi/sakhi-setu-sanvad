import React, { useState, useEffect } from 'react';
import { Bell, X, Heart, Activity, FileText, MessageCircle, Video, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'symptom' | 'post' | 'video' | 'report' | 'reminder';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Add a function to refresh notifications (can be called from other components)
  useEffect(() => {
    const handleRefreshNotifications = () => {
      if (user) {
        fetchNotifications();
      }
    };

    window.addEventListener('refreshNotifications', handleRefreshNotifications);
    return () => {
      window.removeEventListener('refreshNotifications', handleRefreshNotifications);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      console.log('Fetching notifications for user:', user.id);
      
      // First, fetch existing notifications from database
      const { data: existingNotifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('id, title, message, type, is_read, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (notificationsError) {
        console.error('Error fetching notifications:', notificationsError);
        console.log('Falling back to creating basic notifications...');
        await createFallbackNotifications();
        return;
      }

      console.log('Found notifications:', existingNotifications?.length || 0);

      // Convert database notifications to our format
      const dbNotifications: Notification[] = existingNotifications?.map(n => ({
        id: n.id,
        type: n.type as any,
        title: n.title,
        message: n.message,
        created_at: n.created_at,
        read: n.is_read || false
      })) || [];

      // If no notifications exist, create some from recent activities
      if (dbNotifications.length === 0) {
        console.log('No notifications found, creating initial ones...');
        await createInitialNotifications();
        
        // Wait a moment for the insert to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch again after creating
        const { data: newNotifications, error: fetchError } = await supabase
          .from('notifications')
          .select('id, title, message, type, is_read, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (fetchError) {
          console.error('Error fetching new notifications:', fetchError);
          await createFallbackNotifications();
          return;
        }

        const formattedNotifications: Notification[] = newNotifications?.map(n => ({
          id: n.id,
          type: n.type as any,
          title: n.title,
          message: n.message,
          created_at: n.created_at,
          read: n.is_read || false
        })) || [];

        console.log('Created notifications:', formattedNotifications.length);
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
      } else {
        console.log('Using existing notifications:', dbNotifications.length);
        setNotifications(dbNotifications);
        setUnreadCount(dbNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Create fallback notifications if database fails
      await createFallbackNotifications();
    }
  };

  const createFallbackNotifications = async () => {
    console.log('Creating fallback notifications...');
    // Create some basic notifications without database
    const fallbackNotifications: Notification[] = [
      {
        id: 'welcome-1',
        type: 'tip',
        title: 'Welcome to MyMenoSakhi!',
        message: 'Start tracking your symptoms to get personalized insights.',
        created_at: new Date().toISOString(),
        read: false
      },
      {
        id: 'welcome-2',
        type: 'tip',
        title: 'Community Support',
        message: 'Connect with other women going through similar experiences.',
        created_at: new Date(Date.now() - 60000).toISOString(),
        read: false
      },
      {
        id: 'welcome-3',
        type: 'tip',
        title: 'Wellness Reports',
        message: 'Generate AI-powered health reports based on your data.',
        created_at: new Date(Date.now() - 120000).toISOString(),
        read: false
      }
    ];

    setNotifications(fallbackNotifications);
    setUnreadCount(fallbackNotifications.filter(n => !n.read).length);
  };

  const createInitialNotifications = async () => {
    if (!user) return;

    try {
      console.log('Creating initial notifications for user:', user.id);
      
      // Create some basic welcome notifications first
      const basicNotifications = [
        {
          user_id: user.id,
          title: 'Welcome to MyMenoSakhi!',
          message: 'Start tracking your symptoms to get personalized insights.',
          type: 'tip',
          is_read: false,
          action_url: '/tracker'
        },
        {
          user_id: user.id,
          title: 'Community Support',
          message: 'Connect with other women going through similar experiences.',
          type: 'tip',
          is_read: false,
          action_url: '/community'
        },
        {
          user_id: user.id,
          title: 'Wellness Reports',
          message: 'Generate AI-powered health reports based on your data.',
          type: 'tip',
          is_read: false,
          action_url: '/profile?tab=reports'
        }
      ];

      // Try to insert basic notifications
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(basicNotifications);

      if (insertError) {
        console.error('Error inserting basic notifications:', insertError);
        throw insertError;
      }

      console.log('Successfully created basic notifications');

      // Try to fetch recent activities to create additional notifications
      try {
        const [symptomsResult, postsResult] = await Promise.all([
          supabase
            .from('symptoms')
            .select('id, symptom_type, severity, recorded_at')
            .eq('user_id', user.id)
            .order('recorded_at', { ascending: false })
            .limit(2),
          supabase
            .from('community_posts')
            .select('id, content, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(2)
        ]);

        const additionalNotifications: any[] = [];

        // Add symptom notifications
        if (symptomsResult.data && symptomsResult.data.length > 0) {
          symptomsResult.data.forEach((symptom) => {
            additionalNotifications.push({
              user_id: user.id,
              title: 'Symptom Tracked',
              message: `${symptom.symptom_type} (Severity: ${symptom.severity}/10)`,
              type: 'symptom',
              is_read: false,
              action_url: '/tracker'
            });
          });
        }

        // Add post notifications
        if (postsResult.data && postsResult.data.length > 0) {
          postsResult.data.forEach((post) => {
            additionalNotifications.push({
              user_id: user.id,
              title: 'Community Post',
              message: post.content.substring(0, 50) + '...',
              type: 'post',
              is_read: false,
              action_url: '/community'
            });
          });
        }

        // Insert additional notifications if any
        if (additionalNotifications.length > 0) {
          const { error: additionalError } = await supabase
            .from('notifications')
            .insert(additionalNotifications);
          
          if (additionalError) {
            console.error('Error inserting additional notifications:', additionalError);
          } else {
            console.log('Successfully created additional notifications:', additionalNotifications.length);
          }
        }
      } catch (activityError) {
        console.log('Could not fetch recent activities, using basic notifications only');
      }

    } catch (error) {
      console.error('Error creating initial notifications:', error);
      throw error;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Check if it's a fallback notification (starts with 'welcome-')
      if (notificationId.startsWith('welcome-')) {
        // Just update local state for fallback notifications
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        return;
      }

      // Update in database for real notifications
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error updating notification in database:', error);
      }

      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update all real notifications in database
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error updating notifications in database:', error);
      }

      // Update local state (this will handle both real and fallback notifications)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'symptom':
        return <Activity className="w-4 h-4 text-orange-500" />;
      case 'post':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'report':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'reminder':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-purple-500" />;
      case 'profile':
        return <User className="w-4 h-4 text-indigo-500" />;
      case 'tip':
        return <Heart className="w-4 h-4 text-pink-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Function to create a new notification (can be called from other components)
  const createNotification = async (title: string, message: string, type: string, actionUrl?: string) => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title,
          message,
          type,
          is_read: false,
          action_url: actionUrl
        });

      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Expose createNotification function globally for other components
  useEffect(() => {
    (window as any).createNotification = createNotification;
    return () => {
      delete (window as any).createNotification;
    };
  }, [user]);

  // Add a test function for debugging
  const createTestNotification = () => {
    const testNotification: Notification = {
      id: `test-${Date.now()}`,
      type: 'tip',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working.',
      created_at: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [testNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Expose test function globally for debugging
  useEffect(() => {
    (window as any).createTestNotification = createTestNotification;
    (window as any).testNotificationsTable = testNotificationsTable;
    return () => {
      delete (window as any).createTestNotification;
      delete (window as any).testNotificationsTable;
    };
  }, []);

  // Test function to check if notifications table is accessible
  const testNotificationsTable = async () => {
    if (!user) {
      console.log('No user logged in');
      return;
    }

    try {
      console.log('Testing notifications table access...');
      
      // Try to insert a test notification
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Test Notification',
          message: 'This is a test to verify database access',
          type: 'test',
          is_read: false
        })
        .select();

      if (error) {
        console.error('Error inserting test notification:', error);
        return;
      }

      console.log('Successfully inserted test notification:', data);

      // Try to fetch it back
      const { data: fetchedData, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', data[0].id);

      if (fetchError) {
        console.error('Error fetching test notification:', fetchError);
        return;
      }

      console.log('Successfully fetched test notification:', fetchedData);

      // Clean up - delete the test notification
      await supabase
        .from('notifications')
        .delete()
        .eq('id', data[0].id);

      console.log('Test completed successfully! Notifications table is working.');
    } catch (error) {
      console.error('Error testing notifications table:', error);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-4 h-4 md:w-5 md:h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-12 w-[calc(100vw-2rem)] sm:w-80 max-w-sm sm:max-w-80 max-h-96 overflow-hidden z-50"
          >
            <Card className="shadow-lg border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs h-6 px-2"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications yet
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-700 ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${
                                  notification.read 
                                    ? 'text-gray-900 dark:text-gray-100' 
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {notification.title}
                                </p>
                                <span className={`text-xs ${
                                  notification.read 
                                    ? 'text-gray-700 dark:text-gray-300' 
                                    : 'text-muted-foreground'
                                }`}>
                                  {formatTimeAgo(notification.created_at)}
                                </span>
                              </div>
                              <p className={`text-xs mt-1 line-clamp-2 ${
                                notification.read 
                                  ? 'text-gray-800 dark:text-gray-200' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
