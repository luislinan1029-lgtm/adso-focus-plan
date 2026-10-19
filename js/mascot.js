/**
 * ============================================================================
 * MÓDULO: MascotController (Mascota Oficial: "León SENA ADSO 🦁")
 * ============================================================================
 * CONCEPTO SENIOR / GAMIFICACIÓN (ADSO):
 * Mascota interactiva oficial con el hoodie de SENA ADSO y laptop,
 * con reacciones dinámicas al cronómetro Pomodoro y frases de motivación.
 */

const MASCOT_PHRASES = {
    idle: [
        "¡Hola Luis! Soy el León de ADSO 🦁, tu compañero de proyecto. ¿Listo para programar?",
        "¡Fuerza y disciplina! Un desarrollador del SENA no se rinde ante los errores de código.",
        "¡Cada línea de código y cada evidencia te acercan a tu titulación! 💻",
        "El SENA nos forma como líderes de software. ¡Vamos a darle con toda hoy! 🚀",
        "¡Rugido de león! La constancia diaria vence cualquier desafío 🔥"
    ],
    studying: [
        "¡Modo león enfocado! 25 minutos de pura concentración en el proyecto 🎧",
        "Analizando requerimientos y programando con calma y buenas prácticas 💻",
        "¡Cero distracciones en el navegador! Tu código y tú.",
        "25 minutos de hiperenfoque. ¡Construyamos ese entregable como Seniors!"
    ],
    break: [
        "¡Tiempo fuera! Los leones también descansan para volver con más energía ☕",
        "5 minutos de pausa activa: estírate, relaja la vista y toma agua 💧",
        "Despeja la mente unos minutos; a veces la solución a un bug llega descansando.",
        "Respira hondo y prepárate para el siguiente bloque de estudio."
    ],
    celebrate: [
        "¡RUGIDO DE VICTORIA! 🦁🎉 ¡Completaste el bloque de 25 minutos!",
        "¡Racha de hoy asegurada! Orgullo total para el equipo de ADSO 🔥",
        "¡Un bloque más cerca de ser un egresado exitoso del SENA! 🏆",
        "¡Excelente disciplina! Así se trabaja en proyectos de clase mundial."
    ]
};

class MascotController {
    constructor() {
        this.container = document.getElementById('mascot-container');
        this.speechBubble = document.getElementById('mascot-speech');
        this.avatarElement = document.getElementById('mascot-avatar');
        this.currentMood = 'idle';
        this.phraseInterval = null;

        this.init();
    }

    init() {
        this.setMood('idle');
        // Cambiar frases aleatorias cada 30 segundos si está ocioso
        this.phraseInterval = setInterval(() => {
            if (this.currentMood === 'idle') {
                this.speakRandom('idle');
            }
        }, 30000);
    }

    /**
     * Cambia el estado visual y emocional del León ADSO.
     * @param {'idle' | 'studying' | 'break' | 'celebrate'} mood 
     */
    setMood(mood) {
        this.currentMood = mood;
        if (!this.avatarElement) return;

        // Remover clases anteriores y aplicar la nueva
        this.avatarElement.classList.remove('mood-idle', 'mood-studying', 'mood-break', 'mood-celebrate');
        this.avatarElement.classList.add(`mood-${mood}`);

        // Renderizar el León oficial con su estado
        this.avatarElement.innerHTML = this.renderMascotHTML(mood);
        this.speakRandom(mood);
    }

    /**
     * Muestra un mensaje en el bocadillo de diálogo.
     * @param {string} text 
     */
    speak(text) {
        if (!this.speechBubble) return;
        this.speechBubble.textContent = text;
        this.speechBubble.classList.remove('pop-anim');
        void this.speechBubble.offsetWidth; // Forzar reflow para reiniciar animación
        this.speechBubble.classList.add('pop-anim');
    }

    /**
     * Selecciona una frase aleatoria para el estado dado.
     * @param {'idle' | 'studying' | 'break' | 'celebrate'} mood 
     */
    speakRandom(mood) {
        const phrases = MASCOT_PHRASES[mood] || MASCOT_PHRASES.idle;
        const randomIndex = Math.floor(Math.random() * phrases.length);
        this.speak(phrases[randomIndex]);
    }

    /**
     * Renderiza el León SENA ADSO con efectos visuales según el estado.
     * @param {string} mood 
     * @returns {string} Código HTML del León
     */
    renderMascotHTML(mood) {
        let badgeMood = '';
        if (mood === 'studying') {
            badgeMood = '<span class="leon-status-badge studying">🎧 Modo Enfoque</span>';
        } else if (mood === 'break') {
            badgeMood = '<span class="leon-status-badge break">☕ En Descanso</span>';
        } else if (mood === 'celebrate') {
            badgeMood = '<span class="leon-status-badge celebrate">🎉 ¡Éxito!</span>';
        }

        return `
            <div class="leon-figure-wrapper">
                                <img src="img/leon-adso.png" alt="León SENA ADSO" class="mascot-img mascot-leon" draggable="false" style=width:65px; height:65px; max-width:none; object-fit:contain; display:block;">
            </div>
        `;
    }
}
