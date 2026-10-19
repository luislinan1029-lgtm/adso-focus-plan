/**
 * ============================================================================
 * MÓDULO: PomodoroTimer (Cronómetro 25 min Estudio / 5 min Descanso)
 * ============================================================================
 * CONCEPTO SENIOR / COMPATIBILIDAD MULTIPLATAFORMA (ADSO):
 * 1. Soporte Multi-Navegador: Chrome, Firefox, Safari (iOS/macOS), Edge, Brave, Opera.
 * 2. Desbloqueo de Audio en Móviles (iOS/Android): Safari y Chrome móvil bloquean
 *    el audio si no se inicializa tras un toque del usuario.
 * 3. Vibración Háptica: Si el usuario está en Android, el celular vibra suavemente
 *    al terminar los 25 minutos de concentración.
 */

const TIMER_MODES = {
    STUDY: {
        id: 'STUDY',
        label: 'Modo Estudio (25 min)',
        durationSeconds: 25 * 60, // 25 minutos = 1500 segundos
        badgeClass: 'badge-focus',
        subtext: '¡Enfoque Total!'
    },
    BREAK: {
        id: 'BREAK',
        label: 'Modo Descanso (5 min)',
        durationSeconds: 5 * 60, // 5 minutos = 300 segundos
        badgeClass: 'badge-break',
        subtext: 'Toma agua y estírate ☕'
    }
};

class PomodoroTimer {
    constructor({ onTick, onComplete, onModeChange }) {
        this.currentMode = TIMER_MODES.STUDY;
        this.timeLeft = this.currentMode.durationSeconds;
        this.isRunning = false;
        this.timerId = null;

        // Contexto de Audio compartido para evitar bloqueos en iOS Safari
        this.audioCtx = null;

        // Callbacks para comunicar con la UI
        this.onTick = onTick || (() => {});
        this.onComplete = onComplete || (() => {});
        this.onModeChange = onModeChange || (() => {});
    }

    /**
     * Desbloquea el motor de audio en dispositivos móviles (iOS Safari / Android).
     * Los navegadores modernos exigen que el audio se active tras un clic o toque del usuario.
     */
    unlockAudio() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;

            if (!this.audioCtx) {
                this.audioCtx = new AudioContextClass();
            }

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
        } catch (e) {
            console.warn('No se pudo inicializar AudioContext:', e);
        }
    }

    /**
     * Inicia o reanuda la cuenta regresiva.
     */
    start() {
        if (this.isRunning) return;

        this.unlockAudio();
        this.isRunning = true;
        this.timerId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    /**
     * Pausa temporalmente el cronómetro sin perder el tiempo restante.
     */
    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.timerId);
        this.timerId = null;
    }

    /**
     * Alterna entre iniciar y pausar.
     * @returns {boolean} true si quedó corriendo, false si quedó pausado
     */
    toggle() {
        this.unlockAudio();
        if (this.isRunning) {
            this.pause();
            return false;
        } else {
            this.start();
            return true;
        }
    }

    /**
     * Reinicia el cronómetro a la duración inicial del modo actual.
     */
    reset() {
        this.pause();
        this.timeLeft = this.currentMode.durationSeconds;
        this.onTick(this.timeLeft, this.currentMode.durationSeconds, this.currentMode);
    }

    /**
     * Salta a la siguiente fase (de Estudio a Descanso, o de Descanso a Estudio).
     */
    skipPhase() {
        this.pause();
        this.currentMode = (this.currentMode.id === 'STUDY') ? TIMER_MODES.BREAK : TIMER_MODES.STUDY;
        this.timeLeft = this.currentMode.durationSeconds;
        this.onModeChange(this.currentMode);
        this.onTick(this.timeLeft, this.currentMode.durationSeconds, this.currentMode);
    }

    /**
     * Ejecuta cada segundo de cuenta regresiva.
     */
    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft -= 1;
            this.onTick(this.timeLeft, this.currentMode.durationSeconds, this.currentMode);
        }

        if (this.timeLeft <= 0) {
            this.pause();
            this.playNotificationSound();
            this.triggerHapticFeedback();

            const finishedMode = this.currentMode;

            // Cambiamos automáticamente al modo opuesto para el siguiente bloque
            this.currentMode = (finishedMode.id === 'STUDY') ? TIMER_MODES.BREAK : TIMER_MODES.STUDY;
            this.timeLeft = this.currentMode.durationSeconds;

            this.onComplete(finishedMode);
            this.onModeChange(this.currentMode);
            this.onTick(this.timeLeft, this.currentMode.durationSeconds, this.currentMode);
        }
    }

    /**
     * Sintetiza un sonido de campana agradable usando Web Audio API.
     * Compatible con Chrome, Firefox, Safari, Edge, Brave y navegadores móviles.
     */
    playNotificationSound() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;

            if (!this.audioCtx || this.audioCtx.state === 'closed') {
                this.audioCtx = new AudioContextClass();
            }

            const ctx = this.audioCtx;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            // Dos tonos armónicos para simular una campana suave (Acorde C Mayor)
            const notes = [523.25, 659.25, 783.99]; 
            notes.forEach((freq, index) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + (index * 0.15));

                gain.gain.setValueAtTime(0.25, ctx.currentTime + (index * 0.15));
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (index * 0.15) + 0.85);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + (index * 0.15));
                osc.stop(ctx.currentTime + (index * 0.15) + 0.95);
            });
        } catch (e) {
            console.warn('Web Audio no disponible:', e);
        }
    }

    /**
     * Hace vibrar el dispositivo móvil (Android / navegadores con soporte Vibration API).
     */
    triggerHapticFeedback() {
        if ('vibrate' in navigator) {
            try {
                // Patrón: vibra 300ms, pausa 100ms, vibra 300ms
                navigator.vibrate([300, 100, 300]);
            } catch (e) {
                // Algunos navegadores bloquean la vibración si la pestaña no está activa
            }
        }
    }

    /**
     * Formatea segundos en texto MM:SS
     * @param {number} totalSeconds 
     * @returns {string} Ejemplo: "24:59"
     */
    static formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}
