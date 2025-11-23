'use client';

import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import apiAdmin from '@/app/lib/api-admin';

interface Reservation {
  id: number;
  user_id: number;
  vehicle_id: number;
  inspection_id: number | null;
  amount: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  user?: {
    username: string;
    email: string;
  };
  vehicle?: {
    marca: string;
    modelo: string;
    preco: number;
  };
  inspection?: {
    status: string;
  };
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await apiAdmin.get('/api/admin/reservations');
      setReservations(response.data.reservations);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar reservas');
      console.error('Erro ao carregar reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter(reservation => 
    statusFilter === 'all' || reservation.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: '🟢 Ativa', color: 'bg-green-100 text-green-800' },
      completed: { label: '✅ Concluída', color: 'bg-blue-100 text-blue-800' },
      cancelled: { label: '❌ Cancelada', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'id',
      label: 'ID Reserva',
      sortable: true
    },
    {
      key: 'user',
      label: 'Cliente',
      sortable: false,
      render: (value: any) => value?.username || 'N/A'
    },
    {
      key: 'vehicle',
      label: 'Veículo',
      sortable: false,
      render: (value: any) => value ? `${value.marca} ${value.modelo}` : 'N/A'
    },
    {
      key: 'amount',
      label: 'Sinal',
      sortable: true,
      render: (value: number) => `R$ ${value.toLocaleString('pt-BR')}`
    },
    {
      key: 'vehicle',
      label: 'Valor Veículo',
      sortable: false,
      render: (value: any) => value ? `R$ ${value.preco.toLocaleString('pt-BR')}` : 'N/A'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'inspection',
      label: 'Vistoria',
      sortable: false,
      render: (value: any) => value ? getStatusBadge(value.status) : '❌ Não agendada'
    },
    {
      key: 'created_at',
      label: 'Data Reserva',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  const getActions = (reservation: Reservation) => {
    if (reservation.status === 'active') {
      return [
        {
          label: 'Confirmar Compra',
          onClick: () => console.log('Confirmar compra da reserva:', reservation),
          variant: 'primary' as const
        },
        {
          label: 'Cancelar',
          onClick: () => console.log('Cancelar reserva:', reservation),
          variant: 'danger' as const
        }
      ];
    } else {
      return [
        {
          label: reservation.status === 'completed' ? 'Ver Detalhes' : 'Ver Histórico',
          onClick: () => console.log('Ver detalhes da reserva:', reservation),
          variant: 'primary' as const
        },
        {
          label: 'Reativar',
          onClick: () => console.log('Reativar reserva:', reservation),
          variant: 'secondary' as const
        }
      ];
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-4 text-gray-600">Carregando reservas...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💰 Gerenciar Reservas</h1>
          <p className="text-gray-600 mt-2">
            {reservations.length} reserva{reservations.length !== 1 ? 's' : ''} no sistema
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativas</option>
            <option value="completed">Concluídas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{reservations.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="text-xl font-bold text-green-600">
            {reservations.filter(r => r.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Ativas</div>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="text-xl font-bold text-blue-600">
            {reservations.filter(r => r.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Concluídas</div>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="text-xl font-bold text-red-600">
            {reservations.filter(r => r.status === 'cancelled').length}
          </div>
          <div className="text-sm text-gray-600">Canceladas</div>
        </div>
      </div>

      <DataTable
        data={filteredReservations}
        columns={columns}
        getActions={getActions}
        searchKey="user"
        emptyMessage="Nenhuma reserva encontrada"
      />
    </div>
  );
}