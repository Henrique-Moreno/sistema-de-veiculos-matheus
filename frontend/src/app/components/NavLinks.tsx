'use client';

import React from 'react';
import Link from 'next/link';

const NavLinks: React.FC = () => {
  return (
    <nav className="flex space-x-4">
      <Link href="/dashboard" className="text-sm hover:underline">
        Dashboard
      </Link>
      <Link href="/reservations" className="text-sm hover:underline">
        Minhas Reservas
      </Link>
    </nav>
  );
};

export default NavLinks;