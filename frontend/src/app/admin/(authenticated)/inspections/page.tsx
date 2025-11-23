'use client';

import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import apiAdmin from '@/app/lib/api-admin';

interface Inspection {
  id: number;
  user_id: number;
  vehicle_id: number;
  inspection_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  report: string | null;
  created_at: string;
  user?: {
    username: string;
    email: string;
  };
  vehicle?: {
    marca: string;
    modelo: string;
  };
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const response = await apiAdmin.get('/api/admin/inspections');
      setInspections(response.data.inspections);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar vistorias');
      console.error('Erro ao carregar vistorias:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInspections = inspections.filter(inspection => 
    statusFilter === 'all' || inspection.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '⏳ Pendente', color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: '✅ Concluída', color: 'bg-green-100 text-green-800' },
      cancelled: { label: '❌ Cancelada', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
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
      key: 'inspection_date',
      label: 'Data Agendada',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'created_at',
      label: 'Data Solicitação',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  const actions = [
    {
      label: (inspection: Inspection) => inspection.status === 'pending' ? 'Concluir' : 'Ver Detalhes',
      onClick: (inspection: Inspection) => {
        if (inspection.status === 'pending') {
          console.log('Concluir vistoria:', inspection);
        } else {
          console.log('Ver detalhes da vistoria:', inspection);
        }
      },
      variant: 'primary' as const
    },
    {
      label: 'Editar',
      onClick: (inspection: Inspection) => console.log('Editar vistoria:', inspection),
      variant: 'secondary' as const
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-4 text-gray-600">Carregando vistorias...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔍 Gerenciar Vistorias</h1>
          <p className="text-gray-600 mt-2">
            {inspections.length} vistoria{inspections.length !== 1 ? 's' : ''} agendada{inspections.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendentes</option>
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

      <DataTable
        data={filteredInspections}
        columns={columns}
        actions={actions}
        searchKey="vehicle"
        emptyMessage="Nenhuma vistoria encontrada"
      />
    </div>
  );
}