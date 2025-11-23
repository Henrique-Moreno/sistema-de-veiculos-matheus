'use client';

import React, { useState } from 'react';
import Button from './ui/Button';
import Select from './Select';

interface Slot {
  slot: string;
}

interface InspectionFormProps {
  slots: Slot[];
  onSubmit: (inspectionDate: string) => void;
}

const InspectionForm: React.FC<InspectionFormProps> = ({ slots, onSubmit }) => {
  const [selectedSlot, setSelectedSlot] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Selecione um horário.');
      return;
    }
    onSubmit(selectedSlot);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <Select
        label="Horário da Vistoria"
        value={selectedSlot}
        onChange={(e) => setSelectedSlot(e.target.value)}
        options={slots.map((slot) => ({
          value: slot.slot,
          label: new Date(slot.slot).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          }),
        }))}
        required
      />
      <Button type="submit" className="mt-4 bg-amber-600 p-2">  
        Agendar Vistoria
      </Button>
    </form>
  );
};

export default InspectionForm;