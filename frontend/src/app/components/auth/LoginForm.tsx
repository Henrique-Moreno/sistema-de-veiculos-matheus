'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/api';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
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
      const response = await api.post('/api/users/login', { email, password });
      console.log('Login bem-sucedido:', {
        data: response.data,
        headers: response.headers,
      });
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login.');
      console.error('Erro no login:', err);
      localStorage.removeItem('isAuthenticated');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Carregando...' : 'Entrar'}
      </Button>
      
      <div className="mt-4 space-y-3 text-center">
        <p className="text-sm">
          Não tem cadastro?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary hover:underline font-medium"
          >
            Crie sua conta
          </button>
        </p>
        
        <div className="pt-3 border-t">
          <Link 
            href="/admin/login" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors inline-flex items-center gap-1"
          >
            🔐 Sou administrador
          </Link>
          <p className="text-xs text-gray-500 mt-1">
            Acesso ao painel administrativo
          </p>
        </div>
      </div>
    </form>
  );
}