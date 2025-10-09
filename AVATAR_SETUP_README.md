# Avatar Upload Setup Guide

This guide explains how to set up profile avatar upload functionality in your Sakhi Setu Sanvad application.

## 🚀 Quick Setup

### 1. Run the Supabase Setup Script

Execute the SQL script in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase_avatar_setup.sql`
4. Click **Run** to execute the script

This will:
- Create the `avatars` storage bucket
- Add `avatar_url` column to `user_profiles` table
- Set up proper RLS policies for security
- Create triggers for automatic URL updates

### 2. Storage Bucket Configuration

The script creates a bucket named `avatars` with:
- **Public access**: Yes (for displaying avatars)
- **File size limit**: 5MB
- **Allowed file types**: JPEG, PNG, GIF, WebP
- **Security**: Users can only upload/update/delete their own avatars

### 3. Database Schema Updates

The `user_profiles` table now includes:
```sql
avatar_url TEXT -- URL of the user's profile avatar
```

## 🔧 Features Implemented

### AvatarUpload Component
- **File validation**: Type and size checking
- **Preview functionality**: See image before uploading
- **Error handling**: User-friendly error messages
- **Loading states**: Visual feedback during upload
- **Multiple sizes**: Small, medium, large variants

### Storage Integration
- **Supabase Storage**: Secure file storage
- **Automatic URL generation**: Public URLs for avatars
- **Profile updates**: Automatic database updates
- **Fallback avatars**: Default avatars using user initials

### Profile Components Updated
- **EnhancedProfile**: Shows avatar with upload option
- **EditProfileForm**: Avatar upload in edit mode
- **Removed profile views**: Cleaner profile display

## 📁 Files Created/Modified

### New Files:
- `src/lib/storage.ts` - Storage utility functions
- `src/components/AvatarUpload.tsx` - Avatar upload component
- `supabase_avatar_setup.sql` - Database setup script

### Modified Files:
- `src/components/EnhancedProfile.tsx` - Added avatar display and upload
- `src/components/EditProfileForm.tsx` - Added avatar upload to edit form

## 🎨 Usage Examples

### Basic Avatar Upload
```tsx
import AvatarUpload from '@/components/AvatarUpload';

<AvatarUpload
  currentAvatar={user.avatar_url}
  onAvatarUpdate={(url) => setUser({...user, avatar_url: url})}
  size="lg"
/>
```

### With Custom Styling
```tsx
<AvatarUpload
  currentAvatar={profile.avatar_url}
  onAvatarUpdate={handleAvatarUpdate}
  size="md"
  className="mx-auto"
  showUploadButton={true}
/>
```

## 🔒 Security Features

- **RLS Policies**: Users can only access their own avatars
- **File Validation**: Type and size restrictions
- **Secure Upload**: Files uploaded to user-specific paths
- **Public Read Access**: Avatars are publicly viewable (as intended)

## 🐛 Troubleshooting

### Common Issues:

1. **Upload fails**: Check Supabase storage bucket exists and RLS policies are set
2. **Images not displaying**: Verify bucket is public and URLs are correct
3. **Permission errors**: Ensure RLS policies allow user operations
4. **File size errors**: Check file size limit (5MB) and file type

### Debug Steps:

1. Check browser console for errors
2. Verify Supabase storage bucket configuration
3. Test RLS policies in Supabase dashboard
4. Check network tab for failed requests

## 📝 Notes

- Avatars are stored in the `avatars` bucket
- File naming: `{user_id}-{timestamp}.{extension}`
- Automatic cleanup: Old avatars should be manually managed
- Default avatars use UI Avatars service for initials

## 🚀 Next Steps

1. Run the SQL setup script
2. Test avatar upload functionality
3. Customize avatar styling as needed
4. Add avatar deletion functionality if required
5. Implement avatar cropping/resizing if needed

The avatar upload system is now ready to use! 🎉
