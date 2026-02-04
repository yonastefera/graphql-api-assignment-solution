import type { Plugin } from '@envelop/core';
import { v4 as uuid } from 'uuid';
import { PartialContext } from '../types';

export const buildHeaders = (): Plugin<PartialContext> => {
  return {
    onParse({ extendContext }) {
      const requestId = uuid();
      extendContext({ requestId });
    },
  };
};
