import { createYoga } from 'graphql-yoga';
import { print, type DocumentNode } from 'graphql';
import { genSchema } from '../src/schema';
import plugins from '../src/envelop/index';

console.profile = jest.fn();

let yogaPromise: Promise<ReturnType<typeof createYoga>> | null = null;

const getYoga = async () => {
  if (!yogaPromise) {
    yogaPromise = (async () => {
      const schema = await genSchema();
      return createYoga({ schema, plugins });
    })();
  }
  return yogaPromise;
};

type ExecutorArgs = {
  document: DocumentNode;
  variables?: Record<string, any>;
  headers?: Record<string, string>;
};

export const exectuor = async ({ document, variables, headers }: ExecutorArgs) => {
  const yoga = await getYoga();

  const res = await yoga.fetch('http://localhost/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(headers ?? { client: 'web' }),
    },
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
  });

  return res.json();
};
