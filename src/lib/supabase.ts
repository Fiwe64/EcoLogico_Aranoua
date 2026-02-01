import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://blyfxgquhfxwfpzygnmu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJseWZ4Z3F1aGZ4d2Zwenlnbm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NDA5MDcsImV4cCI6MjA4MzIxNjkwN30.8VGKlEsoaaSomWpBLIDEIM0kAOk2O-nCLG6TMywPR1c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});