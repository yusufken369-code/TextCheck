import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://fteokxybopifwgmvpcan.supabase.co';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_X3y-ad-fYmrMDX_EVlaWdA_zgibdD5r';

const safeAsyncStorage = {
  getItem: async (key) => {
    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const val = await AsyncStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      console.warn('AsyncStorage.getItem error:', e);
    }
    return null;
  },
  setItem: async (key, value) => {
    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('AsyncStorage.setItem error:', e);
    }
  },
  removeItem: async (key) => {
    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('AsyncStorage.removeItem error:', e);
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: safeAsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('_dummy_check').select('*').limit(1);
    if (error && error.code !== 'PGRST116' && error.message.indexOf('relation') === -1) {
      console.warn('Supabase connection warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, message: 'Connected to Supabase successfully' };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err.message };
  }
};

export default supabase;
