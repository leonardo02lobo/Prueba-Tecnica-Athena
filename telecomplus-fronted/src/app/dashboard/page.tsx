// app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Contract, Service } from '@/types';
import { contractAPI } from '@/lib/api';
import AddContractModal from '../components/AddContractModal';
import ManageServicesModal from '../components/ManageServicesModal';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [showAddContract, setShowAddContract] = useState(false);

  const [selectedContractForServices, setSelectedContractForServices] = useState<Contract | null>(null);
  const [showManageServices, setShowManageServices] = useState(false);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const response = await contractAPI.getAll();
      const contractsData = response.data || response;
      setContracts(Array.isArray(contractsData) ? contractsData : []);
    } catch (error) {
      console.error('Error al cargar los contratos:', error);
      alert('Error al cargar los contratos');
    } finally {
      setLoading(false);
    }
  };

  const handleContractAdded = () => {
    loadContracts();
  };

  const handleUpdateStatus = async (contractId: number, status: 'active' | 'suspended' | 'cancelled') => {
    try {
      await contractAPI.update(contractId, { status });
      loadContracts();
      alert('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-black';
      case 'suspended': return 'bg-yellow-100 text-black';
      case 'cancelled': return 'bg-red-100 text-black';
      default: return 'bg-gray-100 text-black';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'suspended': return 'Suspendido';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case 'internet': return 'Internet';
      case 'tv': return 'Televisión';
      default: return type;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-black">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-black">TelecomPlus</h1>
              <p className="text-sm text-black">Panel de Cliente</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-black">Hola, {user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">Mis Contratos</h2>
            <p className="text-black">Gestiona tus servicios de telecomunicaciones</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddContract(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              + Nuevo Contrato
            </button>
          </div>
        </div>

        {contracts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-black mb-4">No tienes contratos activos.</p>
            <button
              onClick={() => setShowAddContract(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Crear mi primer contrato
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {contracts.map((contract) => (
              <div key={contract.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center space-x-2 text-black">
                      <span>Contrato #{contract.contract_number}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {getStatusText(contract.status)}
                      </span>
                    </h3>
                    <p className="text-black mt-1">
                      Inicio: {new Date(contract.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={contract.status}
                      onChange={(e) => handleUpdateStatus(contract.id, e.target.value as any)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    >
                      <option value="active">Activo</option>
                      <option value="suspended">Suspendido</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                    <button
                      onClick={() => {
                        setSelectedContractForServices(contract);
                        setShowManageServices(true);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      ⚙️ Gestionar Servicios
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-3 text-black">Servicios:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {contract.services && contract.services.length > 0 ? (
                      contract.services.map((service) => (
                        <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-medium text-black">{service.plan_name}</span>
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.type === 'internet'
                                ? 'bg-blue-100 text-black'
                                : 'bg-purple-100 text-black'
                                }`}>
                                {getServiceTypeText(service.type)}
                              </span>
                            </div>
                            <span className="text-2xl font-bold text-black">
                              ${service.price.toLocaleString()}/mes
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4 text-black">
                        No hay servicios asociados a este contrato
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddContractModal
          isOpen={showAddContract}
          onClose={() => setShowAddContract(false)}
          onContractAdded={handleContractAdded}
        />

        {showManageServices && selectedContractForServices && (
          <ManageServicesModal
            contractId={selectedContractForServices.id}
            onClose={() => {
              setShowManageServices(false);
              setSelectedContractForServices(null);
            }}
            onRefresh={loadContracts}
          />
        )}
      </main>
    </div>
  );
}
