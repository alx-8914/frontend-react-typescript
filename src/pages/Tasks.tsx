import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { AxiosError } from "axios";

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return; // Impede tarefas vazias
    try {
      await api.post("/tasks", { title: newTaskTitle });
      setNewTaskTitle("");
      await fetchTasks(); // Atualiza a lista após criação
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    setIsUpdating(true);
    try {
      await api.patch(`/tasks/${taskId}/toggle`); // 👈 Nova rota
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      if ((error as AxiosError).response?.status === 404) {
        alert("Tarefa não encontrada!");
      }
      await fetchTasks(); // Reverte a UI em caso de erro
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Suas Tarefas</h1>
      
      <div className="mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Digite uma nova tarefa"
          className="p-2 border rounded"
        />
        <button 
          type="button"
          onClick={handleCreateTask}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Adicionar
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>Nenhuma tarefa cadastrada.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center">
              <input
                type="checkbox"
                checked={task.isCompleted}
                disabled={isUpdating}
                onChange={() => handleToggleComplete(task.id)}
                className="mr-2"
                aria-label={`Marcar tarefa "${task.title}" como concluída`}
              />
              <span className={task.isCompleted ? "line-through" : ""}>
                {task.title}
              </span>
              <button 
                type="button"
                onClick={() => handleDeleteTask(task.id)}
                className="ml-2 text-red-500"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Tasks;