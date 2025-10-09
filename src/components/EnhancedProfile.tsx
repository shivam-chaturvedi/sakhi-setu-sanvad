import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Camera, 
  Edit3, 
  MapPin, 
  Globe, 
  Heart, 
  MessageCircle, 
  Settings,
  Calendar,
  BookOpen,
  Video,
  Play,
  Image as ImageIcon,
  Link,
  Mail,
  Phone,
  Share
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getAvatarUrl } from "@/lib/storage";
import AvatarUpload from "@/components/AvatarUpload";
import { toast } from "sonner";
import RecentActivity from './RecentActivity';

interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  social_links: any;
  interests: string[];
  privacy_settings: any;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface EnhancedProfileProps {
  userProfile?: any;
  onProfileUpdate?: () => void;
}

// UserVideos component to show only current user's videos
const UserVideos = ({ onVideoCountChange }: { onVideoCountChange?: (count: number) => void }) => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserVideos();
    }
  }, [user]);

  useEffect(() => {
    if (onVideoCountChange) {
      onVideoCountChange(videos.length);
    }
  }, [videos.length, onVideoCountChange]);

  const fetchUserVideos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('video_library')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching user videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No videos uploaded yet.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/library'}>
              Go to Library
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get video thumbnail
  const getVideoThumbnail = (videoUrl: string) => {
    if (!videoUrl) return null;
    
    // For YouTube videos
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let videoId = '';
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1].split('&')[0];
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      }
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    // For Vimeo videos
    if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.split('vimeo.com/')[1];
      return `https://vumbnail.com/${videoId}.jpg`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Videos ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const thumbnail = getVideoThumbnail(video.video_url);
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-video bg-muted">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Button
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 shadow-lg"
                          onClick={() => window.open(video.video_url, '_blank')}
                        >
                          <Play className="w-6 h-6 ml-1" fill="currentColor" />
                        </Button>
                      </div>
                      <Badge className="absolute top-2 left-2 bg-primary/90">
                        {video.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {video.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {video.tags && video.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                        <User className="h-3 w-3" />
                        <span>Published by {video.publisher_name || 'You'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(video.published_date || video.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            onClick={() => navigator.share?.({ title: video.title, url: video.video_url })}
                          >
                            <Link className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EnhancedProfile = ({ userProfile: propUserProfile, onProfileUpdate }: EnhancedProfileProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    videos: 0
  });
  const [editForm, setEditForm] = useState({
    bio: "",
    location: "",
    website: "",
    interests: [] as string[],
    social_links: {
      instagram: "",
      twitter: "",
      linkedin: "",
      facebook: ""
    }
  });
  const [newInterest, setNewInterest] = useState("");
  const [uploading, setUploading] = useState(false);

  const interests = [
    "Wellness", "Yoga", "Meditation", "Nutrition", "Exercise", "Mental Health",
    "Community", "Education", "Technology", "Art", "Music", "Travel"
  ];

  // Memoized callback for video count updates
  const handleVideoCountChange = useCallback((count: number) => {
    setStats(prev => ({ ...prev, videos: count }));
  }, []);

  useEffect(() => {
    if (propUserProfile) {
      // Use prop data if available
      setProfile(propUserProfile);
      setEditForm({
        bio: propUserProfile.bio || "",
        location: propUserProfile.location || "",
        website: propUserProfile.website || "",
        interests: propUserProfile.interests || [],
        social_links: propUserProfile.social_links || {
          instagram: "",
          twitter: "",
          linkedin: "",
          facebook: ""
        }
      });
      setLoading(false);
    } else {
    fetchProfile();
    }
    
    if (user) {
      fetchStats();
    }
  }, [user, propUserProfile]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Fetch posts count
      const { count: postsCount, error: postsError } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch videos count
      const { count: videosCount, error: videosError } = await supabase
        .from('video_library')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Also fetch actual videos to debug
      const { data: videosData, error: videosDataError } = await supabase
        .from('video_library')
        .select('id, title, user_id')
        .eq('user_id', user.id);

      // Debug logging
      console.log('Stats query results:', { 
        postsCount, 
        postsError, 
        videosCount, 
        videosError, 
        videosData,
        videosDataError,
        userId: user.id 
      });

      // Ensure we have valid counts
      const finalPostsCount = postsCount !== null ? postsCount : 0;
      const finalVideosCount = videosCount !== null ? videosCount : (videosData ? videosData.length : 0);
      
      console.log('Final stats:', {
        posts: finalPostsCount,
        videos: finalVideosCount
      });

      setStats({
        posts: finalPostsCount,
        videos: finalVideosCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Fetch from both users and user_profiles tables
      const [usersResult, profilesResult] = await Promise.all([
        supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single(),
        supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
          .single()
      ]);

      const userData = usersResult.data;
      const profileData = profilesResult.data;

      if (userData) {
        // Merge data from both tables
        const mergedProfile = {
          ...(profileData as any),
          full_name: (userData as any).full_name,
          avatar_url: (userData as any).avatar_url || (profileData as any)?.avatar_url,
          location: (userData as any).location || (profileData as any)?.location,
          age: (userData as any).age,
          phone: (userData as any).phone,
          emergency_contact: (userData as any).emergency_contact,
          medical_conditions: (userData as any).medical_conditions,
          current_medications: (userData as any).current_medications,
          preferred_language: (userData as any).preferred_language
        };

        setProfile(mergedProfile);
        setEditForm({
          bio: (profileData as any)?.bio || "",
          location: (userData as any).location || (profileData as any)?.location || "",
          website: (profileData as any)?.website || "",
          interests: (profileData as any)?.interests || [],
          social_links: (profileData as any)?.social_links || {
            instagram: "",
            twitter: "",
            linkedin: "",
            facebook: ""
          }
        });
      } else {
        // Create profile if it doesn't exist
        await createProfile();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          bio: "",
          location: "",
          website: "",
          interests: [],
          social_links: {},
          privacy_settings: {},
            avatar_url: null
          } as any)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const updateProfile = async () => {
    if (!user || !profile) return;

    try {
      const updateData = {
          bio: editForm.bio,
          location: editForm.location,
          website: editForm.website,
          interests: editForm.interests,
          social_links: editForm.social_links,
          updated_at: new Date().toISOString()
      };

      const { error } = await (supabase as any)
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setIsEditOpen(false);
      if (onProfileUpdate) {
        onProfileUpdate();
      } else {
      fetchProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user avatar in auth.users
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      // Update profile state with new avatar URL
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      
      // Call onProfileUpdate if provided
      if (onProfileUpdate) {
        onProfileUpdate();
      }

      toast.success('Avatar updated successfully!');
      setIsImageUploadOpen(false);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !editForm.interests.includes(newInterest.trim())) {
      setEditForm({
        ...editForm,
        interests: [...editForm.interests, newInterest.trim()]
      });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setEditForm({
      ...editForm,
      interests: editForm.interests.filter(i => i !== interest)
    });
  };

  const addSocialLink = (platform: string, value: string) => {
    setEditForm({
      ...editForm,
      social_links: {
        ...editForm.social_links,
        [platform]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {(profile?.full_name || user?.user_metadata?.full_name || 'U').charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Dialog open={isImageUploadOpen} onOpenChange={setIsImageUploadOpen}>
            
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                    <DialogDescription>
                      Choose a new profile picture for your account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="avatar-upload">Select Image</Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadAvatar(file);
                        }}
                        disabled={uploading}
                      />
                    </div>
                    {uploading && (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                        <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{user?.user_metadata?.full_name || 'User'}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                  {profile?.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Avatar Upload */}
      <Card className="text-center p-6">
        <AvatarUpload
          currentAvatar={profile?.avatar_url || null}
          onAvatarUpdate={(avatarUrl) => {
            setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
            onProfileUpdate?.();
          }}
          size="lg"
          className="mx-auto"
        />
        <p className="text-sm text-muted-foreground mt-4">
          Click the camera icon to upload your profile picture
        </p>
      </Card>

      {/* Profile Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="text-center p-4">
            <div className="text-xl sm:text-2xl font-bold text-energy">{stats.posts}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Posts</div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="text-center p-4">
            <div className="text-xl sm:text-2xl font-bold text-secondary">{stats.videos}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Videos</div>
          </Card>
        </motion.div>
      </div>

      {/* Profile Content */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {profile?.bio || "No bio available. Click edit profile to add one."}
              </p>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile?.interests?.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                )) || (
                  <p className="text-muted-foreground">No interests added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile?.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
                {profile?.social_links && Object.entries(profile.social_links as Record<string, string>).map(([platform, url]) => (
                  url && (
                    <div key={platform} className="flex items-center gap-2">
                      <span className="capitalize">{platform}:</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {url}
                      </a>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <RecentActivity profile={profile} />
        </TabsContent>

        <TabsContent value="videos">
          <UserVideos onVideoCountChange={handleVideoCountChange} />
        </TabsContent>

      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  placeholder="Your location"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={editForm.website}
                  onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                  placeholder="Your website"
                />
              </div>
            </div>

            <div>
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editForm.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeInterest(interest)}>
                    {interest} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add interest..."
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                />
                <Button onClick={addInterest} disabled={!newInterest.trim()}>
                  Add
                </Button>
              </div>
            </div>

            <div>
              <Label>Social Links</Label>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={editForm.social_links.instagram}
                    onChange={(e) => addSocialLink('instagram', e.target.value)}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={editForm.social_links.twitter}
                    onChange={(e) => addSocialLink('twitter', e.target.value)}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={editForm.social_links.linkedin}
                    onChange={(e) => addSocialLink('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={editForm.social_links.facebook}
                    onChange={(e) => addSocialLink('facebook', e.target.value)}
                    placeholder="facebook.com/username"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { EnhancedProfile };
export default EnhancedProfile;
