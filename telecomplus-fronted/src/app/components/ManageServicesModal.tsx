import React, { useState, useEffect, FormEvent } from "react";
import { servicesAPI } from "@/lib/api";
import { Service } from "@/types/index";

interface ManageServicesModalProps {
    contractId: number;
    onClose: () => void;
    onRefresh: () => Promise<void>;
    editingService?: Service | null;
}

const ManageServicesModal: React.FC<ManageServicesModalProps> = ({
    contractId,
    onClose,
    onRefresh,
    editingService = null,
}) => {
    const predefinedServices: Omit<Service, "id">[] = [
        { contract_id: contractId, type: "internet", plan_name: "Plan Premium 100 Mbps", price: 30.43 },
        { contract_id: contractId, type: "internet", plan_name: "Plan Avanzado 200 Mbps", price: 50.45 },
        { contract_id: contractId, type: "tv", plan_name: "TV Familiar HD", price: 25.34 },
        { contract_id: contractId, type: "tv", plan_name: "TV Plus 4K", price: 40.28 },
    ];

    const [formData, setFormData] = useState<Omit<Service, "id">>({
        contract_id: contractId,
        type: "internet",
        plan_name: "Plan Premium 100 Mbps",
        price: 30,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingService) {
            setFormData({
                contract_id: editingService.contract_id,
                type: editingService.type,
                plan_name: editingService.plan_name,
                price: editingService.price,
            });
        }
    }, [editingService]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingService) {
                await servicesAPI.update(editingService.id, {
                    type: formData.type,
                    plan_name: formData.plan_name,
                    price: formData.price,
                });
                alert("Servicio actualizado correctamente");
            } else {
                await servicesAPI.create(formData);
                alert("Servicio creado correctamente");
            }

            await onRefresh();
            onClose();
        } catch (error) {
            console.error("Error al guardar servicio:", error);
            alert("Error al guardar el servicio");
        } finally {
            setLoading(false);
        }
    };

    const handlePredefinedSelect = (service: Omit<Service, "id">) => {
        setFormData(service);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">
                    {editingService ? "Editar servicio" : "Agregar nuevo servicio"}
                </h2>

                {!editingService && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">
                            Selecciona un servicio precargado:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {predefinedServices.map((s, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handlePredefinedSelect(s)}
                                    className="p-2 border rounded-lg text-sm bg-gray-100 hover:bg-blue-100 transition text-black"
                                >
                                    {s.type.toUpperCase()} - {s.plan_name} (${s.price})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Tipo</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 text-black"
                        >
                            <option value="internet">Internet</option>
                            <option value="tv">Televisión</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Nombre del plan</label>
                        <input
                            type="text"
                            name="plan_name"
                            value={formData.plan_name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 text-black"
                            placeholder="Ej. Plan Avanzado 200 Mbps"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Precio ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 text-black"
                            min={0}
                            step={0.01} 
                            placeholder="0.00"
                        />
                    </div>


                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border text-black hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-black hover:bg-blue-700"
                        >
                            {loading ? "Guardando..." : editingService ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageServicesModal;
