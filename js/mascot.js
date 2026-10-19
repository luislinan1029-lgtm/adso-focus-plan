/**
 * ============================================================================
 * MÓDULO: MascotController (Mascota Virtual Interactiva: "Byte el Dev")
 * ============================================================================
 * CONCEPTO SENIOR / BUENA PRÁCTICA (ADSO):
 * Gamificación del Software (Gamification):
 * Incorporar elementos lúdicos y de refuerzo positivo aumenta la retención,
 * la motivación del aprendiz y fomenta el hábito de estudio diario.
 */

const MASCOT_PHRASES = {
    idle: [
        "¡Hola Luis! ¿Listo para avanzar en tu proyecto de ADSO hoy? 💻",
        "Un buen analista de software empieza con 25 minutos de enfoque.",
        "¡Cada línea de código y cada diagrama cuentan!",
        "La disciplina vence al talento cuando el talento no es constante. 🔥"
    ],
    studying: [
        "¡Modo hiperenfoque activado! Cero distracciones 🎧",
        "Programando como un Senior... ¡Tú puedes! 🚀",
        "Documentando y estructurando con buenas prácticas ☕",
        "25 minutos de pura concentración. ¡Sigue así!"
    ],
    break: [
        "¡Tiempo fuera! Levántate, estírate y toma agua 💧",
        "El descanso es parte vital de la ingeniería de software ☕",
        "Despeja la mente 5 minutos para volver con toda.",
        "Un buen café y listos para el siguiente bloque."
    ],
    celebrate: [
        "¡SESIÓN COMPLETADA! Eres una máquina de productividad 🎉",
        "¡Racha asegurada! Tu constancia en ADSO es inspiradora 🔥",
        "¡Un bloque más cerca de titularte como Analista de Software! 🏆",
        "¡Excelente trabajo! Vamos por el siguiente entregable."
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
     * Cambia el estado visual y emocional de la mascota.
     * @param {'idle' | 'studying' | 'break' | 'celebrate'} mood 
     */
    setMood(mood) {
        this.currentMood = mood;
        if (!this.avatarElement) return;

        // Remover clases anteriores
        this.avatarElement.classList.remove('mood-idle', 'mood-studying', 'mood-break', 'mood-celebrate');
        this.avatarElement.classList.add(`mood-${mood}`);

        // SVG vectorial interactivo de "Byte"
        this.avatarElement.innerHTML = this.renderMascotSVG(mood);
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
     * Genera el SVG vectorial de la mascota adaptado a su estado de ánimo.
     * @param {string} mood 
     * @returns {string} Código SVG
     */
    renderMascotSVG(mood) {
        // Expresiones faciales y accesorios según el estado
        let eyes = `
            <ellipse cx="65" cy="65" rx="7" ry="9" fill="#1e293b" class="mascot-eye"/>
            <ellipse cx="95" cy="65" rx="7" ry="9" fill="#1e293b" class="mascot-eye"/>
            <circle cx="67" cy="63" r="2.5" fill="#ffffff"/>
            <circle cx="97" cy="63" r="2.5" fill="#ffffff"/>
        `;
        let mouth = `<path d="M 72 82 Q 80 88 88 82" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="none"/>`;
        let accessory = '';

        if (mood === 'studying') {
            // Audífonos de programador y gafas inteligentes
            accessory = `
                <!-- Diadema de audífonos -->
                <path d="M 40 60 A 42 42 0 0 1 120 60" fill="none" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/>
                <!-- Almohadillas -->
                <rect x="34" y="52" width="10" height="24" rx="5" fill="#312e81"/>
                <rect x="116" y="52" width="10" height="24" rx="5" fill="#312e81"/>
                <!-- Gafas de código -->
                <rect x="54" y="55" width="22" height="18" rx="4" fill="none" stroke="#6366f1" stroke-width="3"/>
                <rect x="84" y="55" width="22" height="18" rx="4" fill="none" stroke="#6366f1" stroke-width="3"/>
                <line x1="76" y1="64" x2="84" y2="64" stroke="#6366f1" stroke-width="3"/>
            `;
            eyes = `
                <circle cx="65" cy="64" r="5" fill="#4f46e5"/>
                <circle cx="95" cy="64" r="5" fill="#4f46e5"/>
            `;
            mouth = `<path d="M 74 83 Q 80 86 86 83" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="none"/>`;
        } else if (mood === 'break') {
            // Ojos felices cerrados y taza de café
            eyes = `
                <path d="M 58 65 Q 65 58 72 65" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
                <path d="M 88 65 Q 95 58 102 65" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
            `;
            mouth = `<path d="M 72 80 Q 80 92 88 80" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="#ea580c"/>`;
            accessory = `
                <!-- Taza de café con vapor -->
                <g transform="translate(100, 75) scale(0.7)">
                    <rect x="0" y="5" width="24" height="26" rx="4" fill="#ef4444"/>
                    <path d="M 24 10 Q 34 18 24 26" fill="none" stroke="#ef4444" stroke-width="3"/>
                    <path d="M 6 0 Q 8 -6 6 -10" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" class="steam"/>
                    <path d="M 14 0 Q 16 -6 14 -10" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" class="steam-2"/>
                </g>
            `;
        } else if (mood === 'celebrate') {
            // Gorro de fiesta y estrellas
            eyes = `
                <path d="M 58 64 Q 65 55 72 64" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
                <path d="M 88 64 Q 95 55 102 64" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
            `;
            mouth = `<path d="M 70 78 Q 80 96 90 78 Z" fill="#e11d48"/>`;
            accessory = `
                <!-- Gorro de celebración festivo -->
                <polygon points="80,10 60,45 100,45" fill="#f59e0b"/>
                <circle cx="80" cy="10" r="5" fill="#ec4899"/>
                <circle cx="70" cy="30" r="3" fill="#ffffff"/>
                <circle cx="88" cy="38" r="2.5" fill="#ffffff"/>
                <!-- Estrellas brillantes -->
                <text x="35" y="35" font-size="16">✨</text>
                <text x="110" y="35" font-size="16">🎉</text>
            `;
        }

        return `
        <svg viewBox="0 0 160 140" width="100%" height="100%" class="mascot-svg">
            <defs>
                <linearGradient id="mascotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fbbf24"/>
                    <stop offset="100%" stop-color="#d97706"/>
                </linearGradient>
                <linearGradient id="mascotCheekGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fca5a5"/>
                    <stop offset="100%" stop-color="#f87171"/>
                </linearGradient>
            </defs>

            <!-- Orejitas -->
            <circle cx="48" cy="40" r="14" fill="#b45309"/>
            <circle cx="48" cy="40" r="8" fill="#fef3c7"/>
            <circle cx="112" cy="40" r="14" fill="#b45309"/>
            <circle cx="112" cy="40" r="8" fill="#fef3c7"/>

            <!-- Cuerpo / Cabeza redonda del Capibara Dev -->
            <rect x="40" y="32" width="80" height="78" rx="36" fill="url(#mascotBodyGrad)"/>

            <!-- Hocico tierno -->
            <ellipse cx="80" cy="76" rx="20" ry="14" fill="#fef3c7"/>
            <!-- Naricita -->
            <ellipse cx="80" cy="71" rx="6" ry="4" fill="#78350f"/>

            <!-- Ojos y Boca -->
            ${eyes}
            ${mouth}

            <!-- Mejillas sonrojadas -->
            <circle cx="53" cy="74" r="6" fill="url(#mascotCheekGrad)" opacity="0.6"/>
            <circle cx="107" cy="74" r="6" fill="url(#mascotCheekGrad)" opacity="0.6"/>

            <!-- Accesorios dinámicos -->
            ${accessory}
        </svg>
        `;
    }
}
