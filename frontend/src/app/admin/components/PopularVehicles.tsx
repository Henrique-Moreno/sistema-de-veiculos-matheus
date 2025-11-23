interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  sales_count?: number;
}

interface PopularVehiclesProps {
  vehicles: Vehicle[];
}

export default function PopularVehicles({ vehicles }: PopularVehiclesProps) {
  const popularVehicles = vehicles.slice(0, 5); 

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          🏆 Veículos Populares
        </h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
          Mais vendidos
        </span>
      </div>

      <div className="space-y-4">
        {popularVehicles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🚗</div>
            <p className="text-gray-500 text-sm">Nenhum veículo vendido ainda</p>
          </div>
        ) : (
          popularVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700">
                  {index + 1}
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {vehicle.marca} {vehicle.modelo}
                  </p>
                  <p className="text-xs text-gray-500">
                    {vehicle.ano} • {vehicle.sales_count || 0} vendas
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  R$ {vehicle.preco.toLocaleString('pt-BR')}
                </p>
                <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full" 
                    style={{ 
                      width: `${Math.min((vehicle.sales_count || 0) * 20, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {popularVehicles.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver todos os veículos ›
          </button>
        </div>
      )}
    </div>
  );
}