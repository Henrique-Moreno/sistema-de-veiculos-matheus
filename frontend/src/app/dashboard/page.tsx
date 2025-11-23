'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import VehicleCard from '../components/VehicleCard';
import api from '../lib/api';
import Input from '../components/ui/Input';

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

const DashboardPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState({ marca: '', modelo: '', ano: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      console.log('Nenhuma sessão encontrada, redirecionando para /auth');
      router.replace('/auth');
      return;
    }

    const fetchVehicles = async () => {
      try {
        const params = {
          marca: search.marca || undefined,
          modelo: search.modelo || undefined,
          ano: search.ano || undefined,
        };
        console.log('Enviando requisição para /api/vehicles com params:', params);
        const response = await api.get('/api/vehicles', { params });
        setVehicles(response.data.vehicles || []);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar veículos.');
        console.error('Erro ao buscar veículos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [search, router]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">
          Dashboard - Veículos
        </h1>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Marca"
            type="text"
            value={search.marca}
            onChange={(e) => setSearch({ ...search, marca: e.target.value })}
            placeholder="Ex.: Nissan"
          />
          <Input
            label="Modelo"
            type="text"
            value={search.modelo}
            onChange={(e) => setSearch({ ...search, modelo: e.target.value })}
            placeholder="Ex.: Kicks"
          />
          <Input
            label="Ano"
            type="number"
            value={search.ano}
            onChange={(e) => setSearch({ ...search, ano: e.target.value })}
            placeholder="Ex.: 2022"
          />
        </div>
        {loading && <p className="text-[var(--foreground)]">Carregando...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {vehicles.length === 0 && !loading && (
          <p className="text-[var(--foreground)]">Nenhum veículo encontrado.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;