'use client';

import { useState, useMemo } from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row?: any) => React.ReactNode;
}

interface Action {
  label: string | ((row: any) => string);
  onClick: (row: any) => void;
  variant: 'primary' | 'secondary' | 'danger';
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  actions?: Action[];
  getActions?: (row: any) => Action[]; 
  searchKey?: string;
  emptyMessage?: string;
}

export default function DataTable({ 
  data, 
  columns, 
  actions = [], 
  getActions,
  searchKey,
  emptyMessage = 'Nenhum dado encontrado' 
}: DataTableProps) {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Aplicar busca
    if (search && searchKey) {
      filtered = filtered.filter(item =>
        item[searchKey]?.toString().toLowerCase().includes(search.toLowerCase())
      );
    }

    // Aplicar ordenação
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, search, searchKey, sortColumn, sortDirection]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const getActionVariantClasses = (variant: Action['variant']) => {
    const classes = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    };
    return `px-3 py-1 rounded text-sm font-medium ${classes[variant]}`;
  };

  // Verifica se tem ações para mostrar a coluna
  const hasActions = actions.length > 0 || getActions;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Search Bar */}
      {searchKey && (
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder={`Buscar por ${columns.find(c => c.key === searchKey)?.label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-2 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="text-gray-400">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (hasActions ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="text-4xl mb-2">📝</div>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredAndSortedData.map((row, index) => {
                // Obtém as ações para esta linha específica
                const rowActions = getActions ? getActions(row) : actions;
                
                return (
                  <tr key={row.id || index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {rowActions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className={getActionVariantClasses(action.variant)}
                            >
                              {typeof action.label === 'function' ? action.label(row) : action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t bg-gray-50">
        <p className="text-sm text-gray-600">
          Mostrando {filteredAndSortedData.length} de {data.length} registro{data.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}