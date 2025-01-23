import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import supabase from 'src/lib/supabase';

// Define the types for AuthContext
interface AuthContextType {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  adminInfo: Record<string, any>;
}

// Define the type for children prop
interface AuthProviderProps {
  children: ReactNode;
}

// Create Context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [adminInfo, setAdminInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    // Fetch the session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    // Fetch admin information when session changes
    const fetchAdminInfo = async () => {
      if (session) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('uid', session.user?.id)
          .single();

        if (!error) {
          setAdminInfo(data || {});
        }
      }
    };

    fetchAdminInfo();
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, setSession, adminInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
