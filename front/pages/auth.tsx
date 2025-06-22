import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { login, register } from '../utils/api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
        router.push('/chat');
      } else {
        await register(username, password);
        // После успешной регистрации сразу логиним пользователя
        await login(username, password);
        router.push('/chat');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Sign In' : 'Sign Up'} - PBLift</title>
      </Head>

      <main className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 shadow-xl animate-scale-in">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <i className="fas fa-brain text-2xl text-primary"></i>
                <span className="text-2xl font-bold text-primary">PBLift</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome back!' : 'Create your account'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isLogin 
                  ? 'Enter your details to access your personal AI internship'
                  : 'Start your journey with personalized AI mentorship'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg animate-fade-up">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  placeholder="your_username"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-primary text-white rounded-lg font-medium transition-all transform hover:shadow-lg hover:shadow-primary/25 animate-fade-up ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'
                }`}
                style={{ animationDelay: '0.4s' }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center animate-fade-up" style={{ animationDelay: '0.5s' }}>
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-primary font-medium hover:underline"
                  disabled={isLoading}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-up" style={{ animationDelay: '0.6s' }}>
              <button className="w-full py-3 px-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:shadow-md">
                <i className="fab fa-google text-primary"></i>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 