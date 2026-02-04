import type { Plugin } from '@envelop/core';
import { GraphQLError } from 'graphql';
import type { PartialContext } from '../types';

const getClientHeader = (contextValue: any): string | undefined => {
  const req: any = contextValue?.request ?? contextValue?.req ?? null;

  if (req?.headers?.get && typeof req.headers.get === 'function') {
    const v = req.headers.get('client');
    return v && v.trim().length ? v.trim() : undefined;
  }

  const headers = req?.headers ?? contextValue?.headers ?? null;
  if (headers && typeof headers === 'object') {
    const raw = headers['client'] ?? headers['Client'] ?? headers['CLIENT'];
    if (typeof raw === 'string' && raw.trim().length) return raw.trim();
  }

  return undefined;
};

export const requireClientHeader = (): Plugin<PartialContext> => {
  const reject = (): never => {
    throw new GraphQLError("Missing required header: 'client'", {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  };

  return {
    onParse({ context, extendContext }) {
      const client = getClientHeader(context);
      if (!client) reject();
      extendContext({ client });
    },

    // Keep subscription coverage (optional but minimal)
    onSubscribe({ context, extendContext }) {
      const client = getClientHeader(context);
      if (!client) reject();
      extendContext({ client });
    },
  };
};
