import winston from 'winston';

export class Logger {
  private winston: any;
  requestId: string = '';
  client: string = '';

  constructor() {
    this.winston = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [new winston.transports.Console()],
    });
  }

  setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  setClient(client: string) {
    this.client = client;
  }

  private withRequestMeta(meta?: any) {
    const base = { requestId: this.requestId, client: this.client };

    if (meta == null) return base;
    if (typeof meta === 'string') return { ...base, message: meta };
    if (typeof meta === 'object') return { ...base, ...meta };
    return { ...base, meta };
  }

  info(message: string, meta?: any) {
    this.winston.info(message, this.withRequestMeta(meta));
  }

  error(message: string, meta?: any) {
    this.winston.error(message, this.withRequestMeta(meta));
  }

  warn(message: string, meta?: any) {
    this.winston.warn(message, this.withRequestMeta(meta));
  }
}
