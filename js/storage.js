/**
 * ============================================================================
 * MÓDULO: StorageService (Servicio de Persistencia de Datos)
 * ============================================================================
 * CONCEPTO SENIOR / COMPATIBILIDAD MULTIPLATAFORMA (ADSO):
 * Soporta navegación privada / incógnito en navegadores como Brave, Firefox y Safari.
 * Si localStorage está bloqueado por políticas de privacidad del usuario,
 * se activa automáticamente un almacenamiento seguro en memoria (Fallback),
 * garantizando que la aplicación nunca se rompa.
 */

const STORAGE_KEYS = {
    TASKS: 'adso_tasks_data',
    STREAK: 'adso_streak_data',
    TODAY_SESSIONS: 'adso_today_sessions'
};

// Almacén en memoria por si el navegador bloquea localStorage (Modo Incógnito estricto)
const memoryStore = {};

const StorageService = {
    /**
     * Verifica si localStorage está disponible y habilitado.
     */
    isLocalStorageAvailable() {
        try {
            const testKey = '__adso_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Obtiene un valor con soporte de fallback.
     */
    getItem(key) {
        if (this.isLocalStorageAvailable()) {
            return localStorage.getItem(key);
        }
        return memoryStore[key] || null;
    },

    /**
     * Guarda un valor con soporte de fallback.
     */
    setItem(key, value) {
        if (this.isLocalStorageAvailable()) {
            localStorage.setItem(key, value);
        } else {
            memoryStore[key] = value;
        }
    },

    /**
     * Obtiene la lista de tareas guardadas.
     * @returns {Array} Arreglo de objetos de actividades
     */
    getTasks() {
        try {
            const data = this.getItem(STORAGE_KEYS.TASKS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al leer actividades:', error);
            return [];
        }
    },

    /**
     * Guarda la lista completa de tareas.
     * @param {Array} tasks Arreglo de tareas
     */
    saveTasks(tasks) {
        try {
            this.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error al guardar actividades:', error);
        }
    },

    /**
     * Obtiene los datos de la racha de estudio.
     * @returns {Object} { currentStreak: number, maxStreak: number, lastStudyDate: string }
     */
    getStreakData() {
        try {
            const data = this.getItem(STORAGE_KEYS.STREAK);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error al leer racha:', error);
        }
        return {
            currentStreak: 0,
            maxStreak: 0,
            lastStudyDate: null // Formato YYYY-MM-DD
        };
    },

    /**
     * Guarda los datos de la racha de estudio.
     * @param {Object} streakData
     */
    saveStreakData(streakData) {
        try {
            this.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streakData));
        } catch (error) {
            console.error('Error al guardar racha:', error);
        }
    },

    /**
     * Obtiene las sesiones de estudio completadas hoy.
     * Si la fecha guardada no es hoy, reinicia automáticamente el contador diario.
     * @returns {number} Número de sesiones completadas hoy
     */
    getTodaySessions() {
        const todayStr = new Date().toISOString().split('T')[0];
        try {
            const data = this.getItem(STORAGE_KEYS.TODAY_SESSIONS);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.date === todayStr) {
                    return parsed.count || 0;
                }
            }
        } catch (error) {
            console.error('Error al leer sesiones de hoy:', error);
        }
        // Si no existe o es de un día anterior, reiniciamos a 0 para hoy
        this.saveTodaySessions(0);
        return 0;
    },

    /**
     * Guarda el conteo de sesiones para el día de hoy.
     * @param {number} count 
     */
    saveTodaySessions(count) {
        const todayStr = new Date().toISOString().split('T')[0];
        try {
            this.setItem(STORAGE_KEYS.TODAY_SESSIONS, JSON.stringify({
                date: todayStr,
                count: count
            }));
        } catch (error) {
            console.error('Error al guardar sesiones:', error);
        }
    }
};
