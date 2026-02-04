const fsReadFile = jest.fn();
const fsWriteFile = jest.fn();
const fsRename = jest.fn();

jest.mock('node:fs', () => {
  const actual = jest.requireActual('node:fs');
  return {
    ...actual,
    promises: {
      ...actual.promises,
      readFile: (...args: any[]) => fsReadFile(...args),
      writeFile: (...args: any[]) => fsWriteFile(...args),
      rename: (...args: any[]) => fsRename(...args),
    },
  };
});

jest.mock('fs', () => {
  const actual = jest.requireActual('fs');
  return {
    ...actual,
    promises: {
      ...actual.promises,
      readFile: (...args: any[]) => fsReadFile(...args),
      writeFile: (...args: any[]) => fsWriteFile(...args),
      rename: (...args: any[]) => fsRename(...args),
    },
  };
});

import { parse } from 'graphql';
import { exectuor } from '../exectuor';

describe('createAddress (Ticket 2 + Ticket 6)', () => {
  beforeEach(() => {
    fsReadFile.mockReset();
    fsWriteFile.mockReset();
    fsRename.mockReset();
  });

  test('Creates a new record and does not smash existing records', async () => {
    const initialDb = {
      jack: { street: '123 Street St.', city: 'Sometown', state: 'OH', zipcode: '43215' },
    };

    fsReadFile.mockResolvedValueOnce(JSON.stringify(initialDb));

    fsWriteFile.mockResolvedValueOnce(undefined);
    fsRename.mockResolvedValueOnce(undefined);

    const mutation = `
      mutation {
        createAddress(
          username: "bob"
          address: { street: "1 Main", city: "Columbus", state: "OH", zipcode: "43000" }
        ) {
          street
          city
          state
          zipcode
        }
      }
    `;

    const result = await exectuor({ document: parse(mutation) });

    expect(result).toEqual(
      expect.objectContaining({
        data: {
          createAddress: {
            street: '1 Main',
            city: 'Columbus',
            state: 'OH',
            zipcode: '43000',
          },
        },
        
        metadata: {
          requestId: expect.any(String),
        },
      })
    );

    expect(fsWriteFile).toHaveBeenCalledTimes(1);
    expect(fsRename).toHaveBeenCalledTimes(1);

    const writtenPayload = fsWriteFile.mock.calls[0][1] as string;
    const writtenDb = JSON.parse(writtenPayload);

    expect(writtenDb.jack).toEqual(initialDb.jack);
    expect(writtenDb.bob).toEqual({
      street: '1 Main',
      city: 'Columbus',
      state: 'OH',
      zipcode: '43000',
    });
  });

  test('Rejects duplicate username and does not write', async () => {
    const existingDb = {
      bob: { street: 'OLD', city: 'Oldtown', state: 'OH', zipcode: '11111' },
    };

    fsReadFile.mockResolvedValueOnce(JSON.stringify(existingDb));

    const mutation = `
      mutation {
        createAddress(
          username: "bob"
          address: { street: "NEW", city: "Newtown", state: "OH", zipcode: "22222" }
        ) {
          street
        }
      }
    `;

    const result = await exectuor({ document: parse(mutation) });

    expect(result).toEqual(
      expect.objectContaining({
        data: null,
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('Address already exists for username'),
          }),
        ]),
  
        metadata: {
          requestId: expect.any(String),
        },
      })
    );

    expect(fsWriteFile).not.toHaveBeenCalled();
    expect(fsRename).not.toHaveBeenCalled();
  });
});
