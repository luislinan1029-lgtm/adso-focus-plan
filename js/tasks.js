/**
 * ============================================================================
 * MÓDULO: TaskManager (Gestor de Actividades y Entregables del Proyecto)
 * ============================================================================
 * CONCEPTO SENIOR / BUENA PRÁCTICA (ADSO):
 * Operaciones CRUD (Create, Read, Update, Delete) estructuradas en una clase.
 * Este modelo refleja las matrices de entregables habituales en la fase de
 * Planeación y Ejecución de proyectos de software en el SENA.
 */

class TaskManager {
    constructor() {
        this.tasks = StorageService.getTasks();
    }

    /**
     * Retorna todas las tareas cargadas en memoria.
     * @returns {Array}
     */
    getAll() {
        return this.tasks;
    }

    /**
     * Agrega una nueva actividad a la lista y la persiste.
     * @param {Object} param0 
     * @returns {Object} La tarea creada con su ID único
     */
    add({ title, responsible, dueDate, deliverable, status = 'Pendiente' }) {
        const newTask = {
            id: 'task_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            title: title.trim(),
            responsible: responsible.trim(),
            dueDate: dueDate,
            deliverable: deliverable.trim(),
            status: status,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(newTask); // Añadir al inicio para que aparezca arriba
        StorageService.saveTasks(this.tasks);
        return newTask;
    }

    /**
     * Elimina una actividad por su identificador.
     * @param {string} id 
     * @returns {boolean} true si se eliminó con éxito
     */
    delete(id) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        
        if (this.tasks.length !== initialLength) {
            StorageService.saveTasks(this.tasks);
            return true;
        }
        return false;
    }

    /**
     * Actualiza el estado de avance de una actividad.
     * @param {string} id 
     * @param {string} newStatus ('Pendiente' | 'En Progreso' | 'Completada')
     * @returns {Object|null}
     */
    updateStatus(id, newStatus) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.status = newStatus;
            StorageService.saveTasks(this.tasks);
            return task;
        }
        return null;
    }

    /**
     * Filtra la lista de actividades por estado.
     * @param {string} filter 'ALL' o estado específico
     * @returns {Array}
     */
    filterByStatus(filter) {
        if (!filter || filter === 'ALL') {
            return this.tasks;
        }
        return this.tasks.filter(task => task.status === filter);
    }

    /**
     * Calcula métricas para el panel de control.
     * @returns {Object} { total, completed, inProgress, pending }
     */
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'Completada').length;
        const inProgress = this.tasks.filter(t => t.status === 'En Progreso').length;
        const pending = this.tasks.filter(t => t.status === 'Pendiente').length;

        return {
            total,
            completed,
            inProgress,
            pending
        };
    }

    /**
     * Exporta la matriz de actividades en formato CSV estándar para Excel.
     * Característica de alto impacto para instructores y sustentaciones.
     */
    exportToCSV() {
        if (this.tasks.length === 0) {
            alert('No hay actividades para exportar.');
            return;
        }

        const headers = ['ID', 'Actividad', 'Responsables', 'Fecha de Entrega', 'Entregable', 'Estado'];
        const rows = this.tasks.map(t => [
            `"${t.id}"`,
            `"${t.title.replace(/"/g, '""')}"`,
            `"${t.responsible.replace(/"/g, '""')}"`,
            `"${t.dueDate}"`,
            `"${t.deliverable.replace(/"/g, '""')}"`,
            `"${t.status}"`
        ]);

        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `ADSO_Matriz_Entregables_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

