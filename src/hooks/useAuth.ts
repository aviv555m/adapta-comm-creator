import { useSupabaseAuth } from './useSupabaseAuth';

// Re-export Supabase auth with backward compatibility
export const useAuth = () => {
  const auth = useSupabaseAuth();
  
  // Transform Supabase user to match the old interface
  const user = auth.user ? {
    email: auth.user.email || '',
    name: auth.user.user_metadata?.name || auth.user.email?.split('@')[0] || 'User'
  } : null;

  return {
    ...auth,
    user,
    // Keep old method signatures for compatibility
    signIn: async (email: string, password: string) => {
      const result = await auth.signIn(email, password);
      return result.error ? { success: false, error: result.error.message } : { success: true };
    },
    signInWithGoogle: async () => {
      const result = await auth.signInWithGoogle();
      return result.error ? { success: false, error: result.error.message } : { success: true };
    },
    signOut: () => {
      auth.signOut();
    }
  };
};