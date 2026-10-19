/**
 * ============================================================================
 * CONTROLADOR PRINCIPAL: app.js
 * ============================================================================
 * CONCEPTO SENIOR / BUENA PRÁCTICA (ADSO):
 * Arquitectura MVC (Modelo-Vista-Controlador):
 * Este archivo actúa como el Controlador (Controller). Escucha eventos de la Vista
 * (DOM HTML), coordina los Modelos y Servicios (Timer, TaskManager, StreakManager,
 * StorageService) y actualiza la interfaz de usuario en respuesta.
 *
 * Además incluye soporte PWA (Progressive Web App):
 * - Registro de Service Worker para soporte offline en móviles.
 * - Soporte de instalación nativa en Android, iOS, Windows y Mac.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialización de Gestores y Mascota
    const taskManager = new TaskManager();
    const mascot = new MascotController();
    const CIRCUMFERENCE = 2 * Math.PI * 105; // 2 * pi * r (r=105) ~ 659.73

    // 2. Referencias a Elementos del DOM
    const streakElement = document.getElementById('current-streak');
    const streakHintElement = document.getElementById('streak-feedback');
    const maxStreakElement = document.getElementById('max-streak');
    const todaySessionsElement = document.getElementById('today-sessions');
    const completedTasksCountElement = document.getElementById('completed-tasks-count');

    // Pomodoro DOM
    const timerDisplay = document.getElementById('timer-display');
    const timerSubtext = document.getElementById('timer-subtext');
    const timerModeBadge = document.getElementById('timer-mode-badge');
    const progressCircle = document.getElementById('progress-circle');
    const btnToggle = document.getElementById('btn-toggle');
    const btnToggleText = document.getElementById('btn-toggle-text');
    const btnToggleIcon = document.getElementById('btn-toggle-icon');
    const btnReset = document.getElementById('btn-reset');
    const btnSkip = document.getElementById('btn-skip');

    // Tareas DOM
    const activityForm = document.getElementById('activity-form');
    const inputTitle = document.getElementById('task-title');
    const inputResponsible = document.getElementById('task-responsible');
    const inputDate = document.getElementById('task-date');
    const inputDeliverable = document.getElementById('task-deliverable');
    const selectStatus = document.getElementById('task-status');
    const filterStatus = document.getElementById('filter-status');
    const tasksTbody = document.getElementById('tasks-tbody');
    const emptyState = document.getElementById('empty-state');
    const btnExportCsv = document.getElementById('btn-export-csv');

    // Toast DOM
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    // Notificaciones & PWA DOM
    const btnToggleNotif = document.getElementById('btn-toggle-notif');
    const btnInstallPwa = document.getElementById('btn-install-pwa');
    const iosBanner = document.getElementById('ios-pwa-banner');
    const btnCloseIosBanner = document.getElementById('btn-close-ios-banner');
    const mascotAvatar = document.getElementById('mascot-avatar');

    let toastTimeout = null;
    let deferredPrompt = null;

    // 3. Configuración del Temporizador Pomodoro
    const timer = new PomodoroTimer({
        onTick: (timeLeft, totalDuration, mode) => {
            timerDisplay.textContent = PomodoroTimer.formatTime(timeLeft);
            
            // Animación del círculo de progreso SVG
            const progress = timeLeft / totalDuration;
            const offset = CIRCUMFERENCE - (progress * CIRCUMFERENCE);
            progressCircle.style.strokeDashoffset = offset;
        },
        onModeChange: (mode) => {
            timerModeBadge.textContent = mode.label;
            timerModeBadge.className = `badge ${mode.badgeClass}`;
            timerSubtext.textContent = mode.subtext;

            if (mode.id === 'STUDY') {
                progressCircle.style.stroke = 'var(--primary)';
            } else {
                progressCircle.style.stroke = 'var(--success)';
            }
            updateTimerToggleButton(false);
        },
        onComplete: (finishedMode) => {
            if (finishedMode.id === 'STUDY') {
                // Registrar sesión completada
                const currentCount = StorageService.getTodaySessions() + 1;
                StorageService.saveTodaySessions(currentCount);

                // Actualizar racha diaria
                StreakManager.recordCompletedStudySession();

                showToast(`¡Excelente trabajo! Completaste 25 min. Descansa 5 min.`, 'ph-check-circle');
                
                // Reacción de la mascota: Celebración festiva
                mascot.setMood('celebrate');
                setTimeout(() => {
                    mascot.setMood('break');
                }, 5500);

                // Notificación nativa al celular o navegador
                NotificationService.sendNotification('🎉 ¡Sesión de 25m completada!', {
                    body: '¡Excelente disciplina! Has sumado a tu racha de hoy. Tómate 5 minutos de descanso.'
                });

                renderStats();
            } else {
                showToast(`¡Descanso finalizado! ¿Listo para otro bloque de estudio?`, 'ph-bell-ringing');
                mascot.setMood('idle');

                // Notificación nativa de fin de descanso
                NotificationService.sendNotification('⏰ ¡Descanso finalizado!', {
                    body: '¿Listo para un nuevo bloque de concentración? ¡A programar!'
                });
            }
            updateTimerToggleButton(false);
        }
    });

    // 4. Funciones de Actualización de Interfaz (Renderers)

    function updateTimerToggleButton(isRunning) {
        if (isRunning) {
            btnToggleText.textContent = 'Pausar';
            btnToggleIcon.textContent = '⏸';
            btnToggle.classList.replace('btn-primary', 'btn-secondary');
        } else {
            btnToggleText.textContent = 'Iniciar Sesión';
            btnToggleIcon.textContent = '▶';
            btnToggle.classList.replace('btn-secondary', 'btn-primary');
        }
    }

    function renderStats() {
        // Datos de Racha
        const streakInfo = StreakManager.checkStreakIntegrity();
        streakElement.textContent = `${streakInfo.currentStreak} ${streakInfo.currentStreak === 1 ? 'día' : 'días'}`;
        streakHintElement.textContent = streakInfo.statusMessage;
        maxStreakElement.textContent = `${streakInfo.maxStreak} ${streakInfo.maxStreak === 1 ? 'día' : 'días'}`;

        // Sesiones de Hoy
        const todaySessions = StorageService.getTodaySessions();
        todaySessionsElement.textContent = todaySessions;

        // Entregables
        const taskStats = taskManager.getStats();
        completedTasksCountElement.textContent = `${taskStats.completed} / ${taskStats.total}`;
    }

    function renderTasks() {
        const selectedFilter = filterStatus.value;
        const tasks = taskManager.filterByStatus(selectedFilter);

        tasksTbody.innerHTML = '';

        if (tasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');

            tasks.forEach((task, index) => {
                const tr = document.createElement('tr');

                // Determinamos la clase del badge según estado
                let badgeClass = 'badge-status-pendiente';
                if (task.status === 'En Progreso') badgeClass = 'badge-status-en-progreso';
                if (task.status === 'Completada') badgeClass = 'badge-status-completada';

                // Formato de fecha legible
                const formattedDate = task.dueDate ? task.dueDate : 'Sin fecha';

                tr.innerHTML = `
                    <td><strong>#${index + 1}</strong></td>
                    <td><strong>${escapeHtml(task.title)}</strong></td>
                    <td>
                        <span style="display: flex; align-items: center; gap: 0.35rem;">
                            <span>👤</span>
                            ${escapeHtml(task.responsible)}
                        </span>
                    </td>
                    <td>
                        <span style="display: flex; align-items: center; gap: 0.35rem;">
                            <span>📅</span>
                            ${formattedDate}
                        </span>
                    </td>
                    <td>${escapeHtml(task.deliverable)}</td>
                    <td>
                        <select class="badge ${badgeClass} task-status-select" data-id="${task.id}" style="cursor: pointer; border: none; font-size: 0.8rem;">
                            <option value="Pendiente" ${task.status === 'Pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
                            <option value="En Progreso" ${task.status === 'En Progreso' ? 'selected' : ''}>🚀 En Progreso</option>
                            <option value="Completada" ${task.status === 'Completada' ? 'selected' : ''}>✅ Completada</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-danger-outline btn-delete" data-id="${task.id}" title="Eliminar actividad">
                            <span>🗑️</span>
                        </button>
                    </td>
                `;

                tasksTbody.appendChild(tr);
            });
        }

        renderStats();
    }

    function showToast(message, iconEmoji = '🔔') {
        toastMessage.textContent = message;
        toastIcon.textContent = iconEmoji;
        toast.classList.remove('hidden');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 5. Manejadores de Eventos (Event Listeners)

    // Botón Iniciar / Pausar Cronómetro
    btnToggle.addEventListener('click', () => {
        const isNowRunning = timer.toggle();
        updateTimerToggleButton(isNowRunning);
        if (isNowRunning) {
            mascot.setMood(timer.currentMode.id === 'STUDY' ? 'studying' : 'break');
        } else {
            mascot.setMood('idle');
        }
    });

    // Botón Reiniciar Cronómetro
    btnReset.addEventListener('click', () => {
        timer.reset();
        updateTimerToggleButton(false);
        mascot.setMood('idle');
        showToast('Temporizador reiniciado');
    });

    // Botón Saltar Fase
    btnSkip.addEventListener('click', () => {
        timer.skipPhase();
        updateTimerToggleButton(false);
        mascot.setMood(timer.currentMode.id === 'STUDY' ? 'idle' : 'break');
        showToast('Fase de tiempo cambiada');
    });

    // Notificaciones Nativas del Dispositivo
    function updateNotifButton() {
        if (!btnToggleNotif) return;
        if (NotificationService.getPermission() === 'granted') {
            btnToggleNotif.classList.add('active');
            btnToggleNotif.innerHTML = '<i class="ph-bold ph-bell-ringing"></i> <span>Notificaciones ON</span>';
        } else {
            btnToggleNotif.classList.remove('active');
            btnToggleNotif.innerHTML = '<i class="ph-bold ph-bell"></i> <span>Notificaciones</span>';
        }
    }

    if (btnToggleNotif) {
        btnToggleNotif.addEventListener('click', async () => {
            const granted = await NotificationService.requestPermission();
            updateNotifButton();
            if (granted) {
                showToast('¡Notificaciones activadas!', 'ph-bell-ringing');
                NotificationService.sendNotification('🔔 ¡ADSO Focus & Plan!', {
                    body: 'Te avisaremos con sonido y vibración al terminar cada bloque de estudio.'
                });
            } else {
                showToast('Notificaciones no permitidas por el navegador', 'ph-warning');
            }
        });
    }

    // Interacción al tocar la mascota Byte
    if (mascotAvatar) {
        mascotAvatar.addEventListener('click', () => {
            mascot.speakRandom(mascot.currentMood);
        });
    }

    // Envío del Formulario de Actividades
    activityForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = inputTitle.value.trim();
        const responsible = inputResponsible.value.trim();
        const dueDate = inputDate.value;
        const deliverable = inputDeliverable.value.trim();
        const status = selectStatus.value;

        if (!title || !responsible || !dueDate || !deliverable) {
            showToast('Por favor completa todos los campos obligatorios', 'ph-warning');
            return;
        }

        taskManager.add({
            title,
            responsible,
            dueDate,
            deliverable,
            status
        });

        // Limpiar formulario y resetear fecha a mañana por defecto
        activityForm.reset();
        setDefaultDueDate();
        
        renderTasks();
        showToast('¡Actividad registrada exitosamente!', 'ph-check');
    });

    // Cambio de estado o eliminación en la tabla (Delegación de eventos)
    tasksTbody.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-status-select')) {
            const taskId = e.target.getAttribute('data-id');
            const newStatus = e.target.value;
            taskManager.updateStatus(taskId, newStatus);
            renderTasks();
            showToast(`Estado actualizado a: ${newStatus}`);
        }
    });

    tasksTbody.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-delete');
        if (deleteBtn) {
            const taskId = deleteBtn.getAttribute('data-id');
            if (confirm('¿Estás seguro de que deseas eliminar este entregable?')) {
                taskManager.delete(taskId);
                renderTasks();
                showToast('Actividad eliminada con éxito', 'ph-trash');
            }
        }
    });

    // Filtro por Estado
    filterStatus.addEventListener('change', () => {
        renderTasks();
    });

    // Exportar a CSV
    btnExportCsv.addEventListener('click', () => {
        taskManager.exportToCSV();
    });

    // 6. Configuración de Progressive Web App (PWA) e Instalación en Móviles

    // A. Registro de Service Worker para funcionamiento Offline
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => {
                    console.log('Service Worker ADSO registrado con éxito:', reg.scope);
                })
                .catch(err => {
                    console.log('Registro de Service Worker omitido o no soportado en este entorno:', err);
                });
        });
    }

    // B. Soporte de instalación nativa en Android, Chrome, Edge y Brave
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir que el navegador muestre el banner por defecto
        e.preventDefault();
        deferredPrompt = e;

        if (btnInstallPwa) {
            btnInstallPwa.style.display = 'inline-flex';
        }
    });

    if (btnInstallPwa) {
        btnInstallPwa.addEventListener('click', async () => {
            if (!deferredPrompt) return;

            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                showToast('¡Aplicación instalada exitosamente!', 'ph-check-circle');
            }
            deferredPrompt = null;
            btnInstallPwa.style.display = 'none';
        });
    }

    // C. Detección y Ayuda para iPhone / iOS Safari
    const isIos = () => {
        const ua = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(ua);
    };

    const isStandalone = () => {
        return ('standalone' in window.navigator && window.navigator.standalone) ||
               window.matchMedia('(display-mode: standalone)').matches;
    };

    // Si es un iPhone y no está todavía instalado en la pantalla de inicio
    if (isIos() && !isStandalone() && !sessionStorage.getItem('adso_ios_banner_closed')) {
        if (iosBanner) {
            iosBanner.classList.remove('hidden');
        }
    }

    if (btnCloseIosBanner) {
        btnCloseIosBanner.addEventListener('click', () => {
            if (iosBanner) iosBanner.classList.add('hidden');
            sessionStorage.setItem('adso_ios_banner_closed', 'true');
        });
    }

    // 7. Carga de datos de demostración si es la primera vez
    function seedDemoDataIfEmpty() {
        const existing = taskManager.getAll();
        if (existing.length === 0) {
            const today = new Date();
            const in3Days = new Date(today);
            in3Days.setDate(today.getDate() + 3);
            const in7Days = new Date(today);
            in7Days.setDate(today.getDate() + 7);

            taskManager.add({
                title: 'Especificación de Requisitos de Software (SRS)',
                responsible: 'Luis & Carlos',
                dueDate: in3Days.toISOString().split('T')[0],
                deliverable: 'Documento estándar IEEE 830 en PDF',
                status: 'En Progreso'
            });

            taskManager.add({
                title: 'Diagrama de Casos de Uso y Modelo Entidad-Relación',
                responsible: 'Equipo ADSO',
                dueDate: in7Days.toISOString().split('T')[0],
                deliverable: 'Diagramas UML y DER exportados en carpeta compartida',
                status: 'Pendiente'
            });
        }
    }

    // Configura la fecha mínima del input de fecha para que sea hoy
    function setDefaultDueDate() {
        const todayStr = new Date().toISOString().split('T')[0];
        inputDate.min = todayStr;
        if (!inputDate.value) {
            inputDate.value = todayStr;
        }
    }

    // 8. Arranque Inicial de la Aplicación
    seedDemoDataIfEmpty();
    setDefaultDueDate();
    renderTasks();
    renderStats();
    updateNotifButton();
});
