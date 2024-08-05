type LogLevel = 0 | 1 | 2 | 3 | 4;
export const logger = {
  level: 2 as LogLevel,
  log(...args: any[]) {
    if (logger.level < 0) return;
    console.log('[log]', ...args);
  },
  warn(...args: any[]) {
    if (logger.level < 1) return;
    console.log('[warn]', ...args);
  },
  error(...args: any[]) {
    if (logger.level < 2) return;
    console.log('[error]', ...args);
  },
  info(...args: any[]) {
    if (logger.level < 3) return;
    console.log('[info]', ...args);
  },
  debug(...args: any[]) {
    if (logger.level < 4) return;
    console.log('[debug]', ...args);
  },
};

const levelStr = process.argv.find((it) => it.startsWith('--logLevel='))?.split('=')?.[1];
if (levelStr) {
  logger.level = ({ log: 0, warn: 1, error: 2, info: 3, debug: 4, 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 }[levelStr] ??
    2) as LogLevel;
}
