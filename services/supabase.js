import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = 'https://irvcovkqdcoccswcxdpz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydmNvdmtxZGNvY2Nzd2N4ZHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTMwMzgsImV4cCI6MjA2NzM4OTAzOH0.DV8HFZ0PCmVBYbPmPE7y_IUVzOVEKT7b6jxuWe0q6Bo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});