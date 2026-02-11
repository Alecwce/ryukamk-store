/**
 * RYŪKAMI Logger
 * Abstracción para el manejo de logs y reportes de errores.
 */

type LogContext = Record<string, unknown>;

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Reporta un error. En desarrollo se muestra en consola, 
   * en producción debería enviarse a un servicio como Sentry.
   */
  error: (message: string, context?: LogContext | unknown) => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, context || '');
    } else {
      // TODO: Integrate Sentry here
      // Sentry.captureException(new Error(message), { extra: context as LogContext });
    }
  },

  /**
   * Log de advertencia.
   */
  warn: (message: string, context?: LogContext | unknown) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, context || '');
    }
    // Opcionalmente enviar a servicio de monitoreo en prod
  },

  /**
   * Log informativo.
   */
  info: (message: string, context?: LogContext | unknown) => {
    if (isDev) {
      console.info(`[INFO] ${message}`, context || '');
    }
  }
};
