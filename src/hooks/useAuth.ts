import { useState, useEffect } from 'react';

interface User {
  email: string;
  name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('adaptacomm_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation for demo
    if (email.includes('@') && password.length >= 8) {
      const user = { email, name: email.split('@')[0] };
      setUser(user);
      localStorage.setItem('adaptacomm_user', JSON.stringify(user));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const signInWithGoogle = async () => {
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = { email: 'user@gmail.com', name: 'Google User' };
    setUser(user);
    localStorage.setItem('adaptacomm_user', JSON.stringify(user));
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('adaptacomm_user');
    localStorage.removeItem('echoes_quiz_v1');
  };

  return {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  };
};