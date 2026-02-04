import type { Plugin } from '@envelop/core';
import type { PartialContext } from '../types';

export const appendRequestIdToResponse = (): Plugin<PartialContext> => {
  return {
    onExecute() {
      return {
        onExecuteDone({ args, result }) {
          const requestId = (args.contextValue as any)?.requestId;
          if (!requestId) return;

          (result as any).metadata = { requestId };
        },
      };
    },
  };
};
