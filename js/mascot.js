/**
 * ============================================================================
 * MÓDULO: MascotController (Mascota Virtual Interactiva: "Oso Dev 🐻")
 * ============================================================================
 * CONCEPTO SENIOR / BUENA PRÁCTICA (ADSO):
 * Gamificación del Software (Gamification):
 * Mascota amigable en formato vectorial SVG con animaciones fluidas,
 * estados de ánimo en tiempo real y frases motivacionales de ADSO.
 */

const MASCOT_PHRASES = {
    idle: [
        "¡Hola Luis! Soy Oso Dev, tu compañero de estudio en ADSO 🐻💻",
        "Un buen analista de software empieza con 25 minutos de enfoque.",
        "¡Cada línea de código y cada diagrama cuentan!",
        "¡Abrazo de oso! La disciplina vence a la pereza siempre 🔥"
    ],
    studying: [
        "¡Modo oso programador activado! Cero distracciones 🎧",
        "Estructurando el proyecto como todo un Senior... ¡Tú puedes! 🚀",
        "Analizando requerimientos y programando con calma ☕",
        "25 minutos de pura concentración. ¡Sigue así!"
    ],
    break: [
        "¡Tiempo fuera! Estira los brazos, toma agüita y descansa 💧",
        "El descanso es clave para resolver errores en el código ☕",
        "5 minutos para despejar la mente y volvemos con toda.",
        "Un café o un té y listos para el próximo bloque."
    ],
    celebrate: [
        "¡SESIÓN COMPLETADA! ¡Eres una máquina de productividad! 🎉",
        "¡Racha de hoy asegurada! Tu constancia en ADSO es imparable 🔥",
        "¡Un bloque más cerca de tu titulación como Analista de Software! 🏆",
        "¡Excelente trabajo en equipo! Vamos por el siguiente entregable."
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
     * Cambia el estado visual y emocional del Oso Dev.
     * @param {'idle' | 'studying' | 'break' | 'celebrate'} mood 
     */
    setMood(mood) {
        this.currentMood = mood;
        if (!this.avatarElement) return;

        // Remover clases anteriores
        this.avatarElement.classList.remove('mood-idle', 'mood-studying', 'mood-break', 'mood-celebrate');
        this.avatarElement.classList.add(`mood-${mood}`);

        // SVG vectorial del Oso Dev
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
     * Genera el SVG vectorial del Oso Dev adaptado a su estado de ánimo.
     * @param {string} mood 
     * @returns {string} Código SVG del Oso
     */
    renderMascotSVG(mood) {
        // Expresiones faciales y accesorios según el estado
        let eyes = `
            <ellipse cx="62" cy="62" rx="6.5" ry="8" fill="#2b1810" class="mascot-eye"/>
            <circle cx="64" cy="59" r="2.5" fill="#ffffff"/>
            <circle cx="61" cy="65" r="1" fill="#ffffff"/>
            
            <ellipse cx="98" cy="62" rx="6.5" ry="8" fill="#2b1810" class="mascot-eye"/>
            <circle cx="100" cy="59" r="2.5" fill="#ffffff"/>
            <circle cx="97" cy="65" r="1" fill="#ffffff"/>
        `;
        let mouth = `
            <!-- Naricita de Oso -->
            <path d="M 73 69 Q 80 66 87 69 Q 84 76 80 77 Q 76 76 73 69 Z" fill="#2b1810"/>
            <circle cx="77" cy="70" r="1.5" fill="#ffffff" opacity="0.8"/>
            <path d="M 80 77 L 80 81 M 74 81 Q 80 86 86 81" stroke="#2b1810" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        `;
        let accessory = '';

        if (mood === 'studying') {
            // Audífonos gamer violetas y gafas inteligentes de programador
            accessory = `
                <!-- Diadema de audífonos -->
                <path d="M 38 52 A 46 46 0 0 1 122 52" fill="none" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/>
                <!-- Almohadillas -->
                <rect x="32" y="46" width="12" height="24" rx="5" fill="#312e81"/>
                <rect x="116" y="46" width="12" height="24" rx="5" fill="#312e81"/>
                <!-- Gafas de código cuadradas -->
                <rect x="52" y="53" width="22" height="18" rx="4" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" stroke-width="3"/>
                <rect x="86" y="53" width="22" height="18" rx="4" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" stroke-width="3"/>
                <line x1="74" y1="62" x2="86" y2="62" stroke="#6366f1" stroke-width="3"/>
            `;
            eyes = `
                <circle cx="63" cy="62" r="5" fill="#4f46e5"/>
                <circle cx="97" cy="62" r="5" fill="#4f46e5"/>
            `;
        } else if (mood === 'break') {
            // Ojos felices curvados y taza de café caliente
            eyes = `
                <path d="M 55 63 Q 63 55 71 63" fill="none" stroke="#2b1810" stroke-width="3" stroke-linecap="round"/>
                <path d="M 89 63 Q 97 55 105 63" fill="none" stroke="#2b1810" stroke-width="3" stroke-linecap="round"/>
            `;
            mouth = `
                <path d="M 74 69 Q 80 66 86 69 Q 83 75 80 76 Q 77 75 74 69 Z" fill="#2b1810"/>
                <path d="M 72 79 Q 80 89 88 79" stroke="#2b1810" stroke-width="3" stroke-linecap="round" fill="#ea580c"/>
            `;
            accessory = `
                <!-- Taza de café con vapor -->
                <g transform="translate(108, 70) scale(0.75)">
                    <rect x="0" y="5" width="26" height="28" rx="5" fill="#ef4444"/>
                    <path d="M 26 10 Q 36 19 26 27" fill="none" stroke="#ef4444" stroke-width="3.5"/>
                    <path d="M 7 0 Q 9 -6 7 -10" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" class="steam"/>
                    <path d="M 16 0 Q 18 -6 16 -10" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" class="steam-2"/>
                </g>
            `;
        } else if (mood === 'celebrate') {
            // Gorro de fiesta festivo y estrellas brillantes
            eyes = `
                <path d="M 55 62 Q 63 53 71 62" fill="none" stroke="#2b1810" stroke-width="3.5" stroke-linecap="round"/>
                <path d="M 89 62 Q 97 53 105 62" fill="none" stroke="#2b1810" stroke-width="3.5" stroke-linecap="round"/>
            `;
            mouth = `
                <path d="M 74 68 Q 80 65 86 68 Q 83 74 80 75 Q 77 74 74 68 Z" fill="#2b1810"/>
                <path d="M 71 78 Q 80 94 89 78 Z" fill="#e11d48"/>
            `;
            accessory = `
                <!-- Gorro de celebración festivo -->
                <polygon points="80,8 60,40 100,40" fill="#f59e0b"/>
                <circle cx="80" cy="8" r="5" fill="#ec4899"/>
                <circle cx="70" cy="26" r="3" fill="#ffffff"/>
                <circle cx="88" cy="34" r="2.5" fill="#ffffff"/>
                <!-- Confeti -->
                <text x="30" y="32" font-size="16">✨</text>
                <text x="114" y="32" font-size="16">🎉</text>
            `;
        }

        return `
        <svg viewBox="0 0 160 140" width="100%" height="100%" class="mascot-svg">
            <defs>
                <!-- Gradiente suave de pelaje de Oso pardo/caramelo -->
                <linearGradient id="bearBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#9a5b43"/>
                    <stop offset="100%" stop-color="#733b28"/>
                </linearGradient>
                <linearGradient id="bearInnerEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f5cfbe"/>
                    <stop offset="100%" stop-color="#e5a894"/>
                </linearGradient>
                <linearGradient id="bearCheekGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fca5a5"/>
                    <stop offset="100%" stop-color="#f87171"/>
                </linearGradient>
            </defs>

            <!-- Orejitas redondas de Oso -->
            <circle cx="44" cy="38" r="16" fill="#733b28"/>
            <circle cx="44" cy="38" r="10" fill="url(#bearInnerEarGrad)"/>
            <circle cx="116" cy="38" r="16" fill="#733b28"/>
            <circle cx="116" cy="38" r="10" fill="url(#bearInnerEarGrad)"/>

            <!-- Cabeza redonda del Oso Dev -->
            <rect x="36" y="28" width="88" height="84" rx="42" fill="url(#bearBodyGrad)"/>

            <!-- Hocico tierno y redondeado de Oso -->
            <ellipse cx="80" cy="77" rx="24" ry="17" fill="#fef0e6"/>

            <!-- Ojos y Hocico -->
            ${eyes}
            ${mouth}

            <!-- Mejillas sonrojadas -->
            <circle cx="50" cy="72" r="7" fill="url(#bearCheekGrad)" opacity="0.6"/>
            <circle cx="110" cy="72" r="7" fill="url(#bearCheekGrad)" opacity="0.6"/>

            <!-- Patitas de oso sutiles abajo -->
            <circle cx="54" cy="108" r="9" fill="#603020"/>
            <circle cx="106" cy="108" r="9" fill="#603020"/>

            <!-- Accesorios dinámicos -->
            ${accessory}
        </svg>
        `;
    }
}
