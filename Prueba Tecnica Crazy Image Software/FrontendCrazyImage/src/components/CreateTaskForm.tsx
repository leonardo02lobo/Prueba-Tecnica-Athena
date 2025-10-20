import React, { useState } from 'react';
import type { CreateTaskRequest } from '../types/task';
import { taskApi } from '../services/taskApi';

interface CreateTaskFormProps {
    userId: number;
    onTaskCreated: () => void; // Cambiado porque necesitamos recargar todas las tareas
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ userId, onTaskCreated }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Omit<CreateTaskRequest, 'user_Id' | 'status'>>({
        title: '',
        description: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateClick = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('El título es requerido');
            return;
        }

        setIsCreating(true);

        try {
            const taskData: CreateTaskRequest = {
                ...formData,
                user_Id: userId,
                status: 'PENDING' // Status por defecto según tu modelo
            };

            console.log('Enviando tarea:', taskData);

            await taskApi.createTask(taskData);

            // Limpiar formulario
            setFormData({
                title: '',
                description: ''
            });

            // Recargar la lista de tareas
            onTaskCreated();

            alert('Tarea creada exitosamente!');

        } catch (error) {
            console.error('Error al crear tarea:', error);
            alert('Error al crear la tarea: ' + (error as Error).message);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Crear Nueva Tarea</h2>

            <form onSubmit={handleCreateClick} className="space-y-3">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Título *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingresa el título de la tarea"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe la tarea (opcional)"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isCreating || !formData.title.trim()}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isCreating || !formData.title.trim() ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {isCreating ? 'Creando...' : 'Crear Tarea'}
                </button>
            </form>
        </div>
    );
};

export default CreateTaskForm;