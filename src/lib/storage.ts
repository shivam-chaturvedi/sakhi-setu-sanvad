import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  data: { path: string } | null;
  error: Error | null;
}

export interface AvatarUploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Upload avatar image to Supabase storage
 */
export const uploadAvatar = async (
  file: File,
  userId: string
): Promise<AvatarUploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        url: null,
        error: 'Please select a valid image file'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        url: null,
        error: 'Image size must be less than 5MB'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        url: null,
        error: error.message
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      error: null
    };
  } catch (error) {
    console.error('Avatar upload error:', error);
    return {
      url: null,
      error: 'Failed to upload avatar. Please try again.'
    };
  }
};

/**
 * Delete avatar from Supabase storage
 */
export const deleteAvatar = async (avatarUrl: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const url = new URL(avatarUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Avatar delete error:', error);
    return false;
  }
};

/**
 * Get avatar URL from user profile
 */
export const getAvatarUrl = (profile: any): string | null => {
  if (profile?.avatar_url) {
    return profile.avatar_url;
  }
  
  // Generate default avatar using user's initials
  if (profile?.full_name) {
    const initials = profile.full_name
      .split(' ')
      .map((name: string) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    // You can use a service like UI Avatars or create a default avatar
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=200`;
  }
  
  return null;
};

/**
 * Update user profile with avatar URL
 */
export const updateProfileAvatar = async (
  userId: string,
  avatarUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ avatar_url: avatarUrl })
      .eq('user_id', userId);

    if (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Profile avatar update error:', error);
    return {
      success: false,
      error: 'Failed to update profile avatar'
    };
  }
};
