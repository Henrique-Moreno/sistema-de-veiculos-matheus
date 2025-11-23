'use client';

import React from 'react';
import Button from './ui/Button';
import Link from 'next/link';

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

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {vehicle.photo_url ? (
        <img
          src={vehicle.photo_url}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-[var(--accent)] flex items-center justify-center">
          <span className="text-white">Sem imagem</span>
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold text-black">
          {vehicle.marca} {vehicle.modelo}
        </h2>
        <p className="text-black">Ano: {vehicle.ano}</p>
        <p className="text-black">
          Preço: R$ {vehicle.preco.toFixed(2)}
        </p>
        <p className="text-black">
          Status: {vehicle.is_reserved ? 'Reservado' : 'Disponível'}
        </p>
        <div className="mt-4 flex space-x-2">
          <Link href={`/inspections/schedule/${vehicle.id}`}>
            <Button variant="primary" >
              Agendar Vistoria
            </Button>
          </Link>
          <Link href={`/reservations/create/${vehicle.id}`}>
            <Button variant="primary" >
              Reservar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;