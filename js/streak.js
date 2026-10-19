/**
 * ============================================================================
 * MÓDULO: StreakManager (Gestión de la Racha de Días de Estudio)
 * ============================================================================
 * CONCEPTO SENIOR / BUENA PRÁCTICA (ADSO):
 * La lógica de negocio (Business Logic) debe ser independiente de la interfaz gráfica.
 * Aquí calculamos la diferencia entre días reales usando aritmética de fechas,
 * simulando la lógica de rachas utilizada en aplicaciones como Duolingo o GitHub.
 */

const StreakManager = {
    /**
     * Obtiene la fecha actual en formato local 'YYYY-MM-DD'
     * @returns {string} Fecha en formato 'YYYY-MM-DD'
     */
    getTodayDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Calcula la diferencia en días naturales entre dos fechas en formato 'YYYY-MM-DD'.
     * @param {string} dateStr1 
     * @param {string} dateStr2 
     * @returns {number} Diferencia en días enteros
     */
    getDaysDifference(dateStr1, dateStr2) {
        if (!dateStr1 || !dateStr2) return Infinity;
        const d1 = new Date(dateStr1 + 'T00:00:00');
        const d2 = new Date(dateStr2 + 'T00:00:00');
        const diffMs = Math.abs(d2 - d1);
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    },

    /**
     * Valida el estado de la racha al abrir la aplicación.
     * Si el aprendiz no estudió ayer ni hoy, la racha activa se ha roto (vuelve a 0).
     */
    checkStreakIntegrity() {
        const data = StorageService.getStreakData();
        const today = this.getTodayDateString();

        if (!data.lastStudyDate) {
            return {
                currentStreak: 0,
                maxStreak: 0,
                studiedToday: false,
                statusMessage: '¡Comienza hoy tu primera racha!'
            };
        }

        const daysSinceLastStudy = this.getDaysDifference(data.lastStudyDate, today);

        if (daysSinceLastStudy === 0) {
            // Ya estudió hoy
            return {
                currentStreak: data.currentStreak,
                maxStreak: data.maxStreak,
                studiedToday: true,
                statusMessage: '¡Excelente! Racha de hoy asegurada 🔥'
            };
        } else if (daysSinceLastStudy === 1) {
            // Estudió ayer, todavía tiene tiempo hoy de mantenerla
            return {
                currentStreak: data.currentStreak,
                maxStreak: data.maxStreak,
                studiedToday: false,
                statusMessage: '¡Estudia hoy para mantener tu racha viva! ⏳'
            };
        } else {
            // Pasaron 2 o más días: se rompió la racha anterior
            data.currentStreak = 0;
            StorageService.saveStreakData(data);
            return {
                currentStreak: 0,
                maxStreak: data.maxStreak,
                studiedToday: false,
                statusMessage: 'La racha se detuvo. ¡Inicia una nueva hoy!'
            };
        }
    },

    /**
     * Registra una sesión de estudio completada y actualiza la racha.
     * Se llama cuando termina el temporizador de 25 minutos.
     * @returns {Object} Datos de la racha actualizados
     */
    recordCompletedStudySession() {
        const data = StorageService.getStreakData();
        const today = this.getTodayDateString();

        if (data.lastStudyDate === today) {
            // Ya había asegurado la racha hoy; mantenemos el número
            return {
                currentStreak: data.currentStreak,
                maxStreak: data.maxStreak,
                isNewStreakDay: false
            };
        }

        const daysSince = this.getDaysDifference(data.lastStudyDate, today);

        if (daysSince === 1) {
            // Día consecutivo: sumamos +1 día de racha
            data.currentStreak += 1;
        } else {
            // Primer día o reinicio de racha
            data.currentStreak = 1;
        }

        // Actualizamos el récord histórico si superamos el máximo
        if (data.currentStreak > data.maxStreak) {
            data.maxStreak = data.currentStreak;
        }

        data.lastStudyDate = today;
        StorageService.saveStreakData(data);

        return {
            currentStreak: data.currentStreak,
            maxStreak: data.maxStreak,
            isNewStreakDay: true
        };
    }
};

