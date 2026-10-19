/**
 * ============================================================================
 * MÓDULO: NotificationService (Notificaciones Nativas del Navegador y Celular)
 * ============================================================================
 * CONCEPTO SENIOR / BUENA PRÁCTICA (ADSO):
 * Utiliza la Notifications API y ServiceWorkerRegistration para enviar alertas
 * incluso si el usuario minimiza el navegador o bloquea la pantalla del celular.
 */

const NotificationService = {
    /**
     * Verifica si el navegador soporta notificaciones nativas.
     */
    isSupported() {
        return 'Notification' in window;
    },

    /**
     * Retorna el estado actual del permiso ('default', 'granted', 'denied').
     */
    getPermission() {
        if (!this.isSupported()) return 'unsupported';
        return Notification.permission;
    },

    /**
     * Solicita permiso al usuario para enviar notificaciones.
     * @returns {Promise<boolean>} true si fue concedido
     */
    async requestPermission() {
        if (!this.isSupported()) {
            alert('Tu navegador no soporta notificaciones nativas.');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Error solicitando permisos de notificación:', error);
            return false;
        }
    },

    /**
     * Envía una notificación nativa al dispositivo.
     * @param {string} title Título de la notificación
     * @param {Object} options Opciones (cuerpo, icono, vibración, etc.)
     */
    async sendNotification(title, options = {}) {
        if (!this.isSupported() || Notification.permission !== 'granted') {
            return;
        }

        const defaultOptions = {
            icon: 'icons/icon-192.png',
            badge: 'icons/icon-192.png',
            vibrate: [300, 150, 300],
            silent: false,
            ...options
        };

        // Si tenemos Service Worker activo (recomendado en Android y PWA)
        if ('serviceWorker' in navigator) {
            try {
                const reg = await navigator.serviceWorker.ready;
                if (reg && reg.showNotification) {
                    await reg.showNotification(title, defaultOptions);
                    return;
                }
            } catch (e) {
                console.warn('Fallback a Notification estándar:', e);
            }
        }

        // Fallback a API de notificación directa
        try {
            new Notification(title, defaultOptions);
        } catch (e) {
            console.warn('No se pudo enviar notificación nativa:', e);
        }
    }
};

