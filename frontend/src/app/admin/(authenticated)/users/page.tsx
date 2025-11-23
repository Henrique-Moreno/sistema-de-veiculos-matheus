'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../components/DataTable';
import apiAdmin from '@/app/lib/api-admin';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiAdmin.get('/api/admin/users');
      setUsers(response.data.users);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar usuários');
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleViewPurchases = (user: User) => {
    console.log('Ver compras do usuário:', user);
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'username',
      label: 'Nome',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'created_at',
      label: 'Data de Cadastro',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  const actions = [
    {
      label: 'Editar',
      onClick: handleEditUser,
      variant: 'secondary' as const
    },
    {
      label: 'Ver Compras',
      onClick: handleViewPurchases,
      variant: 'primary' as const
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-4 text-gray-600">Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">👥 Gerenciar Usuários</h1>
        <p className="text-gray-600 mt-2">
          {users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''} no sistema
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <DataTable
        data={users}
        columns={columns}
        actions={actions}
        searchKey="username"
        emptyMessage="Nenhum usuário encontrado"
      />
    </div>
  );
}