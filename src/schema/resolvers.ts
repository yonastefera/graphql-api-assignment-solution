import { getAddress, createAddress } from './address/address';
import { Address, Args, CreateAddressArgs } from './address/types';

export const resolvers = {
  Query: {
    address: async (parent: any, args: Args, context: any, info: any): Promise<Address> => {
      return getAddress(parent, args, context);
    },
  },
  Mutation: {
    createAddress: async (parent: any, args: CreateAddressArgs, context: any, info: any): Promise<Address> => {
      return createAddress(parent, args, context);
    },
  },
};
