'use client';
import { useState } from 'react';
import { contractAPI, servicesAPI } from '@/lib/api';
import { Service } from '@/types';

interface AddContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContractAdded: () => void;
}

const availableServices: Omit<Service, 'id' | 'contract_id'>[] = [
    { type: 'internet', plan_name: 'Internet Básico 100MB', price: 29.909 },
    { type: 'internet', plan_name: 'Internet Avanzado 500MB', price: 499.22 },
    { type: 'internet', plan_name: 'Internet Premium 1GB', price: 79900.23 },
    { type: 'tv', plan_name: 'TV Básico 100 canales', price: 19900.11 },
    { type: 'tv', plan_name: 'TV Premium 300 canales', price: 39.940 },
    { type: 'tv', plan_name: 'TV Full + Deportes', price: 59900.43 },
];

export default function AddContractModal({ isOpen, onClose, onContractAdded }: AddContractModalProps) {
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const contractData = {
                contract_number: `CTR-${Date.now()}`,
                start_date: new Date().toISOString().split('T')[0],
                status: 'active' as const
            };

            const contractResponse = await contractAPI.create(contractData);
            const contractId = contractResponse.contract?.id;

            if (!contractId) {
                throw new Error('No se pudo obtener el ID del contrato creado');
            }

            const servicesPromises = selectedServices.map(index =>
                servicesAPI.create({
                    ...availableServices[index],
                    contract_id: contractId
                })
            );

            await Promise.all(servicesPromises);

            onContractAdded();
            onClose();
            setSelectedServices([]);
        } catch (error) {
            console.error('Error creating contract:', error);
            alert('Error al crear el contrato');
        } finally {
            setLoading(false);
        }
    };

    const toggleService = (index: number) => {
        setSelectedServices(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const getTotalPrice = () => {
        return selectedServices.reduce((total, index) => total + availableServices[index].price, 0);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-black">Nuevo Contrato</h2>
                        <button
                            onClick={onClose}
                            className="text-black hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-black">Selecciona los servicios</h3>
                            <div className="grid gap-3">
                                {availableServices.map((service, index) => (
                                    <label
                                        key={index}
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedServices.includes(index)
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedServices.includes(index)}
                                            onChange={() => toggleService(index)}
                                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="font-medium text-black">{service.plan_name}</span>
                                                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${service.type === 'internet'
                                                            ? 'bg-blue-100 text-black'
                                                            : 'bg-purple-100 text-black'
                                                        }`}>
                                                        {service.type === 'internet' ? 'Internet' : 'TV'}
                                                    </span>
                                                </div>
                                                <span className="text-lg font-bold text-black">
                                                    ${service.price.toLocaleString()}/mes
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {selectedServices.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-black">Total mensual:</span>
                                    <span className="text-2xl font-bold text-black">
                                        ${getTotalPrice().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || selectedServices.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creando contrato...' : 'Crear Contrato'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}