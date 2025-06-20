import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAuthActions() {
  const { login, register, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async (credentials: { email: string; password: string }, redirectTo?: string) => {
    try {
      await login(credentials);
      router.push(redirectTo || '/dashboard');
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleRegister = async (data: any, redirectTo?: string) => {
    try {
      await register(data);
      router.push(redirectTo || '/dashboard');
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const redirectToLogin = (currentPath?: string) => {
    const loginPath = currentPath ? `/auth/login?redirect=${encodeURIComponent(currentPath)}` : '/auth/login';
    router.push(loginPath);
  };

  const redirectToRegister = () => {
    router.push('/auth/register');
  };

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    redirectToLogin,
    redirectToRegister,
    isLoading,
  };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login');
    return false;
  }

  return isAuthenticated;
}
