'use client';

import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

interface ReservationFormProps {
  onSubmit: (data: { amount: number; inspectionId?: number }) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [inspectionId, setInspectionId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Insira um valor válido para o sinal.');
      return;
    }
    onSubmit({
      amount: Number(amount),
      inspectionId: inspectionId ? Number(inspectionId) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <Input
        label="Valor do Sinal (R$)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Ex.: 500"
        required
      />
      <Input
        label="ID da Vistoria (Opcional)"
        type="number"
        value={inspectionId}
        onChange={(e) => setInspectionId(e.target.value)}
        placeholder="Ex.: 1"
      />
      <Button type="submit" className="mt-4 bg-amber-600 p-2">
        Criar Reserva
      </Button>
    </form>
  );
};

export default ReservationForm;