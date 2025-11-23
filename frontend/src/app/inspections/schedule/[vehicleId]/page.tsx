'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/app/lib/api';
import Header from '@/app/components/Header';
import InspectionForm from '@/app/components/InspectionForm';

interface Slot {
  slot: string;
}

const ScheduleInspectionPage: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
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

    const fetchSlots = async () => {
      try {
        console.log('Buscando horários disponíveis para vistoria');
        const response = await api.get('/api/inspections/slots');
        if (!response.data.available_slots || !Array.isArray(response.data.available_slots)) {
          throw new Error('Resposta inválida: horários não encontrados');
        }
        setSlots(response.data.available_slots.map((slot: string) => ({ slot })));
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar horários disponíveis.');
        console.error('Erro ao buscar horários:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [router]);

  const handleSchedule = async (inspectionDate: string) => {
    try {
      console.log('Agendando vistoria:', { vehicleId, inspectionDate });
      await api.post('/api/inspections', {
        vehicle_id: Number(vehicleId),
        inspection_date: inspectionDate,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao agendar vistoria.');
      console.error('Erro ao agendar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">
          Agendar Vistoria - Veículo {vehicleId}
        </h1>
        {loading && <p className="text-[var(--foreground)]">Carregando...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading && slots.length === 0 && (
          <p className="text-[var(--foreground)]">Nenhum horário disponível.</p>
        )}
        {!loading && slots.length > 0 && (
          <InspectionForm slots={slots} onSubmit={handleSchedule} />
        )}
      </div>
    </div>
  );
};

export default ScheduleInspectionPage;