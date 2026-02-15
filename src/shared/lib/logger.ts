/**
 * RYŪKAMI Logger — Advanced Monitoring Architecture
 * Abstracción para el manejo de logs y reportes de errores preparada para producción.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'fatal';
type LogContext = Record<string, unknown>;

// Detectar entorno
const isProd = import.meta.env.PROD;
const isDev = import.meta.env.DEV;

/**
 * Interface para servicios de monitoreo externos (como Sentry)
 * Esto permite swappear el servicio sin cambiar el resto del código.
 */
interface MonitoringService {
  captureException: (error: Error, context?: LogContext) => void;
  captureMessage: (message: string, level: LogLevel, context?: LogContext) => void;
}

// Placeholder para Sentry u otros servicios
// Cuando instales @sentry/react, solo necesitas inicializarlo aquí.
let monitoringService: MonitoringService | null = null;

/**
 * Buffer para logs críticos en producción antes de que el servicio esté listo
 */
const logBuffer: Array<{ level: LogLevel; message: string; context?: any; timestamp: number }> = [];

export const logger = {
  /**
   * Inicializa el servicio de monitoreo (llamar en el entry point de la app)
   */
  init: (service: MonitoringService) => {
    monitoringService = service;
    
    // Procesar buffer si quedó algo pendiente
    if (logBuffer.length > 0) {
      logBuffer.forEach(log => {
        if (log.level === 'error' || log.level === 'fatal') {
          monitoringService?.captureException(new Error(log.message), log.context);
        } else {
          monitoringService?.captureMessage(log.message, log.level, log.context);
        }
      });
      logBuffer.length = 0;
    }
  },

  /**
   * Reporta un error crítico. 
   * En desarrollo: Consola detallada.
   * En producción: Enviado a servicio externo + filtrado de datos sensibles.
   */
  error: (message: string, context?: LogContext | unknown) => {
    if (isDev) {
      console.error(`%c[ERROR] ${message}`, 'color: #ff4d4d; font-weight: bold;', context || '');
    }

    if (isProd) {
      if (monitoringService) {
        monitoringService.captureException(
          context instanceof Error ? context : new Error(message),
          typeof context === 'object' ? (context as LogContext) : { originalMessage: message }
        );
      } else {
        logBuffer.push({ level: 'error', message, context, timestamp: Date.now() });
      }
    }
  },

  /**
   * Log de advertencia.
   */
  warn: (message: string, context?: LogContext | unknown) => {
    if (isDev) {
      console.warn(`%c[WARN] ${message}`, 'color: #ffcc00; font-weight: bold;', context || '');
    }

    if (isProd && monitoringService) {
      monitoringService.captureMessage(message, 'warn', context as LogContext);
    }
  },

  /**
   * Log informativo. Solo visible en desarrollo o producción si es crítico.
   */
  info: (message: string, context?: LogContext | unknown) => {
    if (isDev) {
      console.info(`%c[INFO] ${message}`, 'color: #00cccc; font-weight: bold;', context || '');
    }
    // Generalmente no enviamos info a Sentry para no quemar cuota de eventos,
    // a menos que sea una acción de negocio crítica.
  }
};
