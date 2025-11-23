'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiAdmin from '@/app/lib/api-admin';
import Button from '@/app/components/ui/Button';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiAdmin.post('/api/admin/login', { email, password });
      console.log('Admin login bem-sucedido:', response.data);
      
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));
      
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login como administrador.');
      console.error('Erro no login admin:', err);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            🔐 Painel Administrativo
          </h2>
          <p className="mt-2 text-sm text-purple-200">
            Acesso restrito para administradores
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Email administrativo
              </label>
              <input
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@concessionaria.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Senha
              </label>
              <input
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            variant="admin"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Acessando...' : '🔓 Acessar Painel Admin'}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/auth')}
              className="text-sm text-purple-300 hover:text-white font-medium transition-colors"
            >
              ← Voltar para login de cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}