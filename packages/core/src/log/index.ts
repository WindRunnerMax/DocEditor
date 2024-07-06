export const LOG_LEVEL = {
  DEBUG: -1,
  INFO: 0,
  WARNING: 1,
  ERROR: 2,
};

export class Logger {
  constructor(private level: number) {}

  set(level: number) {
    this.level = level;
  }

  debug(key: string, ...args: unknown[]) {
    if (this.level <= LOG_LEVEL.DEBUG) {
      console.log("DEBUG -", key, ...args);
    }
  }

  info(key: string, ...args: unknown[]) {
    if (this.level <= LOG_LEVEL.INFO) {
      console.log("Log -", key, ...args);
    }
  }

  warning(key: string, ...args: unknown[]) {
    if (this.level <= LOG_LEVEL.WARNING) {
      console.warn("Warning -", key, ...args);
    }
  }

  error(key: string, ...args: unknown[]) {
    if (this.level <= LOG_LEVEL.ERROR) {
      console.error("Error -", key, ...args);
    }
  }

  trace(key: string, ...args: unknown[]) {
    if (this.level <= LOG_LEVEL.ERROR) {
      console.trace("Trace -", key, ...args);
    }
  }
}
