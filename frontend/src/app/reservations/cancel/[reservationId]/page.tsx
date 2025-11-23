'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/app/lib/api';
import Header from '@/app/components/Header';
import Button from '@/app/components/ui/Button';

const CancelReservationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { reservationId } = useParams();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      console.log('Nenhuma sessão encontrada, redirecionando para /auth');
      router.replace('/auth');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleCancel = async () => {
    try {
      console.log('Cancelando reserva:', { reservationId });
      await api.patch(`/api/reservations/${reservationId}/cancel`, {});
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao cancelar reserva.');
      console.error('Erro ao cancelar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">
          Cancelar Reserva - ID {reservationId}
        </h1>
        {loading && <p className="text-[var(--foreground)]">Carregando...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading && (
          <div className="w-full max-w-md">
            <p className="text-[var(--foreground)] mb-4">
              Deseja cancelar a reserva? Esta ação é irreversível.
            </p>
            <Button onClick={handleCancel} className="mt-4">
              Cancelar Reserva
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelReservationPage;