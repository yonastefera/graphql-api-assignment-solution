import { Plugin, useEngine } from '@envelop/core';
import { parse, validate, specifiedRules, execute, subscribe } from 'graphql';
import { useParserCache } from '@envelop/parser-cache';
import { useValidationCache } from '@envelop/validation-cache';
import { buildHeaders } from './buildHeaders';
import { useLogger } from './useLogger';
import { requireClientHeader } from './requireClientHeader';
import { appendRequestIdToResponse } from './appendRequestIdToResponse';
import type { PartialContext } from '../types';

const plugins: Plugin<PartialContext>[] = [
  useEngine({ parse, validate, specifiedRules, execute, subscribe }) as Plugin<PartialContext>,
  requireClientHeader(),
  buildHeaders(),
  useLogger(),
  useParserCache() as Plugin<PartialContext>,
  useValidationCache() as Plugin<PartialContext>,
  appendRequestIdToResponse(),
];

export default plugins;
