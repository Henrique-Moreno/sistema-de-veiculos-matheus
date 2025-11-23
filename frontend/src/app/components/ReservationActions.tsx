'use client';

import React from 'react';
import Link from 'next/link';
import Button from './ui/Button';

interface Reservation {
  id: number;
  status: 'active' | 'completed' | 'cancelled';
}

interface ReservationActionsProps {
  reservation: Reservation;
}

const ReservationActions: React.FC<ReservationActionsProps> = ({ reservation }) => {
  const isActive = reservation.status === 'active';

  return (
    <div className="mt-4 flex space-x-2">
      <Link href={`/reservations/confirm/${reservation.id}`}>
        <Button variant="primary" disabled={!isActive}>
          Confirmar
        </Button>
      </Link>
      <Link href={`/reservations/cancel/${reservation.id}`}>
        <Button variant="secondary" disabled={!isActive} >
          Cancelar
        </Button>
      </Link>
    </div>
  );
};

export default ReservationActions;