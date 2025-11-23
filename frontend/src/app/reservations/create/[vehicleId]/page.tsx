'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/app/lib/api';
import Header from '@/app/components/Header';
import ReservationForm from '@/app/components/ReservationForm';

const CreateReservationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { vehicleId } = useParams();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      console.log('Nenhuma sessão encontrada, redirecionando para /auth');
      router.replace('/auth');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleReserve = async (data: { amount: number; inspectionId?: number }) => {
    try {
      console.log('Criando reserva:', { vehicleId, ...data });
      await api.post('/api/reservations', {
        vehicle_id: Number(vehicleId),
        amount: data.amount,
        inspection_id: data.inspectionId,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar reserva.');
      console.error('Erro ao reservar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">
          Criar Reserva - Veículo {vehicleId}
        </h1>
        {loading && <p className="text-[var(--foreground)]">Carregando...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading && <ReservationForm onSubmit={handleReserve} />}
      </div>
    </div>
  );
};

export default CreateReservationPage;