'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '../../components/DataTable';
import apiAdmin from '@/app/lib/api-admin';

interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  is_reserved: boolean;
  photo_url: string | null;
  created_at: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await apiAdmin.get('/api/admin/vehicles');
      setVehicles(response.data.vehicles);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar veículos');
      console.error('Erro ao carregar veículos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = () => {
    router.push('/admin/vehicles/new');
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'marca',
      label: 'Marca',
      sortable: true
    },
    {
      key: 'modelo',
      label: 'Modelo',
      sortable: true
    },
    {
      key: 'ano',
      label: 'Ano',
      sortable: true
    },
    {
      key: 'preco',
      label: 'Preço',
      sortable: true,
      render: (value: number) => `R$ ${value.toLocaleString('pt-BR')}`
    },
    {
      key: 'is_reserved',
      label: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-orange-100 text-orange-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {value ? '🟠 Reservado' : '🟢 Disponível'}
        </span>
      )
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
      onClick: (vehicle: Vehicle) => console.log('Editar veículo:', vehicle),
      variant: 'secondary' as const
    },
    {
      label: (vehicle: Vehicle) => vehicle.is_reserved ? 'Ver Reserva' : 'Reservar',
      onClick: (vehicle: Vehicle) => console.log('Ação reserva:', vehicle),
      variant: 'primary' as const
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-4 text-gray-600">Carregando veículos...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🚗 Gerenciar Veículos</h1>
          <p className="text-gray-600 mt-2">
            {vehicles.length} veículo{vehicles.length !== 1 ? 's' : ''} no sistema
          </p>
        </div>
        <button 
          onClick={handleAddVehicle}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          + Adicionar Veículo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <DataTable
        data={vehicles}
        columns={columns}
        actions={actions}
        searchKey="modelo"
        emptyMessage="Nenhum veículo encontrado"
      />
    </div>
  );
}