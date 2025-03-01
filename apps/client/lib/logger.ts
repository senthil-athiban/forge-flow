const isDevelopment = process.env.NEXT_PUBLIC_VERCEL_ENV === "development";
const isLoggerEnabled = true;
const loggerFilter = "Zap, Auth, User, Slack, Discord";

type LoggerFunction = (...args: Array<unknown>) => void;

/**
 * Determines if a log entry should be shown based on tag filtering
 *
 * @param tag - The tag to check against the filter
 * @returns boolean - True if the log should be shown
 */
const shouldLog = (tag: string) => {
  // if loggerFilter is empty, then allow all tags to log
  if (!loggerFilter) {
    return true;
  }

  // if tag is not specificied as well, then allow to log
  if (!tag) {
    return true;
  }

  // if tag is specified, then check given tag is available in loggerFilter.
  return loggerFilter
    ?.split(",")
    ?.filter((item: string) =>
      tag.toLowerCase()?.includes(item?.trim()?.toLowerCase())
    );
};

/**
 * Creates a logger function with the specified console method
 *
 * @param consoleMethod - The console method to use (log, warn, error, etc.)
 * @returns A wrapped logger function that respects environment and filter settings
 */
const createLogger =
  (consoleMethod: LoggerFunction) =>
  (...args: Array<unknown>) => {
    if (isDevelopment || isLoggerEnabled) {
      const tag = typeof args[0] === "string" ? args[0] : "";
      if (shouldLog(tag)) {
        consoleMethod(`[${tag?.toUpperCase()}]`, ...args.slice(1));
      } else {
        consoleMethod(...args);
      }
    }
  };

/**
 * Logger object with different logging levels
 * Each method accepts a tag as the first argument and additional arguments for logging
 *
 * @example
 * logger.info('Component', 'Rendering completed', { time: '100ms' });
 * logger.error('Api', 'Request failed', error);
 */
const logger = {
  log: createLogger(console.log),
  warn: createLogger(console.warn),
  error: createLogger(console.error),
  info: createLogger(console.info),
  debug: createLogger(console.debug),
};

export default logger;
