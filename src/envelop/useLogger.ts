import type { Plugin } from '@envelop/core';
import { Logger } from '../logger';
import type { PartialContext } from '../types';

export const useLogger = (): Plugin<PartialContext> => {
  return {
    onParse({ context, extendContext }) {
      const logger = new Logger();
      logger.setRequestId(context.requestId as string);
      logger.setClient(context.client as string);
      extendContext({ logger });
    },
  };
};
