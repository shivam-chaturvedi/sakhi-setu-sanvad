import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://euulnxqmtkkaaxltqmke.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dWxueHFtdGtrYWF4bHRxbWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODg5OTQsImV4cCI6MjA3NDI2NDk5NH0.XvIqbErxhnRULg4dKVgCBkpqe3aGvEl6zeagK62mlQk';


export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});