import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Heart, 
  MoreVertical, 
  Reply,
  ThumbsUp,
  Share2,
  Flag,
  Smile,
  Image,
  Paperclip,
  Loader2,
  Users,
  Clock,
  Check,
  CheckCheck,
  Wifi
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name?: string;
  likes: number;
  is_anonymous?: boolean;
  replies?: Reply[];
}

interface Reply {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name?: string;
}

export const CommunityChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          users!community_posts_user_id_fkey(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedMessages = data?.map(post => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        created_at: post.created_at,
        user_name: post.users?.full_name || 'Anonymous',
        likes: post.likes || 0,
        is_anonymous: post.is_anonymous || false,
        replies: []
      })) || [];

      setMessages(formattedMessages.reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('community_posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts'
        },
        (payload) => {
          const newPost = payload.new as any;
          const newMessage: Message = {
            id: newPost.id,
            user_id: newPost.user_id,
            content: newPost.content,
            created_at: newPost.created_at,
            user_name: 'Anonymous',
            likes: newPost.likes || 0,
            is_anonymous: newPost.is_anonymous || false,
            replies: []
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };


  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert([{
          user_id: user.id,
          content: newMessage.trim(),
          is_anonymous: false
        }]);

      if (error) throw error;

      setNewMessage('');
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const likeMessage = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ likes: messages.find(m => m.id === messageId)?.likes + 1 })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, likes: msg.likes + 1 }
            : msg
        )
      );
    } catch (error) {
      console.error('Error liking message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          <p className="text-gray-600 dark:text-gray-300">Loading community messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Community Chat</h2>
          <p className="text-gray-600 dark:text-gray-300">Connect with other women on their menopause journey</p>
        </div>
      </div>

      {/* Messages */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-pink-500" />
              <CardTitle className="text-lg">Live Chat</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No messages yet. Be the first to start the conversation!</p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.user_id === user?.id ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start gap-3 ${message.user_id === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                            {getInitials(message.user_name || 'A')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 ${message.user_id === user?.id ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block p-3 rounded-2xl ${
                            message.user_id === user?.id 
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                            message.user_id === user?.id ? 'justify-end' : 'justify-start'
                          }`}>
                            <span>{message.user_name}</span>
                            <span>•</span>
                            <span>{formatTime(message.created_at)}</span>
                            {message.user_id === user?.id && (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Message Actions */}
                      <div className={`flex items-center gap-2 mt-2 ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likeMessage(message.id)}
                          className="h-8 px-2 text-gray-500 hover:text-pink-500"
                        >
                          <Heart className="w-3 h-3 mr-1" />
                          {message.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(message.id)}
                          className="h-8 px-2 text-gray-500 hover:text-blue-500"
                        >
                          <Reply className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-gray-500 hover:text-gray-700"
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Input */}
          {replyingTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border-t bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      // Handle reply submission
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    disabled={!replyContent.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t bg-white dark:bg-gray-900">
            <form onSubmit={sendMessage} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Share your thoughts with the community..."
                  className="pr-20 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500/20"
                  disabled={sending}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};