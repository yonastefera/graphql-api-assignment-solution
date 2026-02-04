import { GraphQLError } from 'graphql';
import { Args, Address, CreateAddressArgs } from './types';
import { createAddressForUsername, getAddressByUsername } from './addressRepo';

export const getAddress = async (_: any, args: Args, context: any): Promise<Address> => {
  context.logger.info('getAddress', { message: 'Enter resolver' });

  const address = await getAddressByUsername(args.username);

  if (address) {
    context.logger.info('getAddress', { message: 'Returning address', username: args.username });
    return address;
  }

  context.logger.error('getAddress', { message: 'No address found', username: args.username });
  throw new GraphQLError('No address found in getAddress resolver');
};

export const createAddress = async (_: any, args: CreateAddressArgs, context: any): Promise<Address> => {
  context.logger.info('createAddress', { message: 'Enter resolver', username: args.username });

  try {
    const created = await createAddressForUsername(args.username, args.address);

    context.logger.info('createAddress', {
      message: 'Created address',
      username: args.username,
    });

    return created;
  } catch (err: any) {
    context.logger.error('createAddress', {
      message: 'Failed to create address',
      username: args.username,
      error: err?.message ?? String(err),
    });

    // If repo threw GraphQLError, rethrow as-is
    if (err instanceof GraphQLError) throw err;

    // Otherwise surface a user-friendly error
    throw new GraphQLError('Unable to create address');
  }
};
