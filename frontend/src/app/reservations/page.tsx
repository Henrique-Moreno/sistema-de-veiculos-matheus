'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import Header from '../components/Header';
import ReservationActions from '../components/ReservationActions';

interface Reservation {
  id: number;
  vehicle_id: number;
  amount: number;
  inspection_id?: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  vehicle: {
    id: number;
    marca: string;
    modelo: string;
    ano: number;
    preco: number;
  };
}

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
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

    const fetchReservations = async () => {
      try {
        console.log('Buscando reservas do usuário');
        const response = await api.get('/api/reservations');
        if (!response.data.reservations || !Array.isArray(response.data.reservations)) {
          throw new Error('Resposta inválida: reservas não encontradas');
        }
        setReservations(response.data.reservations);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar reservas.');
        console.error('Erro ao buscar reservas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">
          Minhas Reservas
        </h1>
        {loading && <p className="text-[var(--foreground)]">Carregando...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading && reservations.length === 0 && (
          <p className="text-[var(--foreground)]">Nenhuma reserva encontrada.</p>
        )}
        {!loading && reservations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="border rounded-lg p-4 shadow-md bg-[var(--background)]"
              >
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Reserva #{reservation.id}
                </h2>
                <p className="text-[var(--foreground)]">
                  Veículo: {reservation.vehicle.marca} {reservation.vehicle.modelo} (
                  {reservation.vehicle.ano})
                </p>
                <p className="text-[var(--foreground)]">
                  Valor do Sinal: R${reservation.amount.toFixed(2)}
                </p>
                <p className="text-[var(--foreground)]">
                  Status: {reservation.status === 'active' ? 'Ativa' : reservation.status === 'completed' ? 'Concluída' : 'Cancelada'}
                </p>
                <p className="text-[var(--foreground)]">
                  Data: {new Date(reservation.created_at).toLocaleDateString('pt-BR')}
                </p>
                <ReservationActions reservation={reservation} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;