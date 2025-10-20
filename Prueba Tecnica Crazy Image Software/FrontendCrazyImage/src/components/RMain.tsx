import React, { useEffect, useState } from "react";
import type { Task } from '../types/task';
import { taskApi } from '../services/taskApi';
import TaskItem from '../components/TaskItem';
import CreateTaskForm from '../components/CreateTaskForm';

interface UserData {
    id?: number;
    email?: string;
    username?: string;

}

function RMain() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('all');

    useEffect(() => {
        const stored = localStorage.getItem("data");
        console.log("LocalStorage data:", stored); // Debug

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                console.log("Datos parseados del usuario:", parsed); // Debug

                if (parsed.user && parsed.user.id) {
                    parsed.user.id = Number(parsed.user.id);
                }

                setUserData(parsed);
            } catch (error) {
                console.error("Error parsing user data:", error);
                setError("Error al cargar datos del usuario");
                setLoading(false);
            }
        } else {
            console.log("No se encontraron datos en localStorage");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userData) {
            console.log("UserData disponible, cargando tareas:", userData); // Debug
            loadAllTasks();
        }
    }, [userData]); // Ejecutar cuando userData cambie

    const loadAllTasks = async () => {
        setLoading(true);
        try {
            const allTasks = await taskApi.getAllTasks();
            console.log("Todas las tareas cargadas:", allTasks);

            let userTasks = allTasks;
            if (userData?.id) {
                userTasks = allTasks.filter(task => {
                    const matches = task.user_Id === userData?.id;
                    console.log(`Tarea ${task.id}: user_Id=${task.user_Id}, usuario=${userData?.id}, coincide=${matches}`); // Debug
                    return matches;
                });
                console.log("Tareas filtradas del usuario:", userTasks);
            } else {
                console.log("No hay userData.user.id disponible, mostrando todas las tareas");
            }

            setTasks(userTasks);
        } catch (error) {
            console.error("Error loading tasks:", error);
            setError("Error al cargar las tareas");
        } finally {
            setLoading(false);
        }
    };

    const handleTaskUpdate = (updatedTask: Task) => {
        setTasks(prev => prev.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        ));
    };

    const handleTaskDelete = (taskId: number) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    };

    const handleTaskCreated = () => {
        loadAllTasks();
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    const getTaskCountByStatus = (status: Task['status']) => {
        return tasks.filter(task => task.status === status).length;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando tareas...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Mi Lista de Tareas
                    </h1>
                    {userData ? (
                        <p className="text-gray-600">
                            Bienvenido, {userData.username || userData.email} (ID: {userData.id})
                        </p>
                    ) : (
                        <p className="text-red-600">
                            No se pudo cargar la información del usuario
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
                        <div className="text-gray-600">Total</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-800">{getTaskCountByStatus('PENDING')}</div>
                        <div className="text-yellow-600">Pendientes</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-blue-800">{getTaskCountByStatus('IN_PROGRESS')}</div>
                        <div className="text-blue-600">En Progreso</div>
                    </div>
                    <div className="bg-green-50 rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-green-800">{getTaskCountByStatus('COMPLETED')}</div>
                        <div className="text-green-600">Completadas</div>
                    </div>
                </div>

                {userData?.id ? (
                    <CreateTaskForm
                        userId={userData.id}
                        onTaskCreated={handleTaskCreated}
                    />
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
                        <p className="text-yellow-800">
                            No se puede crear tareas porque no se pudo identificar al usuario.
                        </p>
                    </div>
                )}

                <div className="mb-4 flex space-x-2">
                    {(['all', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${filter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {status === 'all' ? 'Todas' :
                                status === 'PENDING' ? 'Pendientes' :
                                    status === 'IN_PROGRESS' ? 'En Progreso' : 'Completadas'}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {tasks.length === 0
                                ? "No tienes tareas creadas. ¡Crea tu primera tarea!"
                                : "No hay tareas que coincidan con el filtro seleccionado."}
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onTaskUpdate={handleTaskUpdate}
                                onTaskDelete={handleTaskDelete}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default RMain;