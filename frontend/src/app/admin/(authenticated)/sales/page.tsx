'use client';

import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import apiAdmin from '@/app/lib/api-admin';

interface Sale {
  id: number;
  final_price: number;
  created_at: string;
  vehicle?: {
    marca: string;
    modelo: string;
  };
  buyer?: {
    username: string;
  };
}

interface SalesReport {
  period: {
    start_date?: string;
    end_date?: string;
  };
  total_sales: number;
  total_revenue: number;
  average_sale_value: number;
  sales: Sale[];
}

export default function SalesPage() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchSalesReport();
  }, []);

  const fetchSalesReport = async (params?: { start_date?: string; end_date?: string }) => {
    try {
      setLoading(true);
      const response = await apiAdmin.get('/api/admin/sales/reports', { params });
      setReport(response.data.report);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar relatório de vendas');
      console.error('Erro ao carregar vendas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    fetchSalesReport(dateRange);
  };

  const handleClearFilter = () => {
    setDateRange({ start_date: '', end_date: '' });
    fetchSalesReport();
  };

  const columns = [
    {
      key: 'id',
      label: 'ID Venda',
      sortable: true
    },
    {
      key: 'vehicle',
      label: 'Veículo',
      sortable: false,
      render: (value: any) => value ? `${value.marca} ${value.modelo}` : 'N/A'
    },
    {
      key: 'buyer',
      label: 'Comprador',
      sortable: false,
      render: (value: any) => value?.username || 'N/A'
    },
    {
      key: 'final_price',
      label: 'Valor Final',
      sortable: true,
      render: (value: number) => `R$ ${value.toLocaleString('pt-BR')}`
    },
    {
      key: 'created_at',
      label: 'Data da Venda',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  const actions = [
    {
      label: 'Ver Detalhes',
      onClick: (sale: Sale) => console.log('Ver detalhes da venda:', sale),
      variant: 'primary' as const
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-4 text-gray-600">Carregando relatório de vendas...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📈 Relatório de Vendas</h1>
        <p className="text-gray-600 mt-2">
          Análise completa das vendas realizadas
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Período</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={handleDateFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Aplicar Filtro
            </button>
            <button
              onClick={handleClearFilter}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{report.total_sales}</div>
            <div className="text-sm text-gray-600 mt-1">Total de Vendas</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              R$ {report.total_revenue.toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600 mt-1">Faturamento Total</div>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              R$ {report.average_sale_value.toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600 mt-1">Ticket Médio</div>
          </div>
        </div>
      )}

      <DataTable
        data={report?.sales || []}
        columns={columns}
        actions={actions}
        searchKey="vehicle"
        emptyMessage="Nenhuma venda encontrada no período selecionado"
      />
    </div>
  );
}