import { parse } from 'graphql';
import { exectuor } from '../exectuor';

describe('getAddress', () => {
  test('Success', async () => {
    const query = `
      query GetAddress($username: String!) {
        address(username: $username) {
          street
          city
          state
          zipcode
        }
      }
    `;

    const variables = { username: 'jack' };

    const result = await exectuor({
      document: parse(query),
      variables,
    });

    expect(result).toEqual(
      expect.objectContaining({
        data: {
          address: {
            street: expect.any(String),
            city: expect.any(String),
            state: expect.any(String), 
            zipcode: expect.any(String),
          },
        },
        metadata: {
          requestId: expect.any(String),
        },
      })
    );
  });

  test('Error', async () => {
    const query = `
      query GetAddress($username: String!) {
        address(username: $username) {
          street
          city
          state
          zipcode
        }
      }
    `;

    const variables = { username: 'john' };

    const result = await exectuor({
      document: parse(query),
      variables,
    });

    expect(result).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'No address found in getAddress resolver',
          }),
        ]),
        metadata: {
          requestId: expect.any(String),
        },
      })
    );
  });
});
