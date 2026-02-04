import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Address, Addresses, AddressInput } from './types';
import { GraphQLError } from 'graphql';

const ADDRESSES_PATH = path.resolve(__dirname, '../../../data/addresses.json');

export const readAddresses = async (): Promise<Addresses> => {
  try {
    const raw = await fs.readFile(ADDRESSES_PATH, 'utf-8');
 
    return raw.trim().length ? (JSON.parse(raw) as Addresses) : {};
  } catch (err: any) {
   
    if (err?.code === 'ENOENT') return {};
    throw err;
  }
};

export const writeAddresses = async (next: Addresses): Promise<void> => {
  const tmpPath = `${ADDRESSES_PATH}.tmp`;
  const payload = JSON.stringify(next, null, 2);

  await fs.writeFile(tmpPath, payload, 'utf-8');
  await fs.rename(tmpPath, ADDRESSES_PATH);
};

export const getAddressByUsername = async (username: string): Promise<Address | null> => {
  const addresses = await readAddresses();
  return addresses[username] ?? null;
};

export const createAddressForUsername = async (
  username: string,
  address: AddressInput
): Promise<Address> => {
  const addresses = await readAddresses();

  //Create-only not overwrite
  if (addresses[username]) {
    throw new GraphQLError(`Address already exists for username: ${username}`);
  }

  // Persist new record without smashing existing ones
  const created: Address = {
    street: address.street,
    city: address.city,
    state: address.state,
    zipcode: address.zipcode,
  };

  addresses[username] = created;
  await writeAddresses(addresses);

  return created;
};
