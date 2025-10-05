import { supabase } from '@/integrations/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    return false;
  }
};

export const checkTablesExist = async () => {
  const tables = [
    'users',
    'symptoms', 
    'wellness_tips',
    'community_posts',
    'resources',
    'health_reports',
    'reminders',
    'phc_directory',
    'chatbot_conversations',
    'voice_notes',
    'user_goals',
    'notifications'
  ];
  
  const results = [];
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Table '${table}' not found:`, error.message);
        results.push({ table, exists: false, error: error.message });
      } else {
        console.log(`✅ Table '${table}' exists`);
        results.push({ table, exists: true });
      }
    } catch (err) {
      console.error(`❌ Error checking table '${table}':`, err);
      results.push({ table, exists: false, error: String(err) });
    }
  }
  
  return results;
};
