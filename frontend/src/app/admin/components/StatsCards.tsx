interface StatsCardsProps {
  stats: {
    total_users: number;
    total_vehicles: number;
    available_vehicles: number;
    reserved_vehicles: number;
    total_admins: number;
    total_reservations: number;
    total_inspections: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total de Usuários',
      value: stats.total_users,
      icon: '👥',
      color: 'blue',
      description: 'Usuários cadastrados'
    },
    {
      title: 'Veículos no Sistema',
      value: stats.total_vehicles,
      icon: '🚗',
      color: 'green',
      description: `${stats.available_vehicles} disponíveis`
    },
    {
      title: 'Veículos Reservados',
      value: stats.reserved_vehicles,
      icon: '📋',
      color: 'orange',
      description: 'Em processo de venda'
    },
    {
      title: 'Administradores',
      value: stats.total_admins,
      icon: '🔐',
      color: 'purple',
      description: 'Usuários administrativos'
    },
    {
      title: 'Reservas Ativas',
      value: stats.total_reservations,
      icon: '💰',
      color: 'yellow',
      description: 'Sinais recebidos'
    },
    {
      title: 'Vistorias',
      value: stats.total_inspections,
      icon: '🔍',
      color: 'indigo',
      description: 'Agendadas/concluídas'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow ${colorClasses[card.color as keyof typeof colorClasses]}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">{card.title}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
              <p className="text-xs opacity-70 mt-1">{card.description}</p>
            </div>
            <div className="text-3xl opacity-80">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}