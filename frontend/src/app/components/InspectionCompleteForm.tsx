'use client';

import React, { useState } from 'react';
import Button from './ui/Button';

interface InspectionCompleteFormProps {
  onSubmit: (report: string) => void;
}

const InspectionCompleteForm: React.FC<InspectionCompleteFormProps> = ({ onSubmit }) => {
  const [report, setReport] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!report.trim()) {
      alert('Insira um relatório válido.');
      return;
    }
    onSubmit(report);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Relatório da Vistoria
        </label>
        <textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Ex.: Veículo em excelentes condições..."
          required
          className="w-full px-3 py-2 border rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          rows={5}
        />
      </div>
      <Button type="submit" className="mt-4">
        Completar Vistoria
      </Button>
    </form>
  );
};

export default InspectionCompleteForm;