import { useRouter } from 'next/navigation';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  permission?: string;
}

export default function QuickActions() {
  const router = useRouter();

  const actions: QuickAction[] = [
    {
      title: 'Adicionar Veículo',
      description: 'Cadastrar novo veículo',
      icon: '🚗',
      color: 'green',
      href: '/admin/vehicles/new'
    },
    {
      title: 'Gerenciar Usuários',
      description: 'Ver e editar usuários',
      icon: '👥',
      color: 'blue',
      href: '/admin/users'
    },
    {
      title: 'Relatórios',
      description: 'Relatórios de vendas',
      icon: '📊',
      color: 'purple',
      href: '/admin/sales'
    },
    {
      title: 'Vistorias',
      description: 'Agendamentos pendentes',
      icon: '🔍',
      color: 'orange',
      href: '/admin/inspections'
    }
  ];

  const handleActionClick = (href: string) => {
    router.push(href);
  };

  const colorClasses = {
    green: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700',
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        ⚡ Ações Rápidas
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action.href)}
            className={`p-4 rounded-lg border text-left transition-all hover:scale-105 hover:shadow-md ${colorClasses[action.color as keyof typeof colorClasses]}`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {action.icon}
              </div>
              <div>
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs opacity-70 mt-1">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          Acesso rápido às funcionalidades principais
        </p>
      </div>
    </div>
  );
}