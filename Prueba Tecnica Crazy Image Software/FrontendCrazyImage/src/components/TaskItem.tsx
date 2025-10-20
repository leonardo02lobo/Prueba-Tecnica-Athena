import React, { useState } from 'react';
import type { Task } from '../types/task';
import { taskApi } from '../services/taskApi';

interface TaskItemProps {
    task: Task;
    onTaskUpdate: (updatedTask: Task) => void;
    onTaskDelete: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdate, onTaskDelete }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<Task['status']>(task.status);

    const handleStatusChange = async (newStatus: Task['status']) => {
        setIsUpdating(true);
        try {
            console.log(newStatus)
            await taskApi.updateTaskStatus(task.id, newStatus);

            const updatedTask = { ...task, status: newStatus };
            setCurrentStatus(newStatus);
            onTaskUpdate(updatedTask);

            console.log('Tarea actualizada:', updatedTask);
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            alert('Error al actualizar el estado de la tarea');
            setCurrentStatus(task.status);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteClick = async () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            try {
                await taskApi.deleteTask(task.id);
                onTaskDelete(task.id);
                console.log('Tarea eliminada:', task.id);
            } catch (error) {
                console.error('Error al eliminar tarea:', error);
                alert('Error al eliminar la tarea');
            }
        }
    };

    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusText = (status: Task['status']) => {
        switch (status) {
            case 'PENDING': return 'Pendiente';
            case 'IN_PROGRESS': return 'En Progreso';
            case 'COMPLETED': return 'Completada';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <button
                    onClick={handleDeleteClick}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                    Eliminar
                </button>
            </div>

            <p className="text-gray-600 mb-3">{task.description}</p>

            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Estado:</span>
                    <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
                        disabled={isUpdating}
                        className={`px-2 py-1 rounded border text-sm font-medium ${getStatusColor(currentStatus)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                    >
                        <option value="PENDING">Pendiente</option>
                        <option value="IN_PROGRESS">En Progreso</option>
                        <option value="COMPLETED">Completada</option>
                    </select>

                    {isUpdating && (
                        <span className="text-xs text-gray-500">Actualizando...</span>
                    )}
                </div>

                <div className="text-xs text-gray-400">
                    ID: {task.id} | User ID: {task.user_Id}
                </div>
            </div>
        </div>
    );
};

export default TaskItem;