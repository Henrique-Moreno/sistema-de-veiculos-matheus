'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import NavLinks from './NavLinks';

interface UserProfile {
  username: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      console.log('Nenhuma sessão encontrada, redirecionando para /auth');
      router.replace('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('Buscando perfil do usuário');
        const response = await api.get('/api/users/profile');
        setUser(response.data.user);
      } catch (err: any) {
        console.error('Erro ao buscar perfil:', err);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        router.replace('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      console.log('Fazendo logout');
      await api.post('/api/users/logout');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authToken');
      router.push('/auth');
    }
  };

  return (
    <header className="bg-[var(--primary)] text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-xl font-bold mb-2 sm:mb-0">Concessionária</h1>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <NavLinks />
          <div className="flex items-center space-x-2">
            {loading ? (
              <span className="text-sm">Carregando...</span>
            ) : (
              <span className="text-sm font-semibold">{user?.username || 'Usuário'}</span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm hover:underline text-emerald-500 font-bold"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;