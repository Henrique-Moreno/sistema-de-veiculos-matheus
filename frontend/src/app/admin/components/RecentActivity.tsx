interface Activity {
  id: number;
  admin_username: string;
  action: string;
  description: string;
  created_at: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActionIcon = (action: string) => {
    const icons: { [key: string]: string } = {
      'LOGIN': '🔐',
      'CREATE_USER': '👤',
      'UPDATE_USER': '✏️',
      'CREATE_VEHICLE': '🚗',
      'UPDATE_VEHICLE': '🛠️',
      'DELETE_VEHICLE': '🗑️',
      'CREATE_ADMIN': '👑',
      'UPDATE_PROFILE': '📝'
    };
    return icons[action] || '📄';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          📋 Atividade Recente
        </h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          Últimas 10 ações
        </span>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-500 text-sm">Nenhuma atividade recente</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                {getActionIcon(activity.action)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.admin_username}
                  </p>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatDate(activity.created_at)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {activity.action.replace('_', ' ').toLowerCase()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver todas as atividades ›
          </button>
        </div>
      )}
    </div>
  );
}